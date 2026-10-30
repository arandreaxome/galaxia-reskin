// Pièces et sujets du pack, dessinés sur une grille de 128 × 128, de profil et tournés vers la droite.
// Silhouettes génériques : aucun insigne, aucun marquage national, aucun modèle réel reconnaissable.

import { C, OUTLINE, circle, el, ellipse, g, line, path, poly, rect } from './svg.ts';

const EDGE = { opacity: 0.55 };

/** Ombre portée au sol. */
const shadow = (cx = 64, cy = 104, rx = 50) => ellipse(cx, cy, rx, 4, C.black, { opacity: 0.55 });

/** Chenille de profil : bande crantée, galets et moyeux. */
function tracks(x: number, y: number, w: number, h: number, wheels: number) {
  const r = h / 2;
  const step = (w - h) / (wheels - 1);
  const rollers = Array.from({ length: wheels }, (_, i) => {
    const cx = x + r + i * step;
    return circle(cx, y + r, r - 4, C.fieldLight, { stroke: C.black, 'stroke-width': 1.5 }) + circle(cx, y + r, 1.8, C.ivory);
  });
  return g({}, rect(x, y, w, h, C.black, { rx: r, stroke: C.fieldLight, 'stroke-width': 2, 'stroke-dasharray': '4 2.5' }), ...rollers);
}

/** Roue de véhicule ou d'affût. */
const wheel = (cx: number, cy: number, r: number) =>
  g({}, circle(cx, cy, r, C.black, { stroke: C.fieldLight, 'stroke-width': 2 }), circle(cx, cy, r * 0.45, C.fieldLight), circle(cx, cy, 1.8, C.ivory));

/** Tube de canon, avec frein de bouche ivoire en option. */
function barrel(x1: number, y1: number, x2: number, y2: number, width: number, brake = true) {
  const butt = { 'stroke-linecap': 'butt' };
  const parts = [line(x1, y1, x2, y2, C.black, width + 3, butt), line(x1, y1, x2, y2, C.fieldLight, width, butt)];
  if (brake) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
    parts.push(line(x2 - ux * 6, y2 - uy * 6, x2, y2, C.ivory, width + 2, butt));
  }
  return g({}, ...parts);
}

/** Tête et casque rond générique. */
const head = (cx: number, cy: number, r: number) => circle(cx, cy, r, C.ivory, OUTLINE);
const helmet = (cx: number, cy: number, r: number) =>
  path(`M${cx - r - 3},${cy} A${r + 3},${r + 1} 0 0 1 ${cx + r + 3},${cy} Z`, C.field, OUTLINE);

/** Sac de sable. */
const bag = (x: number, y: number, w = 16, h = 10, fill: string = C.fieldLight) => rect(x, y, w, h, fill, { ...OUTLINE, rx: h / 2 });

/** Rangées de sacs : [x de départ, y, nombre] pour chaque rangée, de bas en haut. */
const sandbags = (rows: [number, number, number][]) =>
  rows.flatMap(([x, y, n], row) => Array.from({ length: n }, (_, i) => bag(x + i * 16, y, 16, 10, (i + row) % 2 ? C.field : C.fieldLight)));

// --- Infanterie ---------------------------------------------------------------

export const rifleman = () => [
  shadow(64, 106, 26),
  rect(54, 74, 8, 28, C.field, { ...OUTLINE, rx: 2 }),
  rect(64, 74, 8, 28, C.field, { ...OUTLINE, rx: 2 }),
  rect(52, 99, 12, 6, C.black, { rx: 2 }),
  rect(63, 99, 12, 6, C.black, { rx: 2 }),
  rect(41, 46, 11, 26, C.olive, { ...OUTLINE, rx: 3 }),
  rect(50, 44, 26, 34, C.fieldLight, { ...OUTLINE, rx: 7 }),
  rect(51, 68, 24, 4, C.olive),
  line(68, 52, 78, 57, C.fieldLight, 8),
  line(44, 84, 100, 40, C.ivory, 3.5),
  line(94, 45, 106, 35, C.ivory, 1.5),
  line(58, 60, 61, 71, C.fieldLight, 8),
  circle(78, 57, 4, C.ivory, OUTLINE),
  circle(61, 71, 4, C.ivory, OUTLINE),
  head(64, 36, 8),
  helmet(64, 34, 9),
];

export const machineGunner = () => [
  shadow(66, 102, 54),
  rect(12, 86, 34, 8, C.field, { ...OUTLINE, rx: 4 }),
  rect(18, 93, 26, 7, C.field, { ...OUTLINE, rx: 3.5 }),
  rect(40, 80, 42, 16, C.fieldLight, { ...OUTLINE, rx: 8 }),
  rect(78, 79, 18, 9, C.field, { ...OUTLINE, rx: 2 }),
  line(94, 83, 124, 82, C.ivory, 4),
  line(114, 83, 108, 98, C.ivory, 2),
  line(114, 83, 120, 98, C.ivory, 2),
  rect(86, 90, 12, 8, C.olive, OUTLINE),
  line(70, 86, 82, 85, C.fieldLight, 7),
  head(82, 76, 7),
  helmet(82, 74, 8),
];

export const sniper = () => [
  shadow(66, 102, 56),
  rect(10, 88, 36, 8, C.field, { ...OUTLINE, rx: 4 }),
  rect(40, 82, 42, 14, C.fieldLight, { ...OUTLINE, rx: 7 }),
  path('M38,86 l5,-8 l4,6 l5,-9 l4,8 l5,-9 l4,8 l5,-8 l4,7 l4,-6 l3,11 Z', C.olive, OUTLINE),
  line(76, 85, 126, 81, C.ivory, 3),
  rect(88, 74, 18, 6, C.fieldLight, { ...OUTLINE, rx: 2 }),
  line(116, 82, 112, 96, C.ivory, 1.5),
  line(116, 82, 120, 96, C.ivory, 1.5),
  head(84, 80, 7),
  path('M74,82 Q84,64 94,80 Z', C.olive, OUTLINE),
];

