import { Fragment, useEffect, useState, type ReactNode } from 'react';
import { RESOURCES, shipsText } from '../analysis';
import { age, clock, duration, num, short } from '../format';
import { resourceName } from '../names';
import { openGame } from '../open-game';
import { cargoFor, lootOf, nearest, targetStatus, type TargetStatus, type TargetStore } from '../targets';
import type { GameState, Target } from '../types';

type Sort = 'coords' | 'proximity' | 'loot' | 'protection';
type Filters = { kind: 'pirates' | 'players'; galaxy: number; levels: number[]; status: TargetStatus | 'all'; sort: Sort };

const DEFAULT_FILTERS: Filters = { kind: 'pirates', galaxy: 0, levels: [], status: 'all', sort: 'coords' };
const FILTERS_KEY = 'radar.filters';
/** Niveau inconnu, dans le filtre des niveaux. */
const UNKNOWN = 0;

const STATUSES: [TargetStatus, string][] = [
  ['ready', 'Prêts'],
  ['protected', 'Protégés'],
  ['respy', 'À réespionner'],
  ['unprobed', 'À sonder'],
];
const PILL: Record<TargetStatus, string> = { ready: 'Prêt', protected: 'Protégé', respy: 'À réespionner', unprobed: 'À sonder' };

type Row = { key: string; t: Target; status: TargetStatus; loot: number | null; near: ReturnType<typeof nearest> };

const byCoords = (a: Row, b: Row) => a.t.g - b.t.g || a.t.s - b.t.s || a.t.p - b.t.p;
const availableAt = (r: Row) => (r.status === 'protected' ? (r.t.protectedUntil ?? 0) : 0);
const SORTS: Record<Sort, (a: Row, b: Row) => number> = {
  coords: byCoords,
  proximity: (a, b) => (a.near?.systems ?? 999) - (b.near?.systems ?? 999) || byCoords(a, b),
  loot: (a, b) => (b.loot ?? -1) - (a.loot ?? -1) || byCoords(a, b),
  protection: (a, b) => availableAt(a) - availableAt(b) || byCoords(a, b),
};

function loadFilters(): Filters {
  try {
    return { ...DEFAULT_FILTERS, ...JSON.parse(localStorage.getItem(FILTERS_KEY) ?? '{}') };
  } catch {
    return DEFAULT_FILTERS;
  }
}

function countBy<K>(rows: Row[], key: (r: Row) => K) {
  const counts = new Map<K, number>();
  for (const r of rows) counts.set(key(r), (counts.get(key(r)) ?? 0) + 1);
  return counts;
}

const total = (units: Record<string, number>) => Object.values(units).reduce((sum, n) => sum + n, 0);

type Props = { state: GameState; store?: TargetStore; reportsAt?: number; now: number; page: boolean };

