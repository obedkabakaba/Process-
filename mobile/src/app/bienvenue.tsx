import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Bouton, Choix, Ecran, Etat, SousTitre, Titre } from '../components/ui';
import { Eleve, envoyer, OptionHumanites, Referentiel } from '../lib/api';
import { analyserDateNaissance } from '../lib/format';
import { useSession } from '../lib/session';
import { couleurs, espace, rayon } from '../lib/theme';
import { useChargement } from '../lib/useChargement';

const LANGUES = [
  { code: 'fr', nom: 'Français' }, { code: 'ln', nom: 'Lingala' }, { code: 'sw', nom: 'Swahili' },
  { code: 'lua', nom: 'Tshiluba' }, { code: 'kg', nom: 'Kikongo' }, { code: 'en', nom: 'Anglais' },
];

export default function Bienvenue() {
  const { definirEleve } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const options = useChargement<OptionHumanites[]>('/options');

  const [etape, setEtape] = useState(0);
  const [prenom, setPrenom] = useState('');
  const [niveau, setNiveau] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [naissance, setNaissance] = useState('');
  const [sexe, setSexe] = useState<string | null>(null);
  const [moyenne, setMoyenne] = useState('');
  const [langues, setLangues] = useState<string[]>(['fr']);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const enHumanites = niveau?.startsWith('H') ?? false;
  const dateIso = naissance.trim() === '' ? undefined : analyserDateNaissance(naissance);
  const moyenneNombre = moyenne.trim() === '' ? undefined : Number(moyenne.replace(',', '.'));
  const moyenneValide = moyenneNombre === undefined || (!Number.isNaN(moyenneNombre) && moyenneNombre >= 0 && moyenneNombre <= 100);

  const basculerLangue = (code: string) => setLangues((l) => (l.includes(code) ? l.filter((x) => x !== code) : [...l, code]));

  async function creer() {
    if (!niveau || !province) return;
    setEnvoi(true);
    setErreur(null);
    try {
      const eleve = await envoyer<Eleve>('/eleves', {
        prenom: prenom.trim(), niveau, province, langues,
        ...(enHumanites && option ? { option } : {}),
        ...(dateIso ? { dateNaissance: dateIso } : {}),
        ...(sexe ? { sexe } : {}),
        ...(moyenneNombre !== undefined ? { moyenne: moyenneNombre } : {}),
      });
      await definirEleve(eleve);
      router.replace('/test');
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setEnvoi(false);
    }
  }

  if (etape === 0) {
    return (
      <Ecran bords={['top', 'bottom']}>
        <View style={styles.hero}>
          <Text style={styles.logo}>Kesho</Text>
          <Text style={styles.devise}>Ton avenir commence aujourd'hui</Text>
        </View>
        <Titre>Bienvenue 👋</Titre>
        <SousTitre>Découvre les métiers faits pour toi, les écoles qui y mènent et les opportunités auxquelles tu as droit.</SousTitre>
        <Text style={styles.label}>Comment tu t'appelles ?</Text>
        <TextInput accessibilityLabel="Ton prénom" value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" placeholderTextColor={couleurs.texteDoux} style={styles.champ} maxLength={40} autoCapitalize="words" />
        <Bouton titre="Commencer" onPress={() => setEtape(1)} desactive={prenom.trim().length === 0} />
      </Ecran>
    );
  }

  if (etape === 1) {
    return (
      <Ecran bords={['top', 'bottom']}>
        <Text style={styles.etape}>Étape 1 sur 2</Text>
        <Titre>Enchanté, {prenom.trim()} !</Titre>
        <SousTitre>Dis-nous où tu en es pour que Kesho s'adapte à toi.</SousTitre>
        <Etat chargement={referentiel.chargement} erreur={referentiel.erreur} onReessayer={referentiel.recharger} />
        {referentiel.donnees && (
          <>
            <Text style={styles.label}>Ta classe</Text>
            <View style={styles.ligne}>
              {referentiel.donnees.niveaux.map((n) => (
                <Choix key={n.code} libelle={n.libelle} actif={niveau === n.code} onPress={() => setNiveau(n.code)} />
              ))}
            </View>
            {enHumanites && options.donnees && (
              <>
                <Text style={styles.label}>Ton option</Text>
                <View style={styles.ligne}>
                  {options.donnees.map((o) => (
                    <Choix key={o.slug} libelle={o.nom} actif={option === o.slug} onPress={() => setOption(o.slug)} />
                  ))}
                </View>
              </>
            )}
            <Text style={styles.label}>Ta province</Text>
            <View style={styles.ligne}>
              {referentiel.donnees.provinces.map((p) => (
                <Choix key={p} libelle={p} actif={province === p} onPress={() => setProvince(p)} />
              ))}
            </View>
            <Bouton titre="Continuer" onPress={() => setEtape(2)} desactive={!niveau || !province || (enHumanites && !option)} />
            <Bouton titre="Retour" variante="discret" onPress={() => setEtape(0)} />
          </>
        )}
      </Ecran>
    );
  }

  return (
    <Ecran bords={['top', 'bottom']}>
      <Text style={styles.etape}>Étape 2 sur 2</Text>
      <Titre>Pour trouver tes opportunités</Titre>
      <SousTitre>Ces informations servent à vérifier les bourses et concours auxquels tu as droit. Elles restent privées et tu peux les compléter plus tard.</SousTitre>

      <Text style={styles.label}>Ta date de naissance</Text>
      <TextInput accessibilityLabel="Date de naissance, jour, mois, année" value={naissance} onChangeText={setNaissance} placeholder="JJ/MM/AAAA" placeholderTextColor={couleurs.texteDoux} style={styles.champ} keyboardType="numbers-and-punctuation" maxLength={10} />
      {dateIso === null && <Text style={styles.erreur}>Écris la date comme ceci : 14/05/2009</Text>}

      <Text style={styles.label}>Tu es</Text>
      <View style={styles.ligne}>
        <Choix libelle="Une fille" actif={sexe === 'F'} onPress={() => setSexe('F')} />
        <Choix libelle="Un garçon" actif={sexe === 'M'} onPress={() => setSexe('M')} />
      </View>

      <Text style={styles.label}>Ta dernière moyenne (en %)</Text>
      <TextInput accessibilityLabel="Ta dernière moyenne en pourcentage" value={moyenne} onChangeText={setMoyenne} placeholder="Exemple : 65" placeholderTextColor={couleurs.texteDoux} style={styles.champ} keyboardType="decimal-pad" maxLength={5} />
      {!moyenneValide && <Text style={styles.erreur}>La moyenne doit être un nombre entre 0 et 100.</Text>}

      <Text style={styles.label}>Les langues que tu parles</Text>
      <View style={styles.ligne}>
        {LANGUES.map((l) => (
          <Choix key={l.code} libelle={l.nom} actif={langues.includes(l.code)} onPress={() => basculerLangue(l.code)} />
        ))}
      </View>

      {erreur && <Text style={styles.erreur}>{erreur}</Text>}
      <Bouton titre="Créer mon profil" onPress={creer} chargement={envoi} desactive={dateIso === null || !moyenneValide || langues.length === 0} />
      <Bouton titre="Retour" variante="discret" onPress={() => setEtape(1)} />
    </Ecran>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: couleurs.primaire, borderRadius: rayon.grand, padding: espace.xl, alignItems: 'center', marginBottom: espace.l },
  logo: { fontSize: 48, fontWeight: '900', color: couleurs.blanc, letterSpacing: -2 },
  devise: { fontSize: 15, color: couleurs.soleil, fontWeight: '600', marginTop: 4 },
  etape: { fontSize: 13, fontWeight: '700', color: couleurs.primaire, marginBottom: espace.xs },
  label: { fontSize: 15, fontWeight: '700', color: couleurs.texte, marginTop: espace.l, marginBottom: espace.s },
  ligne: { flexDirection: 'row', flexWrap: 'wrap' },
  champ: { backgroundColor: couleurs.carte, borderWidth: 1.5, borderColor: couleurs.bordure, borderRadius: rayon.moyen, paddingHorizontal: espace.m, minHeight: 52, fontSize: 17, color: couleurs.texte },
  erreur: { color: couleurs.danger, fontSize: 14, fontWeight: '600', marginTop: espace.s },
});
