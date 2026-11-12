# Kesho Scout — le chasseur d'opportunités

> Trouver, vérifier et apporter à chaque jeune **les opportunités pour lesquelles il est éligible**, puis l'accompagner jusqu'à la candidature.

Retour à la [vision](../VISION.md).

---

## 1. Ce que Scout cherche

| Type | Exemples |
|---|---|
| Bourses | Bourses d'études nationales, universitaires, internationales, bourses d'excellence, d'ONG, d'églises, d'entreprises |
| Admissions | Ouvertures d'inscriptions, concours d'entrée, journées portes ouvertes |
| Concours et compétitions | Olympiades, concours d'éloquence, hackathons, concours d'entrepreneuriat, prix d'innovation |
| Programmes | Leadership jeunesse, camps d'été, échanges, programmes de mentorat, incubateurs |
| Formations | Formations courtes certifiantes, MOOC gratuits, formations professionnelles, bootcamps numériques |
| Événements | Conférences, salons d'orientation, ateliers, forums emploi |
| Emploi | Stages, emplois jeunes diplômés, petits boulots étudiants, volontariat |
| Aides | Kits scolaires, prise en charge de frais, aides aux déplacés et aux vulnérables |

## 2. Architecture en 6 étapes

```
 SOURCES ──► COLLECTE ──► EXTRACTION IA ──► VÉRIFICATION ──► MATCHING ──► NOTIFICATION ──► ACCOMPAGNEMENT
   │                                             │                │                               │
   └──── registre de sources + score ◄───────────┘                └──── retours / résultats ◄─────┘
```

### Étape 1 — Collecte

