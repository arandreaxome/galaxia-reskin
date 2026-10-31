import { useEffect, useState } from 'react';
import { debrisFields, recyclersFor, type DebrisField, type DebrisStore } from '../debris';
import { flight } from '../flight';
import { age, duration, num, short } from '../format';
import { label, resourceName } from '../names';
import { openGame } from '../open-game';
import { nearest } from '../targets';
import type { GameState, Scan } from '../types';
import { bestOrigin, byDistance, OriginPicker } from './Origin';
import { ScanButton, ScanPanel, scanSummary, useScan } from './Scan';

type Sort = 'amount' | 'profit' | 'proximity' | 'coords';
const SORT_KEY = 'radar.debris.sort';

/** `trip` : aller des recycleurs depuis l'origine proposée ; `profit` : débris par minute de vol. */
type Row = {
  f: DebrisField;
  total: number;
  recyclers: number;
  near: ReturnType<typeof nearest>;
  enRoute: boolean;
  trip: ReturnType<typeof flight>;
  profit: number | null;
};

const byCoords = (a: Row, b: Row) => a.f.g - b.f.g || a.f.s - b.f.s || a.f.p - b.f.p;
const SORTS: Record<Sort, (a: Row, b: Row) => number> = {
  amount: (a, b) => b.total - a.total || byCoords(a, b),
  profit: (a, b) => (b.profit ?? -1) - (a.profit ?? -1) || b.total - a.total,
  proximity: (a, b) => (a.near?.systems ?? 999) - (b.near?.systems ?? 999) || b.total - a.total,
  coords: byCoords,
};

function loadSort(): Sort {
  try {
    const sort = localStorage.getItem(SORT_KEY);
    return sort === 'profit' || sort === 'proximity' || sort === 'coords' ? sort : 'amount';
  } catch {
    return 'amount';
  }
}

type Props = { state: GameState; store?: DebrisStore; scan?: Scan; now: number; page: boolean };

/** Champs de débris connus, à recycler : vus dans les secteurs, ou estimés d'après tes combats et recyclages. */
export function DebrisView({ state, store, scan, now, page }: Props) {
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
    .map(f => {
      const total = f.metal + f.crystal;
      const recyclers = recyclersFor(f, tech);
      const origin = bestOrigin(byDistance(state, f), 'recycler', recyclers);
      const trip = origin ? flight({ recycler: recyclers }, origin, f, state.user.research, state.settings?.fleetSpeed) : null;
      return { f, total, recyclers, near: nearest(f, state.planets), enRoute: enRoute.has(f.key), trip, profit: trip ? total / (trip.ms / 60_000) : null };
    })
    .sort(SORTS[sort]);
  // Repasse : les secteurs dont un champ n'est qu'estimé, pour le confirmer ou l'effacer d'une vue réelle.
  const estimated = [...new Set(fields.filter(f => f.estimated).map(f => `${f.g}:${f.s}`))].sort((a, b) => {
    const [ga, sa] = a.split(':').map(Number);
    const [gb, sb] = b.split(':').map(Number);
    return ga - gb || sa - sb;
  });
  const scanControl = useScan(state, estimated, now);
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
            <option value="profit">Rentabilité</option>
            <option value="proximity">Proximité</option>
            <option value="coords">Position</option>
          </select>
          <ScanButton control={scanControl} scan={scan} title="Rouvrir les secteurs dont les champs sont estimés, pour les confirmer ou les effacer" />
          {!page && (
            <button className="icon" title="Ouvrir dans un onglet" onClick={() => void chrome.tabs.create({ url: chrome.runtime.getURL('popup.html?page') })}>
              ⤢
            </button>
          )}
        </div>
        <ScanPanel control={scanControl} scan={scan} now={now} what="aux champs estimés" />
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
            <FieldRow
              key={row.f.key}
              row={row}
              state={state}
              now={now}
              open={open === row.f.key}
              onToggle={() => setOpen(open === row.f.key ? null : row.f.key)}
            />
          ))}
        </ul>
      )}

      <p className="sources muted">
        Champs vus dans les secteurs que tu affiches (ou repasses), puis estimés d’après tes combats (débris créés) et tes recyclages (débris récupérés).
        {scanSummary(scan)}
      </p>
    </section>
  );
}

function FieldRow({ row, state, now, open, onToggle }: { row: Row; state: GameState; now: number; open: boolean; onToggle: () => void }) {
  const { f, total, recyclers, near, enRoute, trip } = row;
  const name = label('recycler').toLowerCase();
  const parts = [`${num(recyclers)} ${name}${recyclers > 1 ? 's' : ''}`];
  parts.push(trip ? `≈ ${duration(trip.ms)} de vol` : near ? (near.systems ? `${near.systems} syst.` : 'ton système') : 'autre galaxie');
  parts.push(f.estimated ? `estimé, dernier rapport il y a ${age(now - f.at)}` : `vu il y a ${age(now - f.at)}`);
  if (f.p === 16) parts.push('espace inconnu');

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
      {open && <FieldDetails row={row} state={state} name={name} />}
    </li>
  );
}

function FieldDetails({ row, state, name }: { row: Row; state: GameState; name: string }) {
  const { f, recyclers, enRoute } = row;
  const planets = byDistance(state, f);
  const [origin, setOrigin] = useState(() => bestOrigin(planets, 'recycler', recyclers)?.id);
  const fleet = `#/fleet?g=${f.g}&s=${f.s}&p=${f.p}&mission=recycle&ships=recycler:${recyclers}`;
  const count = (n: number) => `${num(n)} ${name}${n > 1 ? 's' : ''}`;
  return (
    <div className="details">
      <OriginPicker
        planets={planets}
        to={f}
        value={origin}
        onChange={setOrigin}
        detail={p => {
          const trip = flight({ recycler: recyclers }, p, f, state.user.research, state.settings?.fleetSpeed);
          return `${trip ? `≈ ${duration(trip.ms)} · ${num(trip.fuel)} deut · ` : ''}${count(p.ships?.recycler ?? 0)}`;
        }}
      />
      <div className="actions">
        <button onClick={() => void openGame(fleet, origin)}>Préparer le recyclage ({count(recyclers)})</button>
      </div>
      <p className="muted hint">
        {enRoute && 'Des recycleurs sont déjà en route vers ce champ. '}Ouvre la page Flotte du jeu préremplie, depuis la planète choisie, que l’extension
        sélectionne dans le jeu : rien ne part sans ton clic.
      </p>
    </div>
  );
}
