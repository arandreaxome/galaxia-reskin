// Génère le pack à partir du catalogue (pack.ts) :
//  - assets/skin/<clé>.svg et png/<clé>.png : les dessins, et leur rendu en référence pour un générateur d'images ;
//  - assets/skin/prompts.md et prompts.csv : les prompts à envoyer à ce générateur ;
//  - public/skin-assets.css : les règles qui remplacent les images du jeu quand le réglage « pack d'assets »
//    est actif (classe html.radar-assets, posée par content.js).
// Une image déposée dans assets/skin/generated/<clé>.(png|webp|jpg) remplace le dessin de cette clé.
// Usage : npm run assets [-- --preview <dossier>] pour écrire aussi une planche de contrôle.

import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import { ASSETS, NAV, NEGATIVE, STYLE_ILLUSTRATION, STYLE_VECTOR, VIEWS, type Asset } from './pack.ts';

const root = new URL('../../', import.meta.url);
const skin = new URL('assets/skin/', root);
const png = new URL('png/', skin);
const generated = new URL('generated/', skin);
const served = new URL('public/skin/', root);
for (const dir of [skin, png, generated]) mkdirSync(dir, { recursive: true });
rmSync(served, { recursive: true, force: true });

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Dessins et rendus de référence
for (const asset of ASSETS) {
  writeFileSync(new URL(`${asset.key}.svg`, skin), asset.svg);
  const render = new Resvg(asset.svg, { fitTo: { mode: 'width', value: 512 }, background: 'rgba(0,0,0,0)' }).render();
  writeFileSync(new URL(`${asset.key}.png`, png), render.asPng());
}
for (const nav of NAV) writeFileSync(new URL(`nav-${nav.route || 'planet'}.svg`, skin), nav.svg);

/** Image générée déposée pour cette clé, copiée dans l'extension. */
function generatedImage(key: string): string | null {
  for (const ext of ['png', 'webp', 'jpg', 'jpeg']) {
    if (!existsSync(new URL(`${key}.${ext}`, generated))) continue;
    mkdirSync(served, { recursive: true });
    copyFileSync(new URL(`${key}.${ext}`, generated), new URL(`${key}.${ext}`, served));
    // Chrome remplace __MSG_@@extension_id__ dans les feuilles injectées par les scripts de contenu.
    return `url("chrome-extension://__MSG_@@extension_id__/skin/${key}.${ext}")`;
  }
  return null;
}

// Images du jeu : remplacées par `content` (sans toucher au DOM), hors du filtre de désaturation de skin.css.
let replaced = 0;
const images = ASSETS.map(asset => {
  const selectors = [`img[src*="/assets/${asset.key}-"]`, ...(asset.alt ? [`img[alt="${asset.alt}"]`] : [])];
  const image = generatedImage(asset.key);
  if (image) replaced++;
  return `html.radar-assets :is(${selectors.join(', ')}) {\n  content: ${image ?? dataUri(asset.svg)};\n  filter: none !important;\n}`;
});

// Icônes du menu : l'icône du jeu est masquée par la nôtre, peinte avec la couleur du texte.
const nav = NAV.map(({ route, svg }) => {
  const sel = `html.radar-assets :is(.rail, .bottom-nav) a[href="#/${route}"] .nav-icon svg`;
  return `${sel} {\n  background: currentColor;\n  -webkit-mask: ${dataUri(svg)} center / contain no-repeat;\n  mask: ${dataUri(svg)} center / contain no-repeat;\n}\n${sel} > * {\n  visibility: hidden;\n}`;
});

const header = '/* Généré par tools/assets/build.ts (npm run assets) : ne pas modifier à la main. */\n\n';
writeFileSync(new URL('public/skin-assets.css', root), header + [...images, ...nav].join('\n\n') + '\n');

