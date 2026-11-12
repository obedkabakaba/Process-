import { Redirect } from 'expo-router';
import { Plus, RefreshCw } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Bandeau, Bouton, Carte, Champ, Choix, Ecran, ESPACE, Etat, Etiquette, Pastille, Section, Texte } from '../../components/ui';
import { BilanCollecte, envoyer, obtenir, SourceCuration } from '../../lib/api';
import { formaterDate } from '../../lib/format';
import { estCurateur, useSession } from '../../lib/session';

const VIDE = { nom: '', url: '', format: 'rss', sourceType: 'officielle' };

/** Sources que Scout surveille. Chaque nouvelle annonce devient un brouillon à valider. */
export default function Sources() {
  const { compte } = useSession();
  const [sources, setSources] = useState<SourceCuration[] | null>(null);
  const [ajout, setAjout] = useState(false);
  const [f, setF] = useState(VIDE);
  const [occupe, setOccupe] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [bilans, setBilans] = useState<Record<string, BilanCollecte>>({});

  const charger = useCallback(async () => {
    try {
      setSources(await obtenir<SourceCuration[]>('/curation/sources'));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }, []);
  useEffect(() => { charger(); }, [charger]);

  if (!estCurateur(compte)) return <Redirect href="/(tabs)" />;

  async function executer(nom: string, fn: () => Promise<void>) {
    setOccupe(nom);
    setErreur(null);
    try {
      await fn();
      await charger();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setOccupe(null);
    }
  }

  const ajouter = () => executer('ajout', async () => { await envoyer('/curation/sources', { ...f, nom: f.nom.trim(), url: f.url.trim() }); setF(VIDE); setAjout(false); });
  const collecter = (s: SourceCuration) => executer(s.id, async () => { const bilan = await envoyer<BilanCollecte>(`/curation/sources/${s.id}/collecter`); setBilans((b) => ({ ...b, [s.id]: bilan })); });
  const basculer = (s: SourceCuration) => executer(s.id, async () => { await envoyer(`/curation/sources/${s.id}`, { actif: !s.actif }, 'PATCH'); });

  return (
    <Ecran bords={['bottom']}>
      {ajout ? (
        <Carte>
          <Texte v="section">Nouvelle source</Texte>
          <Etiquette>Nom</Etiquette>
          <Champ accessibilityLabel="Nom de la source" value={f.nom} onChangeText={(v) => setF({ ...f, nom: v })} placeholder="Bourses de l'université X" maxLength={100} />
          <Etiquette>Adresse</Etiquette>
          <Champ accessibilityLabel="Adresse de la source" value={f.url} onChangeText={(v) => setF({ ...f, url: v })} placeholder="https://" autoCapitalize="none" keyboardType="url" />
          <Etiquette>Format</Etiquette>
          <View style={{ flexDirection: 'row', gap: ESPACE.s }}>
            <Choix libelle="Flux RSS" actif={f.format === 'rss'} onPress={() => setF({ ...f, format: 'rss' })} />
            <Choix libelle="Page web" actif={f.format === 'page'} onPress={() => setF({ ...f, format: 'page' })} />
          </View>
          <Etiquette>Fiabilité</Etiquette>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
            <Choix libelle="Site officiel" actif={f.sourceType === 'officielle'} onPress={() => setF({ ...f, sourceType: 'officielle' })} />
            <Choix libelle="Agrégateur" actif={f.sourceType === 'agregateur'} onPress={() => setF({ ...f, sourceType: 'agregateur' })} />
            <Choix libelle="Autre site" actif={f.sourceType === 'web'} onPress={() => setF({ ...f, sourceType: 'web' })} />
          </View>
          <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.l }}>
            <View style={{ flex: 1 }}><Bouton titre="Ajouter" onPress={ajouter} chargement={occupe === 'ajout'} desactive={f.nom.trim().length < 2 || !/^https?:\/\/\S+\.\S+/.test(f.url.trim())} /></View>
            <View style={{ flex: 1 }}><Bouton titre="Annuler" variante="secondaire" onPress={() => setAjout(false)} /></View>
          </View>
        </Carte>
      ) : (
        <Bouton titre="Ajouter une source" icone={Plus} onPress={() => setAjout(true)} />
      )}
      {erreur && <Texte v="petit" c="danger" style={{ marginTop: ESPACE.s }}>{erreur}</Texte>}

      <Section titre="Sources surveillées">
        <Etat chargement={!sources && !erreur} vide={sources?.length === 0} messageVide="Aucune source. Ajoute le flux RSS ou la page d'actualités d'un organisme." />
        {sources?.map((s) => {
          const bilan = bilans[s.id];
          return (
            <Carte key={s.id} style={{ marginBottom: 10 }}>
              <Texte v="fort">{s.nom}</Texte>
              <Texte v="note" c="doux" numberOfLines={1}>{s.url}</Texte>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                <Pastille texte={s.format === 'rss' ? 'Flux RSS' : 'Page web'} />
                <Pastille texte={s.actif ? 'Active' : 'En pause'} ton={s.actif ? 'succes' : 'neutre'} />
                {s.dernierPassage && <Pastille texte={`Lu le ${formaterDate(s.dernierPassage)}`} />}
                {s.dernierStatut && s.dernierStatut !== 'ok' && <Pastille texte="Erreur" ton="danger" />}
              </View>
              {s.dernierStatut && s.dernierStatut !== 'ok' && <Texte v="note" c="danger" style={{ marginTop: 6 }}>{s.dernierStatut}</Texte>}
              {bilan && (
                <View style={{ marginTop: ESPACE.s }}>
                  <Bandeau icone={RefreshCw} ton={bilan.erreurs > 0 ? 'alerte' : 'succes'} titre={`${bilan.brouillons} brouillon(s) créé(s)`} texte={`${bilan.lues} annonce(s) lue(s), ${bilan.nouvelles} nouvelle(s), ${bilan.ignorees} ignorée(s), ${bilan.erreurs} erreur(s)${bilan.restantes ? `, ${bilan.restantes} en attente du prochain passage` : ''}.`} />
                </View>
              )}
              <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
                <Bouton titre="Collecter" compact icone={RefreshCw} onPress={() => collecter(s)} chargement={occupe === s.id} desactive={!!occupe} />
                <Bouton titre={s.actif ? 'Mettre en pause' : 'Réactiver'} compact variante="secondaire" onPress={() => basculer(s)} desactive={!!occupe} />
              </View>
            </Carte>
          );
        })}
      </Section>
      <Texte v="note" c="faible" style={{ marginTop: ESPACE.s }}>Chaque annonce trouvée devient un brouillon « à valider ». Rien n'est publié sans relecture.</Texte>
    </Ecran>
  );
}