export const camp = () => [
  shadow(66, 102, 52),
  line(64, 44, 12, 100, C.ivory, 1, EDGE),
  line(64, 44, 116, 100, C.ivory, 1, EDGE),
  poly([22, 100, 64, 44, 106, 100], C.field, OUTLINE),
  poly([56, 100, 64, 74, 72, 100], C.black),
  line(64, 44, 64, 32, C.ivory, 2),
  rect(96, 82, 22, 18, C.olive, OUTLINE),
  line(96, 82, 118, 100, C.ivory, 1.5, EDGE),
  line(118, 82, 96, 100, C.ivory, 1.5, EDGE),
  rect(10, 88, 14, 12, C.olive, OUTLINE),
];

// --- Véhicules ----------------------------------------------------------------------

export const lightTank = () => [
  shadow(64, 102, 50),
  tracks(18, 80, 92, 20, 5),
  poly([16, 82, 18, 66, 92, 66, 112, 76, 112, 82], C.field, OUTLINE),
  line(20, 66, 90, 66, C.ivory, 1, EDGE),
  line(38, 54, 30, 30, C.ivory, 1.2),
  poly([40, 66, 44, 52, 70, 52, 78, 60, 78, 66], C.fieldLight, OUTLINE),
  rect(50, 46, 12, 7, C.field, { ...OUTLINE, rx: 2 }),
  barrel(76, 58, 114, 58, 4, false),
];

export const heavyTank = () => [
  shadow(64, 104, 58),
  tracks(10, 80, 108, 22, 6),
  poly([8, 82, 10, 62, 94, 62, 120, 72, 120, 82], C.field, OUTLINE),
  line(12, 62, 92, 62, C.ivory, 1, EDGE),
  poly([30, 62, 34, 42, 76, 42, 86, 50, 86, 62], C.fieldLight, OUTLINE),
  rect(44, 35, 14, 8, C.field, { ...OUTLINE, rx: 2 }),
  line(38, 42, 74, 42, C.ivory, 1, EDGE),
  barrel(84, 50, 125, 50, 6),
];

export const tankDestroyer = () => [
  shadow(64, 104, 56),
  tracks(12, 82, 104, 20, 6),
  poly([10, 84, 12, 66, 34, 50, 84, 50, 104, 64, 120, 74, 120, 84], C.field, OUTLINE),
  line(36, 50, 84, 50, C.ivory, 1, EDGE),
  barrel(90, 60, 126, 60, 5),
  circle(90, 60, 7, C.fieldLight, OUTLINE),
];

export const truck = () => [
  shadow(64, 102, 52),
  rect(12, 80, 102, 7, C.black, { rx: 2, stroke: C.fieldLight, 'stroke-width': 1.5 }),
  path('M14,80 L14,58 Q14,48 24,48 L66,48 Q76,48 76,58 L76,80 Z', C.fieldLight, OUTLINE),
  ...[30, 46, 62].map(x => line(x, 51, x, 78, C.olive, 2)),
  poly([78, 80, 78, 56, 96, 56, 104, 66, 114, 68, 114, 80], C.field, OUTLINE),
  poly([82, 60, 94, 60, 100, 67, 82, 67], C.black),
  wheel(32, 88, 10),
  wheel(56, 88, 10),
  wheel(98, 88, 10),
];

export const halfTrack = () => [
  shadow(64, 102, 56),
  tracks(12, 82, 66, 18, 4),
  poly([10, 84, 12, 58, 82, 58, 96, 66, 116, 70, 118, 84], C.field, OUTLINE),
  rect(18, 58, 58, 5, C.black),
  line(12, 58, 82, 58, C.ivory, 1, EDGE),
  poly([96, 66, 116, 70, 118, 76, 96, 75], C.fieldLight, OUTLINE),
  line(30, 58, 38, 44, C.ivory, 2.5),
  line(36, 46, 58, 42, C.ivory, 3),
  wheel(104, 90, 10),
];

export const recoveryTruck = () => [
  shadow(64, 102, 52),
  rect(12, 80, 102, 7, C.black, { rx: 2, stroke: C.fieldLight, 'stroke-width': 1.5 }),
  rect(14, 66, 62, 14, C.fieldLight, OUTLINE),
  line(28, 66, 16, 26, C.field, 6),
  line(44, 66, 16, 26, C.field, 6),
  line(16, 26, 16, 50, C.ivory, 1.5),
  path('M16,50 q5,0 5,5 q0,6 -6,6', 'none', { stroke: C.ivory, 'stroke-width': 2.5, 'stroke-linecap': 'round' }),
  poly([78, 80, 78, 56, 96, 56, 104, 66, 114, 68, 114, 80], C.field, OUTLINE),
  poly([82, 60, 94, 60, 100, 67, 82, 67], C.black),
  wheel(32, 88, 10),
  wheel(56, 88, 10),
  wheel(98, 88, 10),
];

export const railwayGun = () => [
  line(4, 99, 124, 99, C.fieldLight, 2),
  ...[18, 32, 46, 82, 96, 110].map(x => wheel(x, 91, 7)),
  rect(8, 70, 112, 14, C.field, { ...OUTLINE, rx: 2 }),
  line(10, 70, 118, 70, C.ivory, 1, EDGE),
  barrel(56, 58, 124, 16, 9),
  poly([32, 70, 44, 50, 82, 50, 94, 70], C.fieldLight, OUTLINE),
];

