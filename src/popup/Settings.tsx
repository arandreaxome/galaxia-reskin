import type { Settings } from '../types';

export function SettingsView({ settings = {} }: { settings?: Settings }) {
  const update = (change: Settings) => void chrome.storage.local.set({ settings: { ...settings, ...change } });
  return (
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
      <p className="muted hint">Appliqué tout de suite aux onglets Galaxia ouverts, sans les recharger.</p>
    </section>
  );
}
