import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ChoixClasse, LANGUES } from '../components/ChoixClasse';
import { Bouton, Champ, Choix, Ecran, EnteteEtapes, ESPACE, Etat, Etiquette, OptionListe, Texte } from '../components/ui';
import { envoyer, OptionHumanites, ProfilCree, Referentiel } from '../lib/api';
import { analyserDateNaissance } from '../lib/format';
import { useSession } from '../lib/session';
import { useChargement } from '../lib/useChargement';

const sansAccent = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function ageDepuis(iso: string): number {
  const n = new Date(iso);
  const a = new Date();
  let age = a.getFullYear() - n.getFullYear();
  if (a.getMonth() < n.getMonth() || (a.getMonth() === n.getMonth() && a.getDate() < n.getDate())) age--;
  return age;
}

/** Création du profil : une question par écran. */
export default function Creation() {
  const { definirEleve, deconnecter } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const options = useChargement<OptionHumanites[]>('/options');

  const [etape, setEtape] = useState(0);
  const [prenom, setPrenom] = useState('');
  const [cycle, setCycle] = useState<string | null>(null);
  const [niveau, setNiveau] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [recherche, setRecherche] = useState('');
  const [naissance, setNaissance] = useState('');
  const [telephoneParent, setTelephoneParent] = useState('');
  const [sexe, setSexe] = useState<string | null>(null);
  const [moyenne, setMoyenne] = useState('');
  const [langues, setLangues] = useState<string[]>(['fr']);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const enHumanites = niveau?.startsWith('H') ?? false;
  const etapes = ['prenom', 'classe', ...(enHumanites ? ['option'] : []), 'province', 'naissance', 'infos'];
  const courante = etapes[Math.min(etape, etapes.length - 1)];
  const dateIso = naissance.trim() === '' ? undefined : analyserDateNaissance(naissance);
  const mineur = !!dateIso && ageDepuis(dateIso) < 18;
  const moyenneNombre = moyenne.trim() === '' ? undefined : Number(moyenne.replace(',', '.'));
  const moyenneValide = moyenneNombre === undefined || (!Number.isNaN(moyenneNombre) && moyenneNombre >= 0 && moyenneNombre <= 100);

  async function creer() {
    if (!niveau || !province || !dateIso) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const r = await envoyer<ProfilCree>('/eleves', {
        prenom: prenom.trim(), niveau, province, langues, dateNaissance: dateIso,
        ...(enHumanites && option ? { option } : {}),
        ...(mineur ? { telephoneParent: telephoneParent.trim() } : {}),
        ...(sexe ? { sexe } : {}),
        ...(moyenneNombre !== undefined ? { moyenne: moyenneNombre } : {}),
      });
      await definirEleve(r.eleve);
      if (r.consentement.statut === 'en_attente') router.replace({ pathname: '/accord', params: { suite: 'test', ...(r.codeDev ? { demo: r.codeDev } : {}) } });
      else router.replace('/test');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  const peutContinuer = {
    prenom: prenom.trim().length > 0,
    classe: !!niveau,
    option: !!option,
    province: !!province,
    naissance: !!dateIso && (!mineur || telephoneParent.trim().length >= 8),
    infos: moyenneValide && langues.length > 0,
  }[courante];
  const derniere = etape === etapes.length - 1;
  const provinces = (referentiel.donnees?.provinces ?? []).filter((p) => sansAccent(p).includes(sansAccent(recherche.trim())));

  return (
    <Ecran
      bords={['top', 'bottom']}
      pied={
        <>
          {erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}
          <Bouton titre={derniere ? 'Créer mon profil' : 'Continuer'} onPress={derniere ? creer : () => setEtape(etape + 1)} desactive={!peutContinuer} chargement={envoi} />
        </>
      }
    >
      <EnteteEtapes progression={(etape + 1) / etapes.length} onRetour={etape === 0 ? async () => { await deconnecter(); router.replace('/bienvenue'); } : () => setEtape(etape - 1)} />

      {courante === 'prenom' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Comment tu t'appelles ?</Texte>
          <Champ accessibilityLabel="Ton prénom" value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" maxLength={40} autoCapitalize="words" />
        </>
      )}

      {courante === 'classe' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Tu es en quelle classe, {prenom.trim()} ?</Texte>
          <Etat chargement={referentiel.chargement} erreur={referentiel.erreur} onReessayer={referentiel.recharger} />
          {referentiel.donnees && (
            <ChoixClasse niveaux={referentiel.donnees.niveaux} cycle={cycle} niveau={niveau} onNiveau={setNiveau} onCycle={(c, unique) => { setCycle(c); setNiveau(unique); setOption(null); }} />
          )}
        </>
      )}

      {courante === 'option' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Quelle est ton option ?</Texte>
          <Etat chargement={options.chargement} erreur={options.erreur} onReessayer={options.recharger} />
          {options.donnees?.map((o) => (
            <OptionListe key={o.slug} libelle={o.nom} detail={o.section.charAt(0).toUpperCase() + o.section.slice(1)} actif={option === o.slug} onPress={() => setOption(o.slug)} />
          ))}
        </>
      )}

      {courante === 'province' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Tu habites où ?</Texte>
          <Champ icone={Search} accessibilityLabel="Chercher une province" value={recherche} onChangeText={setRecherche} placeholder="Chercher une province" />
          <View style={{ marginTop: ESPACE.m }}>
            {provinces.map((p) => (
              <OptionListe key={p} libelle={p} actif={province === p} onPress={() => setProvince(p)} />
            ))}
          </View>
        </>
      )}

      {courante === 'naissance' && (
        <>
          <Texte v="titre">Ta date de naissance</Texte>
          <Texte c="doux" style={{ marginTop: ESPACE.xs, marginBottom: ESPACE.l }}>Beaucoup de bourses ont une limite d'âge.</Texte>
          <Champ accessibilityLabel="Date de naissance, jour, mois, année" value={naissance} onChangeText={setNaissance} placeholder="JJ/MM/AAAA" keyboardType="numbers-and-punctuation" maxLength={10} />
          {dateIso === null && <Texte v="petit" c="danger" style={{ marginTop: 6 }}>Exemple : 14/05/2009</Texte>}
          {mineur && (
            <>
              <Etiquette>Numéro d'un parent ou tuteur</Etiquette>
              <Champ accessibilityLabel="Numéro de téléphone d'un parent" value={telephoneParent} onChangeText={setTelephoneParent} placeholder="089 876 54 32" keyboardType="phone-pad" maxLength={20} />
              <Texte v="note" c="faible" style={{ marginTop: ESPACE.s }}>Tu as moins de 18 ans : ton parent recevra un code pour donner son accord.</Texte>
            </>
          )}
        </>
      )}

      {courante === 'infos' && (
        <>
          <Texte v="titre">Encore un peu sur toi</Texte>
          <Texte c="doux" style={{ marginTop: ESPACE.xs }}>Facultatif. Plus ton profil est complet, plus tu vois d'opportunités.</Texte>
          <Etiquette>Tu es</Etiquette>
          <View style={{ flexDirection: 'row', gap: ESPACE.s }}>
            <Choix libelle="Une fille" actif={sexe === 'F'} onPress={() => setSexe(sexe === 'F' ? null : 'F')} />
            <Choix libelle="Un garçon" actif={sexe === 'M'} onPress={() => setSexe(sexe === 'M' ? null : 'M')} />
          </View>
          <Etiquette>Dernière moyenne (%)</Etiquette>
          <Champ accessibilityLabel="Ta dernière moyenne en pourcentage" value={moyenne} onChangeText={setMoyenne} placeholder="65" keyboardType="decimal-pad" maxLength={5} />
          {!moyenneValide && <Texte v="petit" c="danger" style={{ marginTop: 6 }}>Un nombre entre 0 et 100</Texte>}
          <Etiquette>Langues parlées</Etiquette>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
            {LANGUES.map((l) => (
              <Choix key={l.code} libelle={l.nom} actif={langues.includes(l.code)} onPress={() => setLangues((x) => (x.includes(l.code) ? x.filter((y) => y !== l.code) : [...x, l.code]))} />
            ))}
          </View>
        </>
      )}
    </Ecran>
  );
}
