# Pack d’assets Galaxia Radar : prompts de génération

Fichier généré par `npm run assets` à partir de `tools/assets/pack.ts` : modifier le catalogue, pas ce fichier.

Images réalistes façon photo d’archives de la Seconde Guerre mondiale, aux noms du renommage : un Gem Gemini porte le style, puis un prompt par image (61 images). Les icônes du menu restent dessinées : elles servent de masque.

## Mode d’emploi

1. Dans Gemini, créer un Gem (Explorer les Gems › Nouveau Gem), par exemple « Galaxia Radar · Arsenal 1940 », et coller les instructions ci-dessous.
2. Dans une conversation avec ce Gem, envoyer un prompt par message : une image par élément. Une conversation par famille garde la série homogène ; une image qui s’écarte du style se régénère.
3. Enregistrer chaque image sous `assets/skin/generated/<clé>.png` (clé entre parenthèses au début du prompt ; `.jpg` et `.webp` sont acceptés).
4. Lancer `npm run assets && npm run build`, puis recharger l’extension (↻ dans `chrome://extensions`) et l’onglet du jeu. Les clés sans image gardent leur dessin.

## Instructions du Gem

```text
You are the image studio of "Galaxia Radar", a World War II makeover of a space strategy game. Each message I send names one game element (French name, then its key in brackets) and describes its subject and framing. Answer every message with exactly one new image that follows this style guide, so that the whole set looks like one coherent series. Do not add any text to your answer.

LOOK
- A genuine 1940s photograph, as taken by a war-department photographer, then hand-tinted: photorealistic and highly detailed, with authentic period materials and wear (chipped paint, mud, rust, canvas, rivets, oil stains, worn leather, brass).
- Muted hand-tinted colours only: olive drab, field grey-green, khaki, gunmetal, weathered steel and aged ivory highlights. A small touch of dark oxblood red is allowed only on danger details (warhead band, fuse, flame). No bright or saturated colour.
- Fine silver-gelatin film grain, slightly soft corners.

LIGHT
- Low-key studio light: one warm key light from the upper left, a faint cool rim light on the right edge that separates the subject from the background, deep but readable shadows.

COMPOSITION
- One single subject, centred, entirely in frame, filling about 70% of the image.
- The subject rests on a small round patch of ground (earth, gravel, concrete or a wooden workbench, whatever suits it) that fades into a plain near-black background (#1A1A1A) with a soft vignette. No landscape, horizon, sky or extra objects unless the prompt asks for them.
- Camera slightly above the subject, three-quarter view, unless the prompt says otherwise.
- Square 1:1 format.
- The image must stay readable when displayed very small (64 pixels): strong, clear silhouette, well separated from the background.

EQUIPMENT
- Generic designs that mix features of several nations’ equipment, never an exact copy of one identifiable model.
- Soldiers are anonymous: helmets, shadow or distance hide their faces.

NEVER INCLUDE
- Text, letters, numbers, labels, logos, watermarks, signatures, frames or borders.
- Flags, national markings, roundels, stars, crosses, eagles, swastikas or any other political or extremist symbol, unit badges or insignia.
- Recognisable faces, gore, modern or science-fiction elements.
- Cartoon, vector, flat-colour or video-game 3D-render looks.
```

## Prompts par image

### Unités

**Fantassin** · `lightFighter`

```text
Fantassin (lightFighter). Subject: an infantry rifleman standing at ease, round steel helmet, wool field jacket with webbing, small backpack, bolt-action rifle with fixed bayonet held across the chest. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Mitrailleur** · `heavyFighter`

```text
Mitrailleur (heavyFighter). Subject: a machine gunner lying prone behind a light machine gun on its bipod, round steel helmet, an open ammunition box and spent brass cases beside him. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Char léger** · `cruiser`