export const generator = () => [
  shadow(60, 102, 44),
  line(26, 76, 10, 88, C.fieldLight, 3),
  rect(26, 50, 68, 34, C.field, { ...OUTLINE, rx: 4 }),
  ...[34, 39, 44, 49, 54].map(x => line(x, 58, x, 76, C.ivory, 1.5, EDGE)),
  rect(76, 34, 8, 16, C.black, { stroke: C.fieldLight, 'stroke-width': 1.5 }),
  circle(74, 67, 10, C.black, { stroke: C.fieldLight, 'stroke-width': 1.5 }),
  poly([76, 58, 69, 69, 74, 69, 72, 76, 79, 65, 74, 65], C.ivory),
  wheel(42, 90, 9),
  wheel(80, 90, 9),
];

export const bomber = () => [
  poly([6, 62, 122, 62, 112, 72, 16, 72], C.fieldLight, OUTLINE),
  poly([42, 104, 86, 104, 80, 112, 48, 112], C.fieldLight, OUTLINE),
  rect(56, 12, 16, 104, C.field, { ...OUTLINE, rx: 8 }),
  ...[22, 40, 80, 98].map(x => rect(x, 54, 8, 18, C.black, { rx: 2, stroke: C.fieldLight, 'stroke-width': 1.5 }) + line(x - 4, 51, x + 12, 51, C.ivory, 2)),
  ellipse(64, 21, 4, 6, C.ivory, { opacity: 0.85 }),
  line(64, 32, 64, 98, C.ivory, 1, EDGE),
];

// --- Artillerie et fortifications ------------------------------------------------------

export const howitzer = () => [
  shadow(60, 104, 48),
  line(48, 88, 8, 100, C.field, 6),
  barrel(56, 66, 118, 28, 7),
  line(60, 60, 102, 35, C.field, 3),
  poly([40, 58, 64, 54, 66, 82, 42, 86], C.field, OUTLINE),
  wheel(50, 88, 15),
];

export const fieldGun = () => [
  shadow(60, 104, 50),
  line(46, 88, 6, 100, C.field, 6),
  barrel(56, 68, 125, 50, 7),
  poly([38, 56, 64, 52, 66, 82, 40, 86], C.field, OUTLINE),
  wheel(48, 88, 16),
];

export const antiTankGun = () => [
  shadow(64, 104, 52),
  line(48, 90, 10, 100, C.field, 5),
  barrel(64, 72, 125, 70, 6),
  poly([38, 62, 70, 58, 72, 86, 40, 88], C.field, OUTLINE),
  wheel(52, 90, 13),
];

export const antiAirGun = () => [
  shadow(64, 102, 50),
  rect(16, 92, 96, 6, C.olive, OUTLINE),
  barrel(58, 74, 96, 14, 5),
  barrel(70, 76, 108, 16, 5),
  poly([46, 94, 56, 70, 76, 70, 86, 94], C.field, OUTLINE),
  rect(42, 62, 16, 14, C.fieldLight, { ...OUTLINE, rx: 2 }),
];

export const rocketLauncher = () => [
  shadow(64, 104, 50),
  line(44, 88, 8, 100, C.field, 5),
  g(
    { transform: 'rotate(-24 70 66)' },
    ...[50, 59, 68].map(y => rect(32, y, 76, 8, C.fieldLight, { ...OUTLINE, rx: 1.5 }) + circle(106, y + 4, 2.4, C.ivory)),
  ),
  poly([40, 76, 66, 70, 72, 84, 42, 88], C.field, OUTLINE),
  wheel(50, 90, 13),
];

export const machineGunNest = () => [
  shadow(64, 102, 54),
  ...sandbags([
    [16, 90, 6],
    [24, 80, 5],
    [40, 70, 3],
  ]),
  line(66, 66, 116, 60, C.ivory, 4),
  helmet(56, 70, 8),
];

export const casemate = () => [
  path('M4,102 Q20,74 40,72 L96,70 Q118,74 124,102 Z', C.olive),
  poly([16, 100, 22, 54, 96, 46, 110, 100], C.fieldLight, OUTLINE),
  line(24, 54, 94, 47, C.ivory, 1, EDGE),
  rect(72, 64, 26, 12, C.black, { rx: 2 }),
  barrel(84, 70, 126, 64, 8),
  path('M4,102 Q14,86 30,84 L30,102 Z', C.olive),
];

export const sandbagWall = () => [
  shadow(64, 102, 58),
  ...sandbags([
    [8, 90, 7],
    [16, 80, 6],
    [24, 70, 5],
  ]),
];

export const bunker = () => [
  path('M4,102 Q64,30 124,102 Z', C.olive, OUTLINE),
  path('M22,102 A42,36 0 0 1 106,102 Z', C.fieldLight, OUTLINE),
  rect(44, 76, 40, 7, C.black, { rx: 3.5 }),
  path('M30,90 A34,28 0 0 1 98,90', 'none', { stroke: C.ivory, 'stroke-width': 1, ...EDGE }),
];

/** Missile vertical (avant rotation) : corps, ogive ivoire, bande rouge de charge, empennage. */
const missile = (x: number, top: number, w: number, h: number) => [
  poly([x, top + h - 14, x - w * 0.7, top + h + 4, x, top + h - 2], C.field, OUTLINE),
  poly([x + w, top + h - 14, x + w + w * 0.7, top + h + 4, x + w, top + h - 2], C.field, OUTLINE),
  rect(x, top + w * 0.6, w, h - w * 0.6, C.fieldLight, { ...OUTLINE, rx: 3 }),
  path(`M${x},${top + w * 0.8} Q${x + w / 2},${top - w * 0.6} ${x + w},${top + w * 0.8} Z`, C.ivory, OUTLINE),
  rect(x, top + w * 1.1, w, w * 0.3, C.red),
];

