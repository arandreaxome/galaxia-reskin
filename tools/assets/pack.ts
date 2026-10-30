// Catalogue du pack : quel dessin remplace quelle image du jeu, sous quel nom, et comment le décrire
// à un générateur d'images (brief en anglais, la langue que ces outils comprennent le mieux).

import * as P from './parts.ts';
import { el, svg } from './svg.ts';

export type Group = 'Unités' | 'Défenses' | 'Ressources' | 'Bâtiments' | 'Recherches';

export type Asset = {
  /** Clé de l'élément dans le jeu (nom de son image : /assets/<clé>-<empreinte>.webp). */
  key: string;
  /** Nom dans l'univers du pack. */
  name: string;
  group: Group;
  /** Sujet décrit pour un générateur d'images. */
  brief: string;
  /** Sélecteur supplémentaire, quand l'image du jeu n'a pas de fichier (intégrée en data:). */
  alt?: string;
  svg: string;
};

const make =
  (group: Group, size = 128) =>
  (key: string, name: string, brief: string, draw: () => string[], alt?: string): Asset => ({ key, name, group, brief, alt, svg: svg(size, ...draw()) });

const unit = make('Unités');
const defense = make('Défenses');
const resource = make('Ressources', 64);
const building = make('Bâtiments');
const research = make('Recherches');

