import { router } from 'expo-router';
import { Award, ClipboardCheck, Dna, LogOut, Palette, Trash2, UsersRound } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { symboleProfil } from '../../components/icones';
import { Bouton, Carte, Ecran, ESPACE, Ligne, Section, Texte, Vignette } from '../../components/ui';
import { envoyer, Referentiel } from '../../lib/api';
import { formaterDate, niveauJeu } from '../../lib/format';
import { estCurateur, useSession } from '../../lib/session';
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
  const { compte, eleve, deconnecter } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const [confirmation, setConfirmation] = useState(false);
  const [suppression, setSuppression] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
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
          {eleve.consentement === 'en_attente' && (
            <Ligne titre="Accord de ton parent" sousTitre="En attente : entre son code" gauche={<Vignette icone={UsersRound} emoji="👪" taille={40} ton="alerte" />} onPress={() => router.push('/accord')} />
          )}
          {estCurateur(compte) && (
            <Ligne titre="Espace curateur" sousTitre="Valider et publier les opportunités" gauche={<Vignette icone={ClipboardCheck} emoji="📋" taille={40} />} onPress={() => router.push('/curation')} />
          )}
          <Ligne titre="Apparence" sousTitre={`${t.nom} · ${libelleMode}`} gauche={<Vignette icone={Palette} emoji="🎨" taille={40} ton="neutre" />} onPress={() => router.push('/apparence')} dernier />
        </Carte>
      </Section>

      <Section titre="Mes informations" action="Modifier" onAction={() => router.push('/modifier')}>
        <Carte plat>
          <Info libelle="Classe" valeur={classe} />
          {eleve.section && <Info libelle="Section" valeur={eleve.section.charAt(0).toUpperCase() + eleve.section.slice(1)} />}
          <Info libelle="Naissance" valeur={eleve.dateNaissance ? formaterDate(eleve.dateNaissance) : 'Non renseignée'} />
          <Info libelle="Moyenne" valeur={eleve.moyenne !== null ? `${eleve.moyenne} %` : 'Non renseignée'} />
          <Info libelle="Langues" valeur={eleve.langues.map((l) => NOMS_LANGUES[l] ?? l).join(', ')} dernier />
        </Carte>
      </Section>

      <View style={{ marginTop: ESPACE.l, gap: ESPACE.s }}>
        <Texte v="note" c="faible" centre>Connecté avec le {compte?.telephone}</Texte>
        {erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}
        {confirmation ? (
          <Carte>
            <Texte v="fort">Te déconnecter de ce téléphone ?</Texte>
            <Texte v="petit" c="doux">Ton profil est conservé. Tu le retrouveras avec ton numéro.</Texte>
            <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
              <Bouton titre="Me déconnecter" compact onPress={async () => { await deconnecter(); router.replace('/bienvenue'); }} />
              <Bouton titre="Annuler" variante="secondaire" compact onPress={() => setConfirmation(false)} />
            </View>
          </Carte>
        ) : suppression ? (
          <Carte>
            <Texte v="fort">Supprimer ton compte pour toujours ?</Texte>
            <Texte v="petit" c="doux">Ton profil, ton test et tes XP seront effacés. C'est irréversible.</Texte>
            <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
              <Bouton
                titre="Supprimer"
                compact
                onPress={async () => {
                  try {
                    await envoyer(`/eleves/${eleve.id}`, {}, 'DELETE');
                    await deconnecter();
                    router.replace('/bienvenue');
                  } catch (e) {
                    setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
                  }
                }}
              />
              <Bouton titre="Annuler" variante="secondaire" compact onPress={() => setSuppression(false)} />
            </View>
          </Carte>
        ) : (
          <>
            <Bouton titre="Se déconnecter" variante="discret" icone={LogOut} onPress={() => setConfirmation(true)} />
            <Bouton titre="Supprimer mon compte" variante="discret" icone={Trash2} onPress={() => setSuppression(true)} />
          </>
        )}
      </View>
    </Ecran>
  );
}
