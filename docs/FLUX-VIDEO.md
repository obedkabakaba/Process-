# Flux vidéo : TikTok, YouTube et vidéos natives

Retour à la [vision](../VISION.md).

## La question : peut-on mettre les vidéos TikTok et YouTube dans Kesho ?

**Oui, mais dans le respect des règles de ces plateformes.** Concrètement :

| Ce qu'on PEUT faire | Ce qu'on NE PEUT PAS faire |
|---|---|
| Intégrer une vidéo YouTube avec le **lecteur officiel** (IFrame / embed), y compris dans une appli mobile | Télécharger la vidéo et la ré-héberger sur nos serveurs |
| Utiliser l'**API YouTube Data** pour chercher des vidéos, lire titres, descriptions, durées, et construire des playlists | Retirer les publicités YouTube, masquer le lecteur ou ses contrôles |
| Intégrer une vidéo TikTok publique via l'**embed / oEmbed officiel** de TikTok, à partir de son lien | Aspirer massivement TikTok ou utiliser l'API de recherche réservée aux chercheurs pour un produit commercial |
| Permettre à un **créateur de connecter son propre compte TikTok** (Display API, avec son autorisation) pour afficher ses vidéos dans Kesho | Afficher les vidéos d'un créateur sans respecter ses paramètres (vidéo supprimée = vidéo retirée chez nous) |
| Lancer une vidéo en lecture automatique uniquement quand le lecteur est visible à l'écran (règle YouTube) | Lancer la lecture automatique hors de l'écran |

> Les règles de ces plateformes évoluent souvent. Avant la mise en production, relire les conditions du service API YouTube (« Required Minimum Functionality », « Developer Policies ») et les conditions développeur de TikTok, puis faire valider l'usage par écrit si besoin.

Point d'attention : les vidéos **« conçues pour les enfants »** sur YouTube ont des règles particulières (données, publicité). Kesho doit les détecter et les traiter en conséquence.

## La stratégie en 3 couches

### Couche 1 — Vidéos natives Kesho (le cœur, 50-60 % du fil à terme)
- Tournées par des **ambassadeurs** : professionnels congolais, étudiants, anciens élèves, enseignants.
- Formats courts (15-90 s), verticaux, sous-titrés, en français et langues nationales.
- **Compressées et préchargées en Wi-Fi**, visibles hors-ligne. Indispensable vu le coût de la data.
- Pas de dépendance aux règles d'une plateforme tierce, données d'engagement complètes.
- Outil de tournage intégré : l'ambassadeur filme avec un **script guidé** (« Présente ton métier en 3 points »), Kesho modère puis publie.

### Couche 2 — YouTube et TikTok sélectionnés (le catalogue, surtout au lancement)
- **Curateurs + IA** sélectionnent les meilleures vidéos : métiers, conseils d'études, révisions (maths, physique), parcours inspirants, bourses expliquées, conseils d'entretien.
- Chaque vidéo est **étiquetée** (métier, filière, niveau, langue, durée) et contrôlée (pas de contenu inadapté).
- Lecture via les lecteurs officiels. Au début, ce sont elles qui rempliront le fil pendant que la couche 1 grandit.
- **Attention à la data** : ces vidéos sont lues en streaming depuis YouTube/TikTok, sans préchargement possible. On les place surtout dans « Découvrir plus » et on prévient l'utilisateur en mode « économie de data ».

### Couche 3 — Créateurs connectés
- Programme **« Créateurs Kesho »** : les créateurs TikTok/YouTube congolais et africains qui font du contenu éducatif ou métier connectent leur compte.
- Leurs vidéos apparaissent avec leur profil ; ils gagnent en visibilité, badges, invitations aux événements, et à terme une **rémunération** (fonds créateurs financé par les sponsors).
- Kesho devient la vitrine des meilleurs créateurs éducatifs du pays.

## Le fil, intelligemment construit

- **Algorithme** : mélange de vidéos alignées sur le profil (70 %), de découverte (20 %, pour élargir les horizons) et de contenus de la saison (10 % : Exetat en mai-juin, inscriptions en août-octobre).
- **Chaque vidéo a un « bouton action »** : « Voir le métier », « Ajouter à ma Roadmap », « Voir les écoles », « Opportunités liées ». C'est ce qui transforme le divertissement en orientation.
- **Quiz éclair** après certaines vidéos (« Quel est le salaire moyen d'un ingénieur ? ») qui rapportent de l'XP.
- **Signaux pour le profil** : visionnage complet, revisionnage, partage, sauvegarde, action déclenchée.
- **Bien-être** : pas de défilement infini la nuit pour les mineurs, pause proposée après 20 minutes.

## Formats vidéo phares

| Format | Exemple |
|---|---|
| Une journée avec… | « Une journée avec une ingénieure des mines à Kolwezi » |
| Combien je gagne ? | Salaires réels, sans tabou |
| Mon parcours en 60 s | « De la 8e à pilote d'avion » |
| Ce qu'on ne te dit pas | « La vérité sur les études de médecine » |
| Battle de filières | Informatique vs génie civil : débat entre deux étudiants |
| Erreurs à éviter | « 5 erreurs qui font rater une inscription » |
| Exetat en 1 minute | Une notion de physique expliquée vite |
| Bourse expliquée | « Comment j'ai eu ma bourse, étape par étape » |
| Micro-trottoir | « Que veux-tu faire plus tard ? » dans les écoles |
| Défi métier | Tutoriels courts : coder un mini-site, faire un plan de maison |

## Plan de production de contenu

1. **Mois 1-3** : 300 vidéos natives (10 ambassadeurs × 30) + 2 000 vidéos YouTube/TikTok sélectionnées.
2. **Mois 4-12** : 50 ambassadeurs, 100 créateurs connectés, concours vidéo dans les écoles.
3. Partenariats : universités (vidéos de filières), entreprises (métiers de leurs employés), médias (extraits d'émissions).
4. **Kesho Studio** : un petit studio mobile qui visite écoles et entreprises pour filmer.
