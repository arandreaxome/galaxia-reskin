// Vols : distance, durée et deutérium d'un aller, mêmes formules que la page Flotte du jeu (à pleine vitesse).

import type { Coords } from './types';

type Drive = 'combustion' | 'impulse' | 'hyperspace';
type Research = Record<string, number>;
type Stats = { speed: number; fuel: number; drive: Drive };

/** Vaisseaux des préparations de l'extension : vitesse, consommation et réacteur de base. */
const SHIPS: Record<string, Stats> = {
  smallCargo: { speed: 5_000, fuel: 10, drive: 'combustion' },
  largeCargo: { speed: 7_500, fuel: 50, drive: 'combustion' },
  recycler: { speed: 2_000, fuel: 300, drive: 'combustion' },
  espionageProbe: { speed: 100_000_000, fuel: 1, drive: 'combustion' },
};

/** Vitesse gagnée par niveau de la technologie du réacteur. */
const BONUS: Record<Drive, [tech: string, perLevel: number]> = {
  combustion: ['combustionDrive', 0.1],
  impulse: ['impulseDrive', 0.2],
  hyperspace: ['hyperspaceDrive', 0.3],
};

/** Réacteur plus rapide débloqué par la recherche (petit transporteur, recycleur), comme dans le jeu. */
function stats(key: string, r: Research): Stats {
  if (key === 'smallCargo' && (r.impulseDrive ?? 0) >= 5) return { speed: 10_000, fuel: 20, drive: 'impulse' };
  if (key === 'recycler' && (r.hyperspaceDrive ?? 0) >= 15) return { speed: 6_000, fuel: 900, drive: 'hyperspace' };
  if (key === 'recycler' && (r.impulseDrive ?? 0) >= 17) return { ...SHIPS.recycler, fuel: 600, drive: 'impulse' };
  return SHIPS[key];
}

function speedOf(key: string, r: Research) {
  const { speed, drive } = stats(key, r);
  const [tech, perLevel] = BONUS[drive];
  return speed * (1 + perLevel * (r[tech] ?? 0));
}

export const distance = (a: Coords, b: Coords) =>
  a.g !== b.g ? 20_000 * Math.abs(a.g - b.g) : a.s !== b.s ? 2_700 + 95 * Math.abs(a.s - b.s) : a.p !== b.p ? 1_000 + 5 * Math.abs(a.p - b.p) : 5;

/** Aller de `ships` de `from` à `to` : durée (ms) et deutérium. `fleetSpeed` : vitesse des flottes de l'univers. */
export function flight(ships: Record<string, number>, from: Coords, to: Coords, research: Research, fleetSpeed = 1) {
  const keys = Object.keys(ships).filter(key => ships[key] > 0 && SHIPS[key]);
  if (!keys.length) return null;
  const d = distance(from, to);
  const speed = Math.min(...keys.map(key => speedOf(key, research)));
  const seconds = Math.max(5, Math.round((10 + 3_500 * Math.sqrt((d * 10) / speed)) / fleetSpeed));
  const consumption = keys.reduce((sum, key) => sum + stats(key, research).fuel * ships[key], 0);
  return { ms: seconds * 1000, fuel: 1 + Math.round(((consumption * d) / 35_000) * 4) };
}