```text
Char léger (cruiser). Subject: a small light tank with a compact riveted turret and a short gun, five road wheels, low hull, mud on the tracks. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Char lourd** · `battleship`

```text
Char lourd (battleship). Subject: a massive heavy tank with a large boxy turret, a long gun with a muzzle brake, six large road wheels, thick sloped armour plates with welding seams. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Chasseur de chars** · `battlecruiser`

```text
Chasseur de chars (battlecruiser). Subject: a turretless tank destroyer with a low sloped casemate and a very long gun, spare track links bolted to the hull. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Bombardier** · `bomber`

```text
Bombardier (bomber). Subject: a four-engine heavy bomber parked on a round concrete hardstand, straight wings, glazed nose, propellers at rest. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Obusier** · `destroyer`

```text
Obusier (destroyer). Subject: a towed field howitzer with large spoked steel wheels, a gun shield and the barrel raised at about 35 degrees, split trails dug into the ground. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Canon sur voie ferrée** · `deathstar`

```text
Canon sur voie ferrée (deathstar). Subject: a super-heavy railway gun on a long multi-axle rail carriage standing on a short length of track, enormous barrel raised. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Camion** · `smallCargo`

```text
Camion (smallCargo). Subject: a military cargo truck with a canvas-covered rear bed, three axles and mud-spattered wheels. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Half-track** · `largeCargo`

```text
Half-track (largeCargo). Subject: an armoured half-track carrier with front wheels and rear tracks, an open-topped troop compartment and a pintle-mounted machine gun. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Dépanneuse** · `recycler`

```text
Dépanneuse (recycler). Subject: a heavy recovery truck with an A-frame crane, winch cable and hook at the rear, chains and tools on its bed. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Tireur d’élite** · `espionageProbe`

```text
Tireur d’élite (espionageProbe). Subject: a sniper lying prone under a camouflage cape with leaf scrim, a long rifle with a telescopic sight on a small bipod. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Campement du génie** · `colonyShip`

```text
Campement du génie (colonyShip). Subject: an engineers field camp: a canvas ridge tent with guy ropes, stacked supply crates, shovels and a coil of wire. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

**Groupe électrogène** · `solarSatellite`

```text
Groupe électrogène (solarSatellite). Subject: a two-wheeled towed portable electric generator with a small exhaust stack and cables coiled on top. Framing: three-quarter view from above, the whole vehicle, aircraft or soldier on its round patch of ground.
```

### Défenses

**Lance-roquettes** · `rocketLauncher`

```text
Lance-roquettes (rocketLauncher). Subject: a towed multiple rocket launcher with three rows of launch tubes angled upward, rockets loaded. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Nid de mitrailleuse** · `lightLaser`

```text
Nid de mitrailleuse (lightLaser). Subject: a machine-gun nest behind a curved wall of sandbags, the gun barrel pointing forward through a gap, ammunition belts. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Canon antichar** · `heavyLaser`

```text
Canon antichar (heavyLaser). Subject: a low towed anti-tank gun with a wide angled gun shield and a long horizontal barrel, its trails spread. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Canon de campagne** · `gaussCannon`

```text
Canon de campagne (gaussCannon). Subject: a towed field gun with a gun shield, large spoked wheels and the barrel slightly raised. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Canon antiaérien** · `ionCannon`

```text
Canon antiaérien (ionCannon). Subject: a twin-barrel anti-aircraft gun on a cruciform platform, barrels pointing steeply up, ready ammunition clips beside it. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Casemate** · `plasmaTurret`

```text
Casemate (plasmaTurret). Subject: a heavy concrete coastal casemate half-buried in earth, a large gun barrel protruding from its embrasure. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Sacs de sable** · `smallShieldDome`

```text
Sacs de sable (smallShieldDome). Subject: a low curved wall of neatly stacked sandbags, a few of them torn and leaking sand. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Bunker** · `largeShieldDome`

