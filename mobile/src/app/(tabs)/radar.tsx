import { StyleSheet, Text, View } from 'react-native';
import { BandeauHorsLigne, Carte, Ecran, Etat, Puce, SousTitre, Titre } from '../../components/ui';
import { Evenement } from '../../lib/api';
import { formaterDate, LIBELLES_TYPE } from '../../lib/format';
import { useSession } from '../../lib/session';
import { couleurs, espace } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

export default function Radar() {
  const { eleve } = useSession();
  const { donnees, chargement, erreur, horsLigne, recharger } = useChargement<Evenement[]>(eleve ? `/radar?niveau=${eleve.niveau}&province=${encodeURIComponent(eleve.province)}` : null);

  return (
    <Ecran>
      <Titre>Radar 📡</Titre>
      <SousTitre>Les dates à ne pas rater pour ta classe.</SousTitre>
      <BandeauHorsLigne visible={horsLigne} />
      <View style={{ marginTop: espace.m }}>
        <Etat chargement={chargement && !donnees} erreur={donnees ? null : erreur} onReessayer={recharger} vide={!!donnees && donnees.length === 0} messageVide="Aucune date à venir pour ta classe." />
        {donnees?.map((e) => {
          const type = LIBELLES_TYPE[e.type] ?? { nom: e.type, emoji: '📅' };
          return (
            <Carte key={e.id}>
              <View style={styles.puces}>
                <Puce texte={`${type.emoji} ${type.nom}`} ton="primaire" />
                <Puce texte={e.enCours ? '🟢 En cours' : e.dansJours === 0 ? "Aujourd'hui" : `Dans ${e.dansJours} jour${e.dansJours > 1 ? 's' : ''}`} ton={e.enCours ? 'succes' : e.dansJours <= 14 ? 'danger' : 'soleil'} />
              </View>
              <Text style={styles.titre}>{e.titre}</Text>
              <Text style={styles.date}>
                {formaterDate(e.dateDebut)}{e.dateFin ? ` → ${formaterDate(e.dateFin)}` : ''}
              </Text>
              <Text style={styles.texte}>{e.description}</Text>
              {e.aConfirmer && <Text style={styles.note}>ℹ️ Période habituelle. La date officielle sera confirmée par le ministère ou l'établissement.</Text>}
            </Carte>
          );
        })}
      </View>
    </Ecran>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap' },
  titre: { fontSize: 17, fontWeight: '700', color: couleurs.texte, marginTop: espace.xs },
  date: { fontSize: 14, fontWeight: '700', color: couleurs.primaire, marginTop: 2 },
  texte: { fontSize: 14, color: couleurs.texteDoux, marginTop: espace.xs, lineHeight: 20 },
  note: { fontSize: 12, color: couleurs.texteDoux, marginTop: espace.s, lineHeight: 17, fontStyle: 'italic' },
});
