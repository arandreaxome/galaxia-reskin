// Grades du classement (html.radar-skin), à la façon de ceux de Call of Duty : chaque joueur prend le grade
// de sa tranche de points, de Recrue à Maréchal (cinq étoiles). Le nom et l'insigne passent à skin.css par
// --radar-grade et --radar-insignia, sur la ligne du joueur ; le survol de la ligne donne le grade suivant.
// Chrome charge ce fichier tel quel, sans module : il ne doit rien importer.
{
  const CLASS = 'radar-skin';
  const IVORY = '#e8e4d9';
  const BRASS = '#9c8452';
  const INK = '#1a1a1a';

  type Insignia = { chevrons?: number; bars?: number; stars?: number };

  /** Grades par tranche de points (1 point = 1 000 ressources investies) ; les seuils doublent à partir de Lieutenant. */
  const GRADES: [points: number, name: string, insignia: Insignia][] = [
    [0, 'Recrue', {}],
    [25, 'Soldat', { chevrons: 1 }],
    [100, 'Caporal', { chevrons: 2 }],
    [250, 'Sergent', { chevrons: 3 }],
    [500, 'Adjudant', { bars: 1 }],
    [750, 'Lieutenant', { bars: 2 }],
    [1_500, 'Capitaine', { bars: 3 }],
    [3_000, 'Commandant', { bars: 4 }],
    [6_000, 'Colonel', { bars: 5 }],
    [12_000, 'Général de brigade', { stars: 1 }],
    [25_000, 'Général de division', { stars: 2 }],
    [50_000, 'Général de corps d’armée', { stars: 3 }],
    [100_000, 'Général d’armée', { stars: 4 }],
    [200_000, 'Maréchal', { stars: 5 }],
  ];

  let observer: MutationObserver | null = null;

  const round = (n: number) => Math.round(n * 100) / 100;
  const amount = (text: string) => Number(text.replace(/\D/g, ''));
  const points = (n: number) => `${n.toLocaleString('fr-FR')} points`;

  const draw = (width: number, body: string) =>
    `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${round(width)}' height='20'>${body}</svg>`)}")`;

  /** Laiton cerné d'encre : l'insigne reste visible sur la ligne surlignée (la tienne, celle survolée). */
  const brass = (shapes: string[]) =>
    `<g fill='${BRASS}' stroke='${INK}' stroke-width='1.2' stroke-linejoin='round' paint-order='stroke'>${shapes.join('')}</g>`;

  function star(cx: number, cy: number, r: number) {
    const corners = Array.from({ length: 10 }, (_, i) => {
      const radius = i % 2 ? r * 0.42 : r;
      return `${round(cx + radius * Math.sin((Math.PI * i) / 5))} ${round(cy - radius * Math.cos((Math.PI * i) / 5))}`;
    });
    return `<path d='M${corners.join('L')}Z'/>`;
  }

  /** Étoiles des généraux rangées comme dans Call of Duty : une grande, deux côte à côte, deux sur une, deux sur
   *  deux ; cinq en cercle pour le maréchal. Une étoile de rayon r fait 1,902 r de large et 1,809 r de haut. */
  function stars(n: number) {
    if (n === 5) {
      const angle = (i: number) => (2 * Math.PI * i) / 5;
      return draw(22, brass(Array.from({ length: 5 }, (_, i) => star(11 + 6.1 * Math.sin(angle(i)), 10.9 - 6.1 * Math.cos(angle(i)), 3.5))));
    }
    const rows = n <= 2 ? [n] : [2, n - 2];
    const [r, step] = n === 1 ? [7.5, 0] : n === 2 ? [5.2, 11] : [4.8, 10.4];
    const rowStep = 9.2;
    const width = step * (rows[0] - 1) + 1.902 * r + 1.2;
    const top = (20 - 1.809 * r - rowStep * (rows.length - 1)) / 2 + r;
    const shapes = rows.flatMap((count, k) =>
      Array.from({ length: count }, (_, j) => star(width / 2 + (j - (count - 1) / 2) * step, top + k * rowStep, r)),
    );
    return draw(width, brass(shapes));
  }

  /** Insigne de 20 px de haut : chevrons ivoire de la troupe, barrettes laiton côte à côte des officiers,
   *  étoiles laiton des généraux. */
  function insignia({ chevrons = 0, bars = 0, stars: count = 0 }: Insignia) {
    if (chevrons) {
      const top = 8 - 2.25 * (chevrons - 1);
      const d = Array.from({ length: chevrons }, (_, i) => `M1 ${top + 4.5 * i + 4}L6 ${top + 4.5 * i}L11 ${top + 4.5 * i + 4}`);
      return draw(12, `<path d='${d.join('')}' fill='none' stroke='${IVORY}' stroke-width='1.8' stroke-linecap='square'/>`);
    }
    if (bars) {
      return draw(5 + 5.6 * (bars - 1), brass(Array.from({ length: bars }, (_, i) => `<rect x='${round(1 + 5.6 * i)}' y='4.5' width='3.6' height='11' rx='0.6'/>`)));
    }
    return count ? stars(count) : 'none';
  }

  const INSIGNIA = GRADES.map(([, , badge]) => insignia(badge));

  function grade(score: number) {
    let i = 0;
    while (i + 1 < GRADES.length && score >= GRADES[i + 1][0]) i++;
    return i;
  }

  /** Lignes de l'onglet Joueurs ; l'onglet Guildes (colonne « Guilde ») garde son classement simple. */
  function mark() {
    if (document.documentElement.dataset.radarRoute !== 'ranking') return;
    for (const table of document.querySelectorAll<HTMLTableElement>('.page table')) {
      const head = [...(table.tHead?.rows[0]?.cells ?? [])].map(cell => cell.textContent?.trim());
      const col = head.indexOf('Points');
      if (!head.includes('Joueur') || col < 0) continue;
      for (const row of table.tBodies[0]?.rows ?? []) {
        const score = amount(row.cells[col]?.textContent ?? '');
        const i = grade(score);
        const [, name] = GRADES[i];
        const next = GRADES[i + 1];
        if (row.dataset.radarGrade !== name) {
          row.dataset.radarGrade = name;
          row.style.setProperty('--radar-grade', JSON.stringify(name));
          row.style.setProperty('--radar-insignia', INSIGNIA[i]);
        }
        const title = next ? `${name} · ${next[1]} à ${points(next[0])}, encore ${points(next[0] - score)}` : `${name} · grade le plus haut`;
        if (row.title !== title) row.title = title;
      }
    }
  }

  // Le classement se met à jour chaque minute et se redessine à chaque retour sur la page.
  function start() {
    observer = new MutationObserver(mark);
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true });
    mark();
  }

  function stop() {
    observer?.disconnect();
    observer = null;
    for (const row of document.querySelectorAll<HTMLElement>('tr[data-radar-grade]')) {
      delete row.dataset.radarGrade;
      row.style.removeProperty('--radar-grade');
      row.style.removeProperty('--radar-insignia');
      row.removeAttribute('title');
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
