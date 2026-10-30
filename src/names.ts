// Libellés repris du client du jeu. Une clé inconnue (nouveauté du jeu) s'affiche telle quelle.

import type { Resource } from './types';

const NAMES: Record<string, string> = {
  metalMine: 'Mine de métal',
  crystalMine: 'Mine de cristal',
  deuteriumSynth: 'Synthétiseur de deutérium',
  solarPlant: 'Centrale solaire',
  fusionReactor: 'Centrale de fusion',
  metalStorage: 'Hangar de métal',
  crystalStorage: 'Hangar de cristal',
  deuteriumTank: 'Réservoir de deutérium',
  roboticsFactory: 'Usine de robots',
  shipyard: 'Chantier spatial',
  researchLab: 'Laboratoire de recherche',
  naniteFactory: 'Usine de nanites',
  terraformer: 'Terraformeur',
  missileSilo: 'Silo de missiles',
  lunarBase: 'Base lunaire',
  sensorPhalanx: 'Phalange de capteur',
  jumpGate: 'Porte de saut spatial',
  energyTech: 'Technologie Énergie',
  laserTech: 'Technologie Laser',
  ionTech: 'Technologie Ions',
  hyperspaceTech: 'Technologie Hyperespace',
  plasmaTech: 'Technologie Plasma',
  combustionDrive: 'Réacteur à combustion',
  impulseDrive: 'Réacteur à impulsion',
  hyperspaceDrive: 'Propulsion hyperespace',
  espionageTech: 'Technologie Espionnage',
  computerTech: 'Technologie Ordinateur',
  astrophysics: 'Astrophysique',
  researchNetwork: 'Réseau de recherche intergalactique',
  gravitonTech: 'Technologie Graviton',
  weaponsTech: 'Technologie Armes',
  shieldingTech: 'Technologie Bouclier',
  armourTech: 'Technologie Protection',
  smallCargo: 'Petit transporteur',
  largeCargo: 'Grand transporteur',
  lightFighter: 'Chasseur léger',
  heavyFighter: 'Chasseur lourd',
  cruiser: 'Croiseur',
  battleship: 'Vaisseau de bataille',
  battlecruiser: 'Traqueur',
  bomber: 'Bombardier',
  destroyer: 'Destructeur',
  deathstar: 'Étoile de la mort',
  recycler: 'Recycleur',
  espionageProbe: 'Sonde d’espionnage',
  colonyShip: 'Vaisseau de colonisation',
  solarSatellite: 'Satellite solaire',
  rocketLauncher: 'Lanceur de missiles',
  lightLaser: 'Artillerie laser légère',
  heavyLaser: 'Artillerie laser lourde',
  gaussCannon: 'Canon de Gauss',
  ionCannon: 'Artillerie à ions',
  plasmaTurret: 'Lanceur de plasma',
  smallShieldDome: 'Petit bouclier',
  largeShieldDome: 'Grand bouclier',
  antiBallisticMissile: 'Missile d’interception',
  interplanetaryMissile: 'Missile interplanétaire',
};

// Noms du thème (réglage « Renommer les éléments »), repris du pack d'assets (tools/assets/pack.ts) :
// génériques, sans unité ni armée réelle.
const THEME: Record<string, string> = {
  metalMine: 'Mine de fer',
  crystalMine: 'Usine de munitions',
  deuteriumSynth: 'Raffinerie',
  solarPlant: 'Centrale thermique',
  fusionReactor: 'Barrage hydroélectrique',
  metalStorage: 'Dépôt d’acier',
  crystalStorage: 'Dépôt de munitions',
  deuteriumTank: 'Dépôt de carburant',
  roboticsFactory: 'Usine',
  shipyard: 'Usine de blindés',
  researchLab: 'Bureau d’études',
  naniteFactory: 'Arsenal',
  terraformer: 'Génie',
  missileSilo: 'Base de lancement',
  lunarBase: 'Avant-poste',
  sensorPhalanx: 'Station radar',
  jumpGate: 'Aérodrome',
  energyTech: 'Électrification',
  laserTech: 'Optique',
  ionTech: 'Radio',
  hyperspaceTech: 'Cartographie',
  plasmaTech: 'Métallurgie',
  combustionDrive: 'Moteur à explosion',
  impulseDrive: 'Moteur d’avion',
  hyperspaceDrive: 'Moteur-fusée',
  espionageTech: 'Renseignement',
  computerTech: 'Chiffrement',
  astrophysics: 'Observation',
  researchNetwork: 'Réseau de transmissions',
  gravitonTech: 'Balistique',
  weaponsTech: 'Armement',
  shieldingTech: 'Camouflage',
  armourTech: 'Blindage',
  smallCargo: 'Camion',
  largeCargo: 'Half-track',
  lightFighter: 'Fantassin',
  heavyFighter: 'Mitrailleur',
  cruiser: 'Char léger',
  battleship: 'Char lourd',
  battlecruiser: 'Chasseur de chars',
  bomber: 'Bombardier',
  destroyer: 'Obusier',
  deathstar: 'Canon sur voie ferrée',
  recycler: 'Dépanneuse',
  espionageProbe: 'Tireur d’élite',
  colonyShip: 'Campement du génie',
  solarSatellite: 'Groupe électrogène',
  rocketLauncher: 'Lance-roquettes',
  lightLaser: 'Nid de mitrailleuse',
  heavyLaser: 'Canon antichar',
  gaussCannon: 'Canon de campagne',
  ionCannon: 'Canon antiaérien',
  plasmaTurret: 'Casemate',
  smallShieldDome: 'Sacs de sable',
  largeShieldDome: 'Bunker',
  antiBallisticMissile: 'Missile d’interception',
  interplanetaryMissile: 'Fusée',
};