export const ASSETS: Asset[] = [
  unit('lightFighter', 'Fantassin', 'an infantry rifleman standing in profile, round steel helmet, field jacket, small backpack, rifle held across the chest with fixed bayonet', P.rifleman),
  unit('heavyFighter', 'Mitrailleur', 'a machine gunner lying prone behind a light machine gun on a bipod, ammunition box beside him, round helmet', P.machineGunner),
  unit('cruiser', 'Char léger', 'a light tank with a small turret and a short gun, five road wheels, low hull', P.lightTank),
  unit('battleship', 'Char lourd', 'a heavy tank with a large boxy turret, a long gun with muzzle brake, six road wheels, thick sloped armor', P.heavyTank),
  unit('battlecruiser', 'Chasseur de chars', 'a turretless tank destroyer with a low sloped casemate and a very long gun', P.tankDestroyer),
  unit('bomber', 'Bombardier', 'a four-engine heavy bomber seen from above, straight wings, glazed nose', P.bomber),
  unit('destroyer', 'Obusier', 'a towed field howitzer with large wheels, a gun shield and the barrel raised at 35 degrees', P.howitzer),
  unit('deathstar', 'Canon sur voie ferrée', 'a super-heavy railway gun on a long rail carriage with many wheels, enormous barrel raised', P.railwayGun),
  unit('smallCargo', 'Camion', 'a military cargo truck with a canvas-covered rear bed and three axles', P.truck),
  unit('largeCargo', 'Half-track', 'an armored half-track personnel carrier with front wheels and rear tracks, open top', P.halfTrack),
  unit('recycler', 'Dépanneuse', 'a recovery truck with an A-frame crane and a hook at the rear', P.recoveryTruck),
  unit('espionageProbe', 'Tireur d’élite', 'a sniper lying prone under a camouflage covering, long scoped rifle on a bipod', P.sniper),
  unit('colonyShip', 'Campement du génie', 'an engineers field camp: a canvas tent with guy ropes and supply crates', P.camp),
  unit('solarSatellite', 'Groupe électrogène', 'a towed portable electric generator on two wheels with an exhaust stack', P.generator),

  defense('rocketLauncher', 'Lance-roquettes', 'a towed multiple rocket launcher with three rows of tubes angled upward', P.rocketLauncher),
  defense('lightLaser', 'Nid de mitrailleuse', 'a machine-gun nest behind a curved wall of sandbags, barrel pointing forward', P.machineGunNest),
  defense('heavyLaser', 'Canon antichar', 'a low towed anti-tank gun with a wide gun shield and a long horizontal barrel', P.antiTankGun),
  defense('gaussCannon', 'Canon de campagne', 'a towed field gun with a gun shield, large wheels, barrel slightly raised', P.fieldGun),
  defense('ionCannon', 'Canon antiaérien', 'a twin-barrel anti-aircraft gun on a cruciform platform, barrels pointing steeply up', P.antiAirGun),
  defense('plasmaTurret', 'Casemate', 'a concrete coastal casemate half-buried in earth, a heavy gun in its embrasure', P.casemate),
  defense('smallShieldDome', 'Sacs de sable', 'a low defensive wall of stacked sandbags', P.sandbagWall),
  defense('largeShieldDome', 'Bunker', 'a domed concrete bunker covered with earth, with a narrow firing slit', P.bunker),
  defense('antiBallisticMissile', 'Missile d’interception', 'a small interceptor missile on an angled launch rail', P.interceptor),
  defense('interplanetaryMissile', 'Fusée', 'a large rocket standing on a launch table next to a service gantry, thin dark red band near the nose', P.rocket),

  resource('metal', 'Acier', 'a stack of three steel ingots', P.steel, 'Métal'),
  resource('crystal', 'Munitions', 'three artillery shells standing side by side', P.munitions, 'Cristal'),
  resource('deuterium', 'Carburant', 'a military fuel jerrycan with an embossed X', P.fuel, 'Deutérium'),
  resource('energy', 'Énergie', 'a lightning bolt inside a round badge', P.energy, 'Énergie'),

  building('metalMine', 'Mine de fer', 'a mine head: lattice headframe tower with a winding wheel, a spoil heap and a mine cart full of ore', P.mineHead),
  building('crystalMine', 'Usine de munitions', 'an ammunition factory: sawtooth-roof workshop with a chimney, artillery shells and a crate in front', P.ammoWorks),
  building('deuteriumSynth', 'Raffinerie', 'a fuel refinery with two distillation columns, pipes and a cylindrical storage tank', P.refinery),
  building('solarPlant', 'Centrale thermique', 'a coal power station with two chimneys and a high-voltage lattice pylon', P.powerStation),
  building('fusionReactor', 'Barrage hydroélectrique', 'a hydroelectric dam with a turbine house at its base and spillway openings', P.dam),
  building('metalStorage', 'Dépôt d’acier', 'a semicircular corrugated steel hut with a stack of steel girders', P.steelDepot),
  building('crystalStorage', 'Dépôt de munitions', 'an earth-covered ammunition bunker with a steel door and stacked crates', P.ammoDepot),
  building('deuteriumTank', 'Dépôt de carburant', 'a fuel depot with two cylindrical tanks and a stack of fuel drums', P.fuelDepot),
  building('roboticsFactory', 'Usine', 'a large sawtooth-roof factory with a tall chimney', P.factory),
  building('shipyard', 'Usine de blindés', 'a tank assembly hall with a big open door, a tank rolling out and a gantry crane', P.tankWorks),
  building('researchLab', 'Bureau d’études', 'a research building with a tall radio mast and antenna wires', P.laboratory),
  building('naniteFactory', 'Arsenal', 'a large arsenal complex of several workshops and chimneys', P.arsenal),
  building('terraformer', 'Génie', 'a tracked bulldozer pushing a mound of earth', P.bulldozer),
  building('missileSilo', 'Base de lancement', 'a rocket launch site: a rocket on an angled erector, a concrete pad and a small blockhouse', P.launchSite),
  building('lunarBase', 'Avant-poste', 'a fortified forward outpost on a hill: watchtower, sandbags, barbed wire and a tent', P.outpost),
  building('sensorPhalanx', 'Station radar', 'a radar station: a rectangular mesh antenna on a lattice tower and a control hut', P.radarStation),
  building('jumpGate', 'Aérodrome', 'a military airfield: a hangar, a control tower, runway markings and a windsock', P.airfield),

  research('energyTech', 'Électrification', 'an electrical transformer with three porcelain insulators and cables', P.transformer),
  research('laserTech', 'Optique', 'a military searchlight on a tripod projecting a beam', P.searchlight),
  research('ionTech', 'Radio', 'a large radio vacuum tube with visible electrodes', P.radioTube),
  research('hyperspaceTech', 'Cartographie', 'a folded military map with a dashed route and drafting dividers', P.mapAndDividers),
  research('plasmaTech', 'Métallurgie', 'a foundry crucible pouring molten metal into a mold', P.crucible),
  research('combustionDrive', 'Moteur à explosion', 'an inline four-cylinder engine block with a pulley', P.engineBlock),
  research('impulseDrive', 'Moteur d’avion', 'a radial aircraft engine with a three-blade propeller, front view', P.radialEngine),
  research('hyperspaceDrive', 'Moteur-fusée', 'a rocket engine: combustion chamber, nozzle bell and a small flame', P.rocketEngine),
  research('espionageTech', 'Renseignement', 'a pair of military binoculars', P.binoculars),
  research('computerTech', 'Chiffrement', 'a generic electromechanical cipher machine with rotors and a keyboard', P.cipherMachine),
  research('astrophysics', 'Observation', 'a field telescope on a tripod', P.telescope),
  research('researchNetwork', 'Transmissions', 'a field telephone with its handset and a cable reel', P.fieldTelephone),
  research('gravitonTech', 'Balistique', 'a ballistic trajectory: dashed arc from a small gun to a target, shell at the apex', P.ballistics),
  research('weaponsTech', 'Armement', 'two crossed rifles over an ammunition crate', P.crossedRifles),
  research('shieldingTech', 'Camouflage', 'a camouflage net draped over a vehicle shape', P.camouflageNet),
  research('armourTech', 'Blindage', 'thick riveted armor plates with a shell impact', P.armourPlates),
];

