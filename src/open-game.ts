const GAME = 'https://galaxia.eldau.xyz/';

/** Affiche le jeu sur la page demandée, dans l'onglet déjà ouvert s'il y en a un. */
export async function openGame(route = '#/') {
  const url = GAME + route;
  const [tab] = await chrome.tabs.query({ url: `${GAME}*` });
  if (tab?.id == null) {
    await chrome.tabs.create({ url });
    return;
  }
  // La page Galaxie ne lit le secteur de l'adresse qu'à son ouverture : déjà affichée, on la quitte d'abord.
  if (route.startsWith('#/galaxy') && tab.url?.startsWith(`${GAME}#/galaxy`)) {
    await chrome.tabs.update(tab.id, { active: true, url: `${GAME}#/` });
    await new Promise(resolve => setTimeout(resolve, 300));
    await chrome.tabs.update(tab.id, { url });
  } else {
    await chrome.tabs.update(tab.id, tab.url === url ? { active: true } : { active: true, url });
  }
  await chrome.windows.update(tab.windowId, { focused: true });
}
