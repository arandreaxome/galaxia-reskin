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
  unit('lightFighter', 'Fantassin', 'an infantry rifleman standing at ease, round steel helmet, wool field jacket with webbing, small backpack, bolt-action rifle with fixed bayonet held across the chest', P.rifleman),
  unit('heavyFighter', 'Mitrailleur', 'a machine gunner lying prone behind a light machine gun on its bipod, round steel helmet, an open ammunition box and spent brass cases beside him', P.machineGunner),
  unit('cruiser', 'Char léger', 'a small light tank with a compact riveted turret and a short gun, five road wheels, low hull, mud on the tracks', P.lightTank),
  unit('battleship', 'Char lourd', 'a massive heavy tank with a large boxy turret, a long gun with a muzzle brake, six large road wheels, thick sloped armour plates with welding seams', P.heavyTank),
  unit('battlecruiser', 'Chasseur de chars', 'a turretless tank destroyer with a low sloped casemate and a very long gun, spare track links bolted to the hull', P.tankDestroyer),
  unit('bomber', 'Bombardier', 'a four-engine heavy bomber parked on a round concrete hardstand, straight wings, glazed nose, propellers at rest', P.bomber),
  unit('destroyer', 'Obusier', 'a towed field howitzer with large spoked steel wheels, a gun shield and the barrel raised at about 35 degrees, split trails dug into the ground', P.howitzer),
  unit('deathstar', 'Canon sur voie ferrée', 'a super-heavy railway gun on a long multi-axle rail carriage standing on a short length of track, enormous barrel raised', P.railwayGun),
  unit('smallCargo', 'Camion', 'a military cargo truck with a canvas-covered rear bed, three axles and mud-spattered wheels', P.truck),
  unit('largeCargo', 'Half-track', 'an armoured half-track carrier with front wheels and rear tracks, an open-topped troop compartment and a pintle-mounted machine gun', P.halfTrack),
  unit('recycler', 'Dépanneuse', 'a heavy recovery truck with an A-frame crane, winch cable and hook at the rear, chains and tools on its bed', P.recoveryTruck),
  unit('espionageProbe', 'Tireur d’élite', 'a sniper lying prone under a camouflage cape with leaf scrim, a long rifle with a telescopic sight on a small bipod', P.sniper),
  unit('colonyShip', 'Campement du génie', 'an engineers field camp: a canvas ridge tent with guy ropes, stacked supply crates, shovels and a coil of wire', P.camp),
  unit('solarSatellite', 'Groupe électrogène', 'a two-wheeled towed portable electric generator with a small exhaust stack and cables coiled on top', P.generator),

  defense('rocketLauncher', 'Lance-roquettes', 'a towed multiple rocket launcher with three rows of launch tubes angled upward, rockets loaded', P.rocketLauncher),
  defense('lightLaser', 'Nid de mitrailleuse', 'a machine-gun nest behind a curved wall of sandbags, the gun barrel pointing forward through a gap, ammunition belts', P.machineGunNest),
  defense('heavyLaser', 'Canon antichar', 'a low towed anti-tank gun with a wide angled gun shield and a long horizontal barrel, its trails spread', P.antiTankGun),
  defense('gaussCannon', 'Canon de campagne', 'a towed field gun with a gun shield, large spoked wheels and the barrel slightly raised', P.fieldGun),
  defense('ionCannon', 'Canon antiaérien', 'a twin-barrel anti-aircraft gun on a cruciform platform, barrels pointing steeply up, ready ammunition clips beside it', P.antiAirGun),
  defense('plasmaTurret', 'Casemate', 'a heavy concrete coastal casemate half-buried in earth, a large gun barrel protruding from its embrasure', P.casemate),
  defense('smallShieldDome', 'Sacs de sable', 'a low curved wall of neatly stacked sandbags, a few of them torn and leaking sand', P.sandbagWall),
  defense('largeShieldDome', 'Bunker', 'a domed concrete bunker partly covered with earth and grass, with a narrow dark firing slit', P.bunker),
  defense('antiBallisticMissile', 'Missile d’interception', 'a small interceptor missile with short fins on an angled launch rail', P.interceptor),
  defense('interplanetaryMissile', 'Fusée', 'a large finned rocket standing upright on a launch table beside a steel service gantry, a thin dark red band near the nose', P.rocket),

  resource('metal', 'Acier', 'a neat stack of three heavy steel ingots with a dull metallic sheen', P.steel, 'Métal'),
  resource('crystal', 'Munitions', 'three brass artillery shells standing side by side, the middle one taller', P.munitions, 'Cristal'),
  resource('deuterium', 'Carburant', 'a military steel jerrycan with an embossed X pattern on its side and a triple handle', P.fuel, 'Deutérium'),
  resource('energy', 'Énergie', 'an enamelled metal high-voltage warning plate showing one bold lightning bolt and no lettering', P.energy, 'Énergie'),

  building('metalMine', 'Mine de fer', 'an iron mine head: a steel lattice headframe with its winding wheel, a spoil heap and a mine cart full of ore on rails', P.mineHead),
  building('crystalMine', 'Usine de munitions', 'an ammunition factory: a brick workshop with a sawtooth roof and a chimney, artillery shells and crates stacked in front', P.ammoWorks),
  building('deuteriumSynth', 'Raffinerie', 'a fuel refinery: two tall distillation columns, a tangle of pipes and a cylindrical storage tank', P.refinery),
  building('solarPlant', 'Centrale thermique', 'a coal-fired power station with two smoking chimneys, a coal heap and a high-voltage lattice pylon', P.powerStation),
  building('fusionReactor', 'Barrage hydroélectrique', 'a concrete hydroelectric dam with water rushing from its spillways and a turbine house at its foot', P.dam),
  building('metalStorage', 'Dépôt d’acier', 'a semicircular corrugated-steel hut with stacks of steel girders and plates in front', P.steelDepot),
  building('crystalStorage', 'Dépôt de munitions', 'an earth-covered ammunition bunker with a heavy steel door, crates and shells stacked at the entrance', P.ammoDepot),
  building('deuteriumTank', 'Dépôt de carburant', 'a fuel depot with two large cylindrical tanks, pipes and rows of fuel drums', P.fuelDepot),
  building('roboticsFactory', 'Usine', 'a large brick factory with a sawtooth roof and a tall chimney', P.factory),
  building('shipyard', 'Usine de blindés', 'a tank assembly hall with a large open door, a new tank rolling out and an overhead gantry crane', P.tankWorks),
  building('researchLab', 'Bureau d’études', 'a brick research building with a tall radio mast, antenna wires and a few lit windows', P.laboratory),
  building('naniteFactory', 'Arsenal', 'a large arsenal complex: several workshops with chimneys, a railway siding and gun barrels on racks', P.arsenal),
  building('terraformer', 'Génie', 'a tracked bulldozer pushing a mound of earth, its blade dented', P.bulldozer),
  building('missileSilo', 'Base de lancement', 'a rocket launch site: a rocket on an angled erector, a concrete pad and a small blockhouse', P.launchSite),
  building('lunarBase', 'Avant-poste', 'a fortified forward outpost on a small hill: a wooden watchtower, sandbags, barbed wire and a tent', P.outpost),
  building('sensorPhalanx', 'Station radar', 'a radar station: a large rectangular mesh antenna on a lattice tower and a control hut with cables', P.radarStation),
  building('jumpGate', 'Aérodrome', 'a military airfield: a hangar, a small control tower, a stretch of unmarked runway and a windsock', P.airfield),

  research('energyTech', 'Électrification', 'an electrical transformer with three tall porcelain insulators and heavy cables', P.transformer),
  research('laserTech', 'Optique', 'an anti-aircraft searchlight on its trailer, its powerful beam projecting into the darkness', P.searchlight),
  research('ionTech', 'Radio', 'a large glass radio transmitting valve with visible electrodes and a faint warm filament glow, mounted on a radio chassis', P.radioTube),
  research('hyperspaceTech', 'Cartographie', 'a folded topographic map without any lettering, a route drawn in pencil, brass drafting dividers and a compass lying on it', P.mapAndDividers),
  research('plasmaTech', 'Métallurgie', 'a foundry crucible pouring molten metal into a sand mould, a few sparks and a dim orange glow', P.crucible),
  research('combustionDrive', 'Moteur à explosion', 'an oily, well-used six-cylinder truck engine on an engine stand', P.engineBlock),
  research('impulseDrive', 'Moteur d’avion', 'a radial aircraft engine with a three-blade propeller on an engine stand', P.radialEngine),
  research('hyperspaceDrive', 'Moteur-fusée', 'an early liquid-fuel rocket engine on a test stand: combustion chamber, nozzle bell, pipes and a short flame', P.rocketEngine),
  research('espionageTech', 'Renseignement', 'a pair of military binoculars on a worn leather case, beside a blank folded document', P.binoculars),
  research('computerTech', 'Chiffrement', 'a generic electromechanical cipher machine in an open wooden case: three rotors, a keyboard with blank keys and small lamps', P.cipherMachine),
  research('astrophysics', 'Observation', 'an artillery scissors periscope (twin observation telescope) on a tripod', P.telescope),
  research('researchNetwork', 'Réseau de transmissions', 'a field telephone in its leather case with the handset, next to a cable reel on its frame', P.fieldTelephone),
  research('gravitonTech', 'Balistique', 'a sectioned artillery shell lying on graph paper with a hand-drawn trajectory arc, a brass gunner’s quadrant beside it', P.ballistics),
  research('weaponsTech', 'Armement', 'two bolt-action rifles crossed in front of an open wooden ammunition crate full of cartridges', P.crossedRifles),
  research('shieldingTech', 'Camouflage', 'a small military vehicle almost hidden under a camouflage net with leaf-shaped scrim', P.camouflageNet),
  research('armourTech', 'Blindage', 'a thick riveted armour test plate on a stand, with a deep shell impact crater and cracks', P.armourPlates),
];

