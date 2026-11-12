const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function formaterDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

export function jourEtMois(iso: string): { jour: string; mois: string } {
  const d = new Date(iso);
  return { jour: String(d.getUTCDate()), mois: MOIS_COURTS[d.getUTCMonth()] };
}

export function formaterDelai(jours: number | null): string {
  if (jours === null) return 'Dates sur le site';
  if (jours <= 0) return "Aujourd'hui";
  return `${jours} j restants`;
}

/** Retire les emojis d'un texte venu de l'API. */
export function sansEmoji(texte: string): string {
  return texte.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').trim();
}

/** Convertit « JJ/MM/AAAA » en date ISO, ou null si la date est invalide. */
export function analyserDateNaissance(texte: string): string | null {
  const m = texte.trim().match(/^(\d{1,2})[/.\- ](\d{1,2})[/.\- ](\d{4})$/);
  if (!m) return null;
  const [jour, mois, annee] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(annee, mois - 1, jour));
  const valide = date.getUTCFullYear() === annee && date.getUTCMonth() === mois - 1 && date.getUTCDate() === jour;
  const anneeCourante = new Date().getFullYear();
  if (!valide || annee < anneeCourante - 60 || annee > anneeCourante - 5) return null;
  return date.toISOString().slice(0, 10);
}

export const LIBELLES_DEMANDE: Record<string, { texte: string; ton: 'succes' | 'alerte' | 'neutre' }> = {
  forte: { texte: 'Recrute', ton: 'succes' },
  moyenne: { texte: 'Demande moyenne', ton: 'neutre' },
  saturee: { texte: 'Très demandé par les étudiants', ton: 'alerte' },
  variable: { texte: 'Selon le talent', ton: 'neutre' },
};

/** Niveau de jeu calculé à partir de l'XP (200 XP par niveau). */
export function niveauJeu(xp: number): { niveau: number; progression: number; restant: number } {
  const PALIER = 200;
  return { niveau: Math.floor(xp / PALIER) + 1, progression: (xp % PALIER) / PALIER, restant: PALIER - (xp % PALIER) };
}

/** Convertit « JJ/MM/AAAA » en date ISO (AAAA-MM-JJ), ou null si la date est invalide. */
export function analyserDate(texte: string): string | null {
  const m = texte.trim().match(/^(\d{1,2})[/.\- ](\d{1,2})[/.\- ](\d{4})$/);
  if (!m) return null;
  const [jour, mois, annee] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(annee, mois - 1, jour));
  const valide = date.getUTCFullYear() === annee && date.getUTCMonth() === mois - 1 && date.getUTCDate() === jour;
  return valide ? date.toISOString().slice(0, 10) : null;
}

/** Affiche une date ISO au format « JJ/MM/AAAA ». */
export function dateCourte(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const deux = (n: number) => String(n).padStart(2, '0');
  return `${deux(d.getUTCDate())}/${deux(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}`;
}
