import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { BandeauHorsLigne, Carte, Ecran, Etat, Puce, Section } from '../../components/ui';
import { MetierDetail } from '../../lib/api';
import { LIBELLES_DEMANDE } from '../../lib/format';
import { useSession } from '../../lib/session';
import { couleurs, espace, rayon } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

export default function FicheMetier() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { eleve } = useSession();
  const { donnees: m, chargement, erreur, horsLigne, recharger } = useChargement<MetierDetail>(`/metiers/${slug}`);

  if (!m) {
    return (
      <Ecran bords={['bottom']}>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }
  const demande = LIBELLES_DEMANDE[m.tendanceDemande];
  const ecoles = [...m.etablissements].sort((a, b) => Number(b.province === eleve?.province) - Number(a.province === eleve?.province));

  return (
    <Ecran bords={['bottom']}>
      <BandeauHorsLigne visible={horsLigne} />
      <View style={styles.hero}>
        <Text style={styles.emoji}>{m.emoji}</Text>
        <Text style={styles.nom}>{m.nom}</Text>
        <Text style={styles.domaine}>{m.domaine}</Text>
      </View>
      <Text style={styles.description}>{m.description}</Text>
      <View style={styles.puces}>
        {demande && <Puce texte={demande.texte} ton={demande.ton} />}
        {m.fiabiliteDonnees === 'estimation' && <Puce texte="Tendance estimée" />}
      </View>

      <Section titre="Les études">
        <Carte>
          <Text style={styles.fort}>🎓 {m.etudes}</Text>
          <Text style={styles.texte}>{m.dureeEtudesAns > 0 ? `Environ ${m.dureeEtudesAns} an${m.dureeEtudesAns > 1 ? 's' : ''} après les humanités` : 'Pas de durée fixe'}</Text>
        </Carte>
      </Section>

      <Section titre="Les qualités utiles">
        <View style={styles.puces}>
          {m.competences.map((c) => (
            <Puce key={c} texte={c} ton="primaire" />
          ))}
        </View>
      </Section>

      {m.options.length > 0 && (
        <Section titre="Options des humanités conseillées">
          {m.options.map((o) => (
            <Carte key={o.slug}>
              <Text style={styles.fort}>{o.nom}</Text>
              <Text style={styles.texte}>{o.description}</Text>
            </Carte>
          ))}
        </Section>
      )}

      <Section titre="Où étudier">
        {ecoles.length === 0 && <Text style={styles.texte}>Pas encore d'école répertoriée pour ce domaine.</Text>}
        {ecoles.map((e) => (
          <Carte key={e.slug}>
            <Text style={styles.fort}>{e.sigle ? `${e.sigle} · ` : ''}{e.nom}</Text>
            <Text style={styles.texte}>📍 {e.ville}, {e.province}{e.province === eleve?.province ? ' · près de chez toi' : ''}</Text>
          </Carte>
        ))}
        <Text style={styles.note}>Liste indicative. Vérifie auprès de chaque école que la filière est bien organisée.</Text>
      </Section>
    </Ecran>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: couleurs.primaire, borderRadius: rayon.grand, padding: espace.l, alignItems: 'center', marginBottom: espace.m },
  emoji: { fontSize: 64 },
  nom: { color: couleurs.blanc, fontSize: 26, fontWeight: '900', textAlign: 'center', letterSpacing: -0.5 },
  domaine: { color: couleurs.soleil, fontWeight: '700', fontSize: 14, marginTop: 2 },
  description: { fontSize: 16, color: couleurs.texte, lineHeight: 23 },
  puces: { flexDirection: 'row', flexWrap: 'wrap', marginTop: espace.s },
  fort: { fontSize: 15, fontWeight: '700', color: couleurs.texte },
  texte: { fontSize: 14, color: couleurs.texteDoux, marginTop: 2, lineHeight: 20 },
  note: { fontSize: 12, color: couleurs.texteDoux, fontStyle: 'italic', lineHeight: 17 },
});
