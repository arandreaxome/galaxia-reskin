// Cibles : fusion des rapports d'espionnage, des systèmes vus en galaxie et de tes combats.
// Pour la protection, l'information la plus récente l'emporte, quelle que soit sa source.

import type { GalaxySystem, Message, Planet, Target } from './types';

export type TargetStore = {
  list: Record<string, Target>;
  /** Positions que la galaxie montre vides, inconnues ou alliées : les rapports plus anciens sont caducs. */
  gone: Record<string, number>;
};

export type TargetStatus = 'ready' | 'protected' | 'respy' | 'unprobed';

export const emptyStore = (): TargetStore => ({ list: {}, gone: {} });

/** Règle du jeu : un repaire attaqué est protégé 24 h, puis se reconstruit. */
const PROTECTION_MS = 24 * 3_600_000;
const LARGE_CARGO = 25_000;

type Position = { g: number; s: number; p: number };

const keyOf = (c: Position) => `${c.g}:${c.s}:${c.p}`;

const blank = (c: Position): Target => ({ g: c.g, s: c.s, p: c.p, name: '?', pirate: false, level: null, protectedUntil: null, protectionAt: 0 });

function withProtection(t: Target, until: number | null, at: number, estimated: boolean): Target {
  return at >= t.protectionAt ? { ...t, protectedUntil: until, protectionAt: at, estimated } : t;
}

export function mergeReports(store: TargetStore, messages: Message[]): TargetStore {
  const list = { ...store.list };
  const gone = { ...store.gone };
  for (const m of messages) {
    const d = m.data;
    // Sans nom de planète : ancien format de rapport, d'avant le déplacement des repaires.
    if (m.type !== 'spy' || !d?.coords || d.coords.moon || !d.planetName) continue;
    const key = keyOf(d.coords);
    if ((gone[key] ?? 0) >= m.at) continue;
    const t = list[key] ?? blank(d.coords);
    if (t.report && t.report.at >= m.at) continue;
    delete gone[key];
    list[key] = withProtection(
      {
        ...t,
        name: d.planetName ?? t.name,
        owner: d.ownerName ?? t.owner,
        pirate: d.pirateLevel != null || d.ownerName === 'Pirates',
        level: d.pirateLevel ?? t.level,
        report: { id: m.id, at: m.at, resources: d.resources ?? {}, ships: d.ships ?? null, defense: d.defense ?? null },
      },
      d.protectedUntil ?? null,
      m.at,
      false,
    );
  }
  return { list, gone };
}

/** Système affiché par le jeu à l'instant `at` (heure du serveur). */
export function mergeSystem(store: TargetStore, sys: GalaxySystem, at: number): TargetStore {
  const list = { ...store.list };
  const gone = { ...store.gone };
  for (let p = 1; p <= 15; p++) {
    const key = keyOf({ g: sys.g, s: sys.s, p });
    const k = sys.slots.find(slot => slot.p === p)?.known;
    if (!k?.occupied || k.mine || k.ally) {
      delete list[key];
      gone[key] = at;
      continue;
    }
    delete gone[key];
    const t = list[key] ?? blank({ g: sys.g, s: sys.s, p });
    list[key] = withProtection(
      {
        ...t,
        name: k.planetName ?? t.name,
        owner: k.ownerName ?? t.owner,
        pirate: Boolean(k.pirate || k.pirateLevel),
        level: k.pirateLevel ?? t.level,
        ai: k.ai,
        tag: k.tag,
        outdated: Boolean(k.outdated),
        seenAt: at,
      },
      k.protectedUntil ?? null,
      at,
      false,
    );
  }
  return { list, gone };
}