export function Targets({ state, store, reportsAt, now, page }: Props) {
  const [filters, setFilters] = useState(loadFilters);
  const [open, setOpen] = useState<string | null>(null);

  // Rapports relus à l'ouverture (le service worker limite à une fois toutes les 2 min).
  useEffect(() => {
    chrome.runtime.sendMessage({ type: 'refresh-targets' }).catch(() => {});
  }, []);

  const update = (change: Partial<Filters>) => {
    const next = { ...filters, ...change };
    setFilters(next);
    try {
      localStorage.setItem(FILTERS_KEY, JSON.stringify(next));
    } catch {
      // Préférence non gardée, sans conséquence.
    }
  };

  const list = Object.entries(store?.list ?? {});
  const galaxies = [...new Set(list.map(([, t]) => t.g))].sort((a, b) => a - b);
  const rows: Row[] = list
    .filter(([, t]) => t.pirate === (filters.kind === 'pirates') && (!filters.galaxy || t.g === filters.galaxy))
    .map(([key, t]) => ({ key, t, status: targetStatus(t, now), loot: lootOf(t), near: nearest(t, state.planets) }));

  // Le compteur de chaque filtre tient compte de l'autre.
  const levelOf = (r: Row) => r.t.level ?? UNKNOWN;
  const levelOk = (r: Row) => !filters.levels.length || filters.levels.includes(levelOf(r));
  const statusOk = (r: Row) => filters.status === 'all' || r.status === filters.status;
  const levelCounts = countBy(rows.filter(statusOk), levelOf);
  const statusCounts = countBy(rows.filter(levelOk), r => r.status);
  const levels = [...new Set([...levelCounts.keys(), ...filters.levels])].sort((a, b) => (a || 99) - (b || 99));
  const shown = rows.filter(r => levelOk(r) && statusOk(r)).sort(SORTS[filters.sort]);

  // Dernière observation en galaxie de chaque système, toutes cibles confondues.
  const seen = new Map<string, number>();
  for (const [, t] of list) if (t.seenAt) seen.set(`${t.g}:${t.s}`, Math.max(seen.get(`${t.g}:${t.s}`) ?? 0, t.seenAt));

  const toggleLevel = (level: number) =>
    update({ levels: filters.levels.includes(level) ? filters.levels.filter(l => l !== level) : [...filters.levels, level] });

  let lastSystem = '';
  return (
    <section className="targets">
      <div className="filters">
        <div className="row">
          <Segmented value={filters.kind} options={[['pirates', 'Repaires'], ['players', 'Joueurs']]} onChange={kind => update({ kind, levels: [] })} />
          {galaxies.length > 1 && (
            <Segmented
              value={filters.galaxy}
              options={[[0, 'Toutes'], ...galaxies.map((g): [number, string] => [g, `G${g}`])]}
              onChange={galaxy => update({ galaxy })}
            />
          )}
          <span className="spacer" />
          <select value={filters.sort} onChange={e => update({ sort: e.target.value as Sort })} aria-label="Tri">
            <option value="coords">Position</option>
            <option value="proximity">Proximité</option>
            <option value="loot">Butin</option>
            <option value="protection">Fin de protection</option>
          </select>
          {!page && (
            <button className="icon" title="Ouvrir dans un onglet" onClick={() => void chrome.tabs.create({ url: chrome.runtime.getURL('popup.html?page') })}>
              ⤢
            </button>
          )}
        </div>
        {filters.kind === 'pirates' && levels.length > 0 && (
          <div className="row" role="group" aria-label="Niveaux">
            {levels.map(level => (
              <Chip key={level} active={filters.levels.includes(level)} count={levelCounts.get(level) ?? 0} onClick={() => toggleLevel(level)}>
                {level === UNKNOWN ? 'N?' : `N${level}`}
              </Chip>
            ))}
            {filters.levels.length > 0 && (
              <button className="link" onClick={() => update({ levels: [] })}>
                tous
              </button>
            )}
          </div>
        )}
        <div className="row" role="group" aria-label="État">
          <Chip active={filters.status === 'all'} count={rows.filter(levelOk).length} onClick={() => update({ status: 'all' })}>
            Tous
          </Chip>
          {STATUSES.map(([status, text]) => (
            <Chip key={status} className={status} active={filters.status === status} count={statusCounts.get(status) ?? 0} onClick={() => update({ status })}>
              {text}
            </Chip>
          ))}
        </div>
      </div>

      {!list.length ? (
        <p className="muted empty">
          Aucune cible pour l’instant. Espionne un repaire, ou affiche des systèmes dans la vue Galaxie du jeu : l’extension enregistre ce que tu vois.
        </p>
      ) : !shown.length ? (
        <p className="muted empty">
          Aucune cible pour ces filtres.{' '}
          <button className="link" onClick={() => update({ levels: [], status: 'all', galaxy: 0 })}>
            Tout afficher
          </button>
        </p>
      ) : (
        <ul className="target-list">
          {shown.map(row => {
            const system = `${row.t.g}:${row.t.s}`;
            const head = filters.sort === 'coords' && system !== lastSystem;
            lastSystem = system;
            return (
              <Fragment key={row.key}>
                {head && <SystemHead system={system} state={state} seenAt={seen.get(system)} now={now} />}
                <TargetRow row={row} now={now} open={open === row.key} onToggle={() => setOpen(open === row.key ? null : row.key)} state={state} />
              </Fragment>
            );
          })}
        </ul>
      )}

      <p className="sources muted">
        Rapports d’espionnage relus {reportsAt ? `il y a ${age(Date.now() - reportsAt)}` : 'bientôt'}. Systèmes enregistrés quand tu les affiches dans
        le jeu : l’extension n’ouvre jamais la galaxie elle-même, donc 0 deutérium.
      </p>
    </section>
  );
}

