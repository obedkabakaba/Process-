import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BandeauHorsLigne, Bouton, Carte, Ecran, Etat, Puce, Section } from '../../components/ui';
import { Evaluation, Opportunite } from '../../lib/api';
import { formaterDate, formaterDelai, LIBELLES_TYPE } from '../../lib/format';
import { useSession } from '../../lib/session';
import { couleurs, espace } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

const ICONES = { ok: '✅', non: '❌', a_verifier: '⚠️' } as const;

export default function FicheOpportunite() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { eleve } = useSession();
  const { donnees, chargement, erreur, horsLigne, recharger } = useChargement<{ opportunite: Opportunite; evaluation: Evaluation | null }>(eleve ? `/scout/eleves/${eleve.id}/opportunites/${id}` : null);

  if (!donnees) {
    return (
      <Ecran bords={['bottom']}>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }
  const { opportunite: o, evaluation } = donnees;
  const type = LIBELLES_TYPE[o.type] ?? { nom: o.type, emoji: '✨' };
  const eligibilite = evaluation?.eligibilite;

  return (
    <Ecran bords={['bottom']}>
      <BandeauHorsLigne visible={horsLigne} />
      <View style={styles.puces}>
        <Puce texte={`${type.emoji} ${type.nom}`} ton="primaire" />
        {o.demo ? <Puce texte="Exemple de démonstration" /> : o.verifiee ? <Puce texte={`🛡️ Vérifiée par Kesho · ${o.scoreConfiance} %`} ton="succes" /> : <Puce texte={`Confiance ${o.scoreConfiance} %`} ton="alerte" />}
      </View>
      <Text style={styles.titre}>{o.titre}</Text>
      <Text style={styles.organisme}>{o.organisme} · {o.enLigne ? 'En ligne' : o.lieu}</Text>

      <Carte style={{ marginTop: espace.m }}>
        <Text style={styles.fort}>📅 {o.dateLimite ? `Date limite : ${formaterDate(o.dateLimite)}` : 'Dates : à lire sur le site officiel'}</Text>
        {evaluation && evaluation.joursRestants !== null && <Text style={styles.texte}>{formaterDelai(evaluation.joursRestants)}</Text>}
        <Text style={styles.texte}>{o.coutUsd === 0 ? 'Candidature gratuite' : `Coût annoncé : ${o.coutUsd} $`}</Text>
      </Carte>

      <Text style={styles.description}>{o.description}</Text>

      {eligibilite && (
        <Section titre={eligibilite.eligible ? 'Tu peux postuler ✅' : eligibilite.presqueEligible ? 'Tu y es presque' : 'Critères'}>
          {eligibilite.criteres.length === 0 && <Text style={styles.texte}>Ouvert à tous, sans condition particulière.</Text>}
          {eligibilite.criteres.map((c) => (
            <Carte key={c.code}>
              <Text style={styles.fort}>{ICONES[c.statut]} {c.libelle}</Text>
              {c.detail && <Text style={styles.texte}>{c.detail}</Text>}
            </Carte>
          ))}
        </Section>
      )}

      {o.avantages.length > 0 && (
        <Section titre="Ce que tu gagnes">
          <View style={styles.puces}>
            {o.avantages.map((a) => (
              <Puce key={a} texte={a} ton="soleil" />
            ))}
          </View>
        </Section>
      )}

      {o.documents.length > 0 && (
        <Section titre="Documents à préparer">
          {o.documents.map((d) => (
            <Text key={d} style={styles.document}>☐ {d}</Text>
          ))}
        </Section>
      )}

      {o.urlOfficielle && !o.demo && <Bouton titre="Ouvrir le site officiel" onPress={() => Linking.openURL(o.urlOfficielle as string)} />}
      <Text style={styles.note}>🛡️ Kesho ne te demandera jamais d'argent pour une opportunité. Postule toujours sur le site officiel.</Text>
    </Ecran>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap' },
  titre: { fontSize: 24, fontWeight: '800', color: couleurs.texte, letterSpacing: -0.4, marginTop: espace.xs },
  organisme: { fontSize: 14, color: couleurs.texteDoux, marginTop: 2 },
  description: { fontSize: 15, color: couleurs.texte, lineHeight: 22, marginTop: espace.s },
  fort: { fontSize: 15, fontWeight: '700', color: couleurs.texte },
  texte: { fontSize: 14, color: couleurs.texteDoux, marginTop: 2, lineHeight: 20 },
  document: { fontSize: 15, color: couleurs.texte, lineHeight: 26 },
  note: { fontSize: 13, color: couleurs.texteDoux, textAlign: 'center', marginTop: espace.l, lineHeight: 19 },
});