export const interceptor = () => [
  shadow(64, 104, 40),
  rect(36, 96, 56, 6, C.olive, OUTLINE),
  line(44, 98, 92, 30, C.field, 5),
  g({ transform: 'rotate(35 70 60)' }, ...missile(64, 22, 12, 62)),
];

export const rocket = () => [
  shadow(64, 106, 44),
  line(100, 18, 100, 102, C.olive, 3),
  ...[30, 50, 70, 90].map(y => line(100, y, 114, y + 10, C.olive, 2)),
  rect(36, 98, 56, 6, C.black, { stroke: C.fieldLight, 'stroke-width': 1.5 }),
  ...missile(54, 12, 20, 80),
];

// --- Ressources : dessinées sur une grille de 64, lisibles à 16 px ---------------------------

const ingot = (x: number, y: number, w: number) => [
  poly([x + 4, y, x + w - 4, y, x + w, y + 7, x, y + 7], C.ivory, OUTLINE),
  poly([x, y + 7, x + w, y + 7, x + w - 2, y + 16, x + 2, y + 16], C.fieldLight, OUTLINE),
];

export const steel = () => [...ingot(3, 42, 28), ...ingot(33, 42, 28), ...ingot(18, 25, 28)];

const shell = (x: number) => [
  rect(x, 26, 13, 32, C.fieldLight, { ...OUTLINE, rx: 1.5 }),
  rect(x, 50, 13, 3, C.olive),
  path(`M${x},28 Q${x + 6.5},4 ${x + 13},28 Z`, C.ivory, OUTLINE),
];

export const munitions = () => [...shell(8), ...shell(25.5), ...shell(43)];

export const fuel = () => [
  rect(22, 4, 22, 10, 'none', { stroke: C.fieldLight, 'stroke-width': 4, rx: 3 }),
  rect(12, 12, 40, 48, C.field, { ...OUTLINE, rx: 5 }),
  rect(44, 4, 9, 10, C.fieldLight, OUTLINE),
  line(18, 20, 46, 52, C.ivory, 3),
  line(46, 20, 18, 52, C.ivory, 3),
];

export const energy = () => [
  circle(32, 32, 28, C.field, OUTLINE),
  poly([37, 6, 15, 36, 30, 36, 25, 58, 50, 26, 34, 26, 41, 6], C.ivory, OUTLINE),
];

// --- Bâtiments : pièces communes -------------------------------------------------------------

type Roof = 'flat' | 'gable' | 'saw';

/** Bâtiment : murs et toit (plat, à deux pans ou en dents de scie). */
function shed(x: number, y: number, w: number, h: number, roof: Roof, fill: string = C.field) {
  const teeth = Math.max(2, Math.round(w / 18));
  const step = w / teeth;
  const roofs: Record<Roof, string> = {
    flat: rect(x - 2, y - 5, w + 4, 5, C.fieldLight, OUTLINE),
    gable: poly([x - 4, y, x + w / 2, y - Math.min(24, w * 0.3), x + w + 4, y], C.fieldLight, OUTLINE),
    saw: poly([x, y, ...Array.from({ length: teeth }, (_, i) => [x + i * step, y - 12, x + (i + 1) * step, y]).flat()], C.fieldLight, OUTLINE),
  };
  return g({}, rect(x, y, w, h, fill, OUTLINE), roofs[roof]);
}

/** Rangée de fenêtres éclairées. */
const windows = (x: number, y: number, n: number, gap = 11, w = 6, h = 8) =>
  g({}, ...Array.from({ length: n }, (_, i) => rect(x + i * gap, y, w, h, C.ivory, { opacity: 0.75 })));

const door = (x: number, y: number, w: number, h: number) => rect(x, y, w, h, C.black, { stroke: C.fieldLight, 'stroke-width': 1.5 });

const chimney = (x: number, y: number, w: number, h: number) =>
  g({}, rect(x, y, w, h, C.fieldLight, OUTLINE), rect(x - 1.5, y, w + 3, 4, C.olive, OUTLINE));

/** Réservoir cylindrique vertical. */
const tank = (x: number, y: number, w: number, h: number) =>
  g(
    {},
    rect(x, y, w, h, C.fieldLight, { ...OUTLINE, rx: 4 }),
    ellipse(x + w / 2, y + 3, w / 2 - 2, 3, C.ivory, { opacity: 0.6 }),
    line(x + 2, y + h * 0.45, x + w - 2, y + h * 0.45, C.olive, 2),
  );

/** Pylône ou mât en treillis : base de x à x + w, sommet à y - h. */
function lattice(x: number, y: number, w: number, h: number) {
  const top = x + w / 2;
  const n = Math.floor(h / 12);
  const half = (i: number) => (w / 2) * (1 - (i * 12) / h);
  const braces = Array.from({ length: n }, (_, i) =>
    line(top - half(i), y - i * 12, top + half(i + 1), y - (i + 1) * 12, C.fieldLight, 1.2) +
    line(top + half(i), y - i * 12, top - half(i + 1), y - (i + 1) * 12, C.fieldLight, 1.2),
  );
  return g({}, line(x, y, top, y - h, C.fieldLight, 2.5), line(x + w, y, top, y - h, C.fieldLight, 2.5), ...braces);
}

