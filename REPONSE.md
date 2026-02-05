# Lucas DEVERS--DORE

##  Installation (Environnement Linux)

Avant de lancer quoi que ce soit, assurez-vous d'avoir installé les packages nécessaires au fonctionnement des nouveaux systèmes (Matchmaking et Événements).

### 1. Installation globale (à la racine)
```pnpm install```

### 2. Dépendances spécifiques du Serveur

Si vous avez des erreurs de modules manquants sous Linux, lancez ces commandes dans apps/realtime-elo-ranker-server :
Bash

```pnpm add @nestjs/event-emitter @nestjs/schedule```
```pnpm add -D supertest jest ts-jest @types/jest @types/supertest```

### Lancement de l'application

Pour faire fonctionner le système, vous devez ouvrir deux terminaux.
Terminal 1 : Le Serveur (Backend)


```cd apps/realtime-elo-ranker-server```
```npm run start:dev```

Le serveur gère le matchmaking automatique toutes les 30 secondes et diffuse les scores via SSE.
Terminal 2 : Le Client (Frontend)

```cd apps/realtime-elo-ranker-client```
```npm run dev```

Pour les test :

```cd apps/realtime-elo-ranker-server```
```npx jest --coverage --coverageDirectory='coverage' --detectOpenHandles --forceExit```


Si vous souhaitez remettre les scores à zéro et supprimer tous les joueurs :

```rm database.sqlite```
