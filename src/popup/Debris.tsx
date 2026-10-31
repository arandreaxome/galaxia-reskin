import { useEffect, useState } from 'react';
import { debrisFields, recyclersFor, type DebrisField, type DebrisStore } from '../debris';
import { age, num, short } from '../format';
import { label, resourceName } from '../names';
import { openGame } from '../open-game';
import { nearest } from '../targets';
import type { GameState } from '../types';

type Sort = 'amount' | 'proximity' | 'coords';
const SORT_KEY = 'radar.debris.sort';

type Row = { f: DebrisField; total: number; recyclers: number; near: ReturnType<typeof nearest>; enRoute: boolean };

const byCoords = (a: Row, b: Row) => a.f.g - b.f.g || a.f.s - b.f.s || a.f.p - b.f.p;
const SORTS: Record<Sort, (a: Row, b: Row) => number> = {
  amount: (a, b) => b.total - a.total || byCoords(a, b),
  proximity: (a, b) => (a.near?.systems ?? 999) - (b.near?.systems ?? 999) || b.total - a.total,
  coords: byCoords,
};

function loadSort(): Sort {
  try {
    const sort = localStorage.getItem(SORT_KEY);
    return sort === 'proximity' || sort === 'coords' ? sort : 'amount';
  } catch {
    return 'amount';
  }
}

type Props = { state: GameState; store?: DebrisStore; now: number; page: boolean };

/** Champs de débris connus, à recycler : vus dans les secteurs, ou estimés d'après tes combats et recyclages. */
export function DebrisView({ state, store, now, page }: Props) {
  const [galaxy, setGalaxy] = useState(0);
  const [sort, setSort] = useState(loadSort);
  const [open, setOpen] = useState<string | null>(null);

  // Combats et recyclages relus à l'ouverture (au plus toutes les 2 min, comme pour les cibles).
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'refresh-targets' }).catch(() => {});
  }, []);

  const changeSort = (next: Sort) => {
    setSort(next);
    try {
      localStorage.setItem(SORT_KEY, next);
    } catch {
      // Préférence non gardée, sans conséquence.
    }
  };

  const tech = state.user.research.hyperspaceTech ?? 0;
  const enRoute = new Set(state.fleets.filter(f => f.mission === 'recycle' && f.state === 'out').map(f => `${f.target.g}:${f.target.s}:${f.target.p}`));
  const fields = debrisFields(store);
  const galaxies = [...new Set(fields.map(f => f.g))].sort((a, b) => a - b);
  const rows: Row[] = fields
    .filter(f => !galaxy || f.g === galaxy)
    .map(f => ({ f, total: f.metal + f.crystal, recyclers: recyclersFor(f, tech), near: nearest(f, state.planets), enRoute: enRoute.has(f.key) }))
    .sort(SORTS[sort]);
  const total = rows.reduce((sum, r) => sum + r.total, 0);
  const recyclers = rows.reduce((sum, r) => sum + r.recyclers, 0);

  return (
    <section className="targets">
      <div className="filters">
        <div className="row">
          {galaxies.length > 1 && (
            <span className="seg" role="group">
              {[0, ...galaxies].map(g => (
                <button key={g} className={g === galaxy ? 'active' : ''} aria-pressed={g === galaxy} onClick={() => setGalaxy(g)}>
                  {g ? `G${g}` : 'Toutes'}
                </button>
              ))}
            </span>
          )}
          <span className="spacer" />
          <select value={sort} onChange={e => changeSort(e.target.value as Sort)} aria-label="Tri">
            <option value="amount">Quantité</option>
            <option value="proximity">Proximité</option>
            <option value="coords">Position</option>
          </select>
          {!page && (
            <button className="icon" title="Ouvrir dans un onglet" onClick={() => void chrome.tabs.create({ url: chrome.runtime.getURL('popup.html?page') })}>
              ⤢
            </button>
          )}
        </div>
        {rows.length > 0 && (
          <p className="muted debris-total">
            {rows.length} champ{rows.length > 1 ? 's' : ''} · {short(total)} à récupérer · {num(recyclers)} {label('recycler').toLowerCase()}
            {recyclers > 1 ? 's' : ''} en tout
          </p>
        )}
      </div>

      {!rows.length ? (
        <p className="muted empty">
          Aucun champ de débris connu. Affiche des secteurs dans la galaxie du jeu, ou lance une repasse depuis l’onglet Cibles : l’extension relève les
          débris qu’elle y voit, puis suit tes combats et tes recyclages.
        </p>
      ) : (
        <ul className="target-list">
          {rows.map(row => (
            <FieldRow key={row.f.key} row={row} now={now} open={open === row.f.key} onToggle={() => setOpen(open === row.f.key ? null : row.f.key)} />
          ))}
        </ul>
      )}

      <p className="sources muted">
        Champs vus dans les secteurs que tu affiches (ou repasses), puis estimés d’après tes combats (débris créés) et tes recyclages (débris récupérés).
      </p>
    </section>
  );
}

function FieldRow({ row, now, open, onToggle }: { row: Row; now: number; open: boolean; onToggle: () => void }) {
  const { f, total, recyclers, near, enRoute } = row;
  const name = label('recycler').toLowerCase();
  const parts = [`${num(recyclers)} ${name}${recyclers > 1 ? 's' : ''}`];
  parts.push(near ? (near.systems ? `${near.systems} syst.` : 'ton système') : 'autre galaxie');
  parts.push(f.estimated ? `estimé, dernier rapport il y a ${age(now - f.at)}` : `vu il y a ${age(now - f.at)}`);
  if (f.p === 16) parts.push('espace inconnu');
  const fleet = `#/fleet?g=${f.g}&s=${f.s}&p=${f.p}&mission=recycle&ships=recycler:${recyclers}`;

  return (
    <li className="target">
      <button className="target-main" onClick={onToggle} aria-expanded={open}>
        <span className="coords">
          {f.g}:{f.s}:{f.p}
        </span>
        <span className="lvl">{short(total)}</span>
        <span className="name">
          {num(f.metal)} {resourceName('metal').toLowerCase()} · {num(f.crystal)} {resourceName('crystal').toLowerCase()}
        </span>
        <span className={`pill ${enRoute ? 'protected' : f.estimated ? 'unprobed' : 'ready'}`}>{enRoute ? 'En route' : f.estimated ? 'Estimé' : 'Vu'}</span>
        <span className="sub">{parts.join(' · ')}</span>
      </button>
      <button className="icon goto" title={`Ouvrir le secteur ${f.g}:${f.s} dans le jeu`} onClick={() => void openGame(`#/galaxy?g=${f.g}&s=${f.s}`)}>
        ↗
      </button>
      {open && (
        <div className="details">
          <div className="actions">
            <button onClick={() => void openGame(fleet)}>
              Préparer le recyclage ({num(recyclers)} {name}
              {recyclers > 1 ? 's' : ''})
            </button>
          </div>
          <p className="muted hint">
            {enRoute && 'Des recycleurs sont déjà en route vers ce champ. '}Ouvre la page Flotte du jeu préremplie, depuis la planète sélectionnée dans le jeu :
            rien ne part sans ton clic.
          </p>
        </div>
      )}
    </li>
  );
}