const crate = (x: number, y: number, w: number, h: number) =>
  g({}, rect(x, y, w, h, C.olive, OUTLINE), line(x + 3, y + 3, x + w - 3, y + h - 3, C.ivory, 1.2, EDGE), line(x + w - 3, y + 3, x + 3, y + h - 3, C.ivory, 1.2, EDGE));

const drum = (x: number, y: number) =>
  g({}, rect(x, y, 12, 16, C.field, { ...OUTLINE, rx: 2 }), line(x + 1, y + 5, x + 11, y + 5, C.ivory, 1, EDGE), line(x + 1, y + 11, x + 11, y + 11, C.ivory, 1, EDGE));

const smallShell = (x: number, y: number) =>
  g({}, rect(x, y + 8, 8, 14, C.fieldLight, { ...OUTLINE, rx: 1 }), path(`M${x},${y + 9} Q${x + 4},${y - 4} ${x + 8},${y + 9} Z`, C.ivory, OUTLINE));

// --- Bâtiments : production et stockage --------------------------------------------------------

export const mineHead = () => [
  shadow(64, 104, 58),
  path('M4,104 Q24,58 50,104 Z', C.olive, OUTLINE),
  lattice(52, 104, 34, 72),
  circle(69, 34, 9, C.black, { stroke: C.fieldLight, 'stroke-width': 2 }),
  line(69, 26, 69, 42, C.ivory, 1.2),
  line(61, 34, 77, 34, C.ivory, 1.2),
  line(69, 43, 69, 84, C.ivory, 1.2),
  shed(88, 72, 32, 32, 'gable'),
  door(98, 86, 10, 18),
  poly([14, 86, 42, 86, 39, 98, 17, 98], C.fieldLight, OUTLINE),
  circle(21, 100, 3, C.black, { stroke: C.fieldLight, 'stroke-width': 1.2 }),
  circle(35, 100, 3, C.black, { stroke: C.fieldLight, 'stroke-width': 1.2 }),
  circle(21, 84, 3, C.ivory),
  circle(28, 83, 3.5, C.ivory),
  circle(35, 84, 3, C.ivory),
];

export const ammoWorks = () => [
  shadow(64, 104, 60),
  chimney(64, 18, 10, 46),
  shed(6, 62, 82, 42, 'saw'),
  windows(12, 72, 7),
  door(38, 88, 14, 16),
  crate(92, 92, 32, 12),
  smallShell(96, 70),
  smallShell(106, 70),
  smallShell(116, 70),
];

export const refinery = () => [
  shadow(64, 104, 60),
  rect(24, 22, 14, 82, C.fieldLight, { ...OUTLINE, rx: 7 }),
  ...[38, 54, 70, 86].map(y => line(25, y, 37, y, C.olive, 2)),
  rect(46, 40, 12, 64, C.fieldLight, { ...OUTLINE, rx: 6 }),
  ...[54, 70, 86].map(y => line(47, y, 57, y, C.olive, 2)),
  line(38, 50, 46, 50, C.ivory, 2.5),
  line(38, 78, 46, 78, C.ivory, 2.5),
  line(58, 64, 78, 64, C.ivory, 2.5),
  tank(78, 52, 40, 52),
  rect(8, 90, 14, 14, C.olive, OUTLINE),
];

export const powerStation = () => [
  shadow(64, 104, 60),
  chimney(28, 16, 10, 46),
  chimney(48, 24, 10, 38),
  shed(12, 58, 68, 46, 'flat'),
  windows(18, 68, 6, 10, 6, 10),
  door(40, 90, 12, 14),
  lattice(92, 104, 26, 80),
  line(86, 38, 124, 38, C.fieldLight, 2),
  line(88, 50, 122, 50, C.fieldLight, 2),
  ...[88, 122].map(x => rect(x - 1.5, 38, 3, 7, C.ivory)),
  path('M88,45 Q80,52 80,60', 'none', { stroke: C.ivory, 'stroke-width': 1.2, ...EDGE }),
];

export const dam = () => [
  rect(4, 22, 120, 16, C.olive),
  poly([8, 34, 120, 34, 112, 104, 16, 104], C.fieldLight, OUTLINE),
  line(10, 34, 118, 34, C.ivory, 1, EDGE),
  ...[36, 64, 92].map(x => line(x, 38, x, 84, C.field, 2)),
  shed(36, 86, 56, 18, 'flat', C.field),
  ...[22, 102].map(x => path(`M${x - 7},84 L${x - 7},74 A7,7 0 0 1 ${x + 7},74 L${x + 7},84 Z`, C.black)),
  ...[22, 102].map(x => line(x, 86, x, 102, C.ivory, 2, EDGE)),
  windows(44, 92, 4, 11, 6, 6),
];

export const steelDepot = () => [
  shadow(60, 104, 56),
  path('M14,104 A42,42 0 0 1 98,104 Z', C.fieldLight, OUTLINE),
  path('M24,104 A32,32 0 0 1 88,104', 'none', { stroke: C.ivory, 'stroke-width': 1, ...EDGE }),
  door(44, 78, 24, 26),
  ...[0, 1, 2].map(i => rect(98, 96 - i * 8, 26, 6, i === 2 ? C.ivory : C.field, OUTLINE)),
];

export const ammoDepot = () => [
  path('M6,104 Q64,32 122,104 Z', C.olive, OUTLINE),
  path('M42,104 L42,84 A22,20 0 0 1 86,84 L86,104 Z', C.fieldLight, OUTLINE),
  door(52, 86, 24, 18),
  crate(96, 88, 22, 16),
  crate(102, 72, 16, 16),
  crate(8, 90, 22, 14),
];

