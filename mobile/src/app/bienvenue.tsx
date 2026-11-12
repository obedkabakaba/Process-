import { router } from 'expo-router';
import { GraduationCap, ShieldCheck, Target } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Logo } from '../components/Logo';
import { Bouton, Champ, Ecran, EnteteEtapes, ESPACE, Texte, Vignette } from '../components/ui';
import { Connexion, envoyer } from '../lib/api';
import { estCurateur, useSession } from '../lib/session';

type Etape = 'accueil' | 'telephone' | 'code';

/** Accueil et connexion par numéro de téléphone (code à 6 chiffres). */
export default function Bienvenue() {
  const { connecter } = useSession();
  const [etape, setEtape] = useState<Etape>('accueil');
  const [telephone, setTelephone] = useState('');
  const [code, setCode] = useState('');
  const [codeDemo, setCodeDemo] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function demanderCode() {
    setEnvoi(true);
    setErreur(null);
    try {
      const r = await envoyer<{ envoye: boolean; codeDev?: string }>('/auth/demander-code', { telephone: telephone.trim() });
      setCodeDemo(r.codeDev ?? null);
      setCode('');
      setEtape('code');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  async function verifier() {
    setEnvoi(true);
    setErreur(null);
    try {
      const connexion = await envoyer<Connexion>('/auth/verifier-code', { telephone: telephone.trim(), code: code.trim() });
      await connecter(connexion);
      router.replace(connexion.eleve ? '/(tabs)' : estCurateur(connexion.compte) ? '/curation' : '/creation');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  if (etape === 'accueil') {
    return (
      <Ecran bords={['top', 'bottom']} pied={<Bouton titre="Commencer" onPress={() => setEtape('telephone')} />}>
        <View style={{ paddingTop: ESPACE.xl * 2 }}>
          <Logo taille={40} />
          <Texte v="geant" style={{ marginTop: ESPACE.xl }}>Construis{'\n'}ton avenir.</Texte>
          <View style={{ marginTop: ESPACE.xl, gap: ESPACE.m }}>
            {[
              { icone: GraduationCap, titre: 'Les métiers faits pour toi' },
              { icone: Target, titre: 'Les bourses auxquelles tu as droit' },
              { icone: ShieldCheck, titre: 'Une protection contre les arnaques' },
            ].map((x) => (
              <View key={x.titre} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Vignette icone={x.icone} taille={40} />
                <Texte v="fort" style={{ flex: 1 }}>{x.titre}</Texte>
              </View>
            ))}
          </View>
        </View>
      </Ecran>
    );
  }

  if (etape === 'telephone') {
    return (
      <Ecran bords={['top', 'bottom']} pied={<>{erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}<Bouton titre="Recevoir mon code" onPress={demanderCode} chargement={envoi} desactive={telephone.trim().length < 8} /></>}>
        <EnteteEtapes progression={0.33} onRetour={() => setEtape('accueil')} />
        <Texte v="titre">Ton numéro de téléphone</Texte>
        <Texte c="doux" style={{ marginTop: ESPACE.xs, marginBottom: ESPACE.l }}>Tu recevras un code pour te connecter.</Texte>
        <Champ accessibilityLabel="Numéro de téléphone" value={telephone} onChangeText={setTelephone} placeholder="081 234 56 78" keyboardType="phone-pad" autoComplete="tel" maxLength={20} />
        <Texte v="note" c="faible" style={{ marginTop: ESPACE.s }}>Tu peux utiliser le téléphone d'un parent.</Texte>
      </Ecran>
    );
  }

  return (
    <Ecran bords={['top', 'bottom']} pied={<>{erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}<Bouton titre="Valider" onPress={verifier} chargement={envoi} desactive={!/^\d{6}$/.test(code.trim())} /></>}>
      <EnteteEtapes progression={0.66} onRetour={() => { setErreur(null); setEtape('telephone'); }} />
      <Texte v="titre">Entre ton code</Texte>
      <Texte c="doux" style={{ marginTop: ESPACE.xs, marginBottom: ESPACE.l }}>Code à 6 chiffres envoyé au {telephone.trim()}.</Texte>
      <Champ accessibilityLabel="Code à 6 chiffres" value={code} onChangeText={setCode} placeholder="000000" keyboardType="number-pad" autoComplete="one-time-code" maxLength={6} style={{ letterSpacing: 6, fontSize: 22 }} />
      {codeDemo && <Texte v="note" c="alerte" style={{ marginTop: ESPACE.s }}>Mode démonstration : aucun message n'est envoyé. Code : {codeDemo}</Texte>}
      <Pressable accessibilityRole="button" onPress={demanderCode} hitSlop={10} style={{ marginTop: ESPACE.l }}>
        <Texte v="petit" c="accent">Renvoyer un code</Texte>
      </Pressable>
    </Ecran>
  );
}
