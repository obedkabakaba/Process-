# Kesho : application mobile

Application Android et iOS de Kesho, construite avec **Expo (SDK 58)** et **Expo Router**.
Elle a besoin de l'API du dépôt `Process-bakend`.

## Écrans

| Écran | Rôle |
|---|---|
| Bienvenue | Présentation, puis connexion par numéro de téléphone et code à 6 chiffres |
| Création du profil | Une question par écran : prénom, classe, option, province, date de naissance, informations facultatives |
| Accord parental | Pour les moins de 18 ans : saisie du code reçu par le parent. Possible plus tard |
| Test Mon ADN | 30 cartes d'activités, 3 réponses possibles |
| Mon ADN | Profil dominant, forces, métiers et options recommandés |
| Accueil | Prochaine échéance, opportunités, métiers, XP |
| Explorer | Métiers et écoles, avec recherche et filtres |
| Scout | Opportunités « Pour toi », « Presque » et vérificateur d'arnaque |
| Radar | Dates des examens et des inscriptions pour la classe de l'élève |
| Profil | Informations, modification, apparence, déconnexion, suppression du compte |
| Espace curateur | Réservé aux curateurs : tableau de bord, fiche avec analyse par IA, Radar, sources |

Le jeton de session est gardé dans le coffre chiffré du téléphone. Les dernières données chargées restent visibles sans connexion (un bandeau « Hors-ligne » l'indique).

En développement, l'API ne peut pas envoyer de message : le code de connexion s'affiche sous le champ (« Mode démonstration »).

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

## Construire la version Android

`eas.json` prépare un fichier APK de test (`preview`). Il faut un compte Expo ; cette étape n'a pas encore été exécutée.

```bash
npx eas-cli@latest build --profile preview --platform android
```

## Organisation du code

- `src/app/` : les écrans (un fichier = un écran, selon Expo Router)
- `src/components/` : composants partagés (`ui.tsx`, `icones.ts`, `CarteOpportunite.tsx`, `TuileMetier.tsx`, `Logo.tsx`)
- `src/theme/` : apparences (`apparences.ts`) et fournisseur de thème (`ThemeProvider.tsx`)
- `src/lib/` : appels à l'API avec repli hors-ligne, session, formats
