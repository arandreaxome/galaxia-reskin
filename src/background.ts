// Service worker : relève l'état du jeu chaque minute et à chaque échéance connue,
// notifie les changements et tient le badge de l'icône à jour. Lecture seule.

import { alerts, diff, initialMemory, messageEvents, nextDeadline, type GameEvent, type Memory } from './analysis';
import { setThemedNames } from './names';
import { openGame } from './open-game';
import { emptyStore, mergeCombats, mergeReports, mergeSystem, reconcile, type TargetStore } from './targets';
import type { GalaxySystem, GameState, Message, Settings, Snapshot, Status } from './types';

const GAME = 'https://galaxia.eldau.xyz/';
const API = `${GAME}api`;
const ICON = 'icons/icon-128.png';
// Badge de l'icône, dans la palette du thème (src/popup/popup.css).
const BADGE = { idle: '#2c2c2c', alert: '#4a5d4a', danger: '#6b1e1e', text: '#e8e4d9' };

type Stored = {
  token?: string | null;
  snapshot?: Snapshot;
  status?: Status;
  memory?: Memory;
  targets?: TargetStore;
  reportsAt?: number;
  settings?: Settings;
};

const read = () => chrome.storage.local.get(null) as Promise<Stored>;

class SessionExpired extends Error {}

async function api<T>(path: string, token: string): Promise<T> {
  const res = await fetch(API + path, { headers: { Authorization: `Bearer ${token}` } });
  if (res.status === 401) throw new SessionExpired();
  if (!res.ok) throw new Error(`Erreur ${res.status}`);
  return (await res.json()) as T;
}

let running: Promise<void> | null = null;
let lastRun = 0;

/** Relève l'état ; une demande à moins de 5 s de la précédente est ignorée, sauf `force`. */
function refresh(force = false): Promise<void> {
  if (running) return running;
  if (!force && Date.now() - lastRun < 5_000) return Promise.resolve();
  lastRun = Date.now();
  running = poll().finally(() => (running = null));
  return running;
}

async function poll() {
  const stored = await read();
  setThemedNames(Boolean(stored.settings?.rename));
  if (!stored.token) {
    await chrome.storage.local.set({ status: 'no-token' });
    return updateBadge();
  }

  let state: GameState;
  try {
    state = await api<GameState>('/state', stored.token);
  } catch (err) {
    if (err instanceof SessionExpired) {
      await chrome.storage.local.set({ token: null, status: 'expired' });
      if (stored.status !== 'expired') {
        notify({ id: 'session', level: 'danger', title: 'Session Galaxia expirée', message: 'Ouvre le jeu pour reconnecter l’extension.', route: '#/' });
      }
    } else {
      await chrome.storage.local.set({ status: 'offline' });
    }
    return updateBadge();
  }

  // Premier relevé ou autre compte : on repart de zéro, sans notifier le passé.
  const prev = stored.snapshot?.state.user.id === state.user.id ? stored.snapshot.state : null;
  const { events, memory } = diff(prev, state, prev && stored.memory ? stored.memory : initialMemory(state));

  // Premier import des cibles : rapports d'espionnage et carte de la galaxie.
  if (!stored.targets) void refreshReports(true);

  // Messages relus quand les non-lus augmentent.
  if (state.unread > memory.unread) {
    try {
      const { messages } = await api<{ messages: Message[] }>('/messages', stored.token);
      events.push(...messageEvents(messages, memory.lastMessageAt));
      memory.lastMessageAt = Math.max(memory.lastMessageAt, ...messages.map(m => m.at));
      memory.unread = state.unread;
      await importMessages(messages);
    } catch {
      // Nouvel essai au prochain relevé.
    }
  } else {
    memory.unread = state.unread;
  }

  const snapshot: Snapshot = { state, offset: state.serverTime - Date.now(), fetchedAt: Date.now() };
  await chrome.storage.local.set({ snapshot, status: 'ok', memory });
  show(events);
  await updateBadge();
  scheduleDeadline(snapshot);
}

async function updateBadge() {
  const { snapshot, status } = await read();
  await chrome.action.setBadgeTextColor({ color: BADGE.text });
  if (!snapshot || status === 'no-token' || status === 'expired') {
    await chrome.action.setBadgeBackgroundColor({ color: BADGE.idle });
    await chrome.action.setBadgeText({ text: '?' });
    await chrome.action.setTitle({ title: 'Galaxia Radar : ouvre le jeu pour connecter l’extension' });
    return;
  }
  const list = alerts(snapshot.state, Date.now() + snapshot.offset);
  const color = status === 'offline' ? BADGE.idle : list.some(a => a.level === 'danger') ? BADGE.danger : BADGE.alert;
  await chrome.action.setBadgeBackgroundColor({ color });
  await chrome.action.setBadgeText({ text: list.length ? String(list.length) : '' });
  await chrome.action.setTitle({ title: list.length ? list.map(a => a.text).join('\n') : 'Galaxia Radar : rien en attente' });
}

