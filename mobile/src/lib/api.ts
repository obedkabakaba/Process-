import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export class ErreurApi extends Error {
  constructor(message: string, readonly statut?: number, readonly code?: string) {
    super(message);
  }
}

let jetonCourant: string | null = null;
let surSessionExpiree: (() => void) | null = null;

/** Définit le jeton de session joint à chaque requête. */
export function definirJeton(jeton: string | null): void {
  jetonCourant = jeton;
}

/** Appelé quand le serveur ne reconnaît plus la session. */
export function ecouterSessionExpiree(gestionnaire: (() => void) | null): void {
  surSessionExpiree = gestionnaire;
}

async function requete<T>(chemin: string, options?: RequestInit): Promise<T> {
  let reponse: Response;
  try {
    reponse = await fetch(`${API_URL}${chemin}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(jetonCourant ? { Authorization: `Bearer ${jetonCourant}` } : {}), ...(options?.headers ?? {}) },
    });
  } catch {
    throw new ErreurApi('Pas de connexion. Vérifie ton internet et réessaie.');
  }
  if (!reponse.ok) {
    let message = 'Une erreur est survenue.';
    let code: string | undefined;
    try {
      const corps = await reponse.json();
      message = Array.isArray(corps.message) ? corps.message.join('\n') : (corps.message ?? message);
      code = corps.code;
    } catch {
      // Réponse sans corps JSON : on garde le message par défaut.
    }
    if (reponse.status === 401 && jetonCourant) surSessionExpiree?.();
    throw new ErreurApi(message, reponse.status, code);
  }
  if (reponse.status === 204) return undefined as T;
  return reponse.json() as Promise<T>;
}

/**
 * Lecture avec repli hors-ligne : la dernière réponse réussie est gardée sur le téléphone
 * et resservie quand le réseau est indisponible.
 */
export async function lire<T>(chemin: string): Promise<{ donnees: T; horsLigne: boolean }> {
  const cle = `cache:${chemin}`;
  try {
    const donnees = await requete<T>(chemin);
    AsyncStorage.setItem(cle, JSON.stringify(donnees)).catch(() => undefined);
    return { donnees, horsLigne: false };
  } catch (erreur) {
    if (erreur instanceof ErreurApi && erreur.statut === undefined) {
      const enCache = await AsyncStorage.getItem(cle);
      if (enCache) return { donnees: JSON.parse(enCache) as T, horsLigne: true };
    }
    throw erreur;
  }
}

export function envoyer<T>(chemin: string, corps: unknown = {}, methode: 'POST' | 'PATCH' | 'DELETE' = 'POST'): Promise<T> {
  return requete<T>(chemin, { method: methode, ...(methode === 'DELETE' ? {} : { body: JSON.stringify(corps) }) });
}

/** Lecture directe, sans mise en cache (données d'administration). */
export function obtenir<T>(chemin: string): Promise<T> {
  return requete<T>(chemin);
}

/** Efface les réponses gardées sur le téléphone (à la déconnexion). */
export async function viderCache(): Promise<void> {
  const cles = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(cles.filter((c) => c.startsWith('cache:')));
}

/** Mesure d'usage : ne bloque jamais l'écran, même en cas d'échec. */
export function mesurer(type: 'opportunite_ouverte' | 'site_officiel_ouvert' | 'metier_ouvert', donnees?: Record<string, unknown>): void {
  if (!jetonCourant) return;
  requete('/mesures', { method: 'POST', body: JSON.stringify({ type, donnees }) }).catch(() => undefined);
}

// ----- Types renvoyés par l'API -----

export interface Niveau { code: string; libelle: string; saison: string }
export interface Referentiel { niveaux: Niveau[]; provinces: string[] }

export interface Eleve {
  id: string; prenom: string; dateNaissance: string | null; niveau: string; option: string | null; section: string | null;
  province: string; ville: string | null; moyenne: number | null; sexe: string | null; langues: string[];
  scoresRiasec: Record<string, number> | null; codeRiasec: string | null; xp: number; badges: string[];
  consentement: 'non_requis' | 'en_attente' | 'accorde';
}

export interface Compte { id: string; telephone: string; role: 'eleve' | 'curateur' | 'admin' }
export interface Connexion { jeton: string; compte: Compte; eleve: Eleve | null }
export interface EtatConsentement { statut: Eleve['consentement']; telephoneParent: string | null }
export interface ProfilCree { eleve: Eleve; consentement: EtatConsentement; codeDev?: string }

export interface OptionHumanites { slug: string; nom: string; section: string; description: string; codeRiasec: string; matieresCles: string[]; compatibilite?: number }

export interface Etablissement { slug: string; nom: string; sigle: string | null; ville: string; province: string; statut: string; type: string; domaines: string[]; siteWeb: string | null }

export interface Metier {
  slug: string; nom: string; emoji: string; domaine: string; description: string; codeRiasec: string; etudes: string;
  dureeEtudesAns: number; tendanceDemande: string; fiabiliteDonnees: string; competences: string[]; compatibilite?: number;
}
export interface MetierDetail extends Metier { options: OptionHumanites[]; etablissements: Etablissement[] }

export interface QuestionsTest {
  echelle: { valeur: number; libelle: string; emoji: string }[];
  questions: { id: string; emoji: string; texte: string }[];
}

export interface TypeProfil { type: string; nom: string; emoji: string; resume: string; score: number }
export interface Recommandations { scores: Record<string, number>; code: string; profil: TypeProfil[]; metiers: Metier[]; options: OptionHumanites[] }
export interface ResultatTest extends Recommandations { eleve: Eleve; xpGagne: number }

export interface Opportunite {
  id: string; titre: string; organisme: string; type: string; description: string; urlOfficielle: string | null;
  dateLimite: string | null; lieu: string; enLigne: boolean; coutUsd: number; avantages: string[]; documents: string[];
  scoreConfiance: number; verifiee: boolean; demo: boolean;
}
export interface Critere { code: string; libelle: string; statut: 'ok' | 'non' | 'a_verifier'; detail?: string; ameliorable: boolean }
export interface Evaluation {
  opportuniteId: string; pertinence: number; joursRestants: number | null; score: number; raisons: string[];
  eligibilite: { eligible: boolean; presqueEligible: boolean; criteres: Critere[]; nbOk: number; nbTotal: number };
}
export interface ElementFil extends Evaluation { opportunite: Opportunite }
export interface Fil { pourToi: ElementFil[]; presqueEligible: ElementFil[] }

export interface Alerte { code: string; message: string; gravite: string }
export interface Verdict { niveau: 'danger' | 'prudence' | 'aucune_alerte'; score: number; titre: string; alertes: Alerte[]; conseils: string[] }

export interface Evenement { id: string; titre: string; description: string; type: string; dateDebut: string; dateFin: string | null; aConfirmer: boolean; enCours: boolean; dansJours: number }

// ----- Espace curateur -----

export interface CriteresFiche {
  ageMin?: number; ageMax?: number; niveaux?: string[]; sections?: string[]; moyenneMin?: number; sexe?: 'F' | 'M';
  nationalites?: string[]; provinces?: string[]; langues?: string[]; autres?: string[];
}
export interface FicheCuration {
  id: string; titre: string; organisme: string; type: string; description: string; urlOfficielle: string | null; dateLimite: string | null;
  lieu: string; enLigne: boolean; coutUsd: number; avantages: string[]; documents: string[]; tags: string[]; criteres: CriteresFiche;
  sourceType: string; scoreConfiance: number; statut: 'en_revue' | 'publiee' | 'rejetee'; incertitudes: string[]; urlSource: string | null; demo: boolean;
  alertes?: Alerte[]; signaux?: string[];
}
export interface Analyse { fiche: Omit<FicheCuration, 'id' | 'sourceType' | 'scoreConfiance' | 'statut' | 'urlSource' | 'demo'> & { estUneOpportunite: boolean }; alertes: Alerte[] }
export interface Statistiques {
  eleves: { inscrits: number; testTermine: number; consentementEnAttente: number };
  opportunites: Record<string, number>; septDerniersJours: Record<string, number>; sourcesActives: number; analyseDisponible: boolean;
}
export interface EvenementCuration { id: string; titre: string; description: string; type: string; dateDebut: string; dateFin: string | null; niveaux: string[]; provinces: string[]; aConfirmer: boolean }
export interface SourceCuration { id: string; nom: string; url: string; format: 'rss' | 'page'; sourceType: string; actif: boolean; dernierPassage: string | null; dernierStatut: string | null }
export interface BilanCollecte { statut: string; lues: number; nouvelles: number; brouillons: number; ignorees: number; erreurs: number; restantes: number }
