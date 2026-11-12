# Plan d'action

Retour à la [vision](../VISION.md).

Ce document dit **ce qui est construit**, **ce qui vient ensuite** et **ce que le fondateur doit décider ou faire lui-même**.

## 1. Ce qui est construit (sprint 0, terminé)

### API : dépôt `Process-bakend`

| Brique | État |
|---|---|
| Catalogue : 45 métiers, 17 options des humanités, 28 établissements | ✅ Fait |
| Test d'intérêts RIASEC (30 questions) et recommandations de métiers et d'options | ✅ Fait |
| Profils élèves, XP, badge | ✅ Fait |
| Scout : éligibilité critère par critère, « presque éligible », score de confiance, classement | ✅ Fait |
| Bouclier anti-arnaque (vérification d'un message collé) | ✅ Fait |
| Signalement d'une opportunité par la communauté (mise en revue, jamais publiée automatiquement) | ✅ Fait |
| Radar : calendrier filtré par classe et province | ✅ Fait |
| Tests : 28 tests unitaires et 8 tests de bout en bout | ✅ Passent |
| Documentation interactive de l'API (`/api/docs`) | ✅ Fait |

### Application mobile : dossier `mobile/`

| Écran | État |
|---|---|
| Création du profil, test Mon ADN, résultat | ✅ Fait |
| Accueil, Explorer, Scout, Radar, Profil | ✅ Fait |
| Fiches métier et opportunité | ✅ Fait |
| Lecture hors-ligne des dernières données chargées | ✅ Fait |
| Design refait : icônes, polices, moins de texte | ✅ Fait |
| 6 apparences au choix, chacune en clair et en sombre | ✅ Fait |

Le parcours complet a été vérifié dans un navigateur (version web de l'application), sans erreur. **Il n'a pas encore été testé sur un téléphone Android réel.**

Captures : [accueil](captures/accueil.png), [accueil sombre](captures/accueil-sombre.png), [test](captures/test.png), [résultat](captures/resultat.png), [Scout](captures/scout.png), [opportunité](captures/opportunite.png), [anti-arnaque](captures/arnaque.png), [explorateur](captures/explorer.png), [métier](captures/metier.png), [Radar](captures/radar.png), [profil](captures/profil.png), [choix d'apparence](captures/apparence.png).

Les six apparences côte à côte : [en clair](captures/apparences-clair.png), [en sombre](captures/apparences-sombre.png).

### Limites connues de cette version

| Limite | Conséquence | Quand la lever |
|---|---|---|
| **Pas de connexion sécurisée** : l'identifiant d'un élève suffit pour lire et modifier son profil | Ne pas ouvrir à de vrais élèves en l'état | Sprint 1 |
| Pas de consentement parental | Idem | Sprint 1 |
| Données de départ en partie estimées : tendances des métiers, nomenclature des options, dates du Radar | Affichées comme « estimées » ou « à confirmer » dans l'appli | Sprint 1 (collecte terrain) |
| Salaires des métiers non renseignés | Champ vide, volontairement | Sprint 2 (enquête) |
| Opportunités : 8 programmes réels sans date (critères indicatifs) et 9 exemples fictifs marqués « Exemple » | Scout démontre le moteur, pas encore un vrai flux | Sprint 2 |
| Pas de collecte automatique, pas de notifications, pas de vidéos, pas de paiement | Fonctions absentes | Sprints 2 à 4 |
| API non hébergée | Fonctionne en local seulement | Sprint 1 |

## 2. Les prochains sprints

Un sprint dure deux semaines.

### Sprint 1 : prêt pour un vrai pilote

| Tâche | Détail |
|---|---|
| Connexion par numéro de téléphone | Code reçu par SMS ou WhatsApp, jeton de session, chaque élève n'accède qu'à son profil |
| Consentement parental | Numéro du parent, message de validation, mention claire des données collectées |
| Hébergement | API et base de données en ligne, sauvegardes, surveillance des erreurs |
| Version Android installable | Construction avec EAS, test sur 3 téléphones d'entrée de gamme |
| Interface des curateurs | Ajouter, corriger et publier les opportunités et les dates du Radar sans toucher au code |
| Données réelles | Remplacer les exemples par 30 opportunités vérifiées ; confirmer les options et le calendrier |
| Modifier son profil dans l'appli | Compléter moyenne, date de naissance, langues |
| Mesure | Compter les inscriptions, tests terminés, opportunités ouvertes |

**Objectif de fin de sprint :** 3 écoles pilotes, 100 élèves qui utilisent l'appli.

### Sprint 2 : Scout devient vivant

| Tâche | Détail |
|---|---|
| Collecte automatique | 20 sources officielles surveillées chaque jour |
| Extraction par IA | Chaque annonce devient une fiche avec ses critères, relue par un curateur |
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
| 4 | Choisir l'**hébergement** (par exemple Render pour l'API et Supabase pour la base de données) et valider le coût mensuel | Mise en ligne de l'API | Sprint 1 |
| 5 | Créer les comptes **Expo** et **Google Play** (25 $ une fois) | Distribuer l'appli Android | Sprint 1 |
| 6 | Choisir un **fournisseur de SMS ou WhatsApp** pour les codes de connexion | Connexion par téléphone | Sprint 1 |
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
npm run dev                      # http://localhost:3000/api/docs

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
