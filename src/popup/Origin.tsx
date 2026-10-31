import type { GameState, Planet } from '../types';

// Planète d'origine des préparations de flotte : le jeu part de la planète affichée, l'extension la choisit
// d'abord dans le jeu (openGame, paramètre radarPlanet).

type Place = { g: number; s: number };

/** Systèmes jusqu'à la destination ; autre galaxie : null. */
const systemsTo = (p: Planet, to: Place) => (p.g === to.g ? Math.abs(p.s - to.s) : null);

/** Tes planètes et lunes, de la plus proche de la destination à la plus lointaine (autres galaxies en dernier). */
export function byDistance(state: GameState, to: Place): Planet[] {
  const far = (p: Planet) => systemsTo(p, to) ?? 1_000 + Math.abs(p.g - to.g);
  return [...state.planets].sort((a, b) => far(a) - far(b));
}

/** Origine proposée : la plus proche qui a assez du vaisseau utile à quai, sinon la plus proche. */
export const bestOrigin = (planets: Planet[], ship: string, need: number) => planets.find(p => (p.ships?.[ship] ?? 0) >= need) ?? planets[0];

type Props = { planets: Planet[]; to: Place; value?: string; onChange: (id: string) => void; detail: (p: Planet) => string };

export function OriginPicker({ planets, to, value, onChange, detail }: Props) {
  if (planets.length < 2) return null;
  return (
    <div className="origins" role="group" aria-label="Planète d’origine">
      <span className="origins-label">Depuis</span>
      {planets.map(p => {
        const systems = systemsTo(p, to);
        return (
          <button key={p.id} className={`chip ${p.id === value ? 'active' : ''}`} aria-pressed={p.id === value} onClick={() => onChange(p.id)}>
            {p.moon ? `☾ ${p.name}` : p.name}
            <small>
              {systems == null ? 'autre galaxie' : systems ? `${systems} syst.` : 'même système'} · {detail(p)}
            </small>
          </button>
        );
      })}
    </div>
  );
}
