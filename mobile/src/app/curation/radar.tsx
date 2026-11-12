import { Redirect } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { symboleType } from '../../components/icones';
import { Bouton, Carte, Champ, Choix, Ecran, ESPACE, Etat, Etiquette, Ligne, Pastille, Section, Texte } from '../../components/ui';
import { envoyer, EvenementCuration, obtenir, Referentiel } from '../../lib/api';
import { analyserDate, dateCourte } from '../../lib/format';
import { estCurateur, useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';

const TYPES = ['examen', 'inscription', 'rentree', 'concours', 'salon', 'bourse'];
const VIDE = { titre: '', description: '', type: 'examen', debut: '', fin: '', niveaux: [] as string[], aConfirmer: false };

/** Gestion du calendrier affiché aux élèves. */
export default function RadarCuration() {
  const { compte } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const [evenements, setEvenements] = useState<EvenementCuration[] | null>(null);
  const [edition, setEdition] = useState<string | 'nouveau' | null>(null);
  const [f, setF] = useState(VIDE);
  const [occupe, setOccupe] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    try {
      setEvenements(await obtenir<EvenementCuration[]>('/curation/evenements'));
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }, []);
  useEffect(() => { charger(); }, [charger]);

  if (!estCurateur(compte)) return <Redirect href="/(tabs)" />;

  function ouvrir(e?: EvenementCuration) {
    setErreur(null);
    setEdition(e ? e.id : 'nouveau');
    setF(e ? { titre: e.titre, description: e.description, type: e.type, debut: dateCourte(e.dateDebut), fin: dateCourte(e.dateFin), niveaux: e.niveaux, aConfirmer: e.aConfirmer } : VIDE);
  }

  const debut = analyserDate(f.debut);
  const fin = f.fin.trim() === '' ? null : analyserDate(f.fin);
  const valide = f.titre.trim().length >= 3 && f.description.trim().length >= 3 && !!debut && (f.fin.trim() === '' || !!fin);

  async function executer(fn: () => Promise<unknown>) {
    setOccupe(true);
    setErreur(null);
    try {
      await fn();
      setEdition(null);
      await charger();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setOccupe(false);
    }
  }

  const corps = { titre: f.titre.trim(), description: f.description.trim(), type: f.type, dateDebut: debut, dateFin: fin, niveaux: f.niveaux, aConfirmer: f.aConfirmer };
  const enregistrer = () => executer(() => (edition === 'nouveau' ? envoyer('/curation/evenements', corps) : envoyer(`/curation/evenements/${edition}`, corps, 'PATCH')));
  const supprimer = () => executer(() => envoyer(`/curation/evenements/${edition}`, {}, 'DELETE'));

  return (
    <Ecran bords={['bottom']}>
      {edition ? (
        <Carte>
          <Texte v="section">{edition === 'nouveau' ? 'Nouvelle date' : 'Modifier la date'}</Texte>
          <Etiquette>Titre</Etiquette>
          <Champ accessibilityLabel="Titre" value={f.titre} onChangeText={(v) => setF({ ...f, titre: v })} maxLength={150} />
          <Etiquette>Description</Etiquette>
          <Champ accessibilityLabel="Description" value={f.description} onChangeText={(v) => setF({ ...f, description: v })} multiline maxLength={1000} />
          <Etiquette>Type</Etiquette>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
            {TYPES.map((x) => <Choix key={x} libelle={symboleType(x).nom} actif={f.type === x} onPress={() => setF({ ...f, type: x })} />)}
          </View>
          <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.l }}>
            <View style={{ flex: 1 }}><Champ accessibilityLabel="Date de début" value={f.debut} onChangeText={(v) => setF({ ...f, debut: v })} placeholder="Début JJ/MM/AAAA" maxLength={10} /></View>
            <View style={{ flex: 1 }}><Champ accessibilityLabel="Date de fin" value={f.fin} onChangeText={(v) => setF({ ...f, fin: v })} placeholder="Fin (facultatif)" maxLength={10} /></View>
          </View>
          <Etiquette>Classes concernées (aucune = toutes)</Etiquette>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
            {(referentiel.donnees?.niveaux ?? []).map((n) => (
              <Choix key={n.code} libelle={n.code} actif={f.niveaux.includes(n.code)} onPress={() => setF({ ...f, niveaux: f.niveaux.includes(n.code) ? f.niveaux.filter((x) => x !== n.code) : [...f.niveaux, n.code] })} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s, marginTop: ESPACE.l }}>
            <Choix libelle="Date à confirmer" actif={f.aConfirmer} onPress={() => setF({ ...f, aConfirmer: !f.aConfirmer })} />
          </View>
          {erreur && <Texte v="petit" c="danger" style={{ marginTop: ESPACE.s }}>{erreur}</Texte>}
          <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.l }}>
            <View style={{ flex: 1 }}><Bouton titre="Enregistrer" onPress={enregistrer} chargement={occupe} desactive={!valide} /></View>
            <View style={{ flex: 1 }}><Bouton titre="Annuler" variante="secondaire" onPress={() => setEdition(null)} /></View>
          </View>
          {edition !== 'nouveau' && <Bouton titre="Supprimer" variante="discret" icone={Trash2} onPress={supprimer} desactive={occupe} />}
        </Carte>
      ) : (
        <Bouton titre="Ajouter une date" icone={Plus} onPress={() => ouvrir()} />
      )}

      <Section titre="Calendrier">
        <Etat chargement={!evenements && !erreur} erreur={evenements ? null : erreur} onReessayer={charger} vide={evenements?.length === 0} messageVide="Aucune date." />
        {evenements && evenements.length > 0 && (
          <Carte plat>
            {evenements.map((e, i) => (
              <Ligne key={e.id} titre={e.titre} sousTitre={`${dateCourte(e.dateDebut)}${e.dateFin ? ` → ${dateCourte(e.dateFin)}` : ''} · ${e.niveaux.length ? e.niveaux.join(', ') : 'Toutes les classes'}`} dernier={i === evenements.length - 1} droite={e.aConfirmer ? <Pastille texte="À confirmer" ton="alerte" /> : undefined} onPress={() => ouvrir(e)} />
            ))}
          </Carte>
        )}
      </Section>
    </Ecran>
  );
}
