import { router } from 'expo-router';
import { Award, Dna, LogOut, Palette } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { symboleProfil } from '../../components/icones';
import { Bouton, Carte, Ecran, ESPACE, Ligne, Section, Texte, Vignette } from '../../components/ui';
import { Referentiel } from '../../lib/api';
import { formaterDate, niveauJeu } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';
import { useReglagesTheme } from '../../theme/ThemeProvider';

const NOMS_LANGUES: Record<string, string> = { fr: 'Français', ln: 'Lingala', sw: 'Swahili', lua: 'Tshiluba', kg: 'Kikongo', en: 'Anglais' };

function Stat({ valeur, libelle }: { valeur: string; libelle: string }) {
  return (
    <Carte style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
      <Texte v="sousTitre">{valeur}</Texte>
      <Texte v="note" c="doux">{libelle}</Texte>
    </Carte>
  );
}

function Info({ libelle, valeur, dernier }: { libelle: string; valeur: string; dernier?: boolean }) {
  return <Ligne titre={libelle} dernier={dernier} droite={<Texte c="doux" numberOfLines={1} style={{ flexShrink: 1, maxWidth: '60%', textAlign: 'right' }}>{valeur}</Texte>} />;
}

export default function Profil() {
  const { theme: t, mode } = useReglagesTheme();
  const { eleve, deconnecter } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const [confirmation, setConfirmation] = useState(false);
  if (!eleve) return null;

  const jeu = niveauJeu(eleve.xp);
  const classe = referentiel.donnees?.niveaux.find((n) => n.code === eleve.niveau)?.libelle ?? eleve.niveau;
  const profil = eleve.codeRiasec ? eleve.codeRiasec.split('').map((l) => symboleProfil(l).nom).join(' · ') : 'Passer le test · +100 XP';
  const libelleMode = { systeme: 'Automatique', clair: 'Clair', sombre: 'Sombre' }[mode];

  return (
    <Ecran>
      <View style={{ alignItems: 'center', paddingTop: ESPACE.m }}>
        <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: t.c.accentDoux, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[t.p.titre, { fontSize: 34, color: t.c.surAccentDoux }]}>{eleve.prenom.charAt(0).toUpperCase()}</Text>
        </View>
        <Texte v="titre" accessibilityRole="header" style={{ marginTop: 12 }}>{eleve.prenom}</Texte>
        <Texte c="doux">{classe} · {eleve.province}</Texte>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: ESPACE.l }}>
        <Stat valeur={String(eleve.xp)} libelle="XP" />
        <Stat valeur={String(jeu.niveau)} libelle="Niveau" />
        <Stat valeur={String(eleve.badges.length)} libelle={eleve.badges.length > 1 ? 'Badges' : 'Badge'} />
      </View>

      <Section titre="Mon parcours">
        <Carte plat>
          <Ligne titre="Mon ADN" sousTitre={profil} gauche={<Vignette icone={Dna} emoji="🧬" taille={40} />} onPress={() => router.push(eleve.codeRiasec ? '/resultat' : '/test')} />
          <Ligne titre="Badges" sousTitre={eleve.badges.includes('explorateur') ? 'Explorateur' : 'Aucun pour le moment'} gauche={<Vignette icone={Award} emoji="🏅" taille={40} ton="neutre" />} dernier />
        </Carte>
      </Section>

      <Section titre="Réglages">
        <Carte plat>
          <Ligne titre="Apparence" sousTitre={`${t.nom} · ${libelleMode}`} gauche={<Vignette icone={Palette} emoji="🎨" taille={40} ton="neutre" />} onPress={() => router.push('/apparence')} dernier />
        </Carte>
      </Section>

      <Section titre="Mes informations">
        <Carte plat>
          <Info libelle="Classe" valeur={classe} />
          {eleve.section && <Info libelle="Section" valeur={eleve.section.charAt(0).toUpperCase() + eleve.section.slice(1)} />}
          <Info libelle="Naissance" valeur={eleve.dateNaissance ? formaterDate(eleve.dateNaissance) : 'Non renseignée'} />
          <Info libelle="Moyenne" valeur={eleve.moyenne !== null ? `${eleve.moyenne} %` : 'Non renseignée'} />
          <Info libelle="Langues" valeur={eleve.langues.map((l) => NOMS_LANGUES[l] ?? l).join(', ')} dernier />
        </Carte>
      </Section>

      <View style={{ marginTop: ESPACE.l, gap: ESPACE.s }}>
        {confirmation ? (
          <Carte>
            <Texte v="fort">Effacer ton profil de ce téléphone ?</Texte>
            <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
              <Bouton titre="Effacer" compact onPress={async () => { await deconnecter(); router.replace('/bienvenue'); }} />
              <Bouton titre="Annuler" variante="secondaire" compact onPress={() => setConfirmation(false)} />
            </View>
          </Carte>
        ) : (
          <Bouton titre="Changer de profil" variante="discret" icone={LogOut} onPress={() => setConfirmation(true)} />
        )}
      </View>
    </Ecran>
  );
}