export const fuelDepot = () => [
  shadow(64, 104, 60),
  tank(10, 38, 44, 66),
  tank(58, 54, 36, 50),
  line(54, 94, 58, 94, C.ivory, 2.5),
  drum(98, 88),
  drum(111, 88),
  drum(104.5, 72),
];

// --- Bâtiments : installations -----------------------------------------------------------------

export const factory = () => [
  shadow(64, 104, 60),
  chimney(104, 26, 11, 78),
  shed(8, 58, 94, 46, 'saw'),
  windows(14, 70, 8),
  door(46, 88, 16, 16),
];

export const tankWorks = () => [
  shadow(64, 104, 60),
  line(102, 104, 102, 28, C.fieldLight, 3),
  line(122, 104, 122, 28, C.fieldLight, 3),
  line(96, 28, 126, 28, C.fieldLight, 4),
  line(112, 28, 112, 52, C.ivory, 1.2),
  shed(6, 50, 88, 54, 'gable'),
  rect(22, 64, 56, 40, C.black, { stroke: C.fieldLight, 'stroke-width': 1.5 }),
  rect(28, 96, 44, 7, C.black, { rx: 3.5, stroke: C.fieldLight, 'stroke-width': 1.5 }),
  poly([28, 96, 30, 88, 62, 88, 72, 94, 72, 96], C.fieldLight, OUTLINE),
  rect(40, 81, 16, 7, C.field, OUTLINE),
  line(56, 84, 76, 84, C.fieldLight, 3),
];

export const laboratory = () => [
  shadow(64, 104, 58),
  lattice(94, 104, 22, 86),
  line(105, 18, 74, 50, C.ivory, 1, EDGE),
  line(105, 18, 126, 52, C.ivory, 1, EDGE),
  shed(12, 58, 76, 46, 'gable'),
  windows(18, 68, 6),
  door(44, 86, 12, 18),
];

export const arsenal = () => [
  shadow(64, 104, 62),
  chimney(52, 16, 9, 40),
  chimney(68, 22, 9, 34),
  shed(4, 66, 42, 38, 'saw'),
  shed(44, 52, 44, 52, 'flat'),
  shed(88, 70, 36, 34, 'gable'),
  windows(10, 76, 3),
  windows(50, 62, 3, 13, 7, 10),
  windows(94, 80, 2, 12),
  door(58, 88, 16, 16),
];

export const bulldozer = () => [
  shadow(60, 104, 56),
  path('M90,104 Q108,70 126,104 Z', C.olive, OUTLINE),
  tracks(14, 82, 70, 20, 4),
  rect(20, 64, 46, 18, C.field, { ...OUTLINE, rx: 2 }),
  rect(30, 44, 26, 20, C.fieldLight, OUTLINE),
  rect(34, 48, 18, 10, C.black),
  rect(28, 40, 30, 5, C.field, OUTLINE),
  rect(58, 52, 5, 12, C.black, { stroke: C.fieldLight, 'stroke-width': 1.2 }),
  line(64, 76, 86, 80, C.fieldLight, 4),
  path('M84,60 Q96,80 86,102 L93,102 Q103,80 91,58 Z', C.fieldLight, OUTLINE),
];

export const launchSite = () => [
  shadow(72, 104, 50),
  rect(34, 96, 88, 8, C.fieldLight, OUTLINE),
  line(56, 96, 98, 28, C.field, 5),
  g({ transform: 'rotate(31 84 58)' }, ...missile(78, 18, 14, 66)),
  path('M2,104 L6,80 L30,78 L34,104 Z', C.olive, OUTLINE),
  rect(12, 86, 14, 4, C.black),
];

export const outpost = () => [
  path('M4,104 Q64,70 124,104 Z', C.olive, OUTLINE),
  lattice(70, 96, 28, 54),
  rect(70, 30, 28, 14, C.field, OUTLINE),
  rect(66, 26, 36, 5, C.fieldLight, OUTLINE),
  rect(76, 34, 16, 5, C.black),
  ...sandbags([[12, 86, 3]]),
  path('M6,102 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6', 'none', { stroke: C.ivory, 'stroke-width': 1.2 }),
  poly([102, 98, 113, 80, 124, 98], C.field, OUTLINE),
];

export const radarStation = () => [
  shadow(64, 104, 56),
  shed(80, 82, 40, 22, 'flat'),
  door(92, 90, 10, 14),
  lattice(30, 104, 40, 56),
  g(
    { transform: 'rotate(-12 50 34)' },
    rect(22, 20, 56, 28, C.fieldLight, OUTLINE),
    ...[30, 38, 46, 54, 62, 70].map(x => line(x, 21, x, 47, C.black, 1.2)),
    ...[27, 34, 41].map(y => line(23, y, 77, y, C.black, 1.2)),
  ),
];

export const airfield = () => [
  line(4, 104, 124, 104, C.fieldLight, 2),
  ...Array.from({ length: 6 }, (_, i) => rect(8 + i * 20, 108, 12, 3, C.ivory, { opacity: 0.6 })),
  path('M40,104 L40,80 A30,24 0 0 1 100,80 L100,104 Z', C.fieldLight, OUTLINE),
  door(52, 84, 36, 20),
  rect(8, 48, 18, 56, C.field, OUTLINE),
  rect(4, 34, 26, 15, C.fieldLight, OUTLINE),
  rect(7, 37, 20, 7, C.ivory, { opacity: 0.75 }),
  line(114, 104, 114, 56, C.fieldLight, 2),
  poly([114, 56, 126, 59, 126, 64, 114, 67], C.ivory),
  poly([120, 57.5, 126, 59, 126, 64, 120, 65.5], C.olive),
];

// --- Recherches : un objet par technologie ---------------------------------------------------------

