// Construction de SVG en chaînes de caractères : de quoi dessiner le pack sans dépendance.

/** Palette du thème (src/popup/popup.css), seules couleurs autorisées dans le pack. */
export const C = {
  field: '#4a5d4a',
  fieldLight: '#5c6b5c',
  olive: '#3a4a3a',
  black: '#1a1a1a',
  anthracite: '#2c2c2c',
  ivory: '#e8e4d9',
  red: '#6b1e1e',
} as const;

type Attrs = Record<string, string | number | undefined>;

export function el(tag: string, attrs: Attrs = {}, ...children: string[]): string {
  const list = Object.entries(attrs)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');
  return children.length ? `<${tag}${list}>${children.join('')}</${tag}>` : `<${tag}${list}/>`;
}

/** Contour noir qui sépare les pièces d'un même sujet. */
export const OUTLINE: Attrs = { stroke: C.black, 'stroke-width': 2, 'stroke-linejoin': 'round' };

export const svg = (size: number, ...children: string[]) =>
  el('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: `0 0 ${size} ${size}` }, ...children);

export const g = (attrs: Attrs, ...children: string[]) => el('g', attrs, ...children);

export const rect = (x: number, y: number, w: number, h: number, fill: string, attrs: Attrs = {}) =>
  el('rect', { x, y, width: w, height: h, fill, ...attrs });

export const circle = (cx: number, cy: number, r: number, fill: string, attrs: Attrs = {}) => el('circle', { cx, cy, r, fill, ...attrs });

export const ellipse = (cx: number, cy: number, rx: number, ry: number, fill: string, attrs: Attrs = {}) =>
  el('ellipse', { cx, cy, rx, ry, fill, ...attrs });

/** Polygone à partir d'une liste plate de coordonnées : x1, y1, x2, y2… */
export function poly(points: number[], fill: string, attrs: Attrs = {}) {
  const pairs = [];
  for (let i = 0; i < points.length; i += 2) pairs.push(`${points[i]},${points[i + 1]}`);
  return el('polygon', { points: pairs.join(' '), fill, ...attrs });
}

export const line = (x1: number, y1: number, x2: number, y2: number, stroke: string, width = 2, attrs: Attrs = {}) =>
  el('line', { x1, y1, x2, y2, stroke, 'stroke-width': width, 'stroke-linecap': 'round', ...attrs });

export const path = (d: string, fill: string, attrs: Attrs = {}) => el('path', { d, fill, ...attrs });
