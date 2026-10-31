// Génère le pack à partir du catalogue (pack.ts) :
//  - assets/skin/nav-<page>.svg : les icônes du menu ;
//  - assets/skin/prompts.md et prompts.csv : les prompts des images, pour Gemini (un Gem porte le style) ;
//  - public/skin-assets.css : les règles qui remplacent les images du jeu quand le réglage « pack d'assets »
//    est actif (classe html.radar-assets, posée par content.js).
// Les images sont déposées dans public/skin/<clé>.(png|webp|jpg|jpeg), que Vite copie telles quelles dans
// l'extension ; une clé sans image garde celle du jeu.
// Usage : npm run assets [-- --preview <dossier>] pour écrire aussi une planche de contrôle.

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { ASSETS, GEM, NAV, VIEWS, type Asset } from './pack.ts';

const root = new URL('../../', import.meta.url);
const skin = new URL('assets/skin/', root);
const served = new URL('public/skin/', root);
mkdirSync(skin, { recursive: true });

const dataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

for (const nav of NAV) writeFileSync(new URL(`nav-${nav.route || 'planet'}.svg`, skin), nav.svg);

/** Image déposée pour cette clé dans public/skin/. */
const imageFile = (key: string) => ['png', 'webp', 'jpg', 'jpeg'].map(ext => new URL(`${key}.${ext}`, served)).find(file => existsSync(file));

// Images du jeu : remplacées par `content` (sans toucher au DOM), hors du filtre de désaturation de skin.css.
// Chrome remplace __MSG_@@extension_id__ dans les feuilles injectées par les scripts de contenu.
const images = ASSETS.flatMap(asset => {
  const file = imageFile(asset.key);
  if (!file) return [];
  const selectors = [`img[src*="/assets/${asset.key}-"]`, ...(asset.alt ? [`img[alt="${asset.alt}"]`] : [])];
  const url = `chrome-extension://__MSG_@@extension_id__/skin/${file.pathname.split('/').pop()}`;
  return [`html.radar-assets :is(${selectors.join(', ')}) {\n  content: url("${url}");\n  filter: none !important;\n}`];
});

// Icônes du menu : l'icône du jeu est masquée par la nôtre, peinte avec la couleur du texte.
const nav = NAV.map(({ route, svg }) => {
  const sel = `html.radar-assets :is(.rail, .bottom-nav) a[href="#/${route}"] .nav-icon svg`;
  return `${sel} {\n  background: currentColor;\n  -webkit-mask: ${dataUri(svg)} center / contain no-repeat;\n  mask: ${dataUri(svg)} center / contain no-repeat;\n}\n${sel} > * {\n  visibility: hidden;\n}`;
});

const header = '/* Généré par tools/assets/build.ts (npm run assets) : ne pas modifier à la main. */\n\n';
writeFileSync(new URL('public/skin-assets.css', root), header + [...images, ...nav].join('\n\n') + '\n');

// Prompts pour Gemini : le Gem porte le style, chaque prompt ne donne que le sujet et le cadrage.
const prompt = (asset: Asset) => `${asset.name} (${asset.key}). Subject: ${asset.brief}. Framing: ${VIEWS[asset.group]}.`;
const groups = [...new Set(ASSETS.map(a => a.group))];
const promptsMd = [
  '# Pack d’assets Galaxia Radar : prompts de génération',
  '',
  'Fichier généré par `npm run assets` à partir de `tools/assets/pack.ts` : modifier le catalogue, pas ce fichier.',
  '',
  `Images réalistes façon photo d’archives de la Seconde Guerre mondiale, aux noms du renommage : un Gem Gemini porte le style, puis un prompt par image (${ASSETS.length} images). Les icônes du menu restent dessinées : elles servent de masque.`,
  '',
  '## Mode d’emploi',
  '',
  '1. Dans Gemini, créer un Gem (Explorer les Gems › Nouveau Gem), par exemple « Galaxia Radar · Arsenal 1940 », et coller les instructions ci-dessous.',
  '2. Dans une conversation avec ce Gem, envoyer un prompt par message : une image par élément. Une conversation par famille garde la série homogène ; une image qui s’écarte du style se régénère.',
  '3. Enregistrer chaque image sous `public/skin/<clé>.jpeg` (clé entre parenthèses au début du prompt ; `.png`, `.jpg` et `.webp` sont acceptés).',
  '4. Lancer `npm run assets && npm run build`, puis recharger l’extension (↻ dans `chrome://extensions`) et l’onglet du jeu. Les clés sans image gardent celle du jeu.',
  '',
  '## Instructions du Gem',
  '',
  '```text',
  GEM,
  '```',
  '',
  '## Prompts par image',
  ...groups.flatMap(group => [
    '',
    `### ${group}`,
    ...ASSETS.filter(a => a.group === group).flatMap(a => ['', `**${a.name}** · \`${a.key}\``, '', '```text', prompt(a), '```']),
  ]),
  '',
].join('\n');
writeFileSync(new URL('prompts.md', skin), promptsMd);

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;
const csv = [
  ['key', 'name', 'group', 'file', 'prompt'].join(','),
  ...ASSETS.map(a => [a.key, a.name, a.group, `public/skin/${a.key}.jpeg`, prompt(a)].map(csvCell).join(',')),
].join('\n');
writeFileSync(new URL('prompts.csv', skin), csv + '\n');

console.log(`${images.length} image(s) sur ${ASSETS.length}, ${NAV.length} icônes de menu`);

// Planche de contrôle, hors du projet.
const at = process.argv.indexOf('--preview');
if (at > 0) {
  const out = new URL(`file://${process.argv[at + 1]}/`);
  mkdirSync(out, { recursive: true });
  const card = (body: string, name: string, key: string) =>
    `<figure>${body}<figcaption><b>${name}</b><small>${key}</small></figcaption></figure>`;
  const sections = groups.map(group => {
    const cards = ASSETS.filter(a => a.group === group).map(a => {
      const file = imageFile(a.key);
      return card(file ? `<img class="big" src="${file.href}"><img class="small" src="${file.href}">` : '<span class="none">sans image</span>', a.name, a.key);
    });
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
      .big{width:128px;height:128px;display:block}.small{width:32px;height:32px;display:block}.none{height:128px;display:grid;place-items:center;color:#b4503f}
      .nav{width:40px;height:40px;background:#e8e4d9;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}
      figcaption{display:grid;text-align:center}small{color:rgb(232 228 217/62%)}
    </style>${sections.join('')}<h2>Menu</h2><section>${icons.join('')}</section>`,
  );
  console.log(`planche : ${new URL('preview.html', out).pathname}`);
}