```text
Bunker (largeShieldDome). Subject: a domed concrete bunker partly covered with earth and grass, with a narrow dark firing slit. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Missile d’interception** · `antiBallisticMissile`

```text
Missile d’interception (antiBallisticMissile). Subject: a small interceptor missile with short fins on an angled launch rail. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

**Fusée** · `interplanetaryMissile`

```text
Fusée (interplanetaryMissile). Subject: a large finned rocket standing upright on a launch table beside a steel service gantry, a thin dark red band near the nose. Framing: three-quarter view from slightly above, the whole emplacement on its round patch of ground.
```

### Ressources

**Acier** · `metal`

```text
Acier (metal). Subject: a neat stack of three heavy steel ingots with a dull metallic sheen. Framing: close-up still life seen from the front, the object filling 85% of the frame, a simple bold silhouette that still reads as a tiny icon.
```

**Munitions** · `crystal`

```text
Munitions (crystal). Subject: three brass artillery shells standing side by side, the middle one taller. Framing: close-up still life seen from the front, the object filling 85% of the frame, a simple bold silhouette that still reads as a tiny icon.
```

**Carburant** · `deuterium`

```text
Carburant (deuterium). Subject: a military steel jerrycan with an embossed X pattern on its side and a triple handle. Framing: close-up still life seen from the front, the object filling 85% of the frame, a simple bold silhouette that still reads as a tiny icon.
```

**Énergie** · `energy`

```text
Énergie (energy). Subject: an enamelled metal high-voltage warning plate showing one bold lightning bolt and no lettering. Framing: close-up still life seen from the front, the object filling 85% of the frame, a simple bold silhouette that still reads as a tiny icon.
```

### Bâtiments

**Mine de fer** · `metalMine`

```text
Mine de fer (metalMine). Subject: an iron mine head: a steel lattice headframe with its winding wheel, a spoil heap and a mine cart full of ore on rails. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Usine de munitions** · `crystalMine`

```text
Usine de munitions (crystalMine). Subject: an ammunition factory: a brick workshop with a sawtooth roof and a chimney, artillery shells and crates stacked in front. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Raffinerie** · `deuteriumSynth`

```text
Raffinerie (deuteriumSynth). Subject: a fuel refinery: two tall distillation columns, a tangle of pipes and a cylindrical storage tank. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Centrale thermique** · `solarPlant`

```text
Centrale thermique (solarPlant). Subject: a coal-fired power station with two smoking chimneys, a coal heap and a high-voltage lattice pylon. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Barrage hydroélectrique** · `fusionReactor`

```text
Barrage hydroélectrique (fusionReactor). Subject: a concrete hydroelectric dam with water rushing from its spillways and a turbine house at its foot. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Dépôt d’acier** · `metalStorage`

```text
Dépôt d’acier (metalStorage). Subject: a semicircular corrugated-steel hut with stacks of steel girders and plates in front. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Dépôt de munitions** · `crystalStorage`

```text
Dépôt de munitions (crystalStorage). Subject: an earth-covered ammunition bunker with a heavy steel door, crates and shells stacked at the entrance. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Dépôt de carburant** · `deuteriumTank`

```text
Dépôt de carburant (deuteriumTank). Subject: a fuel depot with two large cylindrical tanks, pipes and rows of fuel drums. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Usine** · `roboticsFactory`

```text
Usine (roboticsFactory). Subject: a large brick factory with a sawtooth roof and a tall chimney. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Usine de blindés** · `shipyard`

```text
Usine de blindés (shipyard). Subject: a tank assembly hall with a large open door, a new tank rolling out and an overhead gantry crane. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Bureau d’études** · `researchLab`

```text
Bureau d’études (researchLab). Subject: a brick research building with a tall radio mast, antenna wires and a few lit windows. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Arsenal** · `naniteFactory`

```text
Arsenal (naniteFactory). Subject: a large arsenal complex: several workshops with chimneys, a railway siding and gun barrels on racks. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Génie** · `terraformer`

