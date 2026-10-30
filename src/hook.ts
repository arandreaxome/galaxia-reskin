// Injecté dans la page du jeu : recopie les systèmes de galaxie que le jeu charge lui-même,
// pour que l'extension n'ait jamais à les demander (chaque observation peut coûter du deutérium).
// Chrome charge ce fichier tel quel, sans module : il ne doit rien importer, et le bloc
// garde ses constantes hors de la portée globale de la page.
{
  const SYSTEM_PATH = /^\/api\/galaxy\/\d+\/\d+$/;
  const pageFetch = window.fetch;

  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await pageFetch(input, init);
    try {
      const url = new URL(input instanceof Request ? input.url : String(input), location.href);
      if (response.ok && url.origin === location.origin && SYSTEM_PATH.test(url.pathname)) {
        response
          .clone()
          .json()
          .then(
            data => window.postMessage({ source: 'galaxia-radar', kind: 'system', data }, location.origin),
            () => {},
          );
      }
    } catch {
      // Jamais bloquant pour le jeu.
    }
    return response;
  };
}
