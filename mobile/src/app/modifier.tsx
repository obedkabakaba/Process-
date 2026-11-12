import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { ChoixClasse, cycleDe, LANGUES } from '../components/ChoixClasse';
import { Bouton, Champ, Choix, Ecran, ESPACE, Etat, Etiquette, OptionListe, Texte } from '../components/ui';
import { Eleve, envoyer, OptionHumanites, Referentiel } from '../lib/api';
import { useSession } from '../lib/session';
import { useChargement } from '../lib/useChargement';

/** Modification du profil. Un profil complet débloque plus d'opportunités. */
export default function Modifier() {
  const { eleve, definirEleve } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const options = useChargement<OptionHumanites[]>('/options');

  const [prenom, setPrenom] = useState(eleve?.prenom ?? '');
  const [niveau, setNiveau] = useState<string | null>(eleve?.niveau ?? null);
  const [cycle, setCycle] = useState<string | null>(cycleDe(eleve?.niveau ?? null));
  const [option, setOption] = useState<string | null>(eleve?.option ?? null);
  const [province, setProvince] = useState<string | null>(eleve?.province ?? null);
  const [sexe, setSexe] = useState<string | null>(eleve?.sexe ?? null);
  const [moyenne, setMoyenne] = useState(eleve?.moyenne !== null && eleve?.moyenne !== undefined ? String(eleve.moyenne) : '');
  const [langues, setLangues] = useState<string[]>(eleve?.langues ?? ['fr']);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [choixProvince, setChoixProvince] = useState(false);

  if (!eleve) return null;
  const enHumanites = niveau?.startsWith('H') ?? false;
  const moyenneNombre = moyenne.trim() === '' ? undefined : Number(moyenne.replace(',', '.'));
  const moyenneValide = moyenneNombre === undefined || (!Number.isNaN(moyenneNombre) && moyenneNombre >= 0 && moyenneNombre <= 100);
  const valide = prenom.trim().length > 0 && !!niveau && !!province && (!enHumanites || !!option) && moyenneValide && langues.length > 0;

  async function enregistrer() {
    if (!eleve) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const misAJour = await envoyer<Eleve>(
        `/eleves/${eleve.id}`,
        { prenom: prenom.trim(), niveau, province, langues, option: enHumanites ? option : '', ...(sexe ? { sexe } : {}), ...(moyenneNombre !== undefined ? { moyenne: moyenneNombre } : {}) },
        'PATCH',
      );
      await definirEleve(misAJour);
      router.back();
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <Ecran bords={['bottom']} pied={<>{erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}<Bouton titre="Enregistrer" onPress={enregistrer} chargement={envoi} desactive={!valide} /></>}>
      <Etiquette>Prénom</Etiquette>
      <Champ accessibilityLabel="Ton prénom" value={prenom} onChangeText={setPrenom} maxLength={40} autoCapitalize="words" />

      <Etiquette>Classe</Etiquette>
      <Etat chargement={referentiel.chargement && !referentiel.donnees} erreur={referentiel.donnees ? null : referentiel.erreur} onReessayer={referentiel.recharger} />
      {referentiel.donnees && <ChoixClasse niveaux={referentiel.donnees.niveaux} cycle={cycle} niveau={niveau} onNiveau={setNiveau} onCycle={(c, unique) => { setCycle(c); setNiveau(unique); setOption(null); }} />}

      {enHumanites && options.donnees && (
        <>
          <Etiquette>Option</Etiquette>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s }}>
            {options.donnees.map((o) => (
              <Choix key={o.slug} libelle={o.nom} actif={option === o.slug} onPress={() => setOption(o.slug)} />
            ))}
          </View>
        </>
      )}

      <Etiquette>Province</Etiquette>
      {choixProvince && referentiel.donnees ? (
        referentiel.donnees.provinces.map((p) => <OptionListe key={p} libelle={p} actif={province === p} onPress={() => { setProvince(p); setChoixProvince(false); }} />)
      ) : (
        <OptionListe libelle={province ?? 'Choisir'} detail="Appuie pour changer" actif={false} onPress={() => setChoixProvince(true)} />
      )}

      <Etiquette>Tu es</Etiquette>
      <View style={{ flexDirection: 'row', gap: ESPACE.s }}>
        <Choix libelle="Une fille" actif={sexe === 'F'} onPress={() => setSexe('F')} />
        <Choix libelle="Un garçon" actif={sexe === 'M'} onPress={() => setSexe('M')} />
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
    </Ecran>
  );
}
