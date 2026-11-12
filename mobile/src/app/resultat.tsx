import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Barre, Bouton, Carte, Ecran, Etat, Puce, Section, SousTitre, Titre } from '../components/ui';
import { Recommandations } from '../lib/api';
import { useSession } from '../lib/session';
import { couleurs, espace, rayon } from '../lib/theme';
import { useChargement } from '../lib/useChargement';

export default function Resultat() {
  const { eleve } = useSession();
  const { xp } = useLocalSearchParams<{ xp?: string }>();
  const { donnees, chargement, erreur, recharger } = useChargement<Recommandations>(eleve?.scoresRiasec ? `/eleves/${eleve.id}/recommandations` : null);
  const xpGagne = Number(xp ?? 0);

  if (!eleve?.scoresRiasec) {
    return (
      <Ecran>
        <Titre>Découvre ton ADN</Titre>
        <SousTitre>Réponds à 30 questions rapides pour connaître ton profil et les métiers qui te correspondent.</SousTitre>
        <Bouton titre="Passer le test" onPress={() => router.replace('/test')} />
      </Ecran>
    );
  }
  if (!donnees) {
    return (
      <Ecran>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }

  const [dominant] = donnees.profil;
  const enFinDeBase = eleve.niveau === 'EB7' || eleve.niveau === 'EB8';

  return (
    <Ecran bords={['bottom']}>
      {xpGagne > 0 && (
        <View style={styles.xp}>
          <Text style={styles.texteXp}>🎉 +{xpGagne} XP · Badge « Explorateur » débloqué</Text>
        </View>
      )}
      <View style={styles.hero}>
        <Text style={styles.emojiHero}>{dominant.emoji}</Text>
        <Text style={styles.surtitre}>{eleve.prenom}, tu es surtout</Text>
        <Text style={styles.nomProfil}>{dominant.nom}</Text>
        <Text style={styles.resume}>{dominant.resume}</Text>
      </View>

      <Section titre="Tes trois forces">
        {donnees.profil.map((p) => (
          <Carte key={p.type}>
            <View style={styles.ligneForce}>
              <Text style={styles.nomForce}>{p.emoji} {p.nom}</Text>
              <Text style={styles.scoreForce}>{p.score} %</Text>
            </View>
            <Barre valeur={p.score / 100} />
          </Carte>
        ))}
      </Section>

      <Section titre="Métiers faits pour toi">
        {donnees.metiers.slice(0, 6).map((m) => (
          <Carte key={m.slug} onPress={() => router.push(`/metier/${m.slug}`)} etiquette={m.nom}>
            <View style={styles.ligneForce}>
              <Text style={styles.nomMetier}>{m.emoji} {m.nom}</Text>
              <Puce texte={`${m.compatibilite} %`} ton="primaire" />
            </View>
            <Text style={styles.domaine}>{m.domaine}</Text>
          </Carte>
        ))}
      </Section>

      <Section titre={enFinDeBase ? 'Options à envisager après la 8e' : 'Options des humanités qui te ressemblent'}>
        {donnees.options.slice(0, 3).map((o) => (
          <Carte key={o.slug}>
            <View style={styles.ligneForce}>
              <Text style={styles.nomMetier}>{o.nom}</Text>
              <Puce texte={`${o.compatibilite} %`} ton="soleil" />
            </View>
            <Text style={styles.domaine}>{o.description}</Text>
          </Carte>
        ))}
      </Section>

      <Text style={styles.note}>Ce test est un point de départ, pas un verdict. Parles-en avec tes parents et tes enseignants.</Text>
      <Bouton titre="Voir mes opportunités" onPress={() => router.replace('/(tabs)/scout')} />
      <Bouton titre="Aller à l'accueil" variante="secondaire" onPress={() => router.replace('/(tabs)')} />
    </Ecran>
  );
}

const styles = StyleSheet.create({
  xp: { backgroundColor: couleurs.soleilClair, borderRadius: rayon.moyen, padding: espace.m, marginBottom: espace.m },
  texteXp: { color: '#7A5600', fontWeight: '700', fontSize: 15, textAlign: 'center' },
  hero: { backgroundColor: couleurs.primaire, borderRadius: rayon.grand, padding: espace.l, alignItems: 'center' },
  emojiHero: { fontSize: 64 },
  surtitre: { color: couleurs.soleil, fontWeight: '700', fontSize: 14, marginTop: espace.s },
  nomProfil: { color: couleurs.blanc, fontWeight: '900', fontSize: 34, letterSpacing: -1 },
  resume: { color: couleurs.blanc, fontSize: 15, textAlign: 'center', marginTop: espace.s, lineHeight: 21, opacity: 0.95 },
  ligneForce: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  nomForce: { fontSize: 16, fontWeight: '700', color: couleurs.texte },
  scoreForce: { fontSize: 15, fontWeight: '700', color: couleurs.primaire },
  nomMetier: { fontSize: 16, fontWeight: '700', color: couleurs.texte, flex: 1, marginRight: espace.s },
  domaine: { fontSize: 13, color: couleurs.texteDoux, lineHeight: 18 },
  note: { fontSize: 13, color: couleurs.texteDoux, textAlign: 'center', marginTop: espace.l, lineHeight: 19 },
});
