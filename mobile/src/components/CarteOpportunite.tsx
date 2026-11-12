import { Check, Clock, ShieldCheck, TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';
import { ElementFil } from '../lib/api';
import { formaterDelai } from '../lib/format';
import { useTheme } from '../theme/ThemeProvider';
import { symboleType } from './icones';
import { Carte, Pastille, Texte, Vignette } from './ui';

export function CarteOpportunite({ element, onPress }: { element: ElementFil; onPress: () => void }) {
  const t = useTheme();
  const { opportunite: o, eligibilite, joursRestants } = element;
  const type = symboleType(o.type);
  const manquant = eligibilite.criteres.find((c) => c.statut === 'non');
  const urgent = joursRestants !== null && joursRestants <= 7;

  return (
    <Carte onPress={onPress} etiquette={`${type.nom} : ${o.titre}`} style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <Vignette icone={type.icone} emoji={type.emoji} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Texte v="note" c="doux" numberOfLines={1} style={{ flexShrink: 1 }}>{type.nom} · {o.organisme}</Texte>
            {o.verifiee && !o.demo && <ShieldCheck size={13} color={t.c.succes} strokeWidth={2.4} />}
          </View>
          <Texte v="fort" numberOfLines={2} style={{ marginTop: 2, fontSize: 16, lineHeight: 21 }}>{o.titre}</Texte>
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {eligibilite.eligible ? (
          <Pastille icone={Check} ton="succes" texte={eligibilite.nbTotal === 0 ? 'Ouvert à tous' : `${eligibilite.nbOk}/${eligibilite.nbTotal} critères`} />
        ) : manquant ? (
          <Pastille icone={TriangleAlert} ton="alerte" texte={`Manque : ${manquant.libelle}`} />
        ) : null}
        <Pastille icone={Clock} ton={urgent ? 'danger' : 'neutre'} texte={formaterDelai(joursRestants)} />
        {o.demo && <Pastille texte="Exemple" />}
      </View>
    </Carte>
  );
}
