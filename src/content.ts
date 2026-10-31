// Relaie à l'extension le jeton de session du jeu (à chaque changement) et les systèmes
// de galaxie captés par hook.js. Chrome charge ce fichier tel quel, sans module : il ne doit rien importer.

const TOKEN_KEY = 'galaxia.token';
let sent: string | null | undefined;

function send(message: object) {
  try {
    chrome.runtime.sendMessage(message).catch(() => {});
  } catch {
    // Extension rechargée : ce script n'a plus de contexte.
    clearInterval(timer);
  }
}

function sync() {
  let token: string | null = null;
  try {
    token = localStorage.getItem(TOKEN_KEY);
  } catch {
    // Stockage du site inaccessible : on réessaiera.
  }
  if (token === sent) return;
  sent = token;
  send({ type: 'token', token });
}

// Habillage du site, pack d'assets et renommage (réglages de l'extension ; styles dans skin.css et
// skin-assets.css, renommage dans rename.js). Chaque classe est posée tout de suite d'après la dernière
// valeur, gardée dans le stockage du site, puis confirmée.
const LAYERS = { skin: 'radar-skin', assets: 'radar-assets', rename: 'radar-rename' } as const;
type Layer = keyof typeof LAYERS;

// Polices d'époque de l'habillage (pochoir, machine à écrire), chez Google Fonts comme celles du jeu.
// Chrome ne suit pas les @import des styles d'extension : la feuille passe par un lien dans la page.
const FONTS_ID = 'galaxia-radar-fonts';
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil:wght@800&family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap';

function loadFonts() {
  if (document.getElementById(FONTS_ID)) return;
  const link = Object.assign(document.createElement('link'), { id: FONTS_ID, rel: 'stylesheet', href: FONTS_URL });
  (document.head ?? document.documentElement).append(link);
}

function showLayer(layer: Layer, on: boolean) {
  document.documentElement.classList.toggle(LAYERS[layer], on);
  if (layer === 'skin' && on) loadFonts();
}

function applyLayer(layer: Layer, on: boolean) {
  showLayer(layer, on);
  try {
    localStorage.setItem(`galaxia-radar.${layer}`, on ? '1' : '0');
  } catch {
    // Sans cache, la classe arrivera un instant plus tard au prochain chargement.
  }
}

/** Le pack d'assets suit l'habillage tant que son réglage n'a pas été touché. */
function applySettings(settings: unknown) {
  const { skin, assets, rename } = (settings ?? {}) as { skin?: boolean; assets?: boolean; rename?: boolean };
  applyLayer('skin', Boolean(skin));
  applyLayer('assets', assets ?? Boolean(skin));
  applyLayer('rename', Boolean(rename));
}

try {
  for (const layer of Object.keys(LAYERS) as Layer[]) {
    showLayer(layer, localStorage.getItem(`galaxia-radar.${layer}`) === '1');
  }
  void chrome.storage.local.get('settings').then(({ settings }) => applySettings(settings));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.settings) applySettings(changes.settings.newValue);
  });
} catch {
  // Extension rechargée : ce script n'a plus de contexte.
}

// Planète d'origine choisie dans la popup (paramètre radarPlanet de l'adresse). Le jeu retient la planète affichée
// dans galaxia.planet et ne la relit qu'au démarrage : on l'écrit avant qu'il démarre ; jeu déjà chargé sur une
// autre planète, on recharge (la page Flotte vide sa sélection quand la planète change après coup).
const PLANET_KEY = 'galaxia.planet';
const PLANET_PARAM = 'radarPlanet';

function selectOrigin(starting: boolean) {
  const [path, query = ''] = location.hash.split('?');
  const params = new URLSearchParams(query);
  const planet = params.get(PLANET_PARAM);
  if (!planet) return;
  params.delete(PLANET_PARAM);
  history.replaceState(history.state, '', `${location.pathname}${location.search}${path}${params.size ? `?${params}` : ''}`);
  let current: string | null = null;
  try {
    current = localStorage.getItem(PLANET_KEY);
    localStorage.setItem(PLANET_KEY, planet);
  } catch {
    return;
  }
  if (!starting && current !== planet) location.reload();
}

// popstate arrive avant que le jeu ne lise puis n'efface les paramètres de la page ; hashchange en secours.
selectOrigin(true);
window.addEventListener('popstate', () => selectOrigin(false));
window.addEventListener('hashchange', () => selectOrigin(false));

// Page affichée, pour les règles de skin.css propres à une page (html[data-radar-route]).
function markRoute() {
  document.documentElement.dataset.radarRoute = location.hash.slice(2).split(/[?/]/)[0] || 'planet';
}

// Le jeu change de page par history.pushState, sans hashchange : l'API Navigation voit chaque changement d'adresse.
markRoute();
(window as { navigation?: EventTarget }).navigation?.addEventListener('currententrychange', markRoute);
window.addEventListener('hashchange', markRoute);

window.addEventListener('message', event => {
  const msg = event.data as { source?: string; kind?: string; data?: unknown } | null;
  if (event.source !== window || msg?.source !== 'galaxia-radar' || msg.kind !== 'system') return;
  send({ type: 'system', data: msg.data });
});

const timer = setInterval(sync, 5_000);
sync();
