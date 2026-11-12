import { router } from 'expo-router';
import { ArrowLeft, Heart, LucideIcon, Meh, ThumbsDown, X } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { iconeQuestion } from '../components/icones';
import { Barre, Bouton, Ecran, ESPACE, Etat, Icone, Texte } from '../components/ui';
import { envoyer, QuestionsTest, ResultatTest } from '../lib/api';
import { useSession } from '../lib/session';
import { useChargement } from '../lib/useChargement';
import { useTheme } from '../theme/ThemeProvider';

const ICONES_REPONSE: LucideIcon[] = [ThumbsDown, Meh, Heart];

/** Test d'intérêts : une activité par carte, trois réponses possibles. */
export default function Test() {
  const t = useTheme();
  const { eleve, definirEleve } = useSession();
  const { donnees, chargement, erreur, recharger } = useChargement<QuestionsTest>('/orientation/questions');
  const [index, setIndex] = useState(0);
  const [reponses, setReponses] = useState<Record<string, number>>({});
  const [envoi, setEnvoi] = useState(false);
  const [erreurEnvoi, setErreurEnvoi] = useState<string | null>(null);

  const quitter = () => (router.canGoBack() ? router.back() : router.replace('/(tabs)'));

  if (!donnees) {
    return (
      <Ecran bords={['top', 'bottom']}>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }

  const total = donnees.questions.length;
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

  if (index >= total) {
    return (
      <Ecran bords={['top', 'bottom']} defilant={false}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: ESPACE.m }}>
          {erreurEnvoi ? (
            <>
              <Texte c="doux" centre>{erreurEnvoi}</Texte>
              <Bouton titre="Réessayer" onPress={() => terminer(reponses)} chargement={envoi} />
            </>
          ) : (
            <>
              <Etat chargement />
              <Texte v="section">Calcul de ton profil</Texte>
            </>
          )}
        </View>
      </Ecran>
    );
  }

  return (
    <Ecran defilant={false} bords={['top', 'bottom']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: ESPACE.m }}>
        <Pressable accessibilityRole="button" accessibilityLabel={index > 0 ? 'Question précédente' : 'Fermer'} onPress={index > 0 ? () => setIndex(index - 1) : quitter} hitSlop={12}>
          {index > 0 ? <ArrowLeft size={24} color={t.c.texte} /> : <X size={24} color={t.c.texte} />}
        </Pressable>
        <View style={{ flex: 1 }}>
          <Barre valeur={index / total} />
        </View>
        <Texte v="petit" c="doux" accessibilityLabel={`Question ${index + 1} sur ${total}`}>{index + 1}/{total}</Texte>
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: ESPACE.s }}>
        <View style={{ width: 112, height: 112, borderRadius: t.f.rayonL + 8, backgroundColor: t.c.accentDoux, alignItems: 'center', justifyContent: 'center', marginBottom: ESPACE.xl }}>
          <Icone icone={iconeQuestion(question.id)} emoji={question.emoji} taille={52} couleur={t.c.surAccentDoux} />
        </View>
        <Texte v="petit" c="doux" style={{ marginBottom: ESPACE.s }}>Est-ce que tu aimerais…</Texte>
        <Texte v="titre" centre>{question.texte}</Texte>
      </View>

      <View style={{ flexDirection: 'row', gap: ESPACE.s }}>
        {donnees.echelle.map((e, i) => {
          const I = ICONES_REPONSE[i] ?? Meh;
          const fort = i === donnees.echelle.length - 1;
          return (
            <Pressable key={e.valeur} accessibilityRole="button" accessibilityLabel={e.libelle} onPress={() => repondre(e.valeur)}
              style={({ pressed }) => ({
                flex: 1, minHeight: 84, alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: t.f.rayonM,
                backgroundColor: fort ? t.c.accent : t.c.surface, borderWidth: fort ? 0 : Math.max(1.5, t.f.largeurBordure), borderColor: t.c.bordure,
                ...(t.f.relief ? { borderBottomWidth: pressed ? 0 : 4, borderBottomColor: fort ? t.c.accentRelief : t.c.bordure, marginTop: pressed ? 4 : 0 } : {}),
                opacity: pressed && !t.f.relief ? 0.7 : 1,
              })}>
              <I size={24} color={fort ? t.c.surAccent : t.c.texte} strokeWidth={2} />
              <Text style={[t.p.demi, { fontSize: 13, color: fort ? t.c.surAccent : t.c.texte }]}>{e.libelle}</Text>
            </Pressable>
          );
        })}
      </View>
    </Ecran>
  );
}
