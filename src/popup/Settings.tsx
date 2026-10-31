import type { NotifCategory, Settings } from '../types';

const NOTIFICATIONS: [NotifCategory, string, string][] = [
  ['queues', 'Files terminées', 'Construction, chantier ou recherche terminés, file vide.'],
  ['storage', 'Stockage plein', 'Bientôt plein, puis plein : la production s’arrête.'],
  ['fleets', 'Flottes revenues', 'Retour d’une de tes flottes, avec sa cargaison.'],
  ['hostile', 'Attaques en approche', 'Flotte hostile, missiles ou pillards en route vers une de tes planètes.'],
  ['reports', 'Rapports de combat et de flotte', 'Nouveaux rapports non lus.'],
  ['social', 'Social', 'Messages privés, demandes d’ami, guilde.'],
];

export function SettingsView({ settings = {} }: { settings?: Settings }) {
  const update = (change: Settings) => void chrome.storage.local.set({ settings: { ...settings, ...change } });
  return (
    <>
      <section className="card">
        <h2>Réglages</h2>
        <label className="setting">
          <input type="checkbox" checked={Boolean(settings.skin)} onChange={e => update({ skin: e.target.checked })} />
          <span>
            <b>Habiller le site du jeu aux couleurs de l’extension</b>
            <span className="muted">Mêmes couleurs et même police, décors retirés, images désaturées.</span>
          </span>
        </label>
        <label className="setting">
          <input type="checkbox" checked={settings.assets ?? Boolean(settings.skin)} onChange={e => update({ assets: e.target.checked })} />
          <span>
            <b>Remplacer les images du jeu par le pack d’assets</b>
            <span className="muted">Unités, défenses, bâtiments, recherches, ressources et icônes du menu. Les planètes gardent leurs images.</span>
          </span>
        </label>
        <label className="setting">
          <input type="checkbox" checked={Boolean(settings.rename)} onChange={e => update({ rename: e.target.checked })} />
          <span>
            <b>Renommer les éléments du jeu</b>
            <span className="muted">Unités, bâtiments, recherches, ressources et menu prennent les noms du thème (Petit transporteur → Camion). Le nom d’origine reste au survol ; la popup et les notifications suivent.</span>
          </span>
        </label>
        <p className="muted hint">Appliqué tout de suite aux onglets Galaxia ouverts, sans les recharger.</p>
      </section>
      <section className="card">
        <h2>Notifications de l’extension</h2>
        {NOTIFICATIONS.map(([key, title, text]) => (
          <label className="setting" key={key}>
            <input
              type="checkbox"
              checked={settings.notifications?.[key] !== false}
              onChange={e => update({ notifications: { ...settings.notifications, [key]: e.target.checked } })}
            />
            <span>
              <b>{title}</b>
              <span className="muted">{text}</span>
            </span>
          </label>
        ))}
        <p className="muted hint">
          Depuis sa version 8.0, le jeu notifie lui aussi les combats, l’espionnage, les flottes, le social et les attaques quand il n’est pas affiché
          (Mon compte) : décoche ici ce qu’il te signale déjà.
        </p>
      </section>
    </>
  );
}
