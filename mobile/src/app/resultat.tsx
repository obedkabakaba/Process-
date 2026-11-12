import { router, useLocalSearchParams } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { ScrollView, View } from 'react-native';
import { symboleProfil } from '../components/icones';
import { TuileMetier } from '../components/TuileMetier';
import { Barre, Bouton, Carte, Ecran, ESPACE, Etat, Hero, Icone, Ligne, Pastille, Section, Texte } from '../components/ui';
import { Recommandations } from '../lib/api';
import { useSession } from '../lib/session';
import { useChargement } from '../lib/useChargement';
import { useTheme } from '../theme/ThemeProvider';

export default function Resultat() {
  const t = useTheme();
  const { eleve } = useSession();
  const { xp } = useLocalSearchParams<{ xp?: string }>();
  const { donnees, chargement, erreur, recharger } = useChargement<Recommandations>(eleve?.scoresRiasec ? `/eleves/${eleve.id}/recommandations` : null);
  const xpGagne = Number(xp ?? 0);

  if (!eleve?.scoresRiasec) {
    return (
      <Ecran bords={['bottom']} pied={<Bouton titre="Passer le test" onPress={() => router.replace('/test')} />}>
        <Texte v="titre">Découvre ton ADN</Texte>
        <Texte c="doux" style={{ marginTop: ESPACE.s }}>30 questions, 3 minutes.</Texte>
      </Ecran>
    );
  }
  if (!donnees) {
    return (
      <Ecran bords={['bottom']}>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }

  const [dominant] = donnees.profil;
  const symbole = symboleProfil(dominant.type);

  return (
    <Ecran bords={['bottom']} pied={<Bouton titre="Voir mes opportunités" onPress={() => router.replace('/(tabs)/scout')} />}>
      <Hero>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Icone icone={symbole.icone} emoji={dominant.emoji} taille={40} couleur={t.c.heroAccent} />
          {xpGagne > 0 && <Pastille icone={Sparkles} ton="accent" texte={`+${xpGagne} XP`} />}
        </View>
        <Texte v="petit" c="heroDoux" style={{ marginTop: ESPACE.l }}>{eleve.prenom}, ton profil</Texte>
        <Texte v="geant" c="surHero">{dominant.nom}</Texte>
        <Texte c="heroDoux" style={{ marginTop: ESPACE.s }}>{dominant.resume}</Texte>
      </Hero>

      <Section titre="Tes forces">
        <Carte>
          {donnees.profil.map((p, i) => (
            <View key={p.type} style={{ marginTop: i === 0 ? 0 : ESPACE.m }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Texte v="fort">{p.nom}</Texte>
                <Texte v="fort" c="doux">{p.score} %</Texte>
              </View>
              <Barre valeur={p.score / 100} />
            </View>
          ))}
        </Carte>
      </Section>

      <Section titre="Métiers pour toi">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -ESPACE.m }} contentContainerStyle={{ paddingHorizontal: ESPACE.m, gap: 10 }}>
          {donnees.metiers.slice(0, 8).map((m) => (
            <TuileMetier key={m.slug} metier={m} largeur={156} onPress={() => router.push(`/metier/${m.slug}`)} />
          ))}
        </ScrollView>
      </Section>

      <Section titre="Options des humanités">
        <Carte plat>
          {donnees.options.slice(0, 3).map((o, i, liste) => (
            <Ligne key={o.slug} titre={o.nom} sousTitre={o.matieresCles.join(' · ')} dernier={i === liste.length - 1} droite={<Texte v="fort" c="accent">{o.compatibilite} %</Texte>} />
          ))}
        </Carte>
      </Section>

      <Texte v="note" c="faible" centre style={{ marginTop: ESPACE.l }}>Un point de départ, pas un verdict. Parles-en avec tes parents.</Texte>
    </Ecran>
  );
}
