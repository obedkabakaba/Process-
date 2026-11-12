import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Barre, Bouton, Ecran, Etat } from '../components/ui';
import { envoyer, QuestionsTest, ResultatTest } from '../lib/api';
import { useSession } from '../lib/session';
import { couleurs, espace, rayon } from '../lib/theme';
import { useChargement } from '../lib/useChargement';

/** Test d'intérêts : une activité par carte, trois réponses possibles. */
export default function Test() {
  const { eleve, definirEleve } = useSession();
  const { donnees, chargement, erreur, recharger } = useChargement<QuestionsTest>('/orientation/questions');
  const [index, setIndex] = useState(0);
  const [reponses, setReponses] = useState<Record<string, number>>({});
  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);

  if (!donnees) {
    return (
      <Ecran>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }

  const total = donnees.questions.length;
  const termine = index >= total;
  const question = donnees.questions[Math.min(index, total - 1)];

  async function terminer(finales: Record<string, number>) {
    if (!eleve) return;
    setEnvoi(true);
    setErreurEnvoi(null);
    try {
      const resultat = await envoyer<ResultatTest>(`/eleves/${eleve.id}/test`, { reponses: finales });
      await definirEleve(resultat.eleve);
      router.replace({ pathname: '/resultat', params: { xp: String(resultat.xpGagne) } });
    } catch (e) {
      setErreurEnvoi(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  function repondre(valeur: number) {
    const suivantes = { ...reponses, [question.id]: valeur };
    setReponses(suivantes);
    setIndex(index + 1);
    if (index + 1 >= total) terminer(suivantes);
  }

  if (termine) {
    return (
      <Ecran>
        <View style={styles.fin}>
          <Text style={styles.emojiFin}>🧬</Text>
          <Text style={styles.texteFin}>{erreurEnvoi ?? 'Kesho calcule ton profil…'}</Text>
          {erreurEnvoi ? <Bouton titre="Réessayer" onPress={() => terminer(reponses)} chargement={envoi} /> : <Etat chargement />}
        </View>
      </Ecran>
    );
  }

  return (
    <Ecran defilant={false} bords={['bottom']}>
      <Text style={styles.compteur}>Question {index + 1} sur {total}</Text>
      <Barre valeur={index / total} couleur={couleurs.soleil} />
      <View style={styles.carte}>
        <Text style={styles.consigne}>Est-ce que tu aimerais…</Text>
        <Text style={styles.emoji}>{question.emoji}</Text>
        <Text style={styles.texte}>{question.texte}</Text>
      </View>
      <View style={styles.reponses}>
        {donnees.echelle.map((e) => (
          <Pressable key={e.valeur} accessibilityRole="button" accessibilityLabel={e.libelle} onPress={() => repondre(e.valeur)} style={({ pressed }) => [styles.reponse, pressed && { opacity: 0.7 }]}>
            <Text style={styles.emojiReponse}>{e.emoji}</Text>
            <Text style={styles.libelleReponse}>{e.libelle}</Text>
          </Pressable>
        ))}
      </View>
      {index > 0 && <Bouton titre="Question précédente" variante="discret" onPress={() => setIndex(index - 1)} />}
    </Ecran>
  );
}

const styles = StyleSheet.create({
  compteur: { fontSize: 13, fontWeight: '700', color: couleurs.texteDoux, marginBottom: espace.s },
  carte: { flex: 1, backgroundColor: couleurs.primaire, borderRadius: rayon.grand, marginVertical: espace.m, padding: espace.l, alignItems: 'center', justifyContent: 'center', minHeight: 240 },
  consigne: { color: couleurs.soleil, fontSize: 15, fontWeight: '700' },
  emoji: { fontSize: 72, marginVertical: espace.m },
  texte: { color: couleurs.blanc, fontSize: 24, fontWeight: '800', textAlign: 'center', lineHeight: 31 },
  reponses: { flexDirection: 'row', gap: espace.s },
  reponse: { flex: 1, backgroundColor: couleurs.carte, borderWidth: 1.5, borderColor: couleurs.bordure, borderRadius: rayon.moyen, alignItems: 'center', paddingVertical: espace.m, minHeight: 84, justifyContent: 'center' },
  emojiReponse: { fontSize: 28 },
  libelleReponse: { fontSize: 13, fontWeight: '700', color: couleurs.texte, marginTop: 4, textAlign: 'center' },
  fin: { alignItems: 'center', paddingTop: espace.xl * 2 },
  emojiFin: { fontSize: 64 },
  texteFin: { fontSize: 17, fontWeight: '600', color: couleurs.texte, marginTop: espace.m, textAlign: 'center' },
});
