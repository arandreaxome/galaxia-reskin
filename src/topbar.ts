// Barre du haut habillée (html.radar-skin) : jauges de remplissage (skin.css). Le remplissage du stockage,
// lu dans la description de chaque ressource (« Métal : 1 440 sur 75 000, … »), passe à skin.css par --fill.
// Chrome charge ce fichier tel quel, sans module : il ne doit rien importer.
{
  const CLASS = 'radar-skin';
  const STOCK = /^[^:]*:\s*([\d\s]+?)\s+sur\s+([\d\s]+?),/;
  let observer: MutationObserver | null = null;

  const amount = (text: string) => Number(text.replace(/\D/g, ''));

  function gauges() {
    for (const res of document.querySelectorAll<HTMLElement>('.topbar .res')) {
      const m = res.getAttribute('aria-label')?.match(STOCK);
      if (!m || !amount(m[2])) continue;
      const fill = Math.min(1, amount(m[1]) / amount(m[2]));
      res.style.setProperty('--fill', fill.toFixed(3));
      res.style.setProperty('--gauge', fill >= 0.9 ? 'var(--c-brick)' : 'var(--c-ivory-2)');
    }
  }

  // Les stocks changent chaque seconde : la jauge suit leur description.
  function start() {
    observer = new MutationObserver(records => {
      if (records.some(r => (r.target instanceof Element ? r.target : r.target.parentElement)?.closest('.topbar'))) gauges();
    });
    observer.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-label'] });
    gauges();
  }

  function stop() {
    observer?.disconnect();
    observer = null;
    for (const res of document.querySelectorAll<HTMLElement>('.topbar .res')) {
      res.style.removeProperty('--fill');
      res.style.removeProperty('--gauge');
    }
  }

  function sync() {
    const on = document.documentElement.classList.contains(CLASS);
    if (on && !observer) start();
    if (!on && observer) stop();
  }

  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  sync();
}
