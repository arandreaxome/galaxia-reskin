// Calculs purs sur l'état du jeu : alertes, échéances et événements entre deux relevés.
// Aucun appel à chrome.* ici, pour que la popup et le service worker les partagent.

import { clock, coords, duration, num, place } from './format';
import { label, missionName, resourceName } from './names';
import type { Fleet, GameState, Message, Planet, Resource, Resources, SocialCounter } from './types';

export const RESOURCES: Resource[] = ['metal', 'crystal', 'deuterium'];

/** Un stockage est signalé quand il sera plein dans moins de 30 min. */
export const STORAGE_WARNING = 30 * 60_000;

export type Alert = { level: 'danger' | 'warning'; text: string; route: string };
export type GameEvent = { id: string; level: 'danger' | 'info'; title: string; message: string; route: string };

/** Ce que le service worker retient d'un relevé à l'autre pour ne rien notifier deux fois. */
export type Memory = {
  hostiles: string[];
  storage: Record<string, 'soon' | 'full'>;
  lastMessageAt: number;
  unread: number;
};

/** Ressources à l'instant t, avec le calcul du jeu : la production s'arrête au plafond. */
export function resourcesAt(p: Planet, t: number): Record<Resource, number> {
  const hours = Math.max(0, (t - p.lastUpdate) / 36e5);
  const out = { metal: 0, crystal: 0, deuterium: 0 };
  for (const r of RESOURCES) {
    const stock = p.resources[r] ?? 0;
    const prod = p.production[r] ?? 0;
    const cap = p.caps[r] ?? Infinity;
    out[r] = prod >= 0 ? (stock >= cap ? stock : Math.min(cap, stock + prod * hours)) : Math.max(0, stock + prod * hours);
  }
  return out;
}

/** Instant où la ressource atteint son plafond : lastUpdate si c'est déjà le cas, null si jamais. */
export function fullAt(p: Planet, r: Resource): number | null {
  const stock = p.resources[r] ?? 0;
  const prod = p.production[r] ?? 0;
  const cap = p.caps[r];
  if (cap == null) return null;
  if (stock >= cap) return p.lastUpdate;
  return prod > 0 ? p.lastUpdate + ((cap - stock) / prod) * 36e5 : null;
}

/** Fin de toute la file du chantier : le jeu enchaîne les lots à partir de progressStart. */
export function shipyardEnd(p: Planet): number | null {
  if (!p.shipQueue.length) return null;
  let t = p.shipQueue[0].progressStart ?? p.lastUpdate;
  for (const lot of p.shipQueue) t += lot.unitTime * lot.count;
  return t;
}

/** Prochain changement d'état d'une flotte (null : en défense jusqu'au rappel). */
export function fleetNextTime(f: Fleet): number | null {
  if (f.state === 'out') return f.arriveAt;
  if (f.state === 'wait') return f.departAt;
  if (f.state === 'hold') return f.holdUntil ?? null;
  return f.returnAt ?? null;
}

export function foreignLabel(f: Fleet): string {
  if (f.raid === 'invasion') return 'Invasion';
  if (f.raid) return 'Pillards';
  return f.ownerName ? `Flotte de ${f.ownerName}` : 'Flotte inconnue';
}

export const shipsText = (ships: Record<string, number> = {}) =>
  Object.entries(ships)
    .filter(([, n]) => n > 0)
    .map(([key, n]) => `${num(n)} × ${label(key)}`)
    .join(', ');

const resourcesText = (res: Resources = {}) =>
  RESOURCES.filter(r => (res[r] ?? 0) > 0)
    .map(r => `${num(res[r] ?? 0)} ${resourceName(r).toLowerCase()}`)
    .join(' · ');

