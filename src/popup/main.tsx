import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Settings } from '../types';
import { App } from './App';
import './popup.css';

// Ouverte en grand dans un onglet, la popup prend une mise en page plus large.
document.documentElement.classList.toggle('page', new URLSearchParams(location.search).has('page'));

// Thème (popup.css) : couleurs du site, ou « état-major » quand le site est habillé (réglage skin).
// Le dernier thème est gardé en local pour s'appliquer avant le premier rendu.
const THEME_KEY = 'radar.theme';
const SITE_FONTS = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&family=Exo+2:wght@400;500;600;700&display=swap';

function applyTheme(radar: boolean) {
  document.documentElement.dataset.theme = radar ? 'radar' : 'site';
  try {
    localStorage.setItem(THEME_KEY, radar ? 'radar' : 'site');
  } catch {
    // Sans stockage local, le thème s'applique quand même, un instant plus tard.
  }
  // Polices du site, chargées comme il le fait, seulement pour son thème.
  if (!radar && !document.getElementById('site-fonts')) {
    document.head.append(Object.assign(document.createElement('link'), { id: 'site-fonts', rel: 'stylesheet', href: SITE_FONTS }));
  }
}

try {
  applyTheme(localStorage.getItem(THEME_KEY) === 'radar');
} catch {
  applyTheme(false);
}
void chrome.storage.local.get('settings').then(({ settings }) => applyTheme(Boolean((settings as Settings | undefined)?.skin)));
chrome.storage.onChanged.addListener(changes => {
  if (changes.settings) applyTheme(Boolean((changes.settings.newValue as Settings | undefined)?.skin));
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
