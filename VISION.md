# KESHO — « Demain », en swahili

> **Ton avenir commence aujourd'hui.**
> Le compagnon qui accompagne chaque jeune africain, de l'école primaire jusqu'à son premier emploi — et au-delà.

*Nom de code du projet : **Process**. Nom commercial proposé : **Kesho** (voir §17 pour la vérification de marque).*

> **État du projet (novembre 2026)** : la première version fonctionne. L'API (`Process-bakend`) et l'application mobile (`mobile/`) couvrent le profil, le test Mon ADN, l'explorateur, le Radar et Scout avec son bouclier anti-arnaque. Le détail de ce qui est fait et de ce qui reste est dans [docs/PLAN-ACTION.md](docs/PLAN-ACTION.md).

---

## Sommaire

1. [Le problème](#1-le-problème)
2. [La mission](#2-la-mission)
3. [Pour qui](#3-pour-qui--les-personas)
4. [Le parcours en 5 saisons](#4-le-parcours-en-5-saisons)
5. [Les modules](#5-les-modules)
6. [La couche d'attraction : vidéos, jeux, social](#6-la-couche-dattraction)
7. [Kesho Scout : le chasseur d'opportunités](#7-kesho-scout)
8. [Fonctionnalités innovantes](#8-fonctionnalités-innovantes)
9. [Kesho Solidarité : personne n'est laissé de côté](#9-kesho-solidarité)
10. [Pensé pour le terrain africain](#10-pensé-pour-le-terrain-africain)
11. [Sécurité et éthique (mineurs)](#11-sécurité-et-éthique)
12. [Modèle économique](#12-modèle-économique)
13. [Concurrence](#13-concurrence)
14. [Partenaires](#14-partenaires)
15. [Architecture technique](#15-architecture-technique)
16. [Feuille de route et indicateurs](#16-feuille-de-route-et-indicateurs)
17. [Risques](#17-risques)
18. [Les 90 prochains jours](#18-les-90-prochains-jours)

Documents détaillés :

| Document | Contenu |
|---|---|
| [docs/SCOUT.md](docs/SCOUT.md) | Spécification du moteur d'opportunités |
| [docs/FLUX-VIDEO.md](docs/FLUX-VIDEO.md) | Intégration TikTok / YouTube / vidéos natives |
| [docs/SOLIDARITE.md](docs/SOLIDARITE.md) | Programme pour les enfants démunis |
| [docs/MODELE-ECONOMIQUE.md](docs/MODELE-ECONOMIQUE.md) | Revenus, prix, estimation mensuelle |
| [docs/CONCURRENCE.md](docs/CONCURRENCE.md) | Concurrents RDC, Afrique, monde |
| [docs/PARTENAIRES.md](docs/PARTENAIRES.md) | Liste des partenaires à démarcher, pitch par partenaire |
| [docs/PLAN-ACTION.md](docs/PLAN-ACTION.md) | Ce qui est construit, les prochains sprints, les décisions à prendre |

---

## 1. Le problème

- **Plus d'un million d'élèves** passent l'Examen d'État chaque année en RDC (1 079 341 candidats en 2025, 1 082 742 inscrits en 2026), et environ **2,35 millions** de finalistes passent l'ENAFEP en fin de primaire.
- Les deux grandes décisions — **le choix d'option en fin de 8e** et **le choix de filière après les humanités** — se prennent souvent *par défaut* : selon l'option du grand frère, la pression des parents, l'école la plus proche ou une rumeur.
- Très peu d'écoles ont un conseiller d'orientation actif. L'information sur les universités (frais, conditions, débouchés, calendrier) est **dispersée, orale, souvent fausse**.
- Les jeunes diplômés font face à un fort chômage : on forme beaucoup dans des filières saturées et trop peu dans les métiers qui recrutent.
- Les vraies opportunités (bourses, concours, programmes, stages) existent mais circulent mal — et les **arnaques aux fausses bourses** sont partout sur WhatsApp et Facebook.
- Pendant ce temps, l'attention des jeunes est captée par TikTok, YouTube, Facebook et WhatsApp (environ 30 % de la population est connectée et ce chiffre grimpe vite).

**Conclusion : le jeune congolais n'a pas un problème de talent. Il a un problème d'information, d'accompagnement et d'attention.**

## 2. La mission

> Donner à chaque jeune — riche ou pauvre, en ville ou au village — **la bonne information, au bon moment, sous une forme qu'il a envie de consommer**, et l'accompagner jusqu'à ce qu'il réussisse.

Trois promesses :
1. **Savoir** : connaître tous les métiers, toutes les filières, toutes les écoles, toutes les opportunités.
2. **Choisir** : décider selon ses talents et la réalité du marché, pas par défaut.
3. **Réussir** : être accompagné pas à pas — inscriptions, dossiers, examens, stages, emploi.

## 3. Pour qui : les personas

| Persona | Situation | Ce que Kesho lui apporte |
|---|---|---|
| **Grâce, 16 ans, Kinshasa** | 3e humanités scientifiques, smartphone, adore TikTok | Reels métiers, prépa Exetat, alertes bourses, comparateur d'universités |
| **Benjamin, 12 ans, Kananga** | 6e primaire, pas de smartphone, la famille partage un téléphone basique | Programme radio, SMS/USSD, sessions en classe animées par l'enseignant |
| **Maman Ruth, parent** | Veut que sa fille soit médecin, ne connaît pas les autres options | Espace parent en lingala, vidéos courtes, « conseil de famille » |
| **M. Kabeya, préfet d'école** | 900 élèves, aucun conseiller d'orientation | Tableau de bord d'orientation, contenus prêts à projeter, rapports |
| **Patrick, 23 ans, Lubumbashi** | Diplômé en gestion, sans emploi | Stages, offres, CV, formations courtes qui recrutent |
| **Tonton Jean, diaspora (Bruxelles)** | Paie la scolarité de 3 neveux | Abonnement Premium pour la famille, parrainage solidaire, suivi des progrès |
| **DRH d'une société minière** | Cherche des techniciens au Lualaba | Vivier de jeunes qualifiés et ciblés |
| **Université privée** | Veut remplir ses amphis avec de bons profils | Campagnes d'inscription ciblées, salons virtuels |

## 4. Le parcours en 5 saisons

| Saison | Âge / niveau | Objectif | Fonctions clés |
|---|---|---|---|
| 🌱 **Explorer** | 9-12 ans, primaire | Découvrir le monde des métiers, rêver grand | Avatar, mini-jeux « Je serai… », vidéos d'enfants qui rencontrent des pros, prépa ENAFEP |
| 🧭 **Choisir** | 12-14 ans, 7e-8e (éducation de base) | **Bien choisir son option des humanités** | Tests d'intérêts gamifiés, simulateurs de métiers, conseil de famille, visites d'écoles |
| 🎯 **Préparer** | 14-18 ans, humanités | Réussir l'Exetat et choisir sa filière | Prépa Exetat, comparateur d'universités, **Radar des inscriptions**, Scout (bourses, concours), dossier unique |
| 🎓 **Réussir** | 18-24 ans, université / ISP / ISTA / formation pro | Réussir ses études et préparer l'emploi | Suivi académique, stages, mentorat, petits boulots, certificats, logement étudiant |
| 🚀 **Décoller** | 21 ans et + | Premier emploi ou création d'entreprise | CV vivant, offres, entrepreneuriat, formation continue, réseau alumni |

Chaque saison débloque la suivante, comme dans un jeu. Le profil, l'XP et l'historique suivent le jeune toute sa vie.

## 5. Les modules

1. **🧬 Mon ADN** — profil évolutif : intérêts (modèle RIASEC), aptitudes mesurées dans les jeux, notes (import Ardoise avec accord des parents), valeurs, contraintes (budget, ville). Il se met à jour à chaque interaction.
2. **💼 Explorateur de métiers** — fiches métiers : description, journée type en vidéo, salaires réels en RDC, études nécessaires, **Indice Kesho d'employabilité** (demande, saturation, tendance 5-10 ans, niveau de confiance de la donnée).
3. **🏛️ Explorateur d'établissements** — toutes les universités, instituts supérieurs, ISP, ISTA, centres de formation professionnelle, écoles à l'étranger : filières, frais réels, conditions, taux de réussite, avis d'étudiants vérifiés, carte, comparateur.
4. **📡 Radar** — calendrier national et personnalisé : ENAFEP, Exetat, inscriptions, concours d'entrée, journées portes ouvertes, dates limites de bourses. Alertes push, SMS, WhatsApp.
5. **🗺️ Ma Roadmap** — plan de vie personnalisé découpé en **quêtes** (« Atteindre 70 % en maths », « Passer un test d'anglais », « Déposer ton dossier à l'UNILU avant le 15 »).
6. **🎯 Kesho Scout** — le chasseur d'opportunités (§7).
7. **🤖 Coach IA « Kesho »** — conseiller 24h/24, en **français, lingala, swahili, tshiluba, kikongo** et anglais, à l'écrit et à la voix. Il ne décide jamais à la place du jeune : il pose des questions, explique, propose.
8. **📚 Kesho Exetat** — annales, quiz, examens blancs chronométrés, **score prédit**, plan de révision intelligent.
9. **🤝 Mentorat** — professionnels et étudiants ambassadeurs vérifiés, sessions de groupe encadrées.
10. **💰 Bourses et financement** — bourses, prêts, épargne études, aides d'ONG, vérification d'éligibilité.
11. **📄 Kesho Pro** — CV vivant, offres d'emploi et de stage, entrepreneuriat, préparation aux entretiens.
12. **👨‍👩‍👧 Espaces Parents, Écoles, Conseillers, Partenaires** — un tableau de bord par type d'acteur.

## 6. La couche d'attraction

**Principe d'or : chaque minute « fun » doit faire avancer l'orientation.** Si une fonction divertit sans orienter, on ne la construit pas.

### 6.1 Le fil vidéo (« Kesho Reels »)
Un fil vertical façon TikTok, alimenté par **trois sources** (détails dans [docs/FLUX-VIDEO.md](docs/FLUX-VIDEO.md)) :
1. **Vidéos natives Kesho** — tournées par des pros, étudiants et ambassadeurs congolais. Légères, préchargées en Wi-Fi, visibles hors-ligne. C'est le cœur du fil.
2. **Vidéos YouTube et TikTok intégrées** — sélectionnées par nos curateurs et notre IA, lues via les lecteurs officiels (embed). Énorme catalogue gratuit, dans le respect des règles de ces plateformes.
3. **Créateurs connectés** — un créateur congolais connecte son compte TikTok/YouTube à Kesho et ses vidéos éducatives apparaissent dans le fil, avec son profil.

Chaque vidéo est **étiquetée** (métier, filière, compétence, niveau, langue). Chaque like, partage ou visionnage complet nourrit le profil ADN.

Formats phares : « Une journée avec… », « Combien je gagne ? », « Mon parcours en 60 s », « Ce qu'on ne te dit pas sur la médecine », « Erreurs d'inscription à éviter », « Battle de filières ».

### 6.2 Les jeux
- **Simulateurs de métiers** : « Sois chirurgien 5 minutes », « Gère une ferme à Kikwit », « Construis un pont », « Défends un client », « Lance ta boutique ». Ils mesurent discrètement logique, empathie, créativité, rigueur.
- **Quiz Exetat en duel** : défier un ami ou un élève d'une autre école.
- **Kesho League** : saisons nationales avec classements par école, commune, province. Finale télévisée possible.
- **Escape games éducatifs** : énigmes de maths, physique, histoire du Congo.

### 6.3 Gamification
- XP, niveaux, badges, séries quotidiennes, **avatar qui évolue vers son futur métier**.
- **Kesho Coins** échangeables contre des forfaits internet, des fournitures, des visites d'entreprises, des réductions chez des partenaires.
- **Squads** : petits groupes d'amis avec objectifs communs.
- **Lives** : questions-réponses avec des pros et des célébrités, salons d'orientation virtuels, portes ouvertes en direct.

## 7. Kesho Scout

Le moteur qui cherche en permanence **les opportunités adaptées à chaque élève** : bourses, concours, programmes, conférences, stages, formations, hackathons, emplois. Spécification complète : [docs/SCOUT.md](docs/SCOUT.md).

En résumé :
1. **Collecte** sur des milliers de sources (officielles, partenaires, web, réseaux sociaux, communauté).
2. **Compréhension** par IA : extraction des critères d'éligibilité, dates, documents.
3. **Vérification** : score de confiance, bouclier anti-arnaque, validation humaine des opportunités à fort enjeu.
4. **Association** : filtre d'éligibilité strict + score de pertinence + estimation des chances.
5. **Notification** claire : « ✅ tu remplis ces critères, ⚠️ il te manque ceci, 📅 date limite ».
6. **Accompagnement** jusqu'à la candidature : checklist, rappels, aide à la lettre de motivation, suivi du résultat.

Et ce qui le rend unique : les **opportunités futures** (« dans 2 ans tu pourras viser X, voici comment t'y préparer ») transformées en quêtes.

> Honnêteté : aucun système n'est infaillible. Scout affiche toujours son **niveau de confiance** et le **lien officiel**, et ne demande jamais d'argent au nom d'un organisme.

## 8. Fonctionnalités innovantes

### 8.1 Première série

Au-delà de ce qui précède, voici les idées qui peuvent faire de Kesho une référence mondiale :

| # | Fonction | Ce que c'est | Pourquoi c'est fort |
|---|---|---|---|
| 1 | **Moi dans 10 ans** | Le jeune choisit 2-3 parcours ; Kesho simule pour chacun : années d'études, coût total, salaire probable, ville, mode de vie. Avatar et récit générés. | Rend l'avenir concret et émotionnel |
| 2 | **Calculateur de rentabilité des études** | Coût total d'une filière vs revenu attendu, avec données réelles | Aide les familles à investir intelligemment |
| 3 | **Conseil de famille** | Espace partagé parent-enfant : chacun donne son avis, Kesho apporte les faits | Désamorce le « tu seras médecin » imposé |
| 4 | **Bulletin intelligent** | Import des notes (Ardoise et autres), détection des matières faibles, score Exetat prédit | Lien direct entre notes et rêves |
| 5 | **Passeport Kesho (dossier unique)** | Documents scannés une fois (bulletins, diplôme, pièce d'identité), réutilisés pour toutes les candidatures | Gain de temps énorme, moins d'erreurs |
| 6 | **Certificats vérifiables** | Badges, bénévolat, compétences, avec QR code vérifiable par un recruteur ou une université | Valorise ce que l'école ne note pas |
| 7 | **Kesho Campus** | Logement étudiant, colocation, transport, coût de la vie par ville universitaire | Le déménagement est un frein majeur |
| 8 | **Épargne études** | Avec une banque partenaire : les parents (ou la diaspora) épargnent petit à petit pour les frais universitaires | Résout le problème n°1 : l'argent |
| 9 | **Kesho Langues** | Micro-cours d'anglais (clé pour les bourses) en 5 min/jour | L'anglais ouvre 70 % des grandes bourses |
| 10 | **Bien-être** | Gestion du stress (Exetat), respiration, orientation vers des lignes d'écoute partenaires | Santé mentale des jeunes |
| 11 | **Mode Classe** | L'enseignant projette une séance d'orientation prête à l'emploi (vidéo + quiz + débat) | Touche les élèves sans smartphone |
| 12 | **Kesho Radio / TV** | Émission hebdomadaire d'orientation et de quiz sur radios partenaires | Notoriété + inclusion rurale |
| 13 | **Où sont-ils maintenant ?** | Suivi des anciens élèves par filière : combien travaillent, où, à quel salaire | Données uniques au monde pour la RDC |
| 14 | **Bouclier anti-arnaque** | Vérifier n'importe quel message de « bourse » ou de « visa » reçu sur WhatsApp | Protège les familles, viralité forte |
| 15 | **Olympiades Kesho** | Concours national (maths, sciences, entrepreneuriat, code) avec prix des sponsors | Événement médiatique annuel |
| 16 | **Kesho Business** | Simulateur d'entreprise + parcours entrepreneur + lien vers incubateurs | L'auto-emploi est une réalité |
| 17 | **Petits boulots étudiants** | Missions courtes vérifiées (tutorat, saisie, événements, livraison) | Revenu pour les étudiants |
| 18 | **Mode accessibilité** | Voix, gros caractères, vidéos en langue des signes, sous-titres | Inclusion des jeunes handicapés |
| 19 | **Bot WhatsApp Kesho** | Toutes les fonctions clés par WhatsApp : alertes, questions au coach, vérification d'arnaques | WhatsApp est l'appli n°1 |
| 20 | **USSD / SMS** | `*XXX#` : dates d'examens, résultats, alertes, sans internet | Inclusion totale |
| 21 | **Carte des opportunités** | Événements, salons, ateliers près de chez soi | Opportunités physiques |
| 22 | **Mur des réussites** | Histoires vraies : « 37 élèves de ta province ont obtenu une bourse via Kesho » | Motivation + marketing |
| 23 | **Kesho Diaspora** | Un parent à l'étranger paie l'abonnement, suit les progrès, parraine | Pouvoir d'achat de la diaspora |
| 24 | **Tutorat solidaire** | Les grands aident les petits (révisions), gagnent XP et certificat de bénévolat | Entraide + valorisation |

### 8.2 Nouvelles idées (version 2)

Les idées ci-dessous renforcent trois choses : **l'acquisition** (comment les jeunes arrivent), **la rétention** (pourquoi ils restent) et **l'inclusion** (ceux qui n'ont ni argent ni université en vue).

| # | Idée | Ce que c'est | Pourquoi c'est fort |
|---|---|---|---|
| 25 | **Le Jour J (résultats de l'Exetat)** | Le jour de la publication, chaque finaliste reçoit un plan personnel : « Avec ton pourcentage et ton profil, voici 5 filières, les écoles près de chez toi et les inscriptions ouvertes. » | C'est le jour où un million de jeunes cherchent quoi faire. Le meilleur moment d'acquisition de l'année |
| 26 | **Plan B** | Des parcours pour ceux qui échouent à l'Exetat ou ne peuvent pas payer l'université : formation professionnelle courte, apprentissage, repasser l'examen, auto-emploi | La majorité des jeunes est dans ce cas. Personne ne leur parle |
| 27 | **Tontine études (likelemba)** | Un groupe de parents ou d'amis cotise chaque mois par Mobile Money pour les frais d'études, avec un objectif et un suivi | S'appuie sur une pratique déjà connue de toutes les familles |
| 28 | **Clubs Kesho** | Un club d'orientation dans chaque école, animé par des élèves, avec un kit d'activités mensuel et des défis inter-écoles | Distribution par les élèves eux-mêmes, sans coût marketing |
| 29 | **Agents Kesho** | Des étudiants ambassadeurs rémunérés à la commission : ils présentent Kesho dans les écoles et aident les familles à s'abonner | Emploi étudiant + force de vente sur le terrain |
| 30 | **Vis ma vie** | Une journée d'observation en entreprise, à l'hôpital, au tribunal ou sur un chantier, réservée dans l'appli | Rien ne remplace le fait de voir un métier en vrai |
| 31 | **Répétiteurs vérifiés** | Mise en relation avec des répétiteurs et étudiants notés, paiement par Mobile Money, commission pour Kesho | Besoin massif avant l'Exetat, revenu récurrent |
| 32 | **Kesho Kids** | Pour le primaire : histoires audio et mini-jeux sur les métiers, à faire avec un parent, 10 minutes par jour | Crée l'habitude tôt et rassure les parents |
| 33 | **Défi 21 jours** | Avant un examen : une mission par jour (révision, sommeil, organisation), en équipe | Série quotidienne avec un vrai but |
| 34 | **Baromètre des métiers** | Chaque trimestre : les 10 métiers qui recrutent, les 10 filières saturées, par province | Contenu repris par les médias, crédibilité auprès de l'État |
| 35 | **Carte Kesho** | Une carte élève ou étudiant (numérique, QR code) qui donne des réductions : transport, cybercafés, librairies, data | Avantage concret chaque semaine, même sans opportunité en cours |
| 36 | **Kesho Connect** | Une interface pour que les logiciels de gestion scolaire (Ardoise d'abord) envoient les notes et reçoivent les recommandations | Fait de Kesho la couche d'orientation de tous les logiciels scolaires |

**Les trois paris à tenir en priorité :**
1. **Le Jour J** comme moment de lancement national (préparer la session 2027).
2. **Scout + anti-arnaque** comme raison de revenir chaque semaine.
3. **Plan B** comme preuve que Kesho sert tous les jeunes, pas seulement les futurs universitaires.

## 9. Kesho Solidarité

Kesho doit servir **aussi** les enfants qui n'ont rien : enfants en situation de rue, orphelins, déplacés de l'Est, filles déscolarisées, enfants handicapés, zones rurales sans réseau. Détails : [docs/SOLIDARITE.md](docs/SOLIDARITE.md).

Les piliers :
1. **1 Premium acheté = 1 accès offert** à un élève démuni.
2. **Parrainage** (diaspora, entreprises, églises) : frais scolaires, kit scolaire, Premium — avec suivi transparent et **sans contact direct** donateur-enfant.
3. **Kesho Coins solidaires** : les élèves peuvent donner leurs coins à un fonds.
4. **Fonds de bourses Kesho** : une part fixe des bénéfices finance des bourses.
5. **Kesho hors-ligne** : radio, SMS/USSD, tablettes partagées dans des « Points Kesho » (paroisses, centres communautaires, camps).
6. **Téléphones recyclés** collectés auprès de la diaspora et des entreprises.
7. **Programmes ciblés** : *Kesho Elles* (filles et sciences), enfants des camps de déplacés, enfants en situation de rue avec des ONG spécialisées.
8. **Tableau d'impact public** : chaque dollar donné est traçable.

## 10. Pensé pour le terrain africain

- **Android d'entrée de gamme** : application légère (< 30 Mo), fonctionne sur 2 Go de RAM.
- **Hors-ligne d'abord** : contenus préchargés en Wi-Fi, synchronisation quand le réseau revient.
- **Économie de data** : vidéos compressées, mode « data minimum », zéro-rating négocié avec les opérateurs.
- **Langues nationales** : lingala, swahili, tshiluba, kikongo + français + anglais.
- **Paiement mobile** : M-Pesa, Orange Money, Airtel Money, Afrimoney, cartes pour la diaspora.
- **Multicanal** : appli, WhatsApp, SMS, USSD, radio, papier (fiches à imprimer pour les écoles).
- **Connexion instable** : chaque action fonctionne hors-ligne puis se synchronise.

## 11. Sécurité et éthique

Kesho touche des mineurs : c'est **non négociable**.

- **Consentement parental** pour les moins de 18 ans (via l'école ou par SMS).
- **Aucune messagerie privée** entre un mineur et un adulte non vérifié. Le mentorat se fait en groupe, enregistré et modéré.
- **Modération** de toutes les vidéos et commentaires (IA + humains). Tolérance zéro.
- **Temps d'écran raisonnable** : pas de défilement infini la nuit pour les mineurs, rappels de pause, pas de mécanismes manipulateurs.
- **Données** : jamais vendues. Les partenaires reçoivent des statistiques agrégées et anonymes, jamais de profils individuels sans consentement explicite.
- **Neutralité** : un établissement qui paie n'est jamais mieux classé dans les recommandations. Tout contenu payé est marqué « Sponsorisé ».
- **Transparence de l'IA** : le jeune sait toujours pourquoi on lui recommande quelque chose.
- Conformité à la loi congolaise sur la protection des données et aux règles des plateformes (Google, TikTok, Meta).

## 12. Modèle économique

L'élève paie peu ou rien ; **les organisations paient**. Détails et estimation mensuelle : [docs/MODELE-ECONOMIQUE.md](docs/MODELE-ECONOMIQUE.md).

Sources de revenus : abonnements écoles (via Ardoise), Premium élève et Pack Exetat, Kesho Diaspora, campagnes universités, salons d'orientation, opportunités sponsorisées, recrutement, partenariats télécoms, marques (Kesho Coins), épargne études (commission bancaire), formations certifiantes, bailleurs institutionnels, observatoire de l'emploi des jeunes, licence dans d'autres pays.

## 13. Concurrence

Résumé ([docs/CONCURRENCE.md](docs/CONCURRENCE.md)) : en RDC, **Lobinayo** est le concurrent le plus direct (orientation, tests, annuaire, mentorat). Les autres edtech congolaises (Schoolap, Shule System, Eteyelo, Chers Parents…) font surtout de la gestion scolaire ou des contenus de cours. En Afrique et dans le monde, beaucoup font **une partie** de Kesho (orientation, bourses, emploi), mais **personne ne combine** vidéo courte + jeux + moteur d'opportunités personnalisé + programme congolais + hors-ligne + solidarité.

## 14. Partenaires

Plus de 200 partenaires identifiés, classés par catégorie, avec la fonction à viser, leur intérêt et le pitch : [docs/PARTENAIRES.md](docs/PARTENAIRES.md).

## 15. Architecture technique

| Couche | Choix | Pourquoi |
|---|---|---|
| App mobile | **React Native (Expo)**, Android d'abord | Un seul code Android/iOS, mises à jour rapides |
| Stockage hors-ligne | SQLite + file de synchronisation | Fonctionne sans réseau |
| Web (écoles, parents, partenaires, admin) | **Next.js** | Tableaux de bord |
| API (`process-bakend`) | **NestJS (TypeScript)** | Structuré, modulaire, même langage que le front |
| Base de données | **PostgreSQL** (Supabase possible au départ) + recherche (Meilisearch/Postgres FTS) | Fiable, relationnel |
| Cache / files | Redis + BullMQ | Notifications, collectes Scout |
| Vidéo | Mux ou Cloudflare Stream (natif), lecteurs officiels YouTube/TikTok (embed) | Transcodage léger, CDN |
| IA | LLM (coach, extraction Scout, résumés) + moteur de recommandation maison | Personnalisation |
| Collecte Scout | Workers de collecte (flux RSS, API, pages officielles), API de recherche web | Opportunités |
| Notifications | FCM (push), passerelle SMS, WhatsApp Business API, USSD via agrégateur | Multicanal |
| Paiement | Agrégateur Mobile Money + cartes | Local + diaspora |
| Observabilité | Sentry, logs, métriques | Qualité |

Entités principales : `Utilisateur`, `ProfilADN`, `Ecole`, `Classe`, `Parent`, `Metier`, `Filiere`, `Etablissement`, `Programme`, `Evenement` (Radar), `Opportunite`, `CritereEligibilite`, `Candidature`, `Quete`, `Video`, `Createur`, `Jeu`, `Partie`, `Defi`, `Badge`, `Transaction` (Coins/paiements), `Parrainage`, `Partenaire`.

## 16. Feuille de route et indicateurs

| Phase | Durée | Contenu | Indicateur de réussite |
|---|---|---|---|
| **0. Cadrage** | 4-6 semaines | Enquête terrain (élèves, parents, préfets), collecte données (universités de Kinshasa, 200 métiers, calendrier), maquettes, marque | 50 entretiens, 3 écoles pilotes signées |
| **1. MVP** | 3 mois | Profil ADN + test gamifié, explorateurs métiers/universités (Kinshasa), Reels (natif + YouTube), Radar, XP/badges, bot WhatsApp | 10 écoles, 5 000 élèves, 40 % actifs chaque semaine |
| **2. Engagement** | 3-6 mois | Coach IA, simulateurs, Kesho League, Scout v1, Kesho Exetat, espace parents, Premium | 50 000 élèves, premiers revenus |
| **3. Carrière** | 6-12 mois | Stages/emplois, mentorat, Kesho Coins, Solidarité, Lubumbashi/Goma/Bukavu/Kisangani | 200 000 élèves, 100 partenaires |
| **4. Échelle** | 12-24 mois | Toutes les provinces, USSD/radio, observatoire, Afrique francophone | 1 million de jeunes |

**Indicateur roi** : le nombre de jeunes qui ont **obtenu quelque chose de concret** grâce à Kesho (une bonne orientation, une inscription, une bourse, un stage, un emploi). On le mesure dès le premier jour.

Autres indicateurs : utilisateurs actifs hebdomadaires, rétention à 30 jours, quêtes terminées, candidatures déposées via Scout, taux de réussite Exetat des utilisateurs, satisfaction des écoles, revenus par école.

## 17. Risques

| Risque | Parade |
|---|---|
| Données d'emploi rares ou fausses | Plusieurs sources, suivi des anciens, niveau de confiance affiché |
| Production de vidéos insuffisante | Programme ambassadeurs, créateurs connectés, intégration YouTube/TikTok |
| Faible pouvoir d'achat | Modèle B2B/B2G, diaspora, sponsors |
| Connexion faible | Hors-ligne, SMS, USSD, radio |
| Arnaques et contenus inadaptés | Vérification, modération, bouclier anti-arnaque |
| Copie par un concurrent | Vitesse, données exclusives, réseau Ardoise, marque |
| Dépendance aux règles TikTok/YouTube | Le cœur du fil reste en vidéos natives |
| **Nom « Kesho »** : une ONG « Kesho Congo » (nutrition infantile, Bukavu) existe déjà | Vérifier la disponibilité de la marque auprès de l'office de propriété industrielle de RDC, déposer tôt ; variantes possibles : *Kesho App*, *MyKesho*, *Kesho Academy*. Alternatives : *Boussole*, *Trajectoire* |

## 18. Les 90 prochains jours

Le plan détaillé, sprint par sprint, avec ce qui est déjà construit et les décisions à prendre, est dans [docs/PLAN-ACTION.md](docs/PLAN-ACTION.md).
