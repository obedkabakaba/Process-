import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

export class ErreurApi extends Error {
  constructor(message: string, readonly statut?: number) {
    super(message);
  }
}

async function requete<T>(chemin: string, options?: RequestInit): Promise<T> {
  let reponse: Response;
  try {
    reponse = await fetch(`${API_URL}${chemin}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    });
  } catch {
    throw new ErreurApi('Pas de connexion. Vérifie ton internet et réessaie.');
  }
  if (!reponse.ok) {
    let message = 'Une erreur est survenue.';
    try {
      const corps = await reponse.json();
      message = Array.isArray(corps.message) ? corps.message.join('\n') : (corps.message ?? message);
    } catch {
      // Réponse sans corps JSON : on garde le message par défaut.
    }
    throw new ErreurApi(message, reponse.status);
  }
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

export function envoyer<T>(chemin: string, corps: unknown, methode: 'POST' | 'PATCH' = 'POST'): Promise<T> {
  return requete<T>(chemin, { method: methode, body: JSON.stringify(corps) });
}

// ----- Types renvoyés par l'API -----

export interface Niveau { code: string; libelle: string; saison: string }
export interface Referentiel { niveaux: Niveau[]; provinces: string[] }

export interface Eleve {
  id: string; prenom: string; dateNaissance: string | null; niveau: string; option: string | null; section: string | null;
  province: string; ville: string | null; moyenne: number | null; sexe: string | null; langues: string[];
  scoresRiasec: Record<string, number> | null; codeRiasec: string | null; xp: number; badges: string[];
}

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
