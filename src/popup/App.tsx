import { useEffect, useState, type ReactNode } from 'react';
import { alerts, fleetNextTime, foreignLabel, fullAt, resourcesAt, RESOURCES, shipyardEnd, socialCount } from '../analysis';
import { clock, coords, duration, num, place } from '../format';
import { FLEET_STATES, label, missionName, resourceName, setThemedNames } from '../names';
import { openGame } from '../open-game';
import type { DebrisStore } from '../debris';
import { targetStatus, type TargetStore } from '../targets';
import type { Fleet, GameState, Planet, Scan, Settings, Snapshot, Status } from '../types';
import { DebrisView } from './Debris';
import { SettingsView } from './Settings';
import { Targets } from './Targets';

type Stored = {
  snapshot?: Snapshot;
  status?: Status;
  targets?: TargetStore;
  reportsAt?: number;
  settings?: Settings;
  viewedSystems?: string[];
  scan?: Scan;
  debris?: DebrisStore;
};
type Tab = 'empire' | 'targets' | 'debris' | 'settings';

const open = (route = '#/', planet?: string) => void openGame(route, planet);

/** Popup ouverte en grand dans un onglet (bouton ⤢ de l'onglet Cibles). */
const page = new URLSearchParams(location.search).has('page');
const TAB_KEY = 'radar.tab';

function loadTab(): Tab {
  try {
    const tab = localStorage.getItem(TAB_KEY);
    return tab === 'targets' || tab === 'debris' || tab === 'settings' ? tab : 'empire';
  } catch {
    return 'empire';
  }
}

/** Dernier relevé du service worker, rechargé à chaque changement. */
function useStored(): Stored {
  const [stored, setStored] = useState<Stored>({});
  useEffect(() => {
    const load = () =>
      void (chrome.storage.local.get(['snapshot', 'status', 'targets', 'reportsAt', 'settings', 'viewedSystems', 'scan', 'debris']) as Promise<Stored>).then(setStored);
    load();
    chrome.storage.onChanged.addListener(load);
    // Relevé frais à l'ouverture de la popup.
    chrome.runtime.sendMessage({ type: 'refresh' }).catch(() => {});
    return () => chrome.storage.onChanged.removeListener(load);
  }, []);
  return stored;
}

/** Heure du serveur, rafraîchie chaque seconde pour les comptes à rebours. */
function useServerNow(offset: number) {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  return now + offset;
}

const STATUS_TEXT: Record<Status, (fetchedAt: number) => string> = {
  ok: t => `à jour à ${new Date(t).toLocaleTimeString('fr-FR')}`,
  offline: t => `serveur injoignable, données de ${clock(t)}`,
  expired: () => 'session expirée : ouvre le jeu',
  'no-token': () => 'non connecté : ouvre le jeu',
};

