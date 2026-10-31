// Construction de SVG en chaînes de caractères : de quoi dessiner les icônes du menu sans dépendance.

type Attrs = Record<string, string | number | undefined>;

export function el(tag: string, attrs: Attrs = {}, ...children: string[]): string {
  const list = Object.entries(attrs)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => ` ${key}="${value}"`)
    .join('');
  return children.length ? `<${tag}${list}>${children.join('')}</${tag}>` : `<${tag}${list}/>`;
}

export const svg = (size: number, ...children: string[]) =>
  el('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: `0 0 ${size} ${size}` }, ...children);