let themed = false;

/** Noms du thème dans la popup et les notifications (réglage « Renommer les éléments »). */
export const setThemedNames = (on: boolean) => {
  themed = on;
};

export const label = (key: string) => (themed && THEME[key]) || NAMES[key] || key;

export const MISSIONS: Record<string, string> = {
  attack: 'Attaquer',
  destroy: 'Détruire',
  transport: 'Transporter',
  deploy: 'Stationner',
  defend: 'Défendre',
  spy: 'Espionner',
  colonize: 'Coloniser',
  recycle: 'Recycler',
  expedition: 'Expédition',
  missile: 'Attaque de missiles',
};

export const FLEET_STATES: Record<string, string> = {
  out: 'Aller',
  hold: 'Sur place',
  back: 'Retour',
  wait: 'Départ prévu',
};

const MISSION_THEME: Record<string, string> = {
  attack: 'Assaut',
  destroy: 'Démolition',
  transport: 'Ravitaillement',
  deploy: 'Redéploiement',
  defend: 'Soutien',
  spy: 'Reconnaissance',
  colonize: 'Implantation',
  recycle: 'Récupération',
  expedition: 'Patrouille',
  missile: 'Frappe de missiles',
};

export const missionName = (key: string) => (themed && MISSION_THEME[key]) || MISSIONS[key] || key;

export const RESOURCE_NAMES = { metal: 'Métal', crystal: 'Cristal', deuterium: 'Deutérium' } as const;
const RESOURCE_THEME: Record<Resource, string> = { metal: 'Acier', crystal: 'Munitions', deuterium: 'Carburant' };

export const resourceName = (r: Resource) => (themed ? RESOURCE_THEME : RESOURCE_NAMES)[r];

// Libellés du menu du jeu (repris en titre de page), renommés seulement là.
const MENU_THEME: Record<string, string> = {
  Planète: 'Quartier général',
  Ressources: 'Extraction',
  Installations: 'Usines',
  Recherche: 'Bureau d’études',
  Défense: 'Fortifications',
  Flotte: 'Colonnes',
  Galaxie: 'Carte',
  Messages: 'Transmissions',
  Social: 'Régiment',
  Classement: 'Décorations',
  Inventaire: 'Intendance',
};

// Mots du jeu sans clé : le chantier (menu, niveau affiché) et les pirates.
const WORDS: [string, string][] = [
  ['Chantier', 'Usine de blindés'],
  ['Repaires pirates', 'Camps de pillards'],
  ['repaires pirates', 'camps de pillards'],
  ['Repaire pirate', 'Camp de pillards'],
  ['repaire pirate', 'camp de pillards'],
  ['Repaires', 'Camps'],
  ['repaires', 'camps'],
  ['Repaire', 'Camp'],
  ['repaire', 'camp'],
  ['Pirates', 'Pillards'],
  ['pirates', 'pillards'],
  ['Pirate', 'Pillard'],
  ['pirate', 'pillard'],
];

const pairs = (names: Record<string, string>, theme: Record<string, string>) =>
  Object.keys(theme)
    .filter(key => names[key] && names[key] !== theme[key])
    .map(key => [names[key], theme[key]] as [string, string]);

/** Lexique « nom du jeu → nom du thème » des pages du jeu (rename.ts, injecté au build par vite.config.ts).
 *  inline : remplacé partout dans le texte ; exact : seulement un texte entier (les missions sont des verbes) ;
 *  menu : seulement dans le menu et les titres de page. */
export function lexique() {
  const resources = pairs(RESOURCE_NAMES, RESOURCE_THEME);
  return {
    inline: [...pairs(NAMES, THEME), ...resources, ...resources.map(([from, to]) => [from.toLowerCase(), to.toLowerCase()] as [string, string]), ...WORDS],
    exact: pairs(MISSIONS, MISSION_THEME),
    menu: Object.entries(MENU_THEME),
  };
}