export function App() {
  const { snapshot, status = 'ok', targets, reportsAt, settings, viewedSystems, scan, debris } = useStored();
  setThemedNames(Boolean(settings?.rename));
  const now = useServerNow(snapshot?.offset ?? 0);
  const [tab, setTab] = useState(loadTab);

  const selectTab = (next: Tab) => {
    setTab(next);
    try {
      localStorage.setItem(TAB_KEY, next);
    } catch {
      // Onglet non retenu, sans conséquence.
    }
  };

  if (!snapshot) {
    return (
      <main>
        <h1>Galaxia Radar</h1>
        <p className="muted">Ouvre ou recharge Galaxia dans un onglet : l’extension récupère ta session toute seule.</p>
        <button onClick={() => open()}>Ouvrir Galaxia</button>
      </main>
    );
  }

  const state = snapshot.state;
  const list = alerts(state, now);
  const social = socialCount(state);
  const ready = Object.values(targets?.list ?? {}).filter(t => t.pirate && targetStatus(t, now) === 'ready').length;

  return (
    <main>
      <header>
        <div>
          <b>{state.user.username}</b> · {num(state.user.points)} pts · rang {state.user.rank}
        </div>
        <div className={status === 'ok' ? 'muted' : 'warn'}>{STATUS_TEXT[status](snapshot.fetchedAt)}</div>
        {(state.unread > 0 || social > 0) && (
          <div className="links">
            {state.unread > 0 && <a onClick={() => open('#/messages')}>{state.unread} message(s) non lu(s)</a>}
            {social > 0 && <a onClick={() => open('#/social')}>{social} en attente dans Social</a>}
          </div>
        )}
      </header>

      <nav className="tabs">
        <button className={tab === 'empire' ? 'active' : ''} aria-pressed={tab === 'empire'} onClick={() => selectTab('empire')}>
          Empire
          {list.length > 0 && <span className={`badge ${list.some(a => a.level === 'danger') ? 'danger' : ''}`}>{list.length}</span>}
        </button>
        <button className={tab === 'targets' ? 'active' : ''} aria-pressed={tab === 'targets'} onClick={() => selectTab('targets')}>
          Cibles
          {ready > 0 && <span className="badge ok" title="Repaires prêts à attaquer">{ready}</span>}
        </button>
        <button className={tab === 'debris' ? 'active' : ''} aria-pressed={tab === 'debris'} onClick={() => selectTab('debris')}>
          Débris
        </button>
        <button className={tab === 'settings' ? 'active' : ''} aria-pressed={tab === 'settings'} onClick={() => selectTab('settings')}>
          Réglages
        </button>
      </nav>

      {tab === 'settings' ? (
        <SettingsView settings={settings} />
      ) : tab === 'debris' ? (
        <DebrisView state={state} store={debris} scan={scan} now={now} page={page} />
      ) : tab === 'targets' ? (
        <Targets state={state} store={targets} reportsAt={reportsAt} viewedSystems={viewedSystems} scan={scan} now={now} page={page} />
      ) : (
        <>
          <section className="card">
            <h2>À traiter</h2>
            {list.length ? (
              <ul className="alerts">
                {list.map((a, i) => (
                  <li key={i} className={a.level} onClick={() => open(a.route, a.planet)}>
                    {a.text}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Rien en attente.</p>
            )}
          </section>

          <Planets planets={state.planets} now={now} />
          <Research state={state} now={now} />
          <Fleets state={state} now={now} />

          <footer>
            <button onClick={() => open()}>Ouvrir Galaxia</button>
          </footer>
        </>
      )}
    </main>
  );
}

const UNFOLDED_KEY = 'radar.empire.unfolded';

function loadUnfolded(): string[] {
  try {
    return JSON.parse(localStorage.getItem(UNFOLDED_KEY) ?? '[]');
  } catch {
    return [];
  }
}

/** Planètes repliées par défaut, une ligne chacune, sous le total de l'empire ; une planète dépliée le reste. */
function Planets({ planets, now }: { planets: Planet[]; now: number }) {
  const [unfolded, setUnfolded] = useState(loadUnfolded);
  const toggle = (id: string) => {
    const next = unfolded.includes(id) ? unfolded.filter(other => other !== id) : [...unfolded, id];
    setUnfolded(next);
    try {
      localStorage.setItem(UNFOLDED_KEY, JSON.stringify(next));
    } catch {
      // Préférence non gardée, sans conséquence.
    }
  };
  return (
    <>
      {planets.length > 1 && <Totals planets={planets} now={now} />}
      {planets.map(p => (
        <PlanetCard key={p.id} planet={p} now={now} folded={!unfolded.includes(p.id)} onFold={() => toggle(p.id)} />
      ))}
    </>
  );
}

/** Stocks et production horaire de toutes les planètes ; un stockage plein ne produit plus. */
function Totals({ planets, now }: { planets: Planet[]; now: number }) {
  const moons = planets.filter(p => p.moon).length;
  const bodies = [`${planets.length - moons} planète${planets.length - moons > 1 ? 's' : ''}`, moons && `${moons} lune${moons > 1 ? 's' : ''}`];
  return (
    <section className="card">
      <h2>
        Total
        <span className="muted">{bodies.filter(Boolean).join(' · ')}</span>
      </h2>
      <table>
        <tbody>
          {RESOURCES.map(r => {
            const stock = planets.reduce((sum, p) => sum + resourcesAt(p, now)[r], 0);
            const rate = planets.reduce((sum, p) => sum + (resourcesAt(p, now)[r] < (p.caps[r] ?? Infinity) ? (p.production[r] ?? 0) : 0), 0);
            return (
              <tr key={r}>
                <th>{resourceName(r)}</th>
                <td className="num">{num(stock)}</td>
                <td className="muted">{rate > 0 ? `+${num(rate)}/h` : 'production arrêtée'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

function PlanetCard({ planet: p, now, folded, onFold }: { planet: Planet; now: number; folded: boolean; onFold: () => void }) {
  return (
    <section className="card">
      <h2>
        <button className="fold" aria-expanded={!folded} title={folded ? 'Déplier' : 'Replier'} onClick={onFold}>
          {folded ? '▸' : '▾'} {p.name}
        </button>
        <span className="planet-head">
          <span className="muted">{coords(p)}</span>
          <button className="icon goto" title={`Ouvrir ${p.name} dans le jeu`} onClick={() => open('#/', p.id)}>
            ↗
          </button>
        </span>
      </h2>
      {folded ? <PlanetSummary planet={p} now={now} /> : <PlanetDetails planet={p} now={now} />}
    </section>
  );
}

/** Planète repliée : construction et chantier sur une ligne, premier stockage plein sur la suivante. */
function PlanetSummary({ planet: p, now }: { planet: Planet; now: number }) {
  const build = p.buildQueue[0];
  const lot = p.shipQueue[0];
  const full = RESOURCES.map(r => ({ r, t: fullAt(p, r) }))
    .filter((f): f is { r: (typeof RESOURCES)[number]; t: number } => f.t != null)
    .sort((a, b) => a.t - b.t)[0];
  const work: ReactNode[] = [];
  if (build) work.push(<span key="build">{label(build.key)} {build.demolish ? '(démolition)' : build.level} · {duration(build.end - now)}</span>);
  else if (!p.moon) work.push(<span key="build" className="warn">Aucune construction</span>);
  if (lot) work.push(<span key="lot">{num(lot.count)} × {label(lot.key)}</span>);
  return (
    <div className="planet-summary">
      {work.length > 0 && <p>{work.flatMap((part, i) => (i ? [' · ', part] : [part]))}</p>}
      {full && (full.t <= now ? <p className="warn">{resourceName(full.r)} plein</p> : <p className="muted">{resourceName(full.r)} plein dans {duration(full.t - now)}</p>)}
    </div>
  );
}

/** Planète dépliée : stocks, énergie, construction et chantier. */
function PlanetDetails({ planet: p, now }: { planet: Planet; now: number }) {
  const stock = resourcesAt(p, now);
  const build = p.buildQueue[0];
  const lot = p.shipQueue[0];
  const shipEnd = shipyardEnd(p);
  return (
    <>
      <table>
        <tbody>
          {RESOURCES.map(r => {
            const t = fullAt(p, r);
            const full = t != null && t <= now;
            return (
              <tr key={r}>
                <th>{resourceName(r)}</th>
                <td className="num">
                  {num(stock[r])}
                  <span className="muted"> / {num(p.caps[r] ?? 0)}</span>
                </td>
                <td className={full ? 'warn' : 'muted'}>{full ? 'plein' : t != null ? `plein dans ${duration(t - now)}` : ''}</td>
              </tr>
            );
          })}
          {p.energy && (
            <tr>
              <th>Énergie</th>
              <td className="num">{num(p.energy.produced - p.energy.used)}</td>
              <td className={p.energy.factor < 1 ? 'warn' : 'muted'}>
                {p.energy.factor < 1 ? `production à ${Math.round(p.energy.factor * 100)} %` : `${num(p.energy.used)} / ${num(p.energy.produced)}`}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Tableau à part : ses libellés longs n'élargissent pas les colonnes des ressources. */}
      <table>
        <tbody>
          <tr>
            <th>Construction</th>
            {build ? (
              <td>
                {label(build.key)} {build.demolish ? '(démolition)' : build.level} · {duration(build.end - now)}
                {p.buildQueue.length > 1 && <span className="muted"> · +{p.buildQueue.length - 1}</span>}
              </td>
            ) : (
              <td className={p.moon ? 'muted' : 'warn'}>Aucune</td>
            )}
          </tr>
          <tr>
            <th>Chantier</th>
            {lot && shipEnd != null ? (
              <td>
                {num(lot.count)} × {label(lot.key)} · {duration(shipEnd - now)}
                {p.shipQueue.length > 1 && <span className="muted"> · +{p.shipQueue.length - 1}</span>}
              </td>
            ) : (
              <td className="muted">Inactif</td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
}

function Research({ state, now }: { state: GameState; now: number }) {
  const queue = state.user.researchQueue;
  return (
    <section className="card">
      <h2>Recherche</h2>
      {queue.length ? (
        <table>
          <tbody>
            {queue.map(q => (
              <tr key={q.key + q.level}>
                <th>
                  {label(q.key)} {q.level}
                </th>
                <td>{duration(q.end - now)}</td>
                <td className="muted">{clock(q.end)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="warn">Aucune recherche en cours</p>
      )}
    </section>
  );
}

function Fleets({ state, now }: { state: GameState; now: number }) {
  const foreign = (state.foreign ?? []).filter(f => f.arriveAt > now);
  const limits = state.limits;
  return (
    <section className="card">
      <h2>
        Flottes
        {limits && (
          <span className="muted">
            {limits.usedSlots}/{limits.fleetSlots} · expéditions {limits.usedExpeditions}/{limits.expeditionSlots}
          </span>
        )}
      </h2>
      {foreign.map(f => (
        <div key={f.id} className={`fleet ${f.hostile ? 'hostile' : ''}`}>
          <div>
            <span className="tag">{f.mission ? missionName(f.mission) : 'Inconnue'}</span>
            {foreignLabel(f)} → {place(f.targetName, f.target)}
          </div>
          <div className="when">
            Impact dans {duration(f.arriveAt - now)} · {clock(f.arriveAt)}
          </div>
        </div>
      ))}
      {state.fleets.map(f => (
        <OwnFleet key={f.id} fleet={f} now={now} />
      ))}
      {!foreign.length && !state.fleets.length && <p className="muted">Aucune flotte en vol.</p>}
    </section>
  );
}

function OwnFleet({ fleet: f, now }: { fleet: Fleet; now: number }) {
  const t = fleetNextTime(f);
  const stateText = f.state === 'hold' && f.mission === 'defend' ? 'En défense' : FLEET_STATES[f.state] ?? f.state;
  return (
    <div className="fleet">
      <div>
        <span className="tag">{f.planId ? 'Attaque groupée' : missionName(f.mission ?? '')}</span>
        {coords(f.origin)} → {place(f.targetName, f.target)}
      </div>
      <div className="when">
        {stateText} · {t == null ? 'jusqu’au rappel' : `${duration(t - now)} · ${clock(t)}`}
      </div>
    </div>
  );
}
