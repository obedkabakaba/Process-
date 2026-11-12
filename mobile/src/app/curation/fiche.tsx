import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Check, Sparkles, TriangleAlert, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { symboleProfil, symboleType } from '../../components/icones';
import { Bandeau, Bouton, Carte, Champ, Choix, Ecran, ESPACE, Etat, Etiquette, Pastille, Section, Texte } from '../../components/ui';
import { Alerte, Analyse, CriteresFiche, envoyer, FicheCuration, obtenir, Referentiel, Statistiques } from '../../lib/api';
import { analyserDate, dateCourte } from '../../lib/format';
import { estCurateur, useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';

const TYPES = ['bourse', 'concours', 'programme', 'formation', 'evenement', 'stage', 'emploi', 'aide'];
const SECTIONS = [
  { code: 'scientifique', nom: 'Scientifique' }, { code: 'litteraire', nom: 'Littéraire' }, { code: 'pedagogique', nom: 'Pédagogique' }, { code: 'commerciale', nom: 'Commerciale' },
  { code: 'sociale', nom: 'Sociale' }, { code: 'technique', nom: 'Technique' }, { code: 'agricole', nom: 'Agricole' }, { code: 'sante', nom: 'Santé' },
  { code: 'artistique', nom: 'Artistique' }, { code: 'professionnelle', nom: 'Professionnelle' },
];
const LANGUES = [{ code: 'fr', nom: 'Français' }, { code: 'en', nom: 'Anglais' }, { code: 'sw', nom: 'Swahili' }, { code: 'ln', nom: 'Lingala' }];
const ORIGINES = [{ code: 'partenaire', nom: 'Partenaire' }, { code: 'officielle', nom: 'Site officiel' }, { code: 'agregateur', nom: 'Agrégateur' }, { code: 'web', nom: 'Autre site' }, { code: 'communaute', nom: 'Signalement' }];

const lignes = (texte: string) => texte.split('\n').map((x) => x.trim()).filter(Boolean);
const nombre = (texte: string) => (texte.trim() === '' || Number.isNaN(Number(texte.replace(',', '.'))) ? undefined : Number(texte.replace(',', '.')));
const basculer = (liste: string[], valeur: string) => (liste.includes(valeur) ? liste.filter((x) => x !== valeur) : [...liste, valeur]);

interface Formulaire {
  titre: string; organisme: string; type: string; description: string; urlOfficielle: string; dateLimite: string; lieu: string; enLigne: boolean; cout: string;
  ageMin: string; ageMax: string; moyenneMin: string; sexe: '' | 'F' | 'M'; niveaux: string[]; sections: string[]; provinces: string; langues: string[]; autres: string;
  avantages: string; documents: string; tags: string[]; sourceType: string;
}

const VIDE: Formulaire = {
  titre: '', organisme: '', type: 'bourse', description: '', urlOfficielle: '', dateLimite: '', lieu: '', enLigne: false, cout: '0',
  ageMin: '', ageMax: '', moyenneMin: '', sexe: '', niveaux: [], sections: [], provinces: '', langues: [], autres: '', avantages: '', documents: '', tags: [], sourceType: 'officielle',
};

function versFormulaire(f: Analyse['fiche'] | FicheCuration, sourceType: string): Formulaire {
  const c = f.criteres ?? {};
  return {
    titre: f.titre, organisme: f.organisme, type: f.type, description: f.description, urlOfficielle: f.urlOfficielle ?? '', dateLimite: dateCourte(f.dateLimite), lieu: f.lieu,
    enLigne: f.enLigne, cout: String(f.coutUsd ?? 0), ageMin: c.ageMin !== undefined ? String(c.ageMin) : '', ageMax: c.ageMax !== undefined ? String(c.ageMax) : '',
    moyenneMin: c.moyenneMin !== undefined ? String(c.moyenneMin) : '', sexe: c.sexe ?? '', niveaux: c.niveaux ?? [], sections: c.sections ?? [], provinces: (c.provinces ?? []).join(', '),
    langues: c.langues ?? [], autres: (c.autres ?? []).join('\n'), avantages: f.avantages.join('\n'), documents: f.documents.join('\n'), tags: f.tags, sourceType,
  };
}

function versCorps(f: Formulaire, incertitudes: string[]) {
  const criteres: CriteresFiche = {
    ...(nombre(f.ageMin) !== undefined ? { ageMin: nombre(f.ageMin) } : {}),
    ...(nombre(f.ageMax) !== undefined ? { ageMax: nombre(f.ageMax) } : {}),
    ...(nombre(f.moyenneMin) !== undefined ? { moyenneMin: nombre(f.moyenneMin) } : {}),
    ...(f.sexe ? { sexe: f.sexe } : {}),
    ...(f.niveaux.length ? { niveaux: f.niveaux } : {}),
    ...(f.sections.length ? { sections: f.sections } : {}),
    ...(f.provinces.trim() ? { provinces: f.provinces.split(',').map((x) => x.trim()).filter(Boolean) } : {}),
    ...(f.langues.length ? { langues: f.langues } : {}),
    ...(lignes(f.autres).length ? { autres: lignes(f.autres) } : {}),
  };
  return {
    titre: f.titre.trim(), organisme: f.organisme.trim(), type: f.type, description: f.description.trim(), urlOfficielle: f.urlOfficielle.trim() || null,
    dateLimite: f.dateLimite.trim() ? analyserDate(f.dateLimite) : null, lieu: f.lieu.trim(), enLigne: f.enLigne, coutUsd: Math.round(nombre(f.cout) ?? 0),
    avantages: lignes(f.avantages), documents: lignes(f.documents), tags: f.tags, criteres, sourceType: f.sourceType, incertitudes,
  };
}

/** Création ou relecture d'une fiche. L'IA propose un brouillon, le curateur vérifie et publie. */
export default function Fiche() {
  const { compte } = useSession();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const [fiche, setFiche] = useState<FicheCuration | null>(null);
  const [f, setF] = useState<Formulaire>(VIDE);
  const [incertitudes, setIncertitudes] = useState<string[]>([]);
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [annonce, setAnnonce] = useState('');
  const [analyseDisponible, setAnalyseDisponible] = useState<boolean | null>(null);
  const [occupe, setOccupe] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [chargement, setChargement] = useState(!!id);

  const maj = <K extends keyof Formulaire>(cle: K, valeur: Formulaire[K]) => setF((x) => ({ ...x, [cle]: valeur }));

  useEffect(() => {
    obtenir<Statistiques>('/curation/statistiques').then((s) => setAnalyseDisponible(s.analyseDisponible)).catch(() => setAnalyseDisponible(false));
    if (!id) return;
    obtenir<FicheCuration>(`/curation/opportunites/${id}`)
      .then((o) => { setFiche(o); setF(versFormulaire(o, o.sourceType)); setIncertitudes(o.incertitudes); setAlertes(o.alertes ?? []); })
      .catch((e) => setErreur(e instanceof Error ? e.message : 'Erreur inconnue'))
      .finally(() => setChargement(false));
  }, [id]);

  if (!estCurateur(compte)) return <Redirect href="/(tabs)" />;

  async function action(nom: string, fn: () => Promise<void>) {
    setOccupe(nom);
    setErreur(null);
    setInfo(null);
    try {
      await fn();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setOccupe(null);
    }
  }

  const analyser = () =>
    action('analyser', async () => {
      const texte = annonce.trim();
      const r = await envoyer<Analyse>('/curation/analyser', /^https?:\/\/\S+$/.test(texte) ? { url: texte } : { texte });
      setF(versFormulaire(r.fiche, f.sourceType));
      setIncertitudes(r.fiche.incertitudes);
      setAlertes(r.alertes);
      setInfo(r.fiche.estUneOpportunite ? 'Brouillon rempli. Relis chaque champ avant d\'enregistrer.' : "L'analyse pense que ce texte n'est pas une opportunité. Vérifie avant de continuer.");
    });

  const dateValide = f.dateLimite.trim() === '' || analyserDate(f.dateLimite) !== null;
  const complet = f.titre.trim().length >= 3 && f.organisme.trim().length >= 2 && f.description.trim().length >= 10 && f.lieu.trim().length >= 2 && dateValide;

  async function enregistrerFiche(): Promise<FicheCuration> {
    const corps = versCorps(f, incertitudes);
    const r = fiche ? await envoyer<FicheCuration>(`/curation/opportunites/${fiche.id}`, corps, 'PATCH') : await envoyer<FicheCuration>('/curation/opportunites', corps);
    setFiche(r);
    return r;
  }

  const enregistrer = () => action('enregistrer', async () => { await enregistrerFiche(); setInfo('Fiche enregistrée.'); });
  const publier = () => action('publier', async () => { const r = await enregistrerFiche(); await envoyer(`/curation/opportunites/${r.id}/publier`); router.back(); });
  const rejeter = () => action('rejeter', async () => { if (fiche) await envoyer(`/curation/opportunites/${fiche.id}/rejeter`); router.back(); });

  if (chargement) return <Ecran bords={['bottom']}><Etat chargement /></Ecran>;

  return (
    <Ecran
      bords={['bottom']}
      pied={
        <>
          {erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}
          {info && <Texte v="petit" c="succes" centre>{info}</Texte>}
          <View style={{ flexDirection: 'row', gap: ESPACE.s }}>
            <View style={{ flex: 1 }}><Bouton titre="Enregistrer" variante="secondaire" onPress={enregistrer} chargement={occupe === 'enregistrer'} desactive={!complet || !!occupe} /></View>
            <View style={{ flex: 1 }}><Bouton titre="Publier" icone={Check} onPress={publier} chargement={occupe === 'publier'} desactive={!complet || !!occupe} /></View>
          </View>
        </>
      }
    >
      {fiche && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: ESPACE.m }}>
          <Pastille texte={{ en_revue: 'À valider', publiee: 'Publiée', rejetee: 'Rejetée' }[fiche.statut]} ton={fiche.statut === 'publiee' ? 'succes' : fiche.statut === 'rejetee' ? 'danger' : 'alerte'} />
          <Pastille texte={`Confiance ${fiche.scoreConfiance} %`} />
          {fiche.demo && <Pastille texte="Exemple" />}
        </View>
      )}

      {!fiche && (
        <Carte>
          <Texte v="section">Partir d'une annonce</Texte>
          <Texte v="petit" c="doux" style={{ marginTop: 2, marginBottom: ESPACE.m }}>Colle le texte ou l'adresse de l'annonce : l'IA remplit un brouillon.</Texte>
          <Champ accessibilityLabel="Texte ou adresse de l'annonce" value={annonce} onChangeText={setAnnonce} placeholder="Texte ou adresse de l'annonce" multiline maxLength={40000} />
          <View style={{ marginTop: ESPACE.s }}>
            <Bouton titre="Analyser avec l'IA" icone={Sparkles} variante="secondaire" onPress={analyser} chargement={occupe === 'analyser'} desactive={annonce.trim().length < 12 || analyseDisponible === false || !!occupe} />
          </View>
          {analyseDisponible === false && <Texte v="note" c="alerte" style={{ marginTop: ESPACE.s }}>L'analyse par IA n'est pas configurée sur ce serveur. Remplis la fiche à la main.</Texte>}
        </Carte>
      )}

      {(incertitudes.length > 0 || alertes.length > 0) && (
        <View style={{ gap: ESPACE.s, marginTop: ESPACE.m }}>
          {alertes.map((a) => <Bandeau key={a.code} icone={TriangleAlert} ton="danger" titre="Signal d'arnaque" texte={a.message} />)}
          {incertitudes.map((x) => <Bandeau key={x} icone={TriangleAlert} ton="alerte" titre="À vérifier" texte={x} />)}
        </View>
      )}

      <Etiquette>Titre</Etiquette>
      <Champ accessibilityLabel="Titre" value={f.titre} onChangeText={(v) => maj('titre', v)} maxLength={150} />
      <Etiquette>Organisme</Etiquette>
      <Champ accessibilityLabel="Organisme" value={f.organisme} onChangeText={(v) => maj('organisme', v)} maxLength={120} />
      <Etiquette>Type</Etiquette>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
        {TYPES.map((x) => <Choix key={x} libelle={symboleType(x).nom} actif={f.type === x} onPress={() => maj('type', x)} />)}
      </View>
      <Etiquette>Description (deux phrases, en français simple)</Etiquette>
      <Champ accessibilityLabel="Description" value={f.description} onChangeText={(v) => maj('description', v)} multiline maxLength={2000} />
      <Etiquette>Lien officiel (obligatoire pour publier)</Etiquette>
      <Champ accessibilityLabel="Lien officiel" value={f.urlOfficielle} onChangeText={(v) => maj('urlOfficielle', v)} placeholder="https://" autoCapitalize="none" keyboardType="url" />
      <Etiquette>Date limite</Etiquette>
      <Champ accessibilityLabel="Date limite, jour, mois, année" value={f.dateLimite} onChangeText={(v) => maj('dateLimite', v)} placeholder="JJ/MM/AAAA (vide si inconnue)" maxLength={10} />
      {!dateValide && <Texte v="petit" c="danger" style={{ marginTop: 6 }}>Exemple : 15/03/2027</Texte>}
      <Etiquette>Lieu</Etiquette>
      <Champ accessibilityLabel="Lieu" value={f.lieu} onChangeText={(v) => maj('lieu', v)} maxLength={120} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s, marginTop: ESPACE.s }}>
        <Choix libelle="En ligne" actif={f.enLigne} onPress={() => maj('enLigne', !f.enLigne)} />
      </View>
      <Etiquette>Frais demandés au candidat (en dollars)</Etiquette>
      <Champ accessibilityLabel="Frais en dollars" value={f.cout} onChangeText={(v) => maj('cout', v)} keyboardType="number-pad" maxLength={6} />

      <Section titre="Qui peut postuler">
        <View style={{ flexDirection: 'row', gap: ESPACE.s }}>
          <View style={{ flex: 1 }}><Champ accessibilityLabel="Âge minimum" value={f.ageMin} onChangeText={(v) => maj('ageMin', v)} placeholder="Âge min" keyboardType="number-pad" maxLength={2} /></View>
          <View style={{ flex: 1 }}><Champ accessibilityLabel="Âge maximum" value={f.ageMax} onChangeText={(v) => maj('ageMax', v)} placeholder="Âge max" keyboardType="number-pad" maxLength={2} /></View>
          <View style={{ flex: 1 }}><Champ accessibilityLabel="Moyenne minimale" value={f.moyenneMin} onChangeText={(v) => maj('moyenneMin', v)} placeholder="Moy. %" keyboardType="number-pad" maxLength={3} /></View>
        </View>
        <Etiquette>Réservé à</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
          <Choix libelle="Tous" actif={f.sexe === ''} onPress={() => maj('sexe', '')} />
          <Choix libelle="Filles" actif={f.sexe === 'F'} onPress={() => maj('sexe', 'F')} />
          <Choix libelle="Garçons" actif={f.sexe === 'M'} onPress={() => maj('sexe', 'M')} />
        </View>
        <Etiquette>Niveaux acceptés (aucun = tous)</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
          {(referentiel.donnees?.niveaux ?? []).map((n) => <Choix key={n.code} libelle={n.code} actif={f.niveaux.includes(n.code)} onPress={() => maj('niveaux', basculer(f.niveaux, n.code))} />)}
        </View>
        <Etiquette>Sections (aucune = toutes)</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
          {SECTIONS.map((x) => <Choix key={x.code} libelle={x.nom} actif={f.sections.includes(x.code)} onPress={() => maj('sections', basculer(f.sections, x.code))} />)}
        </View>
        <Etiquette>Langues exigées</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
          {LANGUES.map((l) => <Choix key={l.code} libelle={l.nom} actif={f.langues.includes(l.code)} onPress={() => maj('langues', basculer(f.langues, l.code))} />)}
        </View>
        <Etiquette>Provinces (séparées par des virgules, vide = toutes)</Etiquette>
        <Champ accessibilityLabel="Provinces" value={f.provinces} onChangeText={(v) => maj('provinces', v)} placeholder="Kinshasa, Nord-Kivu" />
        <Etiquette>Autres conditions (une par ligne)</Etiquette>
        <Champ accessibilityLabel="Autres conditions" value={f.autres} onChangeText={(v) => maj('autres', v)} multiline />
      </Section>

      <Section titre="Pour l'élève">
        <Etiquette>Ce qu'il gagne (un avantage par ligne)</Etiquette>
        <Champ accessibilityLabel="Avantages" value={f.avantages} onChangeText={(v) => maj('avantages', v)} multiline />
        <Etiquette>Documents à préparer (un par ligne)</Etiquette>
        <Champ accessibilityLabel="Documents" value={f.documents} onChangeText={(v) => maj('documents', v)} multiline />
        <Etiquette>Profils concernés</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
          {['R', 'I', 'A', 'S', 'E', 'C'].map((l) => <Choix key={l} libelle={symboleProfil(l).nom} actif={f.tags.includes(l)} onPress={() => maj('tags', basculer(f.tags, l))} />)}
        </View>
        <Etiquette>Origine de l'annonce</Etiquette>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
          {ORIGINES.map((o) => <Choix key={o.code} libelle={o.nom} actif={f.sourceType === o.code} onPress={() => maj('sourceType', o.code)} />)}
        </View>
      </Section>

      {fiche && fiche.statut !== 'rejetee' && (
        <View style={{ marginTop: ESPACE.l }}>
          <Bouton titre="Rejeter cette fiche" variante="discret" icone={X} onPress={rejeter} chargement={occupe === 'rejeter'} desactive={!!occupe} />
        </View>
      )}
    </Ecran>
  );
}