/** Tes attaques sur des repaires : protection estimée à 24 h, en attendant de la lire dans le jeu. */
export function mergeCombats(store: TargetStore, messages: Message[]): TargetStore {
  const list = { ...store.list };
  for (const m of messages) {
    const d = m.data;
    if (m.type !== 'combat' || !d?.coords || d.coords.moon || d.perspective !== 'attacker' || d.defenderName !== 'Pirates') continue;
    const key = keyOf(d.coords);
    const t = list[key];
    if (!t || (t.attackedAt ?? 0) >= m.at) continue;
    list[key] = withProtection({ ...t, attackedAt: m.at }, m.at + PROTECTION_MS, m.at, true);
  }
  return { ...store, list };
}

/**
 * Carte de la galaxie (gratuite) : nombre de repaires que le jeu te connaît dans chaque système.
 * Des cibles en plus sont d'anciens rapports sur des repaires déplacés : les moins récentes sont écartées.
 */
export function reconcile(store: TargetStore, known: Record<string, { pirates?: number }>, at: number): TargetStore {
  const list = { ...store.list };
  const gone = { ...store.gone };
  const bySystem = new Map<string, [string, Target][]>();
  for (const entry of Object.entries(list)) {
    const [, t] = entry;
    if (!t.pirate) continue;
    const system = `${t.g}:${t.s}`;
    bySystem.set(system, [...(bySystem.get(system) ?? []), entry]);
  }
  const confirmedAt = (t: Target) => Math.max(t.seenAt ?? 0, t.report?.at ?? 0);
  for (const [system, entries] of bySystem) {
    const excess = entries.length - (known[system]?.pirates ?? 0);
    if (excess <= 0) continue;
    entries.sort(([, a], [, b]) => confirmedAt(a) - confirmedAt(b));
    for (const [key] of entries.slice(0, excess)) {
      delete list[key];
      gone[key] = at;
    }
  }
  return { list, gone };
}

/** Secteurs à repasser : ceux de la liste des cibles (vus ou espionnés) et ceux déjà vus dans le jeu, par galaxie puis système. */
export function observedSystems(store: TargetStore | undefined, viewed: string[] = []): string[] {
  const systems = new Set(viewed);
  for (const t of Object.values(store?.list ?? {})) systems.add(`${t.g}:${t.s}`);
  const parts = (system: string) => system.split(':').map(Number);
  return [...systems].sort((a, b) => parts(a)[0] - parts(b)[0] || parts(a)[1] - parts(b)[1]);
}

export function targetStatus(t: Target, now: number): TargetStatus {
  if (t.protectedUntil != null && t.protectedUntil > now) return 'protected';
  const r = t.report;
  // Niveau connu du jeu mais rapport absent (supprimé, ou antérieur à l'extension) : à refaire.
  if (!r) return t.level != null ? 'respy' : 'unprobed';
  // Un repaire se reconstruit à chaque fin de protection : un rapport antérieur est périmé.
  if (t.outdated && (t.seenAt ?? 0) > r.at) return 'respy';
  if (t.protectedUntil != null && t.protectedUntil > r.at) return 'respy';
  if ((t.attackedAt ?? 0) > r.at) return 'respy';
  return 'ready';
}

/** La moitié du stock du dernier rapport : ce qu'une attaque victorieuse pille. */
export function lootOf(t: Target): number | null {
  const res = t.report?.resources;
  return res ? Math.floor(((res.metal ?? 0) + (res.crystal ?? 0) + (res.deuterium ?? 0)) / 2) : null;
}

/** Grands transporteurs pour emporter `loot` (soute +5 % par niveau de Technologie Hyperespace). */
export const cargoFor = (loot: number, hyperspaceTech = 0) => Math.ceil(loot / Math.floor(LARGE_CARGO * (1 + 0.05 * hyperspaceTech)));

/** Ta planète la plus proche dans la même galaxie, en nombre de systèmes. */
export function nearest(t: { g: number; s: number }, planets: Planet[]): { planet: Planet; systems: number } | null {
  let best: { planet: Planet; systems: number } | null = null;
  for (const planet of planets) {
    if (planet.moon || planet.g !== t.g) continue;
    const systems = Math.abs(planet.s - t.s);
    if (!best || systems < best.systems) best = { planet, systems };
  }
  return best;
}
