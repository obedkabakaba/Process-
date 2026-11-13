# Plan d'action

Retour à la [vision](../VISION.md).

Ce document dit **ce qui est construit**, **ce qui vient ensuite** et **ce que le fondateur doit décider ou faire lui-même**.

## 1. Ce qui est construit (sprints 0 et 1)

### API : dépôt `Process-bakend`

| Brique | État |
|---|---|
| Catalogue : 45 métiers, 17 options des humanités, 28 établissements | ✅ Fait |
| Test d'intérêts RIASEC (30 questions) et recommandations | ✅ Fait |
| **Connexion par numéro de téléphone** (code à 6 chiffres, session de 30 jours) | ✅ Fait |
| **Chaque élève n'accède qu'à son profil** ; suppression du compte à la demande | ✅ Fait |
| **Accord d'un parent** pour les moins de 18 ans | ✅ Fait |
| Scout : éligibilité par critère, « presque éligible », score de confiance, classement | ✅ Fait |
| Bouclier anti-arnaque, ouvert même sans compte | ✅ Fait |
| **Espace curateur** : création, relecture, publication et rejet des fiches | ✅ Fait |
| **Analyse d'une annonce par IA** (texte collé ou adresse web) vers un brouillon de fiche | ✅ Écrit, **pas encore essayé avec une vraie clé** |
| **Sources surveillées** (flux RSS ou pages), collecte à la demande ou quotidienne | ✅ Écrit, dépend de l'IA ci-dessus |
| **Recherche d'opportunités sur le web par l'IA** (8 recherches de départ, relançables chaque jour) | ✅ Écrit, **pas encore essayé avec une vraie clé** |
| **Gestion du Radar** par les curateurs | ✅ Fait |
| **Rôles** (élève, curateur, administrateur) et gestion de l'équipe | ✅ Fait |
| **Mesures d'usage** du pilote et statistiques | ✅ Fait |
| Limites de débit, garde-fous de production, configuration Render, tests en CI | ✅ Fait |
| Tests : 45 tests unitaires et 11 parcours de bout en bout | ✅ Passent |

### Application mobile : dossier `mobile/`

| Écran | État |
|---|---|
| Connexion par téléphone, création du profil en une question par écran | ✅ Fait |
| Accord parental (code du parent), avec rappel sur l'accueil et dans Scout | ✅ Fait |
| Test Mon ADN, résultat, accueil, Explorer, Scout, Radar, Profil | ✅ Fait |
| Modifier ses informations, se déconnecter, supprimer son compte | ✅ Fait |
| Espace curateur : tableau de bord, recherches IA, fiche, Radar, sources | ✅ Fait |
| 6 apparences, chacune en clair et en sombre | ✅ Fait |
| Lecture hors-ligne des dernières données chargées | ✅ Fait |

Le parcours complet a été vérifié dans un navigateur (version web), sans erreur : connexion, profil d'une élève mineure, accord du parent, test, Scout, modification du profil, publication d'une fiche par un curateur, puis suppression du compte. **Il n'a pas encore été testé sur un téléphone Android réel.**

Captures : [bienvenue](captures/bienvenue.png), [connexion](captures/connexion.png), [accord parental](captures/accord-parent.png), [accueil](captures/accueil.png), [accueil sombre](captures/accueil-sombre.png), [test](captures/test.png), [résultat](captures/resultat.png), [Scout](captures/scout.png), [opportunité](captures/opportunite.png), [anti-arnaque](captures/arnaque.png), [explorateur](captures/explorer.png), [métier](captures/metier.png), [Radar](captures/radar.png), [profil](captures/profil.png), [apparences](captures/apparence.png), [espace curateur](captures/curateur.png), [fiche](captures/curateur-fiche.png), [sources](captures/curateur-sources.png), [recherches IA](captures/curateur-recherches.png).

Les six apparences côte à côte : [en clair](captures/apparences-clair.png), [en sombre](captures/apparences-sombre.png).

### Ce qui manque encore avant d'ouvrir à de vrais élèves

| Point | Pourquoi c'est bloquant | Qui |
|---|---|---|
| **Fournisseur SMS ou WhatsApp** | Sans lui, aucun code n'est envoyé. L'API est prête : elle transmet chaque message à une adresse à configurer (`MESSAGERIE_WEBHOOK_URL`) | Fondateur (choix et compte), puis branchement |
| **Mise en ligne** de l'API et de la base | L'appli ne fonctionne qu'en local. `render.yaml` est prêt | Fondateur (compte et coût) |
| **Version Android** et test sur de vrais téléphones | Jamais testée hors navigateur. `eas.json` est prêt | Fondateur (comptes Expo et Google Play) |
| **Premier essai de l'IA** avec une clé | Le code n'a jamais appelé l'IA pour de vrai | Fondateur (clé d'API), puis réglages |
| **Avis d'un juriste** sur les données et l'accord parental | L'accord par code est un mécanisme simple ; sa validité légale en RDC n'est pas vérifiée | Fondateur |
| **Données réelles** : opportunités vérifiées, options officielles, calendrier | Les données de départ sont en partie estimées ou fictives | Curateur |

### Limites connues

