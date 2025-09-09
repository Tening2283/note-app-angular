# Notes App Angular

Une application de prise de notes moderne construite avec Angular 20.

## Fonctionnalités

- Création, édition et suppression de notes
- Organisation par catégories colorées
- Recherche de notes par texte ou tags
- Interface responsive et design épuré
- Sauvegarde locale des données (localStorage)

## Structure du projet

```
src/
  components/
    note-card.component.ts
    note-editor.component.ts
    sidebar.component.ts
  models/
    note.model.ts
  services/
    notes.service.ts
  global_styles.css
  index.html
  main.ts
angular.json
package.json
tsconfig.json
tsconfig.app.json
```

## Installation

1. **Cloner le dépôt**
   ```sh
   git clone https://github.com/Tening2283/note-app-angular.git
   cd note-app-angular
   ```

2. **Installer les dépendances**
   ```sh
   npm install
   ```

3. **Lancer le serveur de développement**
   ```sh
   npm start
   ```
   Accède à l'application sur [http://localhost:4200](http://localhost:4200).

## Scripts utiles

- `npm start` : démarre le serveur de développement
- `npm run build` : construit l'application pour la production

## Personnalisation

- Les catégories sont définies dans [`NotesService`](src/services/notes.service.ts).
- Le modèle de note est dans [`Note`](src/models/note.model.ts).