function SystemHead({ system, state, seenAt, now }: { system: string; state: GameState; seenAt?: number; now: number }) {
  const own = state.planets.find(p => !p.moon && `${p.g}:${p.s}` === system);
  return (
    <li className="sys-head">
      <span>
        Système {system}
        {own && ` · ${own.name}`}
      </span>
      <span>{seenAt ? `vu il y a ${age(now - seenAt)}` : 'jamais affiché'}</span>
    </li>
  );
}

function TargetRow({ row, now, open, onToggle, state }: { row: Row; now: number; open: boolean; onToggle: () => void; state: GameState }) {
  const { t, status, loot, near } = row;
  const r = t.report;
  const parts: string[] = [];
  if (status === 'protected' && t.protectedUntil) {
    parts.push(`fin ${clock(t.protectedUntil)}, dans ${duration(t.protectedUntil - now)}${t.estimated ? ' (estimée)' : ''}`);
  }
  if (loot) parts.push(`butin ${short(loot)} · ${cargoFor(loot, state.user.research.hyperspaceTech)} GT`);
  if (r) parts.push(`flotte ${r.ships ? num(total(r.ships)) : '?'} · déf. ${r.defense ? num(total(r.defense)) : '?'}`);
  parts.push(r ? `rapport il y a ${age(now - r.at)}` : 'aucun rapport');
  if (near) parts.push(near.systems ? `${near.systems} syst.` : 'ton système');

  return (
    <li className={`target ${status}`}>
      <button className="target-main" onClick={onToggle} aria-expanded={open}>
        <span className="coords">
          {t.g}:{t.s}:{t.p}
        </span>
        <span className="lvl">{t.pirate ? `N${t.level ?? '?'}` : t.ai ? 'IA' : 'J'}</span>
        <span className="name">
          {t.tag && `[${t.tag}] `}
          {t.name}
          {!t.pirate && t.owner && <span className="muted"> · {t.owner}</span>}
        </span>
        <span className={`pill ${status}`}>{PILL[status]}</span>
        <span className="sub">{parts.join(' · ')}</span>
      </button>
      {open && <Details t={t} probes={state.user.prefs?.probes ?? 2} />}
    </li>
  );
}

function Details({ t, probes }: { t: Target; probes: number }) {
  const r = t.report;
  const fleet = (mission: string, extra = '') => `#/fleet?g=${t.g}&s=${t.s}&p=${t.p}&mission=${mission}${extra}`;
  return (
    <div className="details">
      {r ? (
        <dl>
          <dt>Stock</dt>
          <dd>{RESOURCES.map(res => `${num(r.resources[res] ?? 0)} ${resourceName(res).toLowerCase()}`).join(' · ')}</dd>
          <dt>Flotte</dt>
          <dd>{r.ships ? shipsText(r.ships) || 'aucune' : 'inconnue (rapport partiel)'}</dd>
          <dt>Défense</dt>
          <dd>{r.defense ? shipsText(r.defense) || 'aucune' : 'inconnue (rapport partiel)'}</dd>
          <dt>Rapport</dt>
          <dd>{clock(r.at)}</dd>
        </dl>
      ) : (
        <p className="muted">Pas encore de rapport d’espionnage.</p>
      )}
      <div className="actions">
        <button onClick={() => void openGame(fleet('spy', `&ships=espionageProbe:${probes}`))}>
          Espionner ({probes} sonde{probes > 1 ? 's' : ''})
        </button>
        {t.pirate && <button onClick={() => void openGame(fleet('attack'))}>Préparer l’attaque</button>}
        {r && <button onClick={() => void openGame(`#/simulator?spy=${r.id}`)}>Simuler</button>}
      </div>
      <p className="muted hint">Ouvre la page du jeu préremplie, depuis la planète sélectionnée dans le jeu : rien ne part sans ton clic.</p>
    </div>
  );
}

function Segmented<T extends string | number>({ value, options, onChange }: { value: T; options: [T, string][]; onChange: (value: T) => void }) {
  return (
    <span className="seg" role="group">
      {options.map(([option, text]) => (
        <button key={option} className={option === value ? 'active' : ''} aria-pressed={option === value} onClick={() => onChange(option)}>
          {text}
        </button>
      ))}
    </span>
  );
}

function Chip({ active, count, onClick, className = '', children }: { active: boolean; count: number; onClick: () => void; className?: string; children: ReactNode }) {
  return (
    <button className={`chip ${className} ${active ? 'active' : ''}`} aria-pressed={active} onClick={onClick}>
      {children}
      <small>{count}</small>
    </button>
  );
}
