// Mise en forme commune à la popup et aux notifications.

import type { Coords } from './types';

const numbers = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });

export const num = (n: number) => numbers.format(Math.floor(n));

/** Quantité courte : « 950 », « 70 k », « 1,2 M ». */
export function short(n: number): string {
  if (n < 1_000) return num(n);
  if (n < 1_000_000) return `${numbers.format(Math.round(n / 1_000))} k`;
  return `${(n / 1_000_000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} M`;
}

/** Ancienneté compacte : « 5 min », « 3 h », « 2 j ». */
export function age(ms: number): string {
  const min = Math.max(0, Math.floor(ms / 60_000));
  if (min < 60) return `${min} min`;
  if (min < 1_440) return `${Math.floor(min / 60)} h`;
  return `${Math.floor(min / 1_440)} j`;
}

/** Durée lisible : « 1 j 3 h », « 2 h 35 min », « 25 min », « 3 min 50 s », « 45 s ». */
export function duration(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const d = Math.floor(total / 86_400);
  const h = Math.floor((total % 86_400) / 3_600);
  const m = Math.floor((total % 3_600) / 60);
  const s = total % 60;
  if (d) return `${d} j ${h} h`;
  if (h) return `${h} h ${m} min`;
  if (m >= 10) return `${m} min`;
  if (m) return `${m} min ${s} s`;
  return `${s} s`;
}

/** Heure, précédée du jour quand ce n'est pas aujourd'hui (« ven. 20:42 »). */
export function clock(t: number): string {
  const date = new Date(t);
  const time = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (date.toDateString() === new Date().toDateString()) return time;
  return `${date.toLocaleDateString('fr-FR', { weekday: 'short' })} ${time}`;
}

export const coords = (c: Coords) => `[${c.g}:${c.s}:${c.p}]${c.moon ? ' lune' : ''}`;

export const place = (name: string | undefined, c: Coords) => (name ? `${name} ${coords(c)}` : coords(c));
