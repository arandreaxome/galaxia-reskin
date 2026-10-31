# Galaxia Radar

Extension Chrome pour [Galaxia](https://galaxia.eldau.xyz) : notifications (files terminées, stockage plein, flottes revenues, attaques en approche), tableau de bord, onglets Cibles et Débris, habillage du site. Elle ne lance aucune action de jeu à ta place.

## Installation

Il faut Chrome et [Node.js](https://nodejs.org) 22.12 ou plus récent (20.19 au minimum).

1. Dans le dossier du repo, construis l'extension :

   ```bash
   npm ci
   npm run build
   ```

   L'extension est écrite dans le dossier `dist/`.

2. Ouvre `chrome://extensions` et active le **Mode développeur** (en haut à droite).
3. Clique sur **Charger l'extension non empaquetée** et choisis le dossier `dist/`.
4. Épingle Galaxia Radar dans la barre d'outils (icône en forme de pièce de puzzle).
5. Ouvre Galaxia dans un onglet, connecté à ton compte : l'extension reprend ta session.

Les options (habillage du site, pack d'assets, renommage, choix des notifications) sont dans l'onglet **Réglages** de la popup.

Sur macOS, les notifications n'apparaissent que si Chrome y est autorisé : Réglages Système › Notifications › Google Chrome.

## Mise à jour

```bash
git pull
npm ci
npm run build
```

Puis clique sur ↻ sous Galaxia Radar dans `chrome://extensions` et recharge l'onglet du jeu.