/** Ce qui attend une action : sert au badge de l'icône et au haut de la popup. */
export function alerts(s: GameState, now: number): Alert[] {
  const list: Alert[] = [];
  for (const f of s.foreign ?? []) {
    if (f.hostile && f.arriveAt > now) {
      list.push({
        level: 'danger',
        text: `${foreignLabel(f)} vers ${place(f.targetName, f.target)} : impact dans ${duration(f.arriveAt - now)}`,
        route: '#/fleet',
      });
    }
  }
  for (const p of s.planets) {
    if (p.moon) continue;
    if (!p.buildQueue.length) list.push({ level: 'warning', text: `Aucune construction sur ${p.name}`, route: '#/' });
    for (const r of RESOURCES) {
      const t = fullAt(p, r);
      if (t == null || t - now > STORAGE_WARNING) continue;
      const text = t <= now ? `${resourceName(r)} : stockage plein sur ${p.name}` : `${resourceName(r)} : stockage plein dans ${duration(t - now)} sur ${p.name}`;
      list.push({ level: 'warning', text, route: '#/resources' });
    }
  }
  if (!s.user.researchQueue.length && s.planets.some(p => (p.buildings.researchLab ?? 0) > 0)) {
    list.push({ level: 'warning', text: 'Aucune recherche en cours', route: '#/research' });
  }
  return list;
}

/** Prochaine échéance connue, pour relire l'état juste après. */
export function nextDeadline(s: GameState, now: number): number | null {
  const times: (number | null | undefined)[] = [];
  for (const p of s.planets) {
    times.push(...p.buildQueue.map(q => q.end), shipyardEnd(p));
    if (p.moon) continue;
    for (const r of RESOURCES) {
      const t = fullAt(p, r);
      if (t != null) times.push(t - STORAGE_WARNING, t);
    }
  }
  times.push(...s.user.researchQueue.map(q => q.end), ...s.fleets.map(fleetNextTime), ...(s.foreign ?? []).map(f => f.arriveAt));
  const future = times.filter((t): t is number => typeof t === 'number' && t > now);
  return future.length ? Math.min(...future) : null;
}

export function initialMemory(s: GameState): Memory {
  return { hostiles: [], storage: {}, lastMessageAt: s.serverTime, unread: s.unread };
}

const SOCIAL: [SocialCounter, string, string][] = [
  ['unreadChats', 'Nouveau message privé', '#/social?tab=chats'],
  ['friendRequests', 'Nouvelle demande d’ami', '#/social?tab=friends'],
  ['guildInvites', 'Invitation dans une guilde', '#/social?tab=guild'],
  ['applications', 'Nouvelle candidature dans ta guilde', '#/social?tab=guild'],
  ['plans', 'Nouveau plan de bataille de guilde', '#/social?tab=guild'],
];

/** Total de l'onglet Social, comme le jeu ; `social` contient aussi l'objet `guild`. */
export const socialCount = (s: GameState) => SOCIAL.reduce((sum, [key]) => sum + (s.social?.[key] ?? 0), 0);

/**
 * Événements à notifier entre deux relevés. Sans relevé précédent (premier passage,
 * changement de compte), seules les flottes hostiles sont signalées.
 */
