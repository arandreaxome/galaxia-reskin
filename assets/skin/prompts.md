# Pack d’assets Galaxia Radar : prompts de génération

Fichier généré par `npm run assets` à partir de `tools/assets/pack.ts` : modifier le catalogue, pas ce fichier.

## Mode d’emploi

1. Choisir un style pour tout le pack : A (pictogramme vectoriel, dans la continuité de l’extension) ou B (illustration).
2. Pour chaque élément, coller le prompt et joindre son rendu de référence `png/<clé>.png` (même silhouette, même cadrage).
3. Ajouter le prompt négatif quand l’outil le permet, sinon l’écrire en fin de prompt après « Avoid: ».
4. Exporter en PNG carré (1024 × 1024 conseillé), fond transparent.
5. Déposer chaque image dans `assets/skin/generated/<clé>.png`, puis lancer `npm run assets && npm run build` et recharger l’extension. Les clés sans image gardent leur dessin.

## Style A : pictogramme vectoriel (conseillé)

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set.
```

## Style B : illustration

```text
Detailed matte illustration in the style of a 1940s technical field manual painted in gouache. Muted desaturated palette built on grey-green #4A5D4A, dark olive #3A4A3A, anthracite #2C2C2C and ivory #E8E4D9, dark red #6B1E1E only as a tiny accent. Clean silhouette readable at 64 pixels, soft directional light, transparent or plain #1A1A1A background, square 1:1, consistent rendering across the whole set.
```

## Prompt négatif

```text
text, letters, numbers, logos, watermark, insignia, emblems, flags, national markings, roundels, stars, crosses, eagles, swastika or any political or extremist symbol, unit badges, brand names, detailed faces, gore, bright saturated colors, gradients, glow, busy background
```

## Prompts par élément (style A)

Pour le style B, remplacer la première partie (jusqu’à « same scale… ») par le paragraphe du style B, ou prendre la colonne `prompt_illustration` de `prompts.csv`.

### Unités

**lightFighter** · Fantassin · référence `png/lightFighter.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an infantry rifleman standing in profile, round steel helmet, field jacket, small backpack, rifle held across the chest with fixed bayonet. Framing: side view facing right, full subject visible.
```

**heavyFighter** · Mitrailleur · référence `png/heavyFighter.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a machine gunner lying prone behind a light machine gun on a bipod, ammunition box beside him, round helmet. Framing: side view facing right, full subject visible.
```

**cruiser** · Char léger · référence `png/cruiser.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a light tank with a small turret and a short gun, five road wheels, low hull. Framing: side view facing right, full subject visible.
```

**battleship** · Char lourd · référence `png/battleship.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a heavy tank with a large boxy turret, a long gun with muzzle brake, six road wheels, thick sloped armor. Framing: side view facing right, full subject visible.
```

**battlecruiser** · Chasseur de chars · référence `png/battlecruiser.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a turretless tank destroyer with a low sloped casemate and a very long gun. Framing: side view facing right, full subject visible.
```

**bomber** · Bombardier · référence `png/bomber.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a four-engine heavy bomber seen from above, straight wings, glazed nose. Framing: side view facing right, full subject visible.
```

**destroyer** · Obusier · référence `png/destroyer.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a towed field howitzer with large wheels, a gun shield and the barrel raised at 35 degrees. Framing: side view facing right, full subject visible.
```

**deathstar** · Canon sur voie ferrée · référence `png/deathstar.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a super-heavy railway gun on a long rail carriage with many wheels, enormous barrel raised. Framing: side view facing right, full subject visible.
```

**smallCargo** · Camion · référence `png/smallCargo.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a military cargo truck with a canvas-covered rear bed and three axles. Framing: side view facing right, full subject visible.
```

**largeCargo** · Half-track · référence `png/largeCargo.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an armored half-track personnel carrier with front wheels and rear tracks, open top. Framing: side view facing right, full subject visible.
```

**recycler** · Dépanneuse · référence `png/recycler.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a recovery truck with an A-frame crane and a hook at the rear. Framing: side view facing right, full subject visible.
```

**espionageProbe** · Tireur d’élite · référence `png/espionageProbe.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a sniper lying prone under a camouflage covering, long scoped rifle on a bipod. Framing: side view facing right, full subject visible.
```

**colonyShip** · Campement du génie · référence `png/colonyShip.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an engineers field camp: a canvas tent with guy ropes and supply crates. Framing: side view facing right, full subject visible.
```

**solarSatellite** · Groupe électrogène · référence `png/solarSatellite.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a towed portable electric generator on two wheels with an exhaust stack. Framing: side view facing right, full subject visible.
```

### Défenses

**rocketLauncher** · Lance-roquettes · référence `png/rocketLauncher.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a towed multiple rocket launcher with three rows of tubes angled upward. Framing: side view facing right, full subject visible.
```

**lightLaser** · Nid de mitrailleuse · référence `png/lightLaser.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a machine-gun nest behind a curved wall of sandbags, barrel pointing forward. Framing: side view facing right, full subject visible.
```

**heavyLaser** · Canon antichar · référence `png/heavyLaser.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a low towed anti-tank gun with a wide gun shield and a long horizontal barrel. Framing: side view facing right, full subject visible.
```

**gaussCannon** · Canon de campagne · référence `png/gaussCannon.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a towed field gun with a gun shield, large wheels, barrel slightly raised. Framing: side view facing right, full subject visible.
```

**ionCannon** · Canon antiaérien · référence `png/ionCannon.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a twin-barrel anti-aircraft gun on a cruciform platform, barrels pointing steeply up. Framing: side view facing right, full subject visible.
```

**plasmaTurret** · Casemate · référence `png/plasmaTurret.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a concrete coastal casemate half-buried in earth, a heavy gun in its embrasure. Framing: side view facing right, full subject visible.
```

**smallShieldDome** · Sacs de sable · référence `png/smallShieldDome.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a low defensive wall of stacked sandbags. Framing: side view facing right, full subject visible.
```

**largeShieldDome** · Bunker · référence `png/largeShieldDome.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a domed concrete bunker covered with earth, with a narrow firing slit. Framing: side view facing right, full subject visible.
```

**antiBallisticMissile** · Missile d’interception · référence `png/antiBallisticMissile.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a small interceptor missile on an angled launch rail. Framing: side view facing right, full subject visible.
```

**interplanetaryMissile** · Fusée · référence `png/interplanetaryMissile.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a large rocket standing on a launch table next to a service gantry, thin dark red band near the nose. Framing: side view facing right, full subject visible.
```

### Ressources

**metal** · Acier · référence `png/metal.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a stack of three steel ingots. Framing: simple bold icon, front view, readable at 16 pixels.
```

**crystal** · Munitions · référence `png/crystal.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: three artillery shells standing side by side. Framing: simple bold icon, front view, readable at 16 pixels.
```

**deuterium** · Carburant · référence `png/deuterium.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a military fuel jerrycan with an embossed X. Framing: simple bold icon, front view, readable at 16 pixels.
```

**energy** · Énergie · référence `png/energy.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a lightning bolt inside a round badge. Framing: simple bold icon, front view, readable at 16 pixels.
```

### Bâtiments

**metalMine** · Mine de fer · référence `png/metalMine.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a mine head: lattice headframe tower with a winding wheel, a spoil heap and a mine cart full of ore. Framing: side view of a single building facing right, full subject visible.
```

**crystalMine** · Usine de munitions · référence `png/crystalMine.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an ammunition factory: sawtooth-roof workshop with a chimney, artillery shells and a crate in front. Framing: side view of a single building facing right, full subject visible.
```

**deuteriumSynth** · Raffinerie · référence `png/deuteriumSynth.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a fuel refinery with two distillation columns, pipes and a cylindrical storage tank. Framing: side view of a single building facing right, full subject visible.
```

**solarPlant** · Centrale thermique · référence `png/solarPlant.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a coal power station with two chimneys and a high-voltage lattice pylon. Framing: side view of a single building facing right, full subject visible.
```

**fusionReactor** · Barrage hydroélectrique · référence `png/fusionReactor.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a hydroelectric dam with a turbine house at its base and spillway openings. Framing: side view of a single building facing right, full subject visible.
```

**metalStorage** · Dépôt d’acier · référence `png/metalStorage.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a semicircular corrugated steel hut with a stack of steel girders. Framing: side view of a single building facing right, full subject visible.
```

**crystalStorage** · Dépôt de munitions · référence `png/crystalStorage.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an earth-covered ammunition bunker with a steel door and stacked crates. Framing: side view of a single building facing right, full subject visible.
```

**deuteriumTank** · Dépôt de carburant · référence `png/deuteriumTank.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a fuel depot with two cylindrical tanks and a stack of fuel drums. Framing: side view of a single building facing right, full subject visible.
```

**roboticsFactory** · Usine · référence `png/roboticsFactory.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a large sawtooth-roof factory with a tall chimney. Framing: side view of a single building facing right, full subject visible.
```

**shipyard** · Usine de blindés · référence `png/shipyard.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a tank assembly hall with a big open door, a tank rolling out and a gantry crane. Framing: side view of a single building facing right, full subject visible.
```

**researchLab** · Bureau d’études · référence `png/researchLab.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a research building with a tall radio mast and antenna wires. Framing: side view of a single building facing right, full subject visible.
```

**naniteFactory** · Arsenal · référence `png/naniteFactory.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a large arsenal complex of several workshops and chimneys. Framing: side view of a single building facing right, full subject visible.
```

**terraformer** · Génie · référence `png/terraformer.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a tracked bulldozer pushing a mound of earth. Framing: side view of a single building facing right, full subject visible.
```

**missileSilo** · Base de lancement · référence `png/missileSilo.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a rocket launch site: a rocket on an angled erector, a concrete pad and a small blockhouse. Framing: side view of a single building facing right, full subject visible.
```

**lunarBase** · Avant-poste · référence `png/lunarBase.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a fortified forward outpost on a hill: watchtower, sandbags, barbed wire and a tent. Framing: side view of a single building facing right, full subject visible.
```

**sensorPhalanx** · Station radar · référence `png/sensorPhalanx.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a radar station: a rectangular mesh antenna on a lattice tower and a control hut. Framing: side view of a single building facing right, full subject visible.
```

**jumpGate** · Aérodrome · référence `png/jumpGate.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a military airfield: a hangar, a control tower, runway markings and a windsock. Framing: side view of a single building facing right, full subject visible.
```

### Recherches

**energyTech** · Électrification · référence `png/energyTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an electrical transformer with three porcelain insulators and cables. Framing: single object centered, slight three-quarter view.
```

**laserTech** · Optique · référence `png/laserTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a military searchlight on a tripod projecting a beam. Framing: single object centered, slight three-quarter view.
```

**ionTech** · Radio · référence `png/ionTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a large radio vacuum tube with visible electrodes. Framing: single object centered, slight three-quarter view.
```

**hyperspaceTech** · Cartographie · référence `png/hyperspaceTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a folded military map with a dashed route and drafting dividers. Framing: single object centered, slight three-quarter view.
```

**plasmaTech** · Métallurgie · référence `png/plasmaTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a foundry crucible pouring molten metal into a mold. Framing: single object centered, slight three-quarter view.
```

**combustionDrive** · Moteur à explosion · référence `png/combustionDrive.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: an inline four-cylinder engine block with a pulley. Framing: single object centered, slight three-quarter view.
```

**impulseDrive** · Moteur d’avion · référence `png/impulseDrive.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a radial aircraft engine with a three-blade propeller, front view. Framing: single object centered, slight three-quarter view.
```

**hyperspaceDrive** · Moteur-fusée · référence `png/hyperspaceDrive.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a rocket engine: combustion chamber, nozzle bell and a small flame. Framing: single object centered, slight three-quarter view.
```

**espionageTech** · Renseignement · référence `png/espionageTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a pair of military binoculars. Framing: single object centered, slight three-quarter view.
```

**computerTech** · Chiffrement · référence `png/computerTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a generic electromechanical cipher machine with rotors and a keyboard. Framing: single object centered, slight three-quarter view.
```

**astrophysics** · Observation · référence `png/astrophysics.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a field telescope on a tripod. Framing: single object centered, slight three-quarter view.
```

**researchNetwork** · Transmissions · référence `png/researchNetwork.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a field telephone with its handset and a cable reel. Framing: single object centered, slight three-quarter view.
```

**gravitonTech** · Balistique · référence `png/gravitonTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a ballistic trajectory: dashed arc from a small gun to a target, shell at the apex. Framing: single object centered, slight three-quarter view.
```

**weaponsTech** · Armement · référence `png/weaponsTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: two crossed rifles over an ammunition crate. Framing: single object centered, slight three-quarter view.
```

**shieldingTech** · Camouflage · référence `png/shieldingTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: a camouflage net draped over a vehicle shape. Framing: single object centered, slight three-quarter view.
```

**armourTech** · Blindage · référence `png/armourTech.png`

```text
Flat vector military pictogram in a clean 1940s field-manual style. Matte limited palette only: grey-green #4A5D4A, light grey-green #5C6B5C, dark olive #3A4A3A, deep black #1A1A1A, anthracite #2C2C2C, ivory #E8E4D9; dark red #6B1E1E only for tiny danger details (warhead band, flame, target). Thin black outlines, flat fills, subtle ivory edge highlights, no gradients, no glow, no texture. Transparent background, soft flat ground shadow, subject centered, square 1:1, same scale and line weight across the whole set. Subject: thick riveted armor plates with a shell impact. Framing: single object centered, slight three-quarter view.
```
