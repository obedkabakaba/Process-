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
| Apparence | Choix parmi 6 apparences, en clair, sombre ou automatique |

Le profil est gardé sur le téléphone. Les dernières données chargées restent visibles sans connexion (un bandeau « Hors-ligne » l'indique).

## Apparences et mode sombre

L'utilisateur choisit son apparence dans **Profil → Apparence**. Chaque apparence existe en clair et en sombre ; le mode « Automatique » suit le réglage du téléphone. Le choix est gardé sur le téléphone.

| Apparence | Caractère | Police des titres |
|---|---|---|
| **Aube** (par défaut) | L'identité Kesho : encre sombre et orange du lever du soleil | Sora |
| **Sable** | Calme et chaleureux, tons crème et terre cuite | Fraunces (à empattements) |
| **Graphite** | Minimal, noir et blanc | Inter |
| **Émeraude** | Net et contrasté, noir avec du vert | Inter extra-gras |
| **Élan** | Vif et motivant, boutons en relief | Nunito |
| **Classique** | Le premier design, violet et jaune, avec emojis | Police du système |

Pour ajouter une apparence : ajouter une entrée dans `src/theme/apparences.ts` (couleurs claires, couleurs sombres, formes, polices). Aucun écran n'est à modifier, car tous lisent leurs couleurs par `useTheme()`.

Règles de design suivies dans tous les écrans :
- des icônes (Lucide) à la place des emojis, sauf dans « Classique » ;
- peu de texte : un titre, une ligne d'aide au plus ;
- une seule question par écran à la création du profil ;
- zones tactiles d'au moins 40 points, libellés d'accessibilité sur les boutons.

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
- `src/components/` : composants partagés (`ui.tsx`, `icones.ts`, `CarteOpportunite.tsx`, `TuileMetier.tsx`, `Logo.tsx`)
- `src/theme/` : apparences (`apparences.ts`) et fournisseur de thème (`ThemeProvider.tsx`)
- `src/lib/` : appels à l'API avec repli hors-ligne, session, formats
