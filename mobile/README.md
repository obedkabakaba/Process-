# Kesho : application mobile

Application Android et iOS de Kesho, construite avec **Expo (SDK 58)** et **Expo Router**.
Elle a besoin de l'API du dépôt `Process-bakend`.

## Ce que fait cette première version

| Écran | Rôle |
|---|---|
| Bienvenue | Création du profil en 3 étapes : prénom, classe et province, informations pour les opportunités |
| Test Mon ADN | 30 cartes d'activités, 3 réponses possibles (test d'intérêts RIASEC) |
| Mon ADN | Profil dominant, trois forces, métiers et options recommandés |
| Accueil | XP et niveau, prochaine échéance, opportunité du moment, métiers pour toi |
| Explorer | Métiers et écoles, avec recherche et filtres |
| Scout | Opportunités « Pour toi », « Presque » et vérificateur d'arnaque |
| Radar | Dates des examens et des inscriptions pour la classe de l'élève |
| Profil | Informations, badges, changement de profil |

Le profil est gardé sur le téléphone. Les dernières données chargées restent visibles sans connexion (un bandeau « Hors-ligne » l'indique).

## Démarrer

```bash
npm install
cp .env.example .env    # adresse de l'API
npx expo start          # puis scanner le QR code avec Expo Go, ou appuyer sur « w » pour le navigateur
```

Sur un téléphone réel, `EXPO_PUBLIC_API_URL` doit pointer vers l'adresse IP de l'ordinateur qui fait tourner l'API (pas `localhost`).

## Vérifier

```bash
npm run typecheck       # types TypeScript
npm run export:web      # construit la version navigateur dans dist/
```

## Organisation du code

- `src/app/` : les écrans (un fichier = un écran, selon Expo Router)
- `src/components/` : composants partagés (`ui.tsx`, `CarteOpportunite.tsx`)
- `src/lib/` : appels à l'API avec repli hors-ligne, session, thème, formats
