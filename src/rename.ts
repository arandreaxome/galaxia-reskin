// Renommage des éléments du jeu (réglage « Renommer les éléments ») : content.js pose la classe
// html.radar-rename, ce script remplace alors les noms dans les textes de la page et garde le nom
// d'origine au survol. Le lexique vient de names.ts, injecté au build (vite.config.ts) : Chrome charge
// ce fichier tel quel, sans module, il ne doit rien importer.
declare const __LEXIQUE__: string;

{
  const LEXIQUE: { inline: [string, string][]; exact: [string, string][]; menu: [string, string][] } = JSON.parse(__LEXIQUE__);
  const CLASS = 'radar-rename';
  // Champs et textes écrits par les joueurs (discussions, description de guilde) : jamais renommés.
  const SKIP = 'script, style, textarea, input, [contenteditable], .chat-msgs, .chat-input, .bubble, .guild-desc';
  const MENU = '.nav-label, h1, .page-head h2';
  const inline = new Map(LEXIQUE.inline);
  const exact = new Map(LEXIQUE.exact);
  const menu = new Map(LEXIQUE.menu);
  // Noms entiers seulement (lettres accentuées comprises), le plus long d'abord : « Mine de métal » avant « métal ».
  const names = [...inline.keys()].sort((a, b) => b.length - a.length).map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${names.join('|')})(?![\\p{L}\\p{N}])`, 'gu');

  /** Nœuds renommés : texte d'origine et texte écrit, pour reconnaître nos écritures et tout rétablir. */
  const renamed = new Map<Text, { from: string; to: string }>();
  const titled = new Set<Element>();
  let observer: MutationObserver | null = null;

  function themed(text: string, parent: Element): string {
    const whole = text.trim();
    const entire = (parent.closest(MENU) && menu.get(whole)) || exact.get(whole);
    return entire ? text.replace(whole, entire) : text.replace(pattern, name => inline.get(name) ?? name);
  }

  function rename(node: Text) {
    const parent = node.parentElement;
    if (!parent || parent.closest(SKIP) || node.data === renamed.get(node)?.to) return;
    const from = node.data;
    const to = themed(from, parent);
    if (to === from) {
      renamed.delete(node);
      return;
    }
    renamed.set(node, { from, to });
    node.data = to;
    if (!parent.hasAttribute('title')) {
      parent.setAttribute('title', from.trim());
      titled.add(parent);
    }
  }

  function walk(root: Node) {
    if (root instanceof Text) return rename(root);
    if (!(root instanceof Element)) return;
    const texts = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = texts.nextNode(); node; node = texts.nextNode()) rename(node as Text);
  }

  /** Le jeu remplace ses nœuds à chaque rendu : on oublie ceux qui ont quitté la page. */
  function prune() {
    for (const node of renamed.keys()) if (!node.isConnected) renamed.delete(node);
    for (const el of titled) if (!el.isConnected) titled.delete(el);
  }

  function start() {
    observer = new MutationObserver(records => {
      for (const r of records) {
        if (r.type === 'characterData') rename(r.target as Text);
        else r.addedNodes.forEach(walk);
      }
      if (renamed.size > 500) prune();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
    walk(document.documentElement);
  }

  function stop() {
    observer?.disconnect();
    observer = null;
    for (const [node, { from, to }] of renamed) if (node.data === to) node.data = from;
    for (const el of titled) el.removeAttribute('title');
    renamed.clear();
    titled.clear();
  }

  function sync() {
    const on = document.documentElement.classList.contains(CLASS);
    if (on && !observer) start();
    if (!on && observer) stop();
  }

  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  sync();
}