- L'accord parental repose sur un code envoyé au numéro que l'élève indique : un élève peut donner un autre numéro que celui de son parent.
- Les règles anti-arnaque reconnaissent les arnaques classiques, pas toutes.
- Salaires des métiers non renseignés ; tendances des métiers estimées.
- Pas encore de notifications, de vidéos, de jeux ni de paiement.

## 2. Les prochains sprints

Un sprint dure deux semaines.

### Sprint 1 : prêt pour un vrai pilote (code terminé)

Le code du sprint 1 est fait. Il reste les actions du tableau « Ce qui manque encore », qui dépendent de comptes et de décisions.

**Objectif :** 3 écoles pilotes, 100 élèves qui utilisent l'appli.

### Sprint 2 : Scout devient vivant

| Tâche | Détail |
|---|---|
| Régler l'IA | Premier essai réel des 8 recherches : coût par recherche, part de pistes fiables, erreurs d'extraction ; ajustement des consignes |
| 20 sources officielles | Ajoutées et suivies dans l'espace curateur |
| Notifications | Push et WhatsApp : nouvelle opportunité, rappels à J-7 et J-2 |
| Suivi des candidatures | « Je postule », liste des documents, résultat |
| Opportunités futures | « Dans 2 ans tu pourras viser X » transformé en objectifs |
| Bot WhatsApp anti-arnaque | Transférer un message suspect, recevoir le verdict |

### Sprint 3 : la couche d'attraction

| Tâche | Détail |
|---|---|
| Fil vidéo | Vidéos natives et vidéos YouTube sélectionnées, étiquetées par métier |
| Programme ambassadeurs | Outil d'envoi de vidéos avec script guidé et modération |
| Quiz Exetat en duel | Défier un ami, classement par école |
| Séries quotidiennes et nouveaux badges | Raisons de revenir chaque jour |
| Premier simulateur de métier | Un mini-jeu complet pour valider le format |

### Sprint 4 : premiers revenus et écoles

| Tâche | Détail |
|---|---|
| Paiement Mobile Money | Premium et Pack Exetat |
| Tableau de bord école | Profils de la classe, options envisagées, opportunités pour l'école |
| Lien avec Ardoise | Import des notes avec accord des parents |
| Espace parents | Voir le profil de l'enfant, « conseil de famille » |
| Coach IA | Questions libres sur les métiers et les études, dans les limites des données Kesho |

### Sprints 5 et 6 : préparer « le Jour J » (résultats de l'Exetat 2027)

Kesho Exetat (annales, examens blancs), Plan B, campagnes des universités, émission radio, montée en charge.

## 3. Ce que le fondateur doit décider ou faire

Ces points ne peuvent pas être faits par le code.

| # | Action | Pourquoi | Urgence |
|---|---|---|---|
| 1 | **Valider le nom** et vérifier la marque (une ONG « Kesho Congo » existe à Bukavu) | Avant toute communication publique | Cette semaine |
| 2 | Choisir **3 écoles pilotes** parmi les clientes d'Ardoise | Sans élèves réels, on ne sait pas ce qui marche | Cette semaine |
| 3 | Confirmer la **liste officielle des options** des humanités et le **calendrier 2026-2027** | Les données de départ sont à valider | Sprint 1 |
| 4 | Créer le compte d'**hébergement** (Render par exemple) et valider le coût mensuel | Mise en ligne de l'API avec `render.yaml` | Cette semaine |
| 5 | Créer les comptes **Expo** et **Google Play** (25 $ une fois) | Construire et distribuer l'appli Android | Cette semaine |
| 6 | Choisir un **fournisseur de SMS ou WhatsApp** | Envoi des codes de connexion et d'accord parental | Cette semaine |
| 6 bis | Créer une **clé d'API Claude** | Analyse des annonces dans l'espace curateur | Sprint 2 |
| 7 | Recruter **1 curateur** (étudiant à temps partiel) | Vérifier les opportunités chaque jour | Sprint 2 |
| 8 | Recruter **10 ambassadeurs vidéastes** | Contenu du fil vidéo | Sprint 2 |
| 9 | Lancer les rendez-vous du **top 20 partenaires** ([PARTENAIRES.md](PARTENAIRES.md)) | Financement et distribution | En continu |
| 10 | Faire relire la **politique de données** par un juriste | Mineurs et données personnelles | Avant le pilote |

## 4. Comment lancer le projet sur un ordinateur

```bash
# 1. API
cd Process-bakend
npm install
cp .env.example .env
npm run db:deploy && npm run db:seed
ADMIN_TELEPHONES=+243812345678 npm run dev   # ton numéro devient administrateur ; http://localhost:3000/api/docs

# 2. Application
cd Process-/mobile
npm install
cp .env.example .env
npx expo start                   # « w » pour le navigateur, ou Expo Go sur téléphone
```

## 5. Indicateurs du pilote

| Indicateur | Cible à 4 semaines |
|---|---|
| Élèves inscrits | 100 |
| Test Mon ADN terminé | 70 % des inscrits |
| Élèves revenus la 2e semaine | 40 % |
| Opportunités ouvertes par élève | 3 |
| Messages vérifiés par l'anti-arnaque | 50 |
| Avis des préfets et des parents | 10 entretiens |
