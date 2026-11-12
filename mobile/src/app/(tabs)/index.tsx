import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CarteOpportunite } from '../../components/CarteOpportunite';
import { BandeauHorsLigne, Barre, Bouton, Carte, Ecran, Etat, Puce, Section } from '../../components/ui';
import { Evenement, Fil, Recommandations } from '../../lib/api';
import { formaterDate, niveauJeu } from '../../lib/format';
import { useSession } from '../../lib/session';
import { couleurs, espace, rayon } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

export default function Accueil() {
  const { eleve, rafraichir } = useSession();
  const aPasseTest = !!eleve?.scoresRiasec;
  const fil = useChargement<Fil>(eleve ? `/scout/eleves/${eleve.id}/fil` : null);
  const radar = useChargement<Evenement[]>(eleve ? `/radar?niveau=${eleve.niveau}&province=${encodeURIComponent(eleve.province)}` : null);
  const reco = useChargement<Recommandations>(eleve && aPasseTest ? `/eleves/${eleve.id}/recommandations` : null);

  // Le profil (XP, badges) est relu à chaque retour sur l'accueil.
  // La référence évite de relancer l'effet quand le profil lui-même vient d'être mis à jour.
  const rafraichirRef = useRef(rafraichir);
  rafraichirRef.current = rafraichir;
  useFocusEffect(
    useCallback(() => {
      rafraichirRef.current();
    }, []),
  );

  if (!eleve) return null;
  const jeu = niveauJeu(eleve.xp);
  const prochain = radar.donnees?.[0];
  const premiere = fil.donnees?.pourToi[0];

  return (
    <Ecran>
      <BandeauHorsLigne visible={fil.horsLigne || radar.horsLigne} />
      <View style={styles.entete}>
        <View style={{ flex: 1 }}>
          <Text style={styles.salut}>Mbote, {eleve.prenom} 👋</Text>
          <Text style={styles.sous}>Un pas de plus vers ton avenir.</Text>
        </View>
        <View style={styles.niveau}>
          <Text style={styles.chiffreNiveau}>{jeu.niveau}</Text>
          <Text style={styles.libelleNiveau}>Niveau</Text>
        </View>
      </View>
      <Carte>
        <View style={styles.ligne}>
          <Text style={styles.xp}>⚡ {eleve.xp} XP</Text>
          <Text style={styles.reste}>Encore {jeu.restant} XP pour le niveau {jeu.niveau + 1}</Text>
        </View>
        <Barre valeur={jeu.progression} couleur={couleurs.soleil} />
      </Carte>

      {!aPasseTest && (
        <View style={styles.appel}>
          <Text style={styles.emojiAppel}>🧬</Text>
          <Text style={styles.titreAppel}>Découvre ton ADN</Text>
          <Text style={styles.texteAppel}>30 questions rapides pour connaître ton profil et les métiers faits pour toi. Gagne 100 XP.</Text>
          <Bouton titre="Passer le test" variante="secondaire" onPress={() => router.push('/test')} />
        </View>
      )}

      {prochain && (
        <Section titre="Prochaine échéance" action={<Text style={styles.lien} onPress={() => router.push('/(tabs)/radar')}>Tout voir</Text>}>
          <Carte onPress={() => router.push('/(tabs)/radar')} etiquette={prochain.titre}>
            <View style={styles.puces}>
              <Puce texte={prochain.enCours ? '🟢 En cours' : `📅 Dans ${prochain.dansJours} jour${prochain.dansJours > 1 ? 's' : ''}`} ton={prochain.enCours ? 'succes' : 'soleil'} />
              {prochain.aConfirmer && <Puce texte="Date à confirmer" />}
            </View>
            <Text style={styles.titreCarte}>{prochain.titre}</Text>
            <Text style={styles.texteCarte}>{prochain.enCours && prochain.dateFin ? `Jusqu'au ${formaterDate(prochain.dateFin)}` : formaterDate(prochain.dateDebut)}</Text>
          </Carte>
        </Section>
      )}

      <Section titre="Une opportunité pour toi" action={<Text style={styles.lien} onPress={() => router.push('/(tabs)/scout')}>Tout voir</Text>}>
        <Etat chargement={fil.chargement && !fil.donnees} erreur={fil.donnees ? null : fil.erreur} onReessayer={fil.recharger} vide={!!fil.donnees && !premiere} messageVide="Pas encore d'opportunité pour ton profil. Kesho continue de chercher." />
        {premiere && <CarteOpportunite element={premiere} onPress={() => router.push(`/opportunite/${premiere.opportunite.id}`)} />}
      </Section>

      {reco.donnees && (
        <Section titre="Métiers faits pour toi" action={<Text style={styles.lien} onPress={() => router.push('/resultat')}>Mon ADN</Text>}>
          {reco.donnees.metiers.slice(0, 3).map((m) => (
            <Carte key={m.slug} onPress={() => router.push(`/metier/${m.slug}`)} etiquette={m.nom}>
              <View style={styles.ligne}>
                <Text style={styles.titreCarte}>{m.emoji} {m.nom}</Text>
                <Puce texte={`${m.compatibilite} %`} ton="primaire" />
              </View>
              <Text style={styles.texteCarte}>{m.domaine}</Text>
            </Carte>
          ))}
        </Section>
      )}
    </Ecran>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', marginBottom: espace.m },
  salut: { fontSize: 26, fontWeight: '800', color: couleurs.texte, letterSpacing: -0.5 },
  sous: { fontSize: 15, color: couleurs.texteDoux, marginTop: 2 },
  niveau: { backgroundColor: couleurs.primaire, borderRadius: rayon.moyen, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  chiffreNiveau: { color: couleurs.blanc, fontWeight: '900', fontSize: 22 },
  libelleNiveau: { color: couleurs.soleil, fontWeight: '700', fontSize: 10 },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  xp: { fontSize: 16, fontWeight: '800', color: couleurs.texte },
  reste: { fontSize: 12, color: couleurs.texteDoux },
  appel: { backgroundColor: couleurs.primaire, borderRadius: rayon.grand, padding: espace.l, marginTop: espace.s, alignItems: 'center' },
  emojiAppel: { fontSize: 44 },
  titreAppel: { color: couleurs.blanc, fontWeight: '900', fontSize: 22, marginTop: 4 },
  texteAppel: { color: couleurs.blanc, opacity: 0.95, fontSize: 14, textAlign: 'center', lineHeight: 20, marginTop: 4, marginBottom: espace.s },
  lien: { color: couleurs.primaire, fontWeight: '700', fontSize: 14, padding: 6 },
  puces: { flexDirection: 'row', flexWrap: 'wrap' },
  titreCarte: { fontSize: 16, fontWeight: '700', color: couleurs.texte, flex: 1, marginRight: espace.s },
  texteCarte: { fontSize: 13, color: couleurs.texteDoux, marginTop: 2 },
});