export const transformer = () => [
  shadow(64, 106, 40),
  rect(34, 60, 60, 44, C.field, { ...OUTLINE, rx: 3 }),
  ...[42, 52, 62, 72, 82].map(x => line(x, 66, x, 98, C.olive, 3)),
  ...[46, 64, 82].map(x => g({}, line(x, 58, x, 26, C.ivory, 1.5), ...[0, 1, 2, 3].map(i => ellipse(x, 54 - i * 7, 6, 3, C.ivory, OUTLINE)))),
  path('M46,26 Q64,12 82,26', 'none', { stroke: C.ivory, 'stroke-width': 1.2 }),
];

export const searchlight = () => [
  poly([76, 38, 126, 6, 126, 66, 76, 62], C.ivory, { opacity: 0.18 }),
  shadow(52, 106, 34),
  line(40, 106, 52, 70, C.fieldLight, 3),
  line(64, 106, 52, 70, C.fieldLight, 3),
  rect(38, 64, 28, 7, C.fieldLight, OUTLINE),
  rect(24, 28, 54, 40, C.field, { ...OUTLINE, rx: 9 }),
  ellipse(77, 48, 6, 18, C.ivory, OUTLINE),
];

export const radioTube = () => [
  shadow(64, 112, 28),
  path('M44,92 L44,40 Q44,12 64,12 Q84,12 84,40 L84,92 Z', C.fieldLight, { ...OUTLINE, 'fill-opacity': 0.35 }),
  rect(54, 38, 20, 40, 'none', { stroke: C.ivory, 'stroke-width': 1.5 }),
  line(64, 28, 64, 84, C.ivory, 1.2),
  rect(40, 90, 48, 14, C.field, OUTLINE),
  ...[48, 58, 70, 80].map(x => line(x, 104, x, 116, C.ivory, 2)),
];

export const mapAndDividers = () => [
  poly([14, 34, 44, 26, 74, 34, 104, 26, 104, 96, 74, 104, 44, 96, 14, 104], C.fieldLight, OUTLINE),
  line(44, 26, 44, 96, C.olive, 1.5),
  line(74, 34, 74, 104, C.olive, 1.5),
  path('M22,84 Q40,52 60,64 T98,44', 'none', { stroke: C.black, 'stroke-width': 1.8, 'stroke-dasharray': '4 3' }),
  line(86, 20, 68, 82, C.ivory, 2.5),
  line(86, 20, 108, 78, C.ivory, 2.5),
  circle(86, 20, 4, C.field, OUTLINE),
];

export const crucible = () => [
  shadow(70, 108, 44),
  rect(64, 88, 52, 18, C.field, OUTLINE),
  rect(68, 88, 44, 6, C.ivory, { opacity: 0.85 }),
  g(
    { transform: 'rotate(-35 40 50)' },
    path('M22,30 L58,30 L54,72 L26,72 Z', C.fieldLight, OUTLINE),
    rect(18, 26, 44, 6, C.field, OUTLINE),
    line(26, 72, 18, 96, C.fieldLight, 4),
  ),
  path('M58,44 Q78,54 84,88', 'none', { stroke: C.ivory, 'stroke-width': 5, 'stroke-linecap': 'round' }),
];

export const engineBlock = () => [
  shadow(64, 106, 52),
  ...[26, 44, 62, 80].map(x => line(x + 7, 36, x + 7, 26, C.ivory, 2)),
  ...[26, 44, 62, 80].map(x => rect(x, 34, 14, 22, C.fieldLight, { ...OUTLINE, rx: 2 })),
  rect(20, 54, 82, 40, C.field, { ...OUTLINE, rx: 3 }),
  line(26, 62, 96, 62, C.ivory, 1, EDGE),
  rect(24, 94, 74, 8, C.olive, OUTLINE),
  circle(104, 76, 14, C.black, { stroke: C.fieldLight, 'stroke-width': 2 }),
  circle(104, 76, 4, C.ivory),
];

export const radialEngine = () => [
  circle(64, 64, 46, C.field, OUTLINE),
  ...Array.from({ length: 9 }, (_, i) =>
    g({ transform: `rotate(${i * 40} 64 64)` }, rect(57, 20, 14, 26, C.fieldLight, { ...OUTLINE, rx: 3 }), ...[27, 33, 39].map(y => line(58, y, 70, y, C.olive, 1))),
  ),
  circle(64, 64, 15, C.fieldLight, OUTLINE),
  ...[0, 120, 240].map(a => g({ transform: `rotate(${a} 64 64)` }, path('M60,62 Q57,30 64,6 Q71,30 68,62 Z', C.black, { stroke: C.ivory, 'stroke-width': 1.5 }))),
  circle(64, 64, 6, C.ivory, OUTLINE),
];