/** Cadrage demandé au générateur, par famille. */
export const VIEWS: Record<Group, string> = {
  Unités: 'side view facing right, full subject visible',
  Défenses: 'side view facing right, full subject visible',
  Bâtiments: 'side view of a single building facing right, full subject visible',
  Recherches: 'single object centered, slight three-quarter view',
  Ressources: 'simple bold icon, front view, readable at 16 pixels',
};

export const STYLE_VECTOR =
  'Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set.';

export const STYLE_ILLUSTRATION =
  'Detailed matte illustration in the style of a 1940s technical field manual painted in gouache. Muted desaturated palette built on grey-green #4A5D4A, dark olive #3A4A3A, anthracite #2C2C2C and ivory #E8E4D9, dark red #6B1E1E only as a tiny accent. Clean silhouette readable at 64 pixels, soft directional light, transparent or plain #1A1A1A background, square 1:1, consistent rendering across the whole set.';

export const NEGATIVE =
  'text, letters, numbers, logos, watermark, insignia, emblems, flags, national markings, roundels, stars, crosses, eagles, swastika or any political or extremist symbol, unit badges, brand names, detailed faces, gore, bright saturated colors, gradients, glow, busy background';

export type NavIcon = { route: string; name: string; svg: string };

/** Icônes du menu, au trait comme celles du jeu : utilisées en masque, elles prennent la couleur du texte. */
const icon = (...shapes: string[]) =>
  svg(24, el('g', { fill: 'none', stroke: '#000', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ...shapes));
const d = (path: string) => el('path', { d: path });

export const NAV: NavIcon[] = [
  { route: '', name: 'Quartier général', svg: icon(d('M3 20 L12 6 L21 20 Z'), d('M10 20 L12 15 L14 20'), d('M12 6 V2.5 L16 3.8 L12 5.2')) },
  { route: 'resources', name: 'Extraction', svg: icon(d('M5 19 L15 9'), d('M10.5 4.5 Q16 5 19.5 10.5'), d('M19 19 L10 10'), d('M7 7 L4.5 4.5 M5.5 9 L3 6.5 M9 5.5 L6.5 3')) },
  { route: 'facilities', name: 'Usines', svg: icon(d('M3 20 V11 L8 14 V11 L13 14 V11 L17 13.5 V4 H20.5 V20 Z'), d('M7 17 H9 M12 17 H14')) },
  { route: 'research', name: 'Bureau d’études', svg: icon(d('M9 3 H15'), d('M10 3 V9 L4.5 18.5 A1.6 1.6 0 0 0 6 21 H18 A1.6 1.6 0 0 0 19.5 18.5 L14 9 V3'), d('M7 15.5 H17')) },
  { route: 'shipyard', name: 'Atelier', svg: icon(d('M14.5 6.5 A4 4 0 0 0 9 11.5 L4 16.5 A1.8 1.8 0 0 0 6.5 19 L11.5 14 A4 4 0 0 0 16.5 8.5 L14 11 L12 10.5 L11.5 8.5 Z')) },
  { route: 'defense', name: 'Fortifications', svg: icon(d('M3.5 15 H11.5 A2.5 2.5 0 0 1 11.5 20 H3.5 A2.5 2.5 0 0 1 3.5 15 Z'), d('M12.5 15 H20.5 A2.5 2.5 0 0 1 20.5 20 H12.5 A2.5 2.5 0 0 1 12.5 15 Z'), d('M8 10 H16 A2.5 2.5 0 0 1 16 15 H8 A2.5 2.5 0 0 1 8 10 Z')) },
  { route: 'fleet', name: 'Colonnes', svg: icon(d('M5 14 H19 A3 3 0 0 1 19 20 H5 A3 3 0 0 1 5 14 Z'), d('M4 14 L6 11 H18 L20 14'), d('M8.5 11 V8 H14 L15.5 11'), d('M14.5 9.5 H22')) },
  { route: 'galaxy', name: 'Carte d’état-major', svg: icon(el('circle', { cx: 12, cy: 12, r: 9 }), d('M12 6.5 L14 12 L12 17.5 L10 12 Z'), d('M12 2 V4 M12 20 V22 M2 12 H4 M20 12 H22')) },
  { route: 'messages', name: 'Transmissions', svg: icon(el('rect', { x: 3, y: 6, width: 18, height: 13, rx: 1.5 }), d('M3 7 L12 13 L21 7')) },
  { route: 'social', name: 'Régiment', svg: icon(d('M3 15 A4.5 4.5 0 0 1 12 15 Z'), d('M2 15 H13'), d('M12 11 A4.5 4.5 0 0 1 21 11 Z'), d('M11 11 H22'), d('M4 21 Q7.5 17.5 11 21 M13 18 Q16.5 14.5 20 18')) },
  { route: 'ranking', name: 'Décorations', svg: icon(d('M8 2 L10.5 9 M16 2 L13.5 9'), el('circle', { cx: 12, cy: 15, r: 5.5 }), el('circle', { cx: 12, cy: 15, r: 2 })) },
];
