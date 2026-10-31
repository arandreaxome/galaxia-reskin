// Champs de débris à recycler : l'état exact vient des vues de secteur (captées dans le jeu ou par la repasse),
// complété depuis par tes rapports : combats (débris créés) et recyclages (débris récupérés).

import type { GalaxySystem, Message } from './types';

/** Soute d'un recycleur, +5 % par niveau de Technologie Hyperespace (règle du jeu pour tous les vaisseaux). */
const RECYCLER_CARGO = 20_000;

type Amount = { metal: number; crystal: number };
type Position = { g: number; s: number; p: number };
export type DebrisView = Amount & { at: number };
/** Combat (débris créés) ou recyclage (débris récupérés, en négatif) relevé dans les messages. */
export type DebrisEvent = Amount & { key: string; at: number };
export type DebrisStore = { views: Record<string, DebrisView>; events: DebrisEvent[] };
export type DebrisField = Amount & Position & { key: string; at: number; estimated: boolean };

export const emptyDebris = (): DebrisStore => ({ views: {}, events: [] });

const amountOf = (d?: { metal?: number; crystal?: number } | null): Amount => ({ metal: d?.metal ?? 0, crystal: d?.crystal ?? 0 });

const position = (key: string): Position => {
  const [g, s, p] = key.split(':').map(Number);
  return { g, s, p };
};

/** Vue d'un secteur à l'instant `at` : débris des positions 1 à 15 et de l'espace inconnu (16), vides compris. */
export function mergeDebrisSystem(store: DebrisStore, sys: GalaxySystem, at: number): DebrisStore {
  const views = { ...store.views };
  for (let p = 1; p <= 15; p++) views[`${sys.g}:${sys.s}:${p}`] = { ...amountOf(sys.slots.find(slot => slot.p === p)?.debris), at };
  views[`${sys.g}:${sys.s}:16`] = { ...amountOf(sys.expeditionDebris), at };
  return { ...store, views };
}

/** « … récupéré 5 400 métal et 1 800 cristal. » */
const recovered = (text: string | undefined, resource: string) =>
  Number(text?.match(new RegExp(`([\\d\\s]+)\\s${resource}`))?.[1].replace(/\D/g, '') ?? 0);

/** Débris créés par tes combats et récupérés par tes recycleurs, d'après tous les messages (liste refaite à chaque relecture). */
export function debrisEvents(messages: Message[]): DebrisEvent[] {
  const events: DebrisEvent[] = [];
  for (const m of messages) {
    const c = m.data?.coords;
    if (m.type === 'combat' && c && m.data?.debris) events.push({ key: `${c.g}:${c.s}:${c.p}`, at: m.at, ...amountOf(m.data.debris) });
    const recycling = m.type === 'fleet' ? m.title.match(/^Recyclage \[(\d+):(\d+):(\d+)\]/) : null;
    if (recycling) {
      const text = m.data?.text;
      events.push({ key: recycling.slice(1).join(':'), at: m.at, metal: -recovered(text, 'métal'), crystal: -recovered(text, 'cristal') });
    }
  }
  return events;
}

/** Champs connus : dernière vue de chaque position, plus les combats et recyclages arrivés depuis (champ estimé). */
export function debrisFields(store: DebrisStore | undefined): DebrisField[] {
  const fields = new Map<string, DebrisField>();
  for (const [key, view] of Object.entries(store?.views ?? {})) fields.set(key, { ...position(key), key, ...amountOf(view), at: view.at, estimated: false });
  for (const e of [...(store?.events ?? [])].sort((a, b) => a.at - b.at)) {
    const f = fields.get(e.key) ?? { ...position(e.key), key: e.key, metal: 0, crystal: 0, at: 0, estimated: true };
    if (f.at >= e.at) continue;
    fields.set(e.key, { ...f, metal: Math.max(0, f.metal + e.metal), crystal: Math.max(0, f.crystal + e.crystal), at: e.at, estimated: true });
  }
  return [...fields.values()].filter(f => f.metal + f.crystal > 0);
}

export const recyclersFor = (f: Amount, hyperspaceTech = 0) =>
  Math.ceil((f.metal + f.crystal) / Math.floor(RECYCLER_CARGO * (1 + 0.05 * hyperspaceTech)));