export const rocketEngine = () => [
  path('M44,98 L84,98 L64,124 Z', C.red),
  path('M54,98 L74,98 L64,114 Z', C.ivory, { opacity: 0.85 }),
  rect(48, 8, 32, 32, C.fieldLight, { ...OUTLINE, rx: 4 }),
  path('M52,40 L76,40 L96,98 L32,98 Z', C.field, OUTLINE),
  ...[58, 78].map(y => line(52 - ((y - 40) * 20) / 58 + 2, y, 76 + ((y - 40) * 20) / 58 - 2, y, C.olive, 2)),
  path('M80,18 L98,18 L98,58 L84,58', 'none', { stroke: C.ivory, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
  path('M48,24 L32,24 L32,62 L46,62', 'none', { stroke: C.ivory, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }),
];

export const binoculars = () => [
  shadow(64, 104, 44),
  rect(30, 30, 18, 20, C.fieldLight, { ...OUTLINE, rx: 4 }),
  rect(80, 30, 18, 20, C.fieldLight, { ...OUTLINE, rx: 4 }),
  rect(20, 46, 34, 50, C.field, { ...OUTLINE, rx: 9 }),
  rect(74, 46, 34, 50, C.field, { ...OUTLINE, rx: 9 }),
  rect(52, 52, 24, 14, C.fieldLight, OUTLINE),
  circle(64, 59, 5, C.ivory, OUTLINE),
  ellipse(37, 93, 13, 4, C.ivory, { opacity: 0.85 }),
  ellipse(91, 93, 13, 4, C.ivory, { opacity: 0.85 }),
];

export const cipherMachine = () => [
  shadow(64, 106, 54),
  ...[44, 64, 84].map(x => g({}, rect(x - 7, 26, 14, 24, C.fieldLight, { ...OUTLINE, rx: 2 }), ...[31, 36, 41, 46].map(y => line(x - 5, y, x + 5, y, C.black, 1)))),
  rect(14, 48, 100, 12, C.fieldLight, OUTLINE),
  rect(14, 58, 100, 44, C.field, { ...OUTLINE, rx: 4 }),
  ...[68, 79, 90].flatMap((y, row) => Array.from({ length: 9 - row }, (_, i) => circle(24 + row * 5 + i * 10, y, 3.2, C.ivory, OUTLINE))),
];

export const telescope = () => [
  shadow(64, 108, 40),
  line(64, 66, 38, 108, C.fieldLight, 3),
  line(64, 66, 90, 108, C.fieldLight, 3),
  line(64, 66, 64, 108, C.fieldLight, 3),
  g(
    { transform: 'rotate(-28 64 60)' },
    rect(18, 52, 92, 16, C.field, { ...OUTLINE, rx: 3 }),
    rect(104, 48, 12, 24, C.fieldLight, { ...OUTLINE, rx: 2 }),
    rect(8, 55, 12, 10, C.fieldLight, OUTLINE),
    ellipse(116, 60, 2, 10, C.ivory),
  ),
  circle(64, 62, 5, C.ivory, OUTLINE),
];

export const fieldTelephone = () => [
  shadow(64, 106, 56),
  rect(12, 54, 58, 50, C.field, { ...OUTLINE, rx: 4 }),
  line(16, 66, 66, 66, C.ivory, 1, EDGE),
  path('M16,46 Q41,30 66,46 L61,52 Q41,40 21,52 Z', C.fieldLight, OUTLINE),
  circle(54, 84, 8, C.black, { stroke: C.fieldLight, 'stroke-width': 1.5 }),
  line(54, 84, 66, 78, C.ivory, 2),
  path('M70,94 Q86,104 100,102', 'none', { stroke: C.ivory, 'stroke-width': 1.5 }),
  circle(100, 80, 22, C.olive, OUTLINE),
  circle(100, 80, 14, C.field, OUTLINE),
  circle(100, 80, 4, C.ivory),
];

export const ballistics = () => [
  shadow(64, 108, 58),
  path('M20,94 Q64,-4 112,98', 'none', { stroke: C.ivory, 'stroke-width': 2, 'stroke-dasharray': '5 4' }),
  rect(56, 40, 14, 8, C.fieldLight, { ...OUTLINE, rx: 2 }),
  path('M70,40 Q79,44 70,48 Z', C.ivory, OUTLINE),
  barrel(18, 96, 34, 78, 4, false),
  wheel(18, 98, 8),
  circle(112, 98, 10, 'none', { stroke: C.ivory, 'stroke-width': 1.5 }),
  circle(112, 98, 4, C.red),
];

/** Fusil vu de profil, avant rotation. */
const rifle = () => [rect(14, 52, 100, 6, C.fieldLight, OUTLINE), rect(12, 50, 28, 11, C.field, { ...OUTLINE, rx: 2 }), line(112, 55, 124, 55, C.ivory, 2)];

export const crossedRifles = () => [
  shadow(64, 110, 40),
  crate(36, 84, 56, 24),
  g({ transform: 'rotate(-38 64 56)' }, ...rifle()),
  g({ transform: 'rotate(38 64 56) scale(-1 1) translate(-128 0)' }, ...rifle()),
];

export const camouflageNet = () => [
  el(
    'defs',
    {},
    el(
      'pattern',
      { id: 'net', width: 9, height: 9, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' },
      rect(0, 0, 9, 9, C.field),
      line(0, 0, 0, 9, C.ivory, 1, { opacity: 0.45 }),
      line(0, 0, 9, 0, C.ivory, 1, { opacity: 0.45 }),
    ),
  ),
  shadow(64, 104, 60),
  path('M8,104 Q18,44 64,38 Q110,44 120,104 Z', 'url(#net)', OUTLINE),
  ...[
    [30, 60],
    [52, 48],
    [78, 52],
    [96, 72],
    [44, 80],
    [70, 76],
  ].map(([x, y]) => poly([x, y, x + 10, y - 4, x + 14, y + 4, x + 4, y + 7], C.olive, OUTLINE)),
];

export const armourPlates = () => [
  shadow(64, 106, 54),
  poly([22, 96, 36, 38, 110, 38, 96, 96], C.field, OUTLINE),
  poly([12, 102, 28, 52, 102, 52, 86, 102], C.fieldLight, OUTLINE),
  ...[38, 52, 66, 80].map(x => circle(x, 58, 2.2, C.ivory)),
  ...[30, 44, 58, 72].map(x => circle(x, 96, 2.2, C.ivory)),
  circle(58, 77, 7, C.black, { stroke: C.ivory, 'stroke-width': 1 }),
  circle(58, 77, 2.5, C.ivory),
];