```text
Génie (terraformer). Subject: a tracked bulldozer pushing a mound of earth, its blade dented. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Base de lancement** · `missileSilo`

```text
Base de lancement (missileSilo). Subject: a rocket launch site: a rocket on an angled erector, a concrete pad and a small blockhouse. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Avant-poste** · `lunarBase`

```text
Avant-poste (lunarBase). Subject: a fortified forward outpost on a small hill: a wooden watchtower, sandbags, barbed wire and a tent. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Station radar** · `sensorPhalanx`

```text
Station radar (sensorPhalanx). Subject: a radar station: a large rectangular mesh antenna on a lattice tower and a control hut with cables. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

**Aérodrome** · `jumpGate`

```text
Aérodrome (jumpGate). Subject: a military airfield: a hangar, a small control tower, a stretch of unmarked runway and a windsock. Framing: high three-quarter aerial view of the whole site, on a round plot of ground that fades into the black background.
```

### Recherches

**Électrification** · `energyTech`

```text
Électrification (energyTech). Subject: an electrical transformer with three tall porcelain insulators and heavy cables. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Optique** · `laserTech`

```text
Optique (laserTech). Subject: an anti-aircraft searchlight on its trailer, its powerful beam projecting into the darkness. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Radio** · `ionTech`

```text
Radio (ionTech). Subject: a large glass radio transmitting valve with visible electrodes and a faint warm filament glow, mounted on a radio chassis. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Cartographie** · `hyperspaceTech`

```text
Cartographie (hyperspaceTech). Subject: a folded topographic map without any lettering, a route drawn in pencil, brass drafting dividers and a compass lying on it. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Métallurgie** · `plasmaTech`

```text
Métallurgie (plasmaTech). Subject: a foundry crucible pouring molten metal into a sand mould, a few sparks and a dim orange glow. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Moteur à explosion** · `combustionDrive`

```text
Moteur à explosion (combustionDrive). Subject: an oily, well-used six-cylinder truck engine on an engine stand. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Moteur d’avion** · `impulseDrive`

```text
Moteur d’avion (impulseDrive). Subject: a radial aircraft engine with a three-blade propeller on an engine stand. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Moteur-fusée** · `hyperspaceDrive`

```text
Moteur-fusée (hyperspaceDrive). Subject: an early liquid-fuel rocket engine on a test stand: combustion chamber, nozzle bell, pipes and a short flame. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Renseignement** · `espionageTech`

```text
Renseignement (espionageTech). Subject: a pair of military binoculars on a worn leather case, beside a blank folded document. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Chiffrement** · `computerTech`

```text
Chiffrement (computerTech). Subject: a generic electromechanical cipher machine in an open wooden case: three rotors, a keyboard with blank keys and small lamps. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Observation** · `astrophysics`

```text
Observation (astrophysics). Subject: an artillery scissors periscope (twin observation telescope) on a tripod. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Réseau de transmissions** · `researchNetwork`

```text
Réseau de transmissions (researchNetwork). Subject: a field telephone in its leather case with the handset, next to a cable reel on its frame. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Balistique** · `gravitonTech`

```text
Balistique (gravitonTech). Subject: a sectioned artillery shell lying on graph paper with a hand-drawn trajectory arc, a brass gunner’s quadrant beside it. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Armement** · `weaponsTech`

```text
Armement (weaponsTech). Subject: two bolt-action rifles crossed in front of an open wooden ammunition crate full of cartridges. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Camouflage** · `shieldingTech`

```text
Camouflage (shieldingTech). Subject: a small military vehicle almost hidden under a camouflage net with leaf-shaped scrim. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```

**Blindage** · `armourTech`

```text
Blindage (armourTech). Subject: a thick riveted armour test plate on a stand, with a deep shell impact crater and cracks. Framing: close-up still life, three-quarter view from slightly above, the object on a dark wooden workbench that fades into the black background.
```
