import { StyleSheet, Text, View } from 'react-native';
import { ElementFil } from '../lib/api';
import { formaterDelai, LIBELLES_TYPE } from '../lib/format';
import { couleurs, espace } from '../lib/theme';
import { Carte, Puce } from './ui';

export function CarteOpportunite({ element, onPress }: { element: ElementFil; onPress: () => void }) {
  const { opportunite: o, eligibilite, joursRestants, raisons } = element;
  const type = LIBELLES_TYPE[o.type] ?? { nom: o.type, emoji: '✨' };
  const manquant = eligibilite.criteres.find((c) => c.statut === 'non');
  const urgent = joursRestants !== null && joursRestants <= 7;

  return (
    <Carte onPress={onPress} etiquette={`${type.nom} : ${o.titre}`}>
      <View style={styles.puces}>
        <Puce texte={`${type.emoji} ${type.nom}`} ton="primaire" />
        {o.demo ? <Puce texte="Exemple" ton="neutre" /> : o.verifiee ? <Puce texte="🛡️ Vérifiée" ton="succes" /> : null}
        <Puce texte={`📅 ${formaterDelai(joursRestants)}`} ton={urgent ? 'danger' : 'neutre'} />
      </View>
      <Text style={styles.titre}>{o.titre}</Text>
      <Text style={styles.organisme}>{o.organisme} · {o.enLigne ? 'En ligne' : o.lieu}</Text>
      {eligibilite.eligible ? (
        <Text style={styles.ok}>
          ✅ {eligibilite.nbTotal === 0 ? 'Ouvert à tous' : `Tu remplis ${eligibilite.nbOk} critère${eligibilite.nbOk > 1 ? 's' : ''} sur ${eligibilite.nbTotal}`}
          {raisons.length > 0 ? ` · ${raisons[0]}` : ''}
        </Text>
      ) : manquant ? (
        <Text style={styles.presque}>⚠️ Il te manque : {manquant.libelle}{manquant.detail ? ` (${manquant.detail})` : ''}</Text>
      ) : null}
    </Carte>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap' },
  titre: { fontSize: 17, fontWeight: '700', color: couleurs.texte, marginTop: espace.xs },
  organisme: { fontSize: 13, color: couleurs.texteDoux, marginTop: 2 },
  ok: { fontSize: 13, color: '#046C4E', fontWeight: '600', marginTop: espace.s },
  presque: { fontSize: 13, color: '#92400E', fontWeight: '600', marginTop: espace.s },
});
