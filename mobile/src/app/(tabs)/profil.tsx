import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Barre, Bouton, Carte, Ecran, Puce, Section, Titre } from '../../components/ui';
import { Referentiel } from '../../lib/api';
import { formaterDate, niveauJeu } from '../../lib/format';
import { useSession } from '../../lib/session';
import { couleurs, espace } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

const BADGES: Record<string, { nom: string; emoji: string }> = { explorateur: { nom: 'Explorateur', emoji: '🧭' } };
const TYPES: Record<string, string> = { R: '🛠️ Bâtisseur', I: '🔬 Chercheur', A: '🎨 Créatif', S: '🤝 Aidant', E: '🚀 Leader', C: '📊 Organisateur' };

function Ligne({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View style={styles.ligne}>
      <Text style={styles.libelle}>{libelle}</Text>
      <Text style={styles.valeur}>{valeur}</Text>
    </View>
  );
}

export default function Profil() {
  const { eleve, deconnecter } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const [confirmation, setConfirmation] = useState(false);
  if (!eleve) return null;

  const jeu = niveauJeu(eleve.xp);
  const classe = referentiel.donnees?.niveaux.find((n) => n.code === eleve.niveau)?.libelle ?? eleve.niveau;
  const incomplet = !eleve.dateNaissance || eleve.moyenne === null || !eleve.sexe;

  return (
    <Ecran>
      <Titre>{eleve.prenom}</Titre>
      <Text style={styles.sous}>{classe} · {eleve.province}</Text>

      <Carte style={{ marginTop: espace.m }}>
        <View style={styles.ligne}>
          <Text style={styles.xp}>Niveau {jeu.niveau}</Text>
          <Text style={styles.libelle}>⚡ {eleve.xp} XP</Text>
        </View>
        <Barre valeur={jeu.progression} couleur={couleurs.soleil} />
      </Carte>

      <Section titre="Mon ADN">
        {eleve.codeRiasec ? (
          <Carte onPress={() => router.push('/resultat')} etiquette="Voir mon ADN">
            <View style={styles.puces}>
              {eleve.codeRiasec.split('').map((l) => (
                <Puce key={l} texte={TYPES[l] ?? l} ton="primaire" />
              ))}
            </View>
            <Text style={styles.lien}>Voir mes métiers et mes options →</Text>
          </Carte>
        ) : (
          <Carte>
            <Text style={styles.libelle}>Tu n'as pas encore passé le test.</Text>
            <Bouton titre="Passer le test (+100 XP)" onPress={() => router.push('/test')} />
          </Carte>
        )}
      </Section>

      <Section titre="Mes badges">
        <View style={styles.puces}>
          {eleve.badges.length === 0 && <Text style={styles.libelle}>Passe le test pour gagner ton premier badge.</Text>}
          {eleve.badges.map((b) => (
            <Puce key={b} texte={`${BADGES[b]?.emoji ?? '🏅'} ${BADGES[b]?.nom ?? b}`} ton="soleil" />
          ))}
        </View>
      </Section>

      <Section titre="Mes informations">
        <Carte>
          <Ligne libelle="Classe" valeur={classe} />
          {eleve.section && <Ligne libelle="Section" valeur={eleve.section} />}
          <Ligne libelle="Province" valeur={eleve.province} />
          <Ligne libelle="Date de naissance" valeur={eleve.dateNaissance ? formaterDate(eleve.dateNaissance) : 'Non renseignée'} />
          <Ligne libelle="Moyenne" valeur={eleve.moyenne !== null ? `${eleve.moyenne} %` : 'Non renseignée'} />
          <Ligne libelle="Langues" valeur={eleve.langues.join(', ')} />
        </Carte>
        {incomplet && <Text style={styles.note}>💡 Un profil complet débloque plus d'opportunités dans Scout.</Text>}
      </Section>

      {confirmation ? (
        <Carte style={{ marginTop: espace.l }}>
          <Text style={styles.valeur}>Effacer ton profil de ce téléphone ?</Text>
          <Text style={styles.libelle}>Tu devras recréer un profil pour continuer.</Text>
          <Bouton titre="Oui, effacer" onPress={async () => { await deconnecter(); router.replace('/bienvenue'); }} />
          <Bouton titre="Annuler" variante="discret" onPress={() => setConfirmation(false)} />
        </Carte>
      ) : (
        <Bouton titre="Changer de profil" variante="discret" onPress={() => setConfirmation(true)} />
      )}
    </Ecran>
  );
}

const styles = StyleSheet.create({
  sous: { fontSize: 15, color: couleurs.texteDoux, marginTop: 2 },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, gap: espace.m },
  libelle: { fontSize: 14, color: couleurs.texteDoux },
  valeur: { fontSize: 14, fontWeight: '700', color: couleurs.texte, flexShrink: 1, textAlign: 'right' },
  xp: { fontSize: 17, fontWeight: '800', color: couleurs.texte },
  puces: { flexDirection: 'row', flexWrap: 'wrap' },
  lien: { color: couleurs.primaire, fontWeight: '700', fontSize: 14, marginTop: espace.xs },
  note: { fontSize: 13, color: couleurs.texteDoux, lineHeight: 19 },
});
