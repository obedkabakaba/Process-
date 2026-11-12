import { View } from 'react-native';
import { Niveau } from '../lib/api';
import { Choix, ESPACE, OptionListe } from './ui';

export const CYCLES = [
  { id: 'P', nom: 'Primaire' }, { id: 'EB', nom: 'Éducation de base (7e, 8e)' }, { id: 'H', nom: 'Humanités' },
  { id: 'U', nom: 'Université ou institut' }, { id: 'DIPLOME', nom: "J'ai fini mes études" },
];
export const cycleDe = (code: string | null) => (code ? CYCLES.find((c) => code.startsWith(c.id))?.id ?? null : null);

/** Choix de la classe en deux temps : le cycle, puis l'année. */
export function ChoixClasse({ niveaux, cycle, niveau, onCycle, onNiveau }: { niveaux: Niveau[]; cycle: string | null; niveau: string | null; onCycle: (cycle: string, niveauUnique: string | null) => void; onNiveau: (code: string) => void }) {
  return (
    <>
      {CYCLES.map((c) => {
        const duCycle = niveaux.filter((n) => cycleDe(n.code) === c.id);
        return (
          <View key={c.id}>
            <OptionListe libelle={c.nom} actif={cycle === c.id} onPress={() => onCycle(c.id, duCycle.length === 1 ? duCycle[0].code : null)} />
            {cycle === c.id && duCycle.length > 1 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s, marginBottom: ESPACE.m, marginTop: 4 }}>
                {duCycle.map((n) => (
                  <Choix key={n.code} libelle={n.libelle.split(' ')[0]} actif={niveau === n.code} onPress={() => onNiveau(n.code)} />
                ))}
              </View>
            )}
          </View>
        );
      })}
    </>
  );
}

export const LANGUES = [
  { code: 'fr', nom: 'Français' }, { code: 'ln', nom: 'Lingala' }, { code: 'sw', nom: 'Swahili' },
  { code: 'lua', nom: 'Tshiluba' }, { code: 'kg', nom: 'Kikongo' }, { code: 'en', nom: 'Anglais' },
];
