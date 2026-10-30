// Sonar de la vue Système : quand le faisceau (skin.css, .sys-glow::after) passe sur une planète
// ou une flotte, un écho s'allume à sa position. Les échos vivent dans leur propre calque :
// rien n'est ajouté aux éléments du jeu. Chrome charge ce fichier tel quel, sans module :
// il ne doit rien importer, et le bloc garde ses noms hors de la portée des autres scripts.
{
  const CONTACTS = '.sys-planet, .fl-blip';
  const PLANET_TYPES = ['mine', 'player', 'ally', 'pirate', 'empty', 'unknown'];
  const FLEET_SIDES: Record<string, string> = { 'side-own': 'own', 'side-hostile': 'hostile', 'side-neutral': 'neutral' };
  let frame = 0;
  let last: number | null = null;

  /** Type du contact, d'après les classes du jeu : il fixe la couleur de l'écho (skin.css). */
  function kind(contact: Element): string {
    if (contact.classList.contains('fl-blip')) {
      const side = Object.keys(FLEET_SIDES).find(c => contact.classList.contains(c));
      return `fleet-${side ? FLEET_SIDES[side] : 'neutral'}`;
    }
    return PLANET_TYPES.find(t => contact.classList.contains(t)) ?? 'unknown';
  }

  /** Angle du faisceau : 0° en haut, sens horaire (comme conic-gradient et rotate). */
  function sweepAngle(map: Element): number | null {
    const sweep = map
      .querySelector('.sys-glow')
      ?.getAnimations({ subtree: true })
      .find(a => (a as CSSAnimation).animationName === 'radar-sweep');
    const progress = sweep?.effect?.getComputedTiming().progress;
    return progress == null ? null : progress * 360;
  }

  function echo(contact: Element) {
    const r = contact.getBoundingClientRect();
    const el = document.createElement('div');
    el.className = `radar-echo echo-${kind(contact)}`;
    Object.assign(el.style, { left: `${r.left + r.width / 2}px`, top: `${r.top + r.height / 2}px`, width: `${r.width}px`, height: `${r.height}px` });
    el.addEventListener('animationend', () => el.remove());
    document.body.append(el);
  }

  function tick() {
    frame = requestAnimationFrame(tick);
    const map = document.querySelector('.sysmap');
    const angle = map && sweepAngle(map);
    if (!map || angle == null) {
      last = null;
      return;
    }
    if (last != null && angle !== last) {
      const box = map.getBoundingClientRect();
      const cx = box.left + box.width / 2;
      const cy = box.top + box.height / 2;
      for (const contact of map.querySelectorAll(CONTACTS)) {
        const r = contact.getBoundingClientRect();
        const bearing = ((Math.atan2(r.left + r.width / 2 - cx, cy - (r.top + r.height / 2)) * 180) / Math.PI + 360) % 360;
        // Le faisceau a balayé l'arc (last, angle] depuis l'image précédente, tour complet compris.
        const crossed = last < angle ? bearing > last && bearing <= angle : bearing > last || bearing <= angle;
        if (crossed) echo(contact);
      }
    }
    last = angle;
  }

  // La boucle ne tourne que sur la vue Système, habillage actif et onglet visible.
  setInterval(() => {
    const active = !document.hidden && document.documentElement.classList.contains('radar-skin') && document.querySelector('.sysmap');
    if (active && !frame) frame = requestAnimationFrame(tick);
    if (!active && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    }
  }, 1000);
}
