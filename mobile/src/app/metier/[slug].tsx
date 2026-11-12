import { useLocalSearchParams } from 'expo-router';
import { Clock, GraduationCap, TrendingUp } from 'lucide-react-native';
import { View } from 'react-native';
import { symboleDomaine } from '../../components/icones';
import { BandeauHorsLigne, Carte, Ecran, ESPACE, Etat, Ligne, Pastille, Section, Texte, Vignette } from '../../components/ui';
import { MetierDetail } from '../../lib/api';
import { LIBELLES_DEMANDE } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';

export default function FicheMetier() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { eleve } = useSession();
  const { donnees: m, chargement, erreur, horsLigne, recharger } = useChargement<MetierDetail>(`/metiers/${slug}`);

  if (!m) {
    return (
      <Ecran bords={['bottom']}>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }
  const symbole = symboleDomaine(m.domaine);
  const demande = LIBELLES_DEMANDE[m.tendanceDemande];
  const ecoles = [...m.etablissements].sort((a, b) => Number(b.province === eleve?.province) - Number(a.province === eleve?.province));

  return (
    <Ecran bords={['bottom']}>
      <BandeauHorsLigne visible={horsLigne} />
      <Vignette icone={symbole.icone} emoji={m.emoji} taille={64} />
      <Texte v="geant" accessibilityRole="header" style={{ marginTop: ESPACE.m }}>{m.nom}</Texte>
      <Texte c="doux" style={{ marginTop: 2 }}>{m.domaine}</Texte>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {demande && <Pastille icone={TrendingUp} texte={`${demande.texte}${m.fiabiliteDonnees === 'estimation' ? ' (estimation)' : ''}`} ton={demande.ton} />}
        {m.dureeEtudesAns > 0 && <Pastille icone={Clock} texte={`${m.dureeEtudesAns} an${m.dureeEtudesAns > 1 ? 's' : ''} d'études`} />}
      </View>
      <Texte style={{ marginTop: ESPACE.m, fontSize: 16, lineHeight: 24 }}>{m.description}</Texte>

      <Section titre="Qualités utiles">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
          {m.competences.map((c) => (
            <Pastille key={c} texte={c} ton="accent" />
          ))}
        </View>
      </Section>

      <Section titre="Le chemin">
        <Carte plat>
          {m.options.map((o) => (
            <Ligne key={o.slug} titre={o.nom} sousTitre="Option des humanités" />
          ))}
          <Ligne titre={m.etudes} sousTitre="Études supérieures" gauche={<Vignette icone={GraduationCap} emoji="🎓" taille={36} ton="neutre" />} dernier />
        </Carte>
      </Section>

      {ecoles.length > 0 && (
        <Section titre="Où étudier">
          <Carte plat>
            {ecoles.map((e, i) => (
              <Ligne key={e.slug} titre={e.sigle ?? e.nom} sousTitre={`${e.sigle ? `${e.nom} · ` : ''}${e.ville}`} dernier={i === ecoles.length - 1} droite={e.province === eleve?.province ? <Pastille texte="Près de toi" ton="succes" /> : undefined} />
            ))}
          </Carte>
          <Texte v="note" c="faible" style={{ marginTop: ESPACE.s }}>Liste indicative. Vérifie la filière auprès de l'école.</Texte>
        </Section>
      )}
    </Ecran>
  );
}
