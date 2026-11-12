const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

export function formaterDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCDate()} ${MOIS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formaterDelai(jours: number | null): string {
  if (jours === null) return 'Dates sur le site officiel';
  if (jours <= 0) return "Dernier jour aujourd'hui";
  if (jours === 1) return 'Plus que 1 jour';
  return `Dans ${jours} jours`;
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

export const LIBELLES_TYPE: Record<string, { nom: string; emoji: string }> = {
  bourse: { nom: 'Bourse', emoji: '🎓' },
  concours: { nom: 'Concours', emoji: '🏆' },
  programme: { nom: 'Programme', emoji: '🌍' },
  formation: { nom: 'Formation', emoji: '📚' },
  evenement: { nom: 'Événement', emoji: '📍' },
  stage: { nom: 'Stage', emoji: '💼' },
  emploi: { nom: 'Emploi', emoji: '💼' },
  aide: { nom: 'Aide', emoji: '🤲' },
  examen: { nom: 'Examen', emoji: '📝' },
  inscription: { nom: 'Inscription', emoji: '🖊️' },
  rentree: { nom: 'Rentrée', emoji: '🎒' },
  salon: { nom: 'Salon', emoji: '🎪' },
};

export const LIBELLES_DEMANDE: Record<string, { texte: string; ton: 'succes' | 'alerte' | 'neutre' }> = {
  forte: { texte: 'Métier qui recrute', ton: 'succes' },
  moyenne: { texte: 'Demande moyenne', ton: 'neutre' },
  saturee: { texte: 'Beaucoup de diplômés', ton: 'alerte' },
  variable: { texte: 'Dépend de ton talent', ton: 'neutre' },
};

/** Niveau de jeu calculé à partir de l'XP (200 XP par niveau). */
export function niveauJeu(xp: number): { niveau: number; progression: number; restant: number } {
  const PALIER = 200;
  return { niveau: Math.floor(xp / PALIER) + 1, progression: (xp % PALIER) / PALIER, restant: PALIER - (xp % PALIER) };
}
