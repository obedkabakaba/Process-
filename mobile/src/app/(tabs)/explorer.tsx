import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { BandeauHorsLigne, Carte, Choix, Ecran, Etat, Onglets, Puce, SousTitre, Titre } from '../../components/ui';
import { Etablissement, Metier } from '../../lib/api';
import { LIBELLES_DEMANDE } from '../../lib/format';
import { useSession } from '../../lib/session';
import { couleurs, espace, rayon } from '../../lib/theme';
import { useChargement } from '../../lib/useChargement';

const sansAccent = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const TYPES_ETABLISSEMENT: Record<string, string> = { universite: 'Université', institut_superieur: 'Institut supérieur', isp: 'Institut pédagogique', formation_pro: 'Formation professionnelle' };

export default function Explorer() {
  const { eleve } = useSession();
  const [vue, setVue] = useState<'metiers' | 'ecoles'>('metiers');
  const [recherche, setRecherche] = useState('');
  const [domaine, setDomaine] = useState<string | null>(null);
  const [maProvince, setMaProvince] = useState(false);
  const metiers = useChargement<Metier[]>('/metiers');
  const ecoles = useChargement<Etablissement[]>('/etablissements');

  const domaines = useMemo(() => [...new Set((metiers.donnees ?? []).map((m) => m.domaine))].sort(), [metiers.donnees]);
  const q = sansAccent(recherche.trim());

  const metiersFiltres = (metiers.donnees ?? []).filter((m) => (!domaine || m.domaine === domaine) && (!q || sansAccent(`${m.nom} ${m.description} ${m.domaine}`).includes(q)));
  const ecolesFiltrees = (ecoles.donnees ?? []).filter(
    (e) => (!maProvince || e.province === eleve?.province) && (!domaine || e.domaines.includes(domaine)) && (!q || sansAccent(`${e.nom} ${e.sigle ?? ''} ${e.ville}`).includes(q)),
  );
  const source = vue === 'metiers' ? metiers : ecoles;
  const nb = vue === 'metiers' ? metiersFiltres.length : ecolesFiltrees.length;

  return (
    <Ecran>
      <Titre>Explorer</Titre>
      <SousTitre>Tous les métiers et les écoles qui y mènent.</SousTitre>
      <BandeauHorsLigne visible={source.horsLigne} />
      <Onglets options={[{ valeur: 'metiers', libelle: '💼 Métiers' }, { valeur: 'ecoles', libelle: '🏛️ Écoles' }]} valeur={vue} onChange={setVue} />
      <TextInput accessibilityLabel="Rechercher" value={recherche} onChangeText={setRecherche} placeholder={vue === 'metiers' ? 'Chercher un métier…' : 'Chercher une école ou une ville…'} placeholderTextColor={couleurs.texteDoux} style={styles.recherche} />
      <View style={styles.filtres}>
        {vue === 'ecoles' && eleve && <Choix libelle={`📍 ${eleve.province}`} actif={maProvince} onPress={() => setMaProvince(!maProvince)} />}
        <Choix libelle="Tous les domaines" actif={domaine === null} onPress={() => setDomaine(null)} />
        {domaines.map((d) => (
          <Choix key={d} libelle={d} actif={domaine === d} onPress={() => setDomaine(domaine === d ? null : d)} />
        ))}
      </View>

      <Etat chargement={source.chargement && !source.donnees} erreur={source.donnees ? null : source.erreur} onReessayer={source.recharger} vide={!!source.donnees && nb === 0} messageVide="Aucun résultat. Essaie un autre mot ou un autre domaine." />

      {vue === 'metiers' &&
        metiersFiltres.map((m) => {
          const demande = LIBELLES_DEMANDE[m.tendanceDemande];
          return (
            <Carte key={m.slug} onPress={() => router.push(`/metier/${m.slug}`)} etiquette={m.nom}>
              <Text style={styles.titre}>{m.emoji} {m.nom}</Text>
              <Text style={styles.texte} numberOfLines={2}>{m.description}</Text>
              <View style={styles.puces}>
                <Puce texte={m.domaine} ton="primaire" />
                {demande && <Puce texte={demande.texte} ton={demande.ton} />}
              </View>
            </Carte>
          );
        })}

      {vue === 'ecoles' &&
        ecolesFiltrees.map((e) => (
          <Carte key={e.slug}>
            <Text style={styles.titre}>{e.sigle ? `${e.sigle} · ` : ''}{e.nom}</Text>
            <Text style={styles.texte}>📍 {e.ville}, {e.province}</Text>
            <View style={styles.puces}>
              <Puce texte={TYPES_ETABLISSEMENT[e.type] ?? e.type} ton="primaire" />
              <Puce texte={e.statut === 'public' ? 'Public' : 'Privé'} />
            </View>
            <Text style={styles.domaines}>{e.domaines.join(' · ')}</Text>
          </Carte>
        ))}
    </Ecran>
  );
}

const styles = StyleSheet.create({
  recherche: { backgroundColor: couleurs.carte, borderWidth: 1.5, borderColor: couleurs.bordure, borderRadius: rayon.moyen, paddingHorizontal: espace.m, minHeight: 48, fontSize: 16, color: couleurs.texte, marginTop: espace.m },
  filtres: { flexDirection: 'row', flexWrap: 'wrap', marginTop: espace.m, marginBottom: espace.s },
  titre: { fontSize: 16, fontWeight: '700', color: couleurs.texte },
  texte: { fontSize: 14, color: couleurs.texteDoux, marginTop: 2, lineHeight: 20 },
  puces: { flexDirection: 'row', flexWrap: 'wrap', marginTop: espace.s },
  domaines: { fontSize: 12, color: couleurs.texteDoux, lineHeight: 17 },
});
