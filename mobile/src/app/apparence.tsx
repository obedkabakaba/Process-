import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { Ecran, ESPACE, Section, Segments, Texte } from '../components/ui';
import { APPARENCES, construireTheme } from '../theme/apparences';
import { Mode, useReglagesTheme } from '../theme/ThemeProvider';

/** Miniature d'une apparence : un petit écran dessiné avec ses propres couleurs. */
function Apercu({ id, sombre }: { id: string; sombre: boolean }) {
  const a = construireTheme(id, sombre);
  return (
    <View style={{ height: 112, borderRadius: 12, backgroundColor: a.c.fond, padding: 10, gap: 7, borderWidth: 1, borderColor: a.c.bordure, overflow: 'hidden' }}>
      <View style={{ height: 8, width: '46%', borderRadius: 4, backgroundColor: a.c.texte }} />
      <View style={{ height: 34, borderRadius: Math.min(a.f.rayonM, 10), backgroundColor: a.c.hero, padding: 8, justifyContent: 'flex-end' }}>
        <View style={{ height: 5, width: '55%', borderRadius: 3, backgroundColor: a.c.heroAccent }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        <View style={{ flex: 1, height: 22, borderRadius: Math.min(a.f.rayonS, 7), backgroundColor: a.c.surface, borderWidth: 1, borderColor: a.c.bordure }} />
        <View style={{ width: 42, height: 22, borderRadius: Math.min(a.f.rayonBouton, 11), backgroundColor: a.c.accent, borderBottomWidth: a.f.relief ? 3 : 0, borderBottomColor: a.c.accentRelief }} />
      </View>
    </View>
  );
}

export default function Apparence() {
  const { theme: t, apparence, mode, choisirApparence, choisirMode } = useReglagesTheme();

  return (
    <Ecran bords={['bottom']}>
      <Segments<Mode>
        options={[{ valeur: 'systeme', libelle: 'Automatique' }, { valeur: 'clair', libelle: 'Clair' }, { valeur: 'sombre', libelle: 'Sombre' }]}
        valeur={mode}
        onChange={choisirMode}
      />
      <Section titre="Apparence">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {APPARENCES.map((a) => {
            const actif = a.id === apparence;
            return (
              <Pressable key={a.id} accessibilityRole="radio" accessibilityState={{ selected: actif }} accessibilityLabel={`${a.nom}, ${a.resume}`} onPress={() => choisirApparence(a.id)}
                style={{ width: '47.8%', borderRadius: 16, padding: 6, borderWidth: 2, borderColor: actif ? t.c.accent : 'transparent', backgroundColor: actif ? t.c.accentDoux : 'transparent' }}>
                <Apercu id={a.id} sombre={t.sombre} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: 8, paddingBottom: 2 }}>
                  <View style={{ flex: 1 }}>
                    <Texte v="fort">{a.nom}</Texte>
                    <Texte v="note" c="doux" numberOfLines={1}>{a.resume}</Texte>
                  </View>
                  {actif && <Check size={18} color={t.c.surAccentDoux} strokeWidth={2.6} />}
                </View>
              </Pressable>
            );
          })}
        </View>
      </Section>
      <Texte v="note" c="faible" centre style={{ marginTop: ESPACE.l }}>« Automatique » suit le réglage clair ou sombre de ton téléphone.</Texte>
    </Ecran>
  );
}
