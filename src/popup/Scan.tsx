import { useState } from 'react';
import { resourcesAt } from '../analysis';
import { age, num } from '../format';
import type { GameState, Planet, Scan } from '../types';

// Repasse des secteurs (onglets Cibles et Débris) : le service worker rouvre chaque secteur comme le jeu, après
// confirmation du coût, payé par la planète la plus riche en deutérium.

/** Prix d'observation d'un système sans planète à toi, si le jeu ne le donne pas. */
const GALAXY_VIEW_COST = 10;
export const viewCost = (state: GameState) => state.settings?.galaxyViewCost ?? GALAXY_VIEW_COST;

/** Planète qui paie la repasse : celle qui a le plus de deutérium. */
function richest(planets: Planet[], now: number): Planet | undefined {
  return planets
    .filter(p => !p.moon)
    .reduce<Planet | undefined>((best, p) => (!best || resourcesAt(p, now).deuterium > resourcesAt(best, now).deuterium ? p : best), undefined);
}

export function useScan(state: GameState, systems: string[], now: number) {
  const [confirming, setConfirming] = useState(false);
  const own = new Set(state.planets.map(p => `${p.g}:${p.s}`));
  const cost = systems.filter(system => !own.has(system)).length * viewCost(state);
  const payer = richest(state.planets, now);
  const start = () => {
    setConfirming(false);
    if (payer) chrome.runtime.sendMessage({ type: 'scan', systems, planet: payer.id }).catch(() => {});
  };
  return { systems, confirming, setConfirming, cost, payer, start };
}

type Control = ReturnType<typeof useScan>;

export function ScanButton({ control, scan, title }: { control: Control; scan?: Scan; title: string }) {
  return (
    <button disabled={scan?.running || !control.systems.length} title={title} onClick={() => control.setConfirming(!control.confirming)}>
      ↻ Repasser
    </button>
  );
}

/** Confirmation (secteurs, coût, planète qui paie), puis avancement ; `what` décrit les secteurs repassés. */
export function ScanPanel({ control, scan, now, what }: { control: Control; scan?: Scan; now: number; what: string }) {
  const { systems, confirming, setConfirming, cost, payer, start } = control;
  const stock = payer ? resourcesAt(payer, now).deuterium : 0;
  return (
    <>
      {confirming && (
        <div className="scan-panel">
          <p>
            Repasser {systems.length} secteur{systems.length > 1 ? 's' : ''} {what} : <b>{num(cost)} deutérium</b>
            {payer && <>, pris sur {payer.name}</>} (gratuit là où tu as une planète).
          </p>
          {payer && stock < cost && <p className="warn">{payer.name} n’a que {num(stock)} deutérium : la repasse s’arrêtera en route.</p>}
          <div className="actions">
            <button onClick={start} disabled={!payer}>
              Lancer la repasse
            </button>
            <button className="link" onClick={() => setConfirming(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}
      {scan?.running && (
        <p className="scan-panel">
          Repasse en cours : {scan.done} / {scan.total} secteurs…
        </p>
      )}
    </>
  );
}

/** Bilan de la dernière repasse terminée, pour le pied de l'onglet. */
export const scanSummary = (scan?: Scan) =>
  !scan || scan.running
    ? ''
    : scan.error
      ? ` Dernière repasse arrêtée à ${scan.done} / ${scan.total} : ${scan.error}.`
      : ` Dernière repasse : ${scan.total} secteur${scan.total > 1 ? 's' : ''}, il y a ${age(Date.now() - scan.at)}.`;