export function diff(prev: GameState | null, next: GameState, memory: Memory): { events: GameEvent[]; memory: Memory } {
  const now = next.serverTime;
  const events: GameEvent[] = [];

  if (prev) {
    for (const before of prev.planets) {
      const after = next.planets.find(p => p.id === before.id);
      if (!after) continue;

      // Terminé = niveau atteint : une annulation ne compte pas, un accélérateur si.
      const built = before.buildQueue.filter(q => {
        const level = after.buildings[q.key] ?? 0;
        return q.demolish ? level <= q.level : level >= q.level;
      });
      if (built.length) {
        const names = built.map(q => `${label(q.key)} ${q.demolish ? '(démolition)' : q.level}`).join(', ');
        events.push({
          id: `build:${after.id}:${built.map(q => q.key + q.level).join(',')}`,
          level: 'info',
          title: `Construction terminée sur ${after.name}`,
          message: after.buildQueue.length ? names : `${names}\nFile de construction vide`,
          route: '#/',
        });
      }

      const end = shipyardEnd(before);
      if (end != null && end <= now + 5_000 && !after.shipQueue.length) {
        events.push({
          id: `shipyard:${after.id}:${end}`,
          level: 'info',
          title: `Chantier terminé sur ${after.name}`,
          message: before.shipQueue.map(lot => `${num(lot.count)} × ${label(lot.key)}`).join(', '),
          route: '#/shipyard',
        });
      }
    }

    const researched = prev.user.researchQueue.filter(q => (next.user.research[q.key] ?? 0) >= q.level);
    if (researched.length) {
      const names = researched.map(q => `${label(q.key)} ${q.level}`).join(', ');
      events.push({
        id: `research:${researched.map(q => q.key + q.level).join(',')}`,
        level: 'info',
        title: 'Recherche terminée',
        message: next.user.researchQueue.length ? names : `${names}\nAucune recherche en cours`,
        route: '#/research',
      });
    }

    // Une flotte vue sur le retour puis disparue est rentrée ; une flotte détruite au combat
    // disparaît à l'aller et n'est donc pas comptée.
    for (const f of prev.fleets) {
      if (f.state !== 'back' || next.fleets.some(n => n.id === f.id)) continue;
      const home = next.planets.find(p => p.id === f.originId)?.name ?? coords(f.origin);
      const cargo = resourcesText(f.cargo);
      events.push({
        id: `back:${f.id}`,
        level: 'info',
        title: `Flotte revenue sur ${home}`,
        message: [shipsText(f.ships), cargo && `Cargaison : ${cargo}`].filter(Boolean).join('\n') || (f.mission && missionName(f.mission)) || 'Flotte',
        route: '#/fleet',
      });
    }

    for (const [key, title, route] of SOCIAL) {
      const count = next.social?.[key] ?? 0;
      if (count > (prev.social?.[key] ?? 0)) events.push({ id: `social:${key}`, level: 'info', title, message: `${count} en attente`, route });
    }
  }

  const hostiles = (next.foreign ?? []).filter(f => f.hostile && f.arriveAt > now);
  for (const f of hostiles) {
    if (memory.hostiles.includes(f.id)) continue;
    events.push({
      id: `hostile:${f.id}`,
      level: 'danger',
      title: `${foreignLabel(f)} en approche`,
      message: `Cible : ${place(f.targetName, f.target)}\nImpact à ${clock(f.arriveAt)}, dans ${duration(f.arriveAt - now)}`,
      route: '#/fleet',
    });
  }

  // « Bientôt plein » une fois, puis « plein » une fois, jusqu'à ce que le stock redescende.
  const storage: Memory['storage'] = {};
  for (const p of next.planets) {
    if (p.moon) continue;
    for (const r of RESOURCES) {
      const t = fullAt(p, r);
      if (t == null || t - now > STORAGE_WARNING) continue;
      const key = `${p.id}:${r}`;
      const level = t <= now ? 'full' : 'soon';
      const before = memory.storage[key];
      storage[key] = level;
      if (!prev || (level === 'full' ? before === 'full' : before)) continue;
      events.push({
        id: `storage:${key}`,
        level: 'info',
        title: level === 'full' ? `${resourceName(r)} : stockage plein sur ${p.name}` : `${resourceName(r)} : stockage bientôt plein sur ${p.name}`,
        message: level === 'full' ? 'La production s’arrête tant que le stockage est plein.' : `Plein à ${clock(t)}, dans ${duration(t - now)}`,
        route: '#/resources',
      });
    }
  }

  return { events, memory: { ...memory, hostiles: hostiles.map(f => f.id), storage } };
}

/** Rapports de combat et messages de flotte non lus, arrivés après `since`. */
export function messageEvents(messages: Message[], since: number): GameEvent[] {
  return messages
    .filter(m => !m.read && m.at > since && (m.type === 'combat' || m.type === 'fleet'))
    .sort((a, b) => a.at - b.at)
    .map((m): GameEvent => {
      const loot = resourcesText(m.data?.loot);
      const message =
        m.type !== 'combat' ? m.data?.text || 'Nouveau message'
        : !loot ? 'Voir le rapport de combat'
        : m.data?.perspective === 'defender' ? `Pillé : ${loot}`
        : `Butin : ${loot}`;
      return { id: `msg:${m.id}`, level: 'info', title: m.title, message: message.slice(0, 200), route: '#/messages' };
    });
}