// Prompts pour un générateur d'images
const prompt = (asset: Asset, style: string) => `${style} Subject: ${asset.brief}. Framing: ${VIEWS[asset.group]}.`;
const groups = [...new Set(ASSETS.map(a => a.group))];
const promptsMd = [
  '# Pack d’assets Galaxia Radar : prompts de génération',
  '',
  'Fichier généré par `npm run assets` à partir de `tools/assets/pack.ts` : modifier le catalogue, pas ce fichier.',
  '',
  '## Mode d’emploi',
  '',
  '1. Choisir un style pour tout le pack : A (pictogramme vectoriel, dans la continuité de l’extension) ou B (illustration).',
  '2. Pour chaque élément, coller le prompt et joindre son rendu de référence `png/<clé>.png` (même silhouette, même cadrage).',
  '3. Ajouter le prompt négatif quand l’outil le permet, sinon l’écrire en fin de prompt après « Avoid: ».',
  '4. Exporter en PNG carré (1024 × 1024 conseillé), fond transparent.',
  '5. Déposer chaque image dans `assets/skin/generated/<clé>.png`, puis lancer `npm run assets && npm run build` et recharger l’extension. Les clés sans image gardent leur dessin.',
  '',
  '## Style A : pictogramme vectoriel (conseillé)',
  '',
  '```text',
  STYLE_VECTOR,
  '```',
  '',
  '## Style B : illustration',
  '',
  '```text',
  STYLE_ILLUSTRATION,
  '```',
  '',
  '## Prompt négatif',
  '',
  '```text',
  NEGATIVE,
  '```',
  '',
  '## Prompts par élément (style A)',
  '',
  'Pour le style B, remplacer la première partie (jusqu’à « same scale… ») par le paragraphe du style B, ou prendre la colonne `prompt_illustration` de `prompts.csv`.',
  ...groups.flatMap(group => [
    '',
    `### ${group}`,
    ...ASSETS.filter(a => a.group === group).flatMap(a => ['', `**${a.key}** · ${a.name} · référence \`png/${a.key}.png\``, '', '```text', prompt(a, STYLE_VECTOR), '```']),
  ]),
  '',
].join('\n');
writeFileSync(new URL('prompts.md', skin), promptsMd);

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
const csv = [
  ['key', 'name', 'group', 'reference', 'prompt_vector', 'prompt_illustration', 'negative'].join(','),
  ...ASSETS.map(a => [a.key, a.name, a.group, `png/${a.key}.png`, prompt(a, STYLE_VECTOR), prompt(a, STYLE_ILLUSTRATION), NEGATIVE].map(csvCell).join(',')),
].join('\n');
writeFileSync(new URL('prompts.csv', skin), csv + '\n');

console.log(`${ASSETS.length} dessins, ${NAV.length} icônes de menu, ${replaced} image(s) générée(s) utilisée(s)`);

// Planche de contrôle, hors du projet.
const at = process.argv.indexOf('--preview');
if (at > 0) {
  const out = new URL(`file://${process.argv[at + 1]}/`);
  mkdirSync(out, { recursive: true });
  const card = (body: string, name: string, key: string) =>
    `<figure>${body}<figcaption><b>${name}</b><small>${key}</small></figcaption></figure>`;
  const sections = groups.map(group => {
    const cards = ASSETS.filter(a => a.group === group).map(a => card(`<div class="big">${a.svg}</div><div class="small">${a.svg}</div>`, a.name, a.key));
    return `<h2>${group}</h2><section>${cards.join('')}</section>`;
  });
  const icons = NAV.map(n => card(`<div class="nav" style='--m:${dataUri(n.svg)}'></div>`, n.name, `#/${n.route}`));
  writeFileSync(
    new URL('preview.html', out),
    `<!doctype html><meta charset="utf-8"><title>Pack d'assets</title><style>
      body{margin:0;padding:24px;background:#1a1a1a;color:#e8e4d9;font:500 13px/1.4 'Avenir Next Condensed',sans-serif}
      h2{margin:18px 0 8px;font-size:13px;letter-spacing:.1em;text-transform:uppercase}
      section{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
      figure{margin:0;padding:10px;background:#2c2c2c;border:1px solid #3a4a3a;border-radius:2px;display:grid;gap:6px;justify-items:center}
      .big svg{width:128px;height:128px;display:block}.small svg{width:32px;height:32px;display:block}
      .nav{width:40px;height:40px;background:#e8e4d9;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}
      figcaption{display:grid;text-align:center}small{color:rgb(232 228 217/62%)}
    </style>${sections.join('')}<h2>Menu</h2><section>${icons.join('')}</section>`,
  );
  console.log(`planche : ${new URL('preview.html', out).pathname}`);
}
