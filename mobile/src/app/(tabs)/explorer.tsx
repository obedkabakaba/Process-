import { router } from 'expo-router';
import { MapPin, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { TuileMetier } from '../../components/TuileMetier';
import { BandeauHorsLigne, Carte, Champ, Choix, Ecran, ESPACE, Etat, Filtres, Ligne, Segments, Texte } from '../../components/ui';
import { Etablissement, Metier } from '../../lib/api';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';
import { useTheme } from '../../theme/ThemeProvider';

const sansAccent = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const TYPES_ETABLISSEMENT: Record<string, string> = { universite: 'Université', institut_superieur: 'Institut supérieur', isp: 'Institut pédagogique', formation_pro: 'Formation pro' };

function paires<T>(liste: T[]): T[][] {
  const lignes: T[][] = [];
  for (let i = 0; i < liste.length; i += 2) lignes.push(liste.slice(i, i + 2));
  return lignes;
}

export default function Explorer() {
  const t = useTheme();
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
      <Texte v="titre" accessibilityRole="header">Explorer</Texte>
      <BandeauHorsLigne visible={source.horsLigne} />
      <View style={{ gap: 12, marginTop: ESPACE.m }}>
        <Champ icone={Search} accessibilityLabel="Rechercher" value={recherche} onChangeText={setRecherche} placeholder={vue === 'metiers' ? 'Un métier' : 'Une école, une ville'} />
        <Segments options={[{ valeur: 'metiers', libelle: 'Métiers' }, { valeur: 'ecoles', libelle: 'Écoles' }]} valeur={vue} onChange={setVue} />
        <Filtres>
          {vue === 'ecoles' && eleve && <Choix libelle={eleve.province} actif={maProvince} onPress={() => setMaProvince(!maProvince)} />}
          <Choix libelle="Tout" actif={domaine === null} onPress={() => setDomaine(null)} />
          {domaines.map((d) => (
            <Choix key={d} libelle={d} actif={domaine === d} onPress={() => setDomaine(domaine === d ? null : d)} />
          ))}
        </Filtres>
      </View>

      <View style={{ marginTop: ESPACE.m }}>
        <Etat chargement={source.chargement && !source.donnees} erreur={source.donnees ? null : source.erreur} onReessayer={source.recharger} vide={!!source.donnees && nb === 0} messageVide="Aucun résultat." />

        {vue === 'metiers' &&
          paires(metiersFiltres).map((ligne) => (
            <View key={ligne[0].slug} style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {ligne.map((m) => (
                <TuileMetier key={m.slug} metier={m} onPress={() => router.push(`/metier/${m.slug}`)} />
              ))}
              {ligne.length === 1 && <View style={{ flex: 1 }} />}
            </View>
          ))}

        {vue === 'ecoles' && ecolesFiltrees.length > 0 && (
          <Carte plat>
            {ecolesFiltrees.map((e, i) => (
              <Ligne
                key={e.slug}
                titre={e.nom}
                sousTitre={`${e.ville} · ${TYPES_ETABLISSEMENT[e.type] ?? e.type} · ${e.statut === 'public' ? 'Public' : 'Privé'}`}
                dernier={i === ecolesFiltrees.length - 1}
                gauche={
                  <View style={{ width: 44, height: 44, borderRadius: t.f.rayonS, backgroundColor: t.c.retrait, alignItems: 'center', justifyContent: 'center' }}>
                    {e.sigle ? <Text numberOfLines={1} style={[t.p.gras, { fontSize: e.sigle.length > 5 ? 8 : 10, color: t.c.texteDoux }]}>{e.sigle}</Text> : <MapPin size={18} color={t.c.texteDoux} />}
                  </View>
                }
              />
            ))}
          </Carte>
        )}
      </View>
    </Ecran>
  );
}
