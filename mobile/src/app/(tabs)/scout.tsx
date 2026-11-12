import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CarteOpportunite } from '../../components/CarteOpportunite';
import { BandeauHorsLigne, Bouton, Carte, Ecran, Etat, Onglets, SousTitre, Titre } from '../../components/ui';
import { envoyer, Fil, Verdict } from '../../lib/api';
import { useSession } from '../../lib/session';
import { couleurs, espace, rayon } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

type Vue = 'pour_toi' | 'presque' | 'verifier';

const COULEURS_VERDICT = {
  danger: { fond: couleurs.dangerClair, texte: '#991B1B' },
  prudence: { fond: couleurs.alerteClair, texte: '#92400E' },
  aucune_alerte: { fond: couleurs.succesClair, texte: '#046C4E' },
};

function Verificateur() {
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

  return (
    <View>
      <Text style={styles.aide}>Tu as reçu un message de « bourse », de « visa » ou d'« emploi » sur WhatsApp ou Facebook ? Colle-le ici avant de répondre ou de payer.</Text>
      <TextInput accessibilityLabel="Message à vérifier" value={texte} onChangeText={setTexte} placeholder="Colle le message ici…" placeholderTextColor={couleurs.texteDoux} style={styles.zone} multiline maxLength={5000} textAlignVertical="top" />
      <Bouton titre="🛡️ Vérifier ce message" onPress={verifier} chargement={envoi} desactive={texte.trim().length < 10} />
      {erreur && <Text style={styles.erreur}>{erreur}</Text>}
      {verdict && (
        <View accessibilityLiveRegion="polite">
          <View style={[styles.verdict, { backgroundColor: COULEURS_VERDICT[verdict.niveau].fond }]}>
            <Text style={[styles.titreVerdict, { color: COULEURS_VERDICT[verdict.niveau].texte }]}>{verdict.titre}</Text>
          </View>
          {verdict.alertes.map((a) => (
            <Carte key={a.code}>
              <Text style={styles.alerte}>⚠️ {a.message}</Text>
            </Carte>
          ))}
          <Text style={styles.titreConseils}>Les bons réflexes</Text>
          {verdict.conseils.map((c) => (
            <Text key={c} style={styles.conseil}>• {c}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

export default function Scout() {
  const { eleve } = useSession();
  const [vue, setVue] = useState<Vue>('pour_toi');
  const fil = useChargement<Fil>(eleve ? `/scout/eleves/${eleve.id}/fil` : null);
  const liste = vue === 'pour_toi' ? fil.donnees?.pourToi : fil.donnees?.presqueEligible;

  return (
    <Ecran>
      <Titre>Scout 🎯</Titre>
      <SousTitre>Les bourses, concours et programmes auxquels tu as droit.</SousTitre>
      <BandeauHorsLigne visible={fil.horsLigne} />
      <Onglets
        options={[
          { valeur: 'pour_toi', libelle: `Pour toi${fil.donnees ? ` (${fil.donnees.pourToi.length})` : ''}` },
          { valeur: 'presque', libelle: `Presque${fil.donnees ? ` (${fil.donnees.presqueEligible.length})` : ''}` },
          { valeur: 'verifier', libelle: '🛡️ Anti-arnaque' },
        ]}
        valeur={vue}
        onChange={setVue}
      />
      <View style={{ marginTop: espace.m }}>
        {vue === 'verifier' ? (
          <Verificateur />
        ) : (
          <>
            {vue === 'presque' && <Text style={styles.aide}>Il ne te manque qu'un seul critère pour ces opportunités. Regarde comment l'obtenir.</Text>}
            <Etat
              chargement={fil.chargement && !fil.donnees}
              erreur={fil.donnees ? null : fil.erreur}
              onReessayer={fil.recharger}
              vide={!!liste && liste.length === 0}
              messageVide={vue === 'pour_toi' ? "Pas encore d'opportunité pour ton profil. Complète ton profil pour en débloquer plus." : 'Rien ici pour le moment.'}
            />
            {liste?.map((e) => <CarteOpportunite key={e.opportuniteId} element={e} onPress={() => router.push(`/opportunite/${e.opportunite.id}`)} />)}
          </>
        )}
      </View>
    </Ecran>
  );
}

const styles = StyleSheet.create({
  aide: { fontSize: 14, color: couleurs.texteDoux, lineHeight: 20, marginBottom: espace.m },
  zone: { backgroundColor: couleurs.carte, borderWidth: 1.5, borderColor: couleurs.bordure, borderRadius: rayon.moyen, padding: espace.m, minHeight: 140, fontSize: 16, color: couleurs.texte },
  erreur: { color: couleurs.danger, fontWeight: '600', marginTop: espace.s },
  verdict: { borderRadius: rayon.moyen, padding: espace.m, marginVertical: espace.m },
  titreVerdict: { fontSize: 17, fontWeight: '800', lineHeight: 23 },
  alerte: { fontSize: 14, color: couleurs.texte, lineHeight: 20 },
  titreConseils: { fontSize: 15, fontWeight: '700', color: couleurs.texte, marginTop: espace.m, marginBottom: espace.xs },
  conseil: { fontSize: 14, color: couleurs.texteDoux, lineHeight: 21, marginBottom: 4 },
});