| Canal | Méthode | Fréquence | Fiabilité |
|---|---|---|---|
| **Partenaires** (universités, ONG, entreprises) | Publication directe dans le portail partenaire Kesho | Temps réel | ★★★★★ |
| **Sources officielles suivies** (ministères, ambassades, programmes de bourses, universités) | Flux RSS, API publiques, surveillance de pages (détection de changement) | 1 à 4 fois par jour | ★★★★☆ |
| **Agrégateurs connus** (sites de bourses et d'opportunités africains) | Flux et pages publiques, en respectant leurs conditions ; remonter à la source officielle | Quotidien | ★★★☆☆ (vérifier la source) |
| **Recherche web automatisée** | API de moteur de recherche, requêtes générées par profil type (« bourse master Afrique francophone 2027 », « hackathon jeunes Goma »…) | Quotidien | ★★☆☆☆ (vérification obligatoire) |
| **Réseaux sociaux publics** | Pages officielles d'organismes (via API quand disponible) | Quotidien | ★★☆☆☆ |
| **Communauté** | Un élève, parent ou enseignant soumet un lien ou une capture | Temps réel | ★☆☆☆☆ (vérification obligatoire) |

Règles : respect des fichiers `robots.txt` et des conditions d'utilisation, identification claire du robot, fréquence raisonnable, priorité aux API et aux partenariats.

**Registre de sources** : chaque source a un score de fiabilité qui évolue (taux d'opportunités confirmées, taux d'arnaques, fraîcheur).

### Étape 2 — Extraction (compréhension par IA)

Chaque page est transformée en fiche structurée :

```json
{
  "titre": "Bourse Excellence Sciences 2027",
  "organisme": "Fondation X",
  "type": "bourse",
  "url_officielle": "https://…",
  "pays_cibles": ["CD"],
  "lieu": "Kinshasa | en ligne | étranger",
  "date_limite": "2027-03-15",
  "date_evenement": null,
  "cout_pour_le_candidat": 0,
  "avantages": ["frais de scolarité", "allocation mensuelle"],
  "criteres": {
    "age_min": 16, "age_max": 19,
    "niveaux": ["humanites_5", "humanites_6"],
    "sections": ["scientifique"],
    "moyenne_min": 65,
    "sexe": null,
    "nationalites": ["CD"],
    "langues": ["fr"],
    "autres": ["lettre de recommandation"]
  },
  "documents": ["bulletin", "lettre de motivation", "recommandation"],
  "langue_annonce": "fr",
  "extrait_source": "…texte d'origine…"
}
```

- L'IA doit **citer le passage source** pour chaque critère : pas de critère inventé.
- Les champs incertains sont marqués `incertain` et poussés en relecture humaine.

### Étape 3 — Vérification (bouclier anti-arnaque)

**Score de confiance (0-100 %)** calculé à partir de :

| Signal | Effet |
|---|---|
| Domaine officiel connu (.gouv, université, organisme répertorié) | ++ |
| Opportunité confirmée par plusieurs sources indépendantes | ++ |
| Organisme déjà vérifié par Kesho dans le passé | ++ |
| Publiée par un partenaire contractuel | +++ |
| Demande de paiement pour « frais de dossier » ou « frais de visa » à un particulier | ---- (alerte rouge) |
| Contact uniquement par WhatsApp ou Gmail, sans site officiel | --- |
| Promesse irréaliste (« bourse 100 % garantie », « visa en 48 h ») | --- |
| Domaine récent, imitant un organisme connu | ---- |
| Date limite déjà passée ou incohérente | élimination |

Niveaux d'affichage :
- **≥ 90 %** « Vérifiée par Kesho » (badge vert) ;
- **70-89 %** affichée avec mention « vérifie sur le site officiel » ;
- **< 70 %** jamais envoyée aux élèves, uniquement aux curateurs ;
- **Opportunités à fort enjeu** (études à l'étranger, montants importants) : **validation humaine obligatoire**.

Autres traitements : dédoublonnage (même opportunité sur 10 sites), **re-vérification automatique** avant la date limite (annulation, changement de date), signalement par les utilisateurs.

### Étape 4 — Matching (association élève ↔ opportunité)

1. **Filtre dur (éligibilité)** : âge, niveau, section, nationalité, moyenne, langue, sexe si exigé, lieu. Un seul critère obligatoire manquant → l'opportunité n'est pas proposée comme « éligible » (mais peut alimenter « Presque éligible »).
2. **Score de pertinence** : proximité avec le profil ADN, les métiers visés, la Roadmap, les vidéos regardées, le budget, la distance.
3. **Score de chances** : estimation à partir des résultats d'élèves aux profils similaires (une fois les données disponibles), du niveau de sélectivité et de la qualité du profil.
4. **Urgence** : la date limite pèse dans le classement.
5. **Diversité** : on évite d'envoyer 10 bourses identiques ; on varie les types.

Le profil élève **ne quitte jamais Kesho** : le calcul est fait en interne.

### Étape 5 — Notification

```
🔔 Opportunité pour toi, Grâce !
Bourse Excellence Sciences 2027 — Fondation X
✅ Âge 16-19 ans (tu as 17 ans)
✅ Section scientifique
✅ Moyenne ≥ 65 % (tu as 72 %)
⚠️ Lettre de recommandation : à obtenir
📅 Date limite : dans 18 jours
🛡️ Vérifiée par Kesho — confiance 96 %
[Je postule]   [Pas pour moi]   [Partager]
```

- Canaux : appli, WhatsApp, SMS (version courte), e-mail ; copie aux parents pour les mineurs (paramétrable).
- **Limite anti-spam** : maximum 3 alertes par semaine sauf urgence, résumé hebdomadaire « Tes opportunités de la semaine ».
- Explication : « Pourquoi je reçois ça ? » toujours accessible.

### Étape 6 — Accompagnement jusqu'à la candidature

- **Checklist** automatique des documents, avec ce qui est déjà dans le **Passeport Kesho**.
- **Rappels** J-14, J-7, J-2, J-0.
- **Aide à la rédaction** : le coach IA aide à structurer la lettre de motivation (il guide, il ne rédige pas tout à la place du jeune).
- **Préremplissage** des formulaires partenaires depuis le profil.
- **Suivi** : postulé → en attente → retenu / refusé. Chaque résultat améliore le score de chances.
- **Célébration** : un succès = badge + histoire (avec accord) sur le Mur des réussites.

## 3. Les extensions qui rendent Scout unique

| Fonction | Description |
|---|---|
| **Opportunités futures** | « Dans 2 ans, tu pourras viser la bourse X. Il te faut 70 % en maths et un test d'anglais. » → quêtes dans la Roadmap |
| **Presque éligible** | « Tu remplis 4 critères sur 5 : voici comment obtenir le 5e » |
| **Opportunités de groupe** | Concours inter-écoles et hackathons proposés à l'école ou à une Squad |
| **Carte des opportunités** | Événements physiques autour de soi |
| **Fiabilité des organismes** | Historique : qui paie vraiment ses bourses, qui tient ses promesses |
| **Vérificateur d'arnaque** | L'utilisateur colle un message suspect reçu sur WhatsApp : Scout répond en quelques secondes |
| **Calendrier annuel des grandes bourses** | Les grandes bourses reviennent chaque année : Scout prévient *avant* l'ouverture |
| **Scout pour les écoles** | Le préfet reçoit les opportunités pour ses classes (concours, olympiades) |

## 4. Indicateurs de qualité

- **Précision** : part des opportunités envoyées qui sont réelles et éligibles (objectif ≥ 98 %).
- **Couverture** : part des opportunités pertinentes connues que Scout a trouvées (audit mensuel par les curateurs).
- **Fraîcheur** : délai entre publication et notification (objectif < 24 h pour les sources officielles).
- **Conversion** : notifications → candidatures → succès.
- **Arnaques laissées passer** : objectif zéro ; chaque cas analysé.

## 5. Prototype (première brique technique)

Objectif : une démo montrable aux écoles et partenaires en 4-6 semaines.

1. Registre de **10-20 sources fiables** (sites de bourses officiels, universités, organismes).
2. Collecteur planifié + détection de nouveautés.
3. Extraction IA vers le schéma JSON ci-dessus, avec citation du texte source.
4. Score de confiance simple (règles).
5. 20 profils d'élèves fictifs ; matching filtre dur + score de pertinence.
6. Tableau de bord curateur + envoi de notifications de test (WhatsApp/e-mail).

Modules backend (`process-bakend`) : `scout-sources`, `scout-collector`, `scout-extractor`, `scout-verifier`, `scout-matcher`, `scout-notifier`, `applications`.
