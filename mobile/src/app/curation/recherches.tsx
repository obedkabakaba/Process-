import { Redirect, router } from 'expo-router';
import { Pause, Play, Plus, Sparkles } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Bandeau, Bouton, Carte, Champ, Ecran, ESPACE, Etat, Pastille, Section, Texte } from '../../components/ui';
import { BilanRecherche, envoyer, obtenir, RechercheCuration, Statistiques } from '../../lib/api';
import { formaterDate } from '../../lib/format';
import { estCurateur, useSession } from '../../lib/session';

/**
 * Recherches que l'IA lance sur le web. Chaque piste trouvée est lue sur sa page,
 * transformée en fiche, puis attend la validation d'un curateur.
 */
export default function Recherches() {
  const { compte } = useSession();
  const [recherches, setRecherches] = useState<RechercheCuration[] | null>(null);
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [ajout, setAjout] = useState(false);
  const [intitule, setIntitule] = useState('');
  const [occupe, setOccupe] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [bilans, setBilans] = useState<Record<string, BilanRecherche>>({});

  const charger = useCallback(async () => {
    try {
      const [liste, stats] = await Promise.all([obtenir<RechercheCuration[]>('/curation/recherches'), obtenir<Statistiques>('/curation/statistiques')]);
      setRecherches(liste);
      setDisponible(stats.rechercheDisponible);
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

  const ajouter = () => executer('ajout', async () => { await envoyer('/curation/recherches', { intitule: intitule.trim() }); setIntitule(''); setAjout(false); });
  const lancer = (r: RechercheCuration) => executer(r.id, async () => { const bilan = await envoyer<BilanRecherche>(`/curation/recherches/${r.id}/lancer`); setBilans((b) => ({ ...b, [r.id]: bilan })); });
  const basculer = (r: RechercheCuration) => executer(r.id, async () => { await envoyer(`/curation/recherches/${r.id}`, { actif: !r.actif }, 'PATCH'); });

  return (
    <Ecran bords={['bottom']}>
      {disponible === false && (
        <View style={{ marginBottom: ESPACE.m }}>
          <Bandeau icone={Sparkles} ton="alerte" titre="IA non configurée" texte="Ajoute une clé d'API sur le serveur pour lancer les recherches." />
        </View>
      )}

      {ajout ? (
        <Carte>
          <Texte v="section">Nouvelle recherche</Texte>
          <Texte v="petit" c="doux" style={{ marginTop: 2, marginBottom: ESPACE.m }}>Décris ce que l'IA doit trouver, comme à une personne.</Texte>
          <Champ accessibilityLabel="Ce que l'IA doit chercher" value={intitule} onChangeText={setIntitule} placeholder="Bourses d'études au Maroc ouvertes aux Congolais" multiline maxLength={300} />
          <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
            <View style={{ flex: 1 }}><Bouton titre="Ajouter" onPress={ajouter} chargement={occupe === 'ajout'} desactive={intitule.trim().length < 10} /></View>
            <View style={{ flex: 1 }}><Bouton titre="Annuler" variante="secondaire" onPress={() => setAjout(false)} /></View>
          </View>
        </Carte>
      ) : (
        <Bouton titre="Nouvelle recherche" icone={Plus} onPress={() => setAjout(true)} />
      )}
      {erreur && <Texte v="petit" c="danger" style={{ marginTop: ESPACE.s }}>{erreur}</Texte>}

      <Section titre="Recherches">
        <Etat chargement={!recherches && !erreur} vide={recherches?.length === 0} messageVide="Aucune recherche." />
        {recherches?.map((r) => {
          const bilan = bilans[r.id];
          const enCours = occupe === r.id;
          return (
            <Carte key={r.id} style={{ marginBottom: 10 }}>
              <Texte v="fort">{r.intitule}</Texte>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                <Pastille texte={r.actif ? 'Chaque jour' : 'En pause'} ton={r.actif ? 'succes' : 'neutre'} />
                {r.dernierPassage && <Pastille texte={`Lancée le ${formaterDate(r.dernierPassage)}`} />}
                {r.dernierStatut && r.dernierStatut !== 'ok' && <Pastille texte="Erreur" ton="danger" />}
              </View>
              {r.dernierStatut && r.dernierStatut !== 'ok' && <Texte v="note" c="danger" style={{ marginTop: 6 }}>{r.dernierStatut}</Texte>}
              {enCours && <Texte v="note" c="doux" style={{ marginTop: ESPACE.s }}>L'IA cherche sur le web puis lit chaque page. Compte une à trois minutes.</Texte>}
              {bilan && (
                <View style={{ marginTop: ESPACE.s }}>
                  <Bandeau
                    icone={Sparkles}
                    ton={bilan.statut !== 'ok' ? 'danger' : bilan.brouillons > 0 ? 'succes' : 'neutre'}
                    titre={bilan.statut !== 'ok' ? 'La recherche a échoué' : `${bilan.brouillons} fiche(s) à valider`}
                    texte={`${bilan.pistes} piste(s) trouvée(s), ${bilan.nouvelles} nouvelle(s), ${bilan.ignorees} écartée(s), ${bilan.erreurs} page(s) illisible(s).`}
                    action={bilan.brouillons > 0 ? 'Voir' : undefined}
                    onAction={bilan.brouillons > 0 ? () => router.push('/curation') : undefined}
                  />
                </View>
              )}
              <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
                <Bouton titre="Lancer" compact icone={Play} onPress={() => lancer(r)} chargement={enCours} desactive={!!occupe || disponible === false} />
                <Bouton titre={r.actif ? 'Pause' : 'Réactiver'} compact variante="secondaire" icone={r.actif ? Pause : undefined} onPress={() => basculer(r)} desactive={!!occupe} />
              </View>
            </Carte>
          );
        })}
      </Section>
      <Texte v="note" c="faible" style={{ marginTop: ESPACE.s }}>« Chaque jour » : la recherche se relance seule si le passage quotidien est activé sur le serveur. Rien n'est publié sans relecture.</Texte>
    </Ecran>
  );
}
