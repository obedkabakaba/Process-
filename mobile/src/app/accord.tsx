import { router, useLocalSearchParams } from 'expo-router';
import { UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Bouton, Champ, Ecran, ESPACE, Texte, Vignette } from '../components/ui';
import { Eleve, envoyer, EtatConsentement } from '../lib/api';
import { useSession } from '../lib/session';

/** Accord d'un parent pour un élève mineur : le parent reçoit un code, l'élève le saisit ici. */
export default function Accord() {
  const { eleve, definirEleve } = useSession();
  const { suite, demo } = useLocalSearchParams<{ suite?: string; demo?: string }>();
  const [code, setCode] = useState('');
  const [codeDemo, setCodeDemo] = useState<string | null>(demo ?? null);
  const [envoi, setEnvoi] = useState(false);
  const [renvoi, setRenvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const continuer = () => router.replace(suite === 'test' ? '/test' : '/(tabs)');
  if (!eleve) return null;

  async function confirmer() {
    if (!eleve) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const r = await envoyer<{ eleve: Eleve }>(`/eleves/${eleve.id}/consentement/confirmer`, { code: code.trim() });
      await definirEleve(r.eleve);
      continuer();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  async function renvoyer() {
    if (!eleve) return;
    setRenvoi(true);
    setErreur(null);
    setInfo(null);
    try {
      const r = await envoyer<{ consentement: EtatConsentement; codeDev?: string }>(`/eleves/${eleve.id}/consentement/demander`, {});
      setCodeDemo(r.codeDev ?? null);
      setInfo(`Nouveau code envoyé au ${r.consentement.telephoneParent ?? 'parent'}.`);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setRenvoi(false);
    }
  }

  return (
    <Ecran
      bords={['top', 'bottom']}
      pied={
        <>
          {erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}
          <Bouton titre="Valider l'accord" onPress={confirmer} chargement={envoi} desactive={!/^\d{6}$/.test(code.trim())} />
          <Bouton titre="Plus tard" variante="discret" onPress={continuer} />
        </>
      }
    >
      <View style={{ paddingTop: ESPACE.xl }}>
        <Vignette icone={UsersRound} taille={64} />
        <Texte v="titre" style={{ marginTop: ESPACE.l }}>L'accord de ton parent</Texte>
        <Texte c="doux" style={{ marginTop: ESPACE.s, marginBottom: ESPACE.l }}>Ton parent a reçu un code par message. Demande-le-lui et entre-le ici.</Texte>
        <Champ accessibilityLabel="Code reçu par ton parent" value={code} onChangeText={setCode} placeholder="000000" keyboardType="number-pad" maxLength={6} style={{ letterSpacing: 6, fontSize: 22 }} />
        {codeDemo && <Texte v="note" c="alerte" style={{ marginTop: ESPACE.s }}>Mode démonstration : aucun message n'est envoyé. Code : {codeDemo}</Texte>}
        {info && <Texte v="note" c="succes" style={{ marginTop: ESPACE.s }}>{info}</Texte>}
        <Pressable accessibilityRole="button" onPress={renvoyer} disabled={renvoi} hitSlop={10} style={{ marginTop: ESPACE.l }}>
          <Texte v="petit" c="accent">{renvoi ? 'Envoi…' : 'Renvoyer le code'}</Texte>
        </Pressable>
        <Texte v="note" c="faible" style={{ marginTop: ESPACE.l }}>Sans cet accord, tu peux explorer les métiers et passer le test. Tes opportunités personnalisées s'ouvriront ensuite.</Texte>
      </View>
    </Ecran>
  );
}