/** Cadrage demandé au générateur, par famille. */
export const VIEWS: Record<Group, string> = {
  Unités: 'three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground',
  Défenses: 'three-quarter view from slightly above, the whole emplacement on its round patch of ground',
  Bâtiments: 'high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background',
  Recherches: 'close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background',
  Ressources: 'close-up still life seen from the front, the object filling 85% of the frame, a simple bold silhouette that still reads as a tiny icon',
};

/** Instructions du Gem Gemini : le style commun à toutes les images, chaque prompt ne donnant que le sujet. */
export const GEM = [
  'You are the image studio of "Galaxia Radar", a World War II makeover of a space strategy game. Each message I send names one game element (French name, then its key in brackets) and describes its subject and framing. Answer every message with exactly one new image that follows this style guide, so that the whole set looks like one coherent series. Do not add any text to your answer.',
  'LOOK\n- A genuine 1940s photograph, as taken by a war-department photographer, then hand-tinted: photorealistic and highly detailed, with authentic period materials and wear (chipped paint, mud, rust, canvas, rivets, oil stains, worn leather, brass).\n- Muted hand-tinted colours only: olive drab, field grey-green, khaki, gunmetal, weathered steel and aged ivory highlights. A small touch of dark oxblood red is allowed only on danger details (warhead band, fuse, flame). No bright or saturated colour.\n- Fine silver-gelatin film grain, slightly soft corners.',
  'LIGHT\n- Low-key studio light: one warm key light from the upper left, a faint cool rim light on the right edge that separates the subject from the background, deep but readable shadows.',
  'COMPOSITION\n- One single subject, centred, entirely in frame, filling about 70% of the image.\n- The subject rests on a small round patch of ground (earth, gravel, concrete or a wooden workbench, whatever suits it) that fades into a plain near-black background (#1A1A1A) with a soft vignette. No landscape, horizon, sky or extra objects unless the prompt asks for them.\n- Camera slightly above the subject, three-quarter view, unless the prompt says otherwise.\n- Square 1:1 format.\n- The image must stay readable when displayed very small (64 pixels): strong, clear silhouette, well separated from the background.',
  'EQUIPMENT\n- Generic designs that mix features of several nations’ equipment, never an exact copy of one identifiable model.\n- Soldiers are anonymous: helmets, shadow or distance hide their faces.',
  'NEVER INCLUDE\n- Text, letters, numbers, labels, logos, watermarks, signatures, frames or borders.\n- Flags, national markings, roundels, stars, crosses, eagles, swastikas or any other political or extremist symbol, unit badges or insignia.\n- Recognisable faces, gore, modern or science-fiction elements.\n- Cartoon, vector, flat-colour or video-game 3D-render looks.',
].join('\n\n');

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