function scheduleDeadline({ state, offset }: Snapshot) {
  const t = nextDeadline(state, state.serverTime);
  // 2 s de marge pour laisser le serveur traiter l'échéance.
  if (t == null) void chrome.alarms.clear('deadline');
  else void chrome.alarms.create('deadline', { when: t - offset + 2_000 });
}

function notify(e: GameEvent) {
  // L'identifiant porte la page du jeu à ouvrir au clic.
  void chrome.notifications.create(`${e.route}|${e.id}`, {
    type: 'basic',
    iconUrl: ICON,
    title: e.title,
    message: e.message,
    priority: e.level === 'danger' ? 2 : 0,
    requireInteraction: e.level === 'danger',
  });
}

/** Au-delà de 3 événements d'un coup (retour de veille), un seul résumé ; les alertes restent à part. */
function show(events: GameEvent[]) {
  const info = events.filter(e => e.level !== 'danger');
  events.filter(e => e.level === 'danger').forEach(notify);
  if (info.length <= 3) return info.forEach(notify);
  notify({
    id: `summary:${Date.now()}`,
    level: 'info',
    title: `${info.length} événements sur Galaxia`,
    message: info.slice(0, 5).map(e => e.title).join('\n'),
    route: '#/',
  });
}

// Les cibles changent depuis plusieurs sources (relevés, systèmes captés) : une écriture après l'autre.
let targetsWrite: Promise<void> = Promise.resolve();

function updateTargets(change: (store: TargetStore) => TargetStore, extra: Partial<Stored> = {}) {
  targetsWrite = targetsWrite
    .then(async () => {
      const { targets = emptyStore() } = await read();
      await chrome.storage.local.set({ targets: change(targets), ...extra });
    })
    .catch(() => {});
  return targetsWrite;
}

const importMessages = (messages: Message[]) =>
  updateTargets(store => mergeCombats(mergeReports(store, messages), messages), { reportsAt: Date.now() });

/** Rapports et carte de la galaxie (gratuits), relus à l'ouverture de l'onglet Cibles, au plus toutes les 2 min. */
async function refreshReports(force = false) {
  const { token, reportsAt = 0, snapshot } = await read();
  if (!token || (!force && Date.now() - reportsAt < 2 * 60_000)) return;
  try {
    const [{ messages }, map] = await Promise.all([
      api<{ messages: Message[] }>('/messages', token),
      api<{ known?: Record<string, { pirates?: number }> }>('/galaxy-map', token),
    ]);
    const now = Date.now() + (snapshot?.offset ?? 0);
    await updateTargets(store => reconcile(mergeCombats(mergeReports(store, messages), messages), map.known ?? {}, now), {
      reportsAt: Date.now(),
    });
  } catch {
    // Nouvel essai à la prochaine ouverture.
  }
}

const isSystem = (data: unknown): data is GalaxySystem => {
  const sys = data as GalaxySystem | null;
  return typeof sys?.g === 'number' && typeof sys.s === 'number' && Array.isArray(sys.slots);
};

async function onSystem(data: unknown) {
  if (!isSystem(data)) return;
  const { snapshot } = await read();
  await updateTargets(store => mergeSystem(store, data, Date.now() + (snapshot?.offset ?? 0)));
}

async function onToken(token: string | null) {
  const { token: current } = await read();
  if (token !== current) await chrome.storage.local.set({ token, status: token ? 'ok' : 'no-token' });
  if (token) return refresh(token !== current);
  return updateBadge();
}

chrome.runtime.onMessage.addListener((msg: { type?: string; token?: string | null; data?: unknown }, sender) => {
  if (msg.type === 'token') void onToken(msg.token ?? null);
  if (msg.type === 'refresh') void refresh();
  if (msg.type === 'refresh-targets') void refreshReports();
  if (msg.type === 'system' && sender.url?.startsWith(GAME)) void onSystem(msg.data);
});

chrome.notifications.onClicked.addListener(id => {
  void chrome.notifications.clear(id);
  void openGame(id.split('|')[0]);
});

chrome.alarms.onAlarm.addListener(() => void refresh(true));
chrome.runtime.onInstalled.addListener(() => void refresh(true));
chrome.runtime.onStartup.addListener(() => void refresh(true));

// Les alarmes ne survivent pas toujours à un redémarrage du navigateur.
void chrome.alarms.get('poll').then(alarm => {
  if (!alarm) void chrome.alarms.create('poll', { periodInMinutes: 1 });
});
