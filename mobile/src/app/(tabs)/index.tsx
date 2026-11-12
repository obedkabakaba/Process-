import { router, useFocusEffect } from 'expo-router';
import { ArrowRight, Zap } from 'lucide-react-native';
import { useCallback, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { CarteOpportunite } from '../../components/CarteOpportunite';
import { symboleType } from '../../components/icones';
import { TuileMetier } from '../../components/TuileMetier';
import { BandeauHorsLigne, Barre, Bouton, Ecran, ESPACE, Etat, Hero, Icone, Section, Texte } from '../../components/ui';
import { Evenement, Fil, Recommandations } from '../../lib/api';
import { jourEtMois, niveauJeu } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';
import { useTheme } from '../../theme/ThemeProvider';

export default function Accueil() {
  const t = useTheme();
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
  const prochain = radar.donnees?.find((e) => !e.enCours) ?? radar.donnees?.[0];
  const opportunites = fil.donnees?.pourToi.slice(0, 2) ?? [];

  return (
    <Ecran>
      <BandeauHorsLigne visible={fil.horsLigne || radar.horsLigne} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.c.accentDoux, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[t.p.gras, { fontSize: 18, color: t.c.surAccentDoux }]}>{eleve.prenom.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Texte v="note" c="doux">Mbote</Texte>
          <Texte v="sousTitre">{eleve.prenom}</Texte>
        </View>
        <View accessibilityLabel={`${eleve.xp} XP, niveau ${jeu.niveau}`} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: t.c.retrait, borderRadius: 999, paddingHorizontal: 12, height: 36 }}>
          <Icone icone={Zap} emoji="⚡" taille={16} couleur={t.c.texte} />
          <Texte v="fort">{eleve.xp}</Texte>
        </View>
      </View>

      <View style={{ marginTop: ESPACE.l }}>
        {!aPasseTest ? (
          <Hero>
            <Texte v="petit" c="heroDoux">3 minutes · +100 XP</Texte>
            <Texte v="titre" c="surHero" style={{ marginTop: 4 }}>Découvre les métiers faits pour toi</Texte>
            <View style={{ marginTop: ESPACE.l }}>
              <Bouton titre="Passer le test" variante="surHero" compact icone={ArrowRight} onPress={() => router.push('/test')} />
            </View>
          </Hero>
        ) : prochain ? (
          <Hero onPress={() => router.push('/(tabs)/radar')} etiquette={prochain.titre}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: ESPACE.m }}>
              <View style={{ flex: 1 }}>
                <Texte v="petit" c="heroDoux">{symboleType(prochain.type).nom} · {jourEtMois(prochain.dateDebut).jour} {jourEtMois(prochain.dateDebut).mois}</Texte>
                <Texte v="sousTitre" c="surHero" numberOfLines={2} style={{ marginTop: 4 }}>{prochain.titre}</Texte>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Texte v="geant" c="heroAccent">{prochain.dansJours}</Texte>
                <Texte v="note" c="heroDoux">jours</Texte>
              </View>
            </View>
          </Hero>
        ) : null}
      </View>

      <View style={{ marginTop: ESPACE.m, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Texte v="note" c="doux">Niveau {jeu.niveau}</Texte>
        <View style={{ flex: 1 }}>
          <Barre valeur={jeu.progression} hauteur={6} />
        </View>
        <Texte v="note" c="faible">{jeu.restant} XP</Texte>
      </View>

      <Section titre="Pour toi" action="Tout voir" onAction={() => router.push('/(tabs)/scout')}>
        <Etat chargement={fil.chargement && !fil.donnees} erreur={fil.donnees ? null : fil.erreur} onReessayer={fil.recharger} vide={!!fil.donnees && opportunites.length === 0} messageVide="Kesho cherche des opportunités pour toi." />
        {opportunites.map((e) => (
          <CarteOpportunite key={e.opportuniteId} element={e} onPress={() => router.push(`/opportunite/${e.opportunite.id}`)} />
        ))}
      </Section>

      {reco.donnees && (
        <Section titre="Tes métiers" action="Mon ADN" onAction={() => router.push('/resultat')}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -ESPACE.m }} contentContainerStyle={{ paddingHorizontal: ESPACE.m, gap: 10 }}>
            {reco.donnees.metiers.slice(0, 8).map((m) => (
              <TuileMetier key={m.slug} metier={m} largeur={156} onPress={() => router.push(`/metier/${m.slug}`)} />
            ))}
          </ScrollView>
        </Section>
      )}
    </Ecran>
  );
}
