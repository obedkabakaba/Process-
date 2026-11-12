import { router } from 'expo-router';
import { CircleCheck, OctagonAlert, ShieldCheck, TriangleAlert, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { CarteOpportunite } from '../../components/CarteOpportunite';
import { Bandeau, BandeauHorsLigne, Bouton, Carte, Champ, Ecran, ESPACE, Etat, Segments, Texte } from '../../components/ui';
import { envoyer, Fil, Verdict } from '../../lib/api';
import { sansEmoji } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';
import { useTheme } from '../../theme/ThemeProvider';

type Vue = 'pour_toi' | 'presque' | 'verifier';

function Verificateur() {
  const t = useTheme();
  const [texte, setTexte] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function verifier() {
    setEnvoi(true);
    setErreur(null);
    setVerdict(null);
    try {
      setVerdict(await envoyer<Verdict>('/scout/verifier-message', { texte: texte.trim() }));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  const aspect = verdict && {
    danger: { fond: t.c.dangerDoux, couleur: t.c.danger, icone: OctagonAlert, ton: 'danger' as const },
    prudence: { fond: t.c.alerteDoux, couleur: t.c.alerte, icone: TriangleAlert, ton: 'alerte' as const },
    aucune_alerte: { fond: t.c.succesDoux, couleur: t.c.succes, icone: CircleCheck, ton: 'succes' as const },
  }[verdict.niveau];

  return (
    <View style={{ gap: 12 }}>
      <Texte c="doux">Un message de bourse ou de visa te paraît louche ? Colle-le ici.</Texte>
      <Champ accessibilityLabel="Message à vérifier" value={texte} onChangeText={setTexte} placeholder="Colle le message" multiline maxLength={5000} />
      <Bouton titre="Vérifier" icone={ShieldCheck} onPress={verifier} chargement={envoi} desactive={texte.trim().length < 10} />
      {erreur && <Texte v="petit" c="danger">{erreur}</Texte>}
      {verdict && aspect && (
        <View accessibilityLiveRegion="polite" style={{ gap: 10, marginTop: ESPACE.s }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: aspect.fond, borderRadius: t.f.rayonM, padding: ESPACE.m }}>
            <aspect.icone size={26} color={aspect.couleur} strokeWidth={2.2} />
            <Texte v="section" c={aspect.ton} style={{ flex: 1 }}>{sansEmoji(verdict.titre)}</Texte>
          </View>
          {verdict.alertes.length > 0 && (
            <Carte>
              {verdict.alertes.map((a, i) => (
                <View key={a.code} style={{ flexDirection: 'row', gap: 10, marginTop: i === 0 ? 0 : 12 }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: aspect.couleur, marginTop: 8 }} />
                  <Texte style={{ flex: 1 }}>{a.message}</Texte>
                </View>
              ))}
            </Carte>
          )}
          <Texte v="note" c="faible">Ne paie jamais pour recevoir une bourse. Vérifie toujours sur le site officiel.</Texte>
        </View>
      )}
    </View>
  );
}

export default function Scout() {
  const { eleve } = useSession();
  const [vue, setVue] = useState<Vue>('pour_toi');
  const enAttente = eleve?.consentement === 'en_attente';
  const fil = useChargement<Fil>(eleve && !enAttente ? `/scout/eleves/${eleve.id}/fil` : null);
  const liste = vue === 'pour_toi' ? fil.donnees?.pourToi : fil.donnees?.presqueEligible;

  return (
    <Ecran>
      <Texte v="titre" accessibilityRole="header">Scout</Texte>
      <BandeauHorsLigne visible={fil.horsLigne} />
      <View style={{ marginTop: ESPACE.m }}>
        <Segments
          options={[
            { valeur: 'pour_toi', libelle: `Pour toi${fil.donnees ? ` · ${fil.donnees.pourToi.length}` : ''}` },
            { valeur: 'presque', libelle: `Presque${fil.donnees ? ` · ${fil.donnees.presqueEligible.length}` : ''}` },
            { valeur: 'verifier', libelle: 'Anti-arnaque' },
          ]}
          valeur={vue}
          onChange={setVue}
        />
      </View>
      <View style={{ marginTop: ESPACE.m }}>
        {vue === 'verifier' ? (
          <Verificateur />
        ) : enAttente ? (
          <Bandeau icone={UsersRound} titre="Il manque l'accord de ton parent" texte="Entre son code pour voir les opportunités auxquelles tu as droit." action="Entrer" onAction={() => router.push('/accord')} />
        ) : (
          <>
            <Etat
              chargement={fil.chargement && !fil.donnees}
              erreur={fil.donnees ? null : fil.erreur}
              onReessayer={fil.recharger}
              vide={!!liste && liste.length === 0}
              messageVide={vue === 'pour_toi' ? 'Complète ton profil pour débloquer des opportunités.' : 'Rien ici pour le moment.'}
            />
            {liste?.map((e) => <CarteOpportunite key={e.opportuniteId} element={e} onPress={() => router.push(`/opportunite/${e.opportunite.id}`)} />)}
          </>
        )}
      </View>
    </Ecran>
  );
}
