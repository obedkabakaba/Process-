import { router } from 'expo-router';
import { ArrowLeft, Check, Search } from 'lucide-react-native';
import { ReactNode, useState } from 'react';
import { Pressable, View } from 'react-native';
import { Logo } from '../components/Logo';
import { Barre, Bouton, Champ, Choix, Ecran, ESPACE, Etat, Texte } from '../components/ui';
import { Eleve, envoyer, OptionHumanites, Referentiel } from '../lib/api';
import { analyserDateNaissance } from '../lib/format';
import { useSession } from '../lib/session';
import { useTheme } from '../theme/ThemeProvider';
import { useChargement } from '../lib/useChargement';

const LANGUES = [
  { code: 'fr', nom: 'Français' }, { code: 'ln', nom: 'Lingala' }, { code: 'sw', nom: 'Swahili' },
  { code: 'lua', nom: 'Tshiluba' }, { code: 'kg', nom: 'Kikongo' }, { code: 'en', nom: 'Anglais' },
];
const CYCLES = [
  { id: 'P', nom: 'Primaire' }, { id: 'EB', nom: 'Éducation de base (7e, 8e)' }, { id: 'H', nom: 'Humanités' },
  { id: 'U', nom: 'Université ou institut' }, { id: 'DIPLOME', nom: "J'ai fini mes études" },
];
const sansAccent = (x: string) => x.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const cycleDe = (code: string) => CYCLES.find((c) => code.startsWith(c.id))?.id;

/** Une ligne de choix avec coche, pour les listes longues. */
function Option({ libelle, detail, actif, onPress }: { libelle: string; detail?: string; actif: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: ESPACE.m, paddingVertical: 10, borderRadius: t.f.rayonM, borderWidth: Math.max(1.5, t.f.largeurBordure), borderColor: actif ? t.c.accent : t.c.bordure, backgroundColor: actif ? t.c.accentDoux : t.c.surface, marginBottom: ESPACE.s }}>
      <View style={{ flex: 1 }}>
        <Texte v="fort" c={actif ? 'accent' : 'texte'}>{libelle}</Texte>
        {detail && <Texte v="petit" c="doux" numberOfLines={1}>{detail}</Texte>}
      </View>
      {actif && <Check size={18} color={t.c.surAccentDoux} strokeWidth={2.6} />}
    </Pressable>
  );
}

function Etiquette({ children }: { children: ReactNode }) {
  return <Texte v="petit" c="doux" style={{ marginTop: ESPACE.l, marginBottom: ESPACE.s }}>{children}</Texte>;
}

export default function Bienvenue() {
  const t = useTheme();
  const { definirEleve } = useSession();
  const referentiel = useChargement<Referentiel>('/referentiel');
  const options = useChargement<OptionHumanites[]>('/options');

  const [etape, setEtape] = useState(0);
  const [prenom, setPrenom] = useState('');
  const [cycle, setCycle] = useState<string | null>(null);
  const [niveau, setNiveau] = useState<string | null>(null);
  const [option, setOption] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [rechercheProvince, setRechercheProvince] = useState('');
  const [naissance, setNaissance] = useState('');
  const [sexe, setSexe] = useState<string | null>(null);
  const [moyenne, setMoyenne] = useState('');
  const [langues, setLangues] = useState<string[]>(['fr']);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const enHumanites = niveau?.startsWith('H') ?? false;
  const etapes = enHumanites ? ['prenom', 'classe', 'option', 'province', 'infos'] : ['prenom', 'classe', 'province', 'infos'];
  const courante = etapes[Math.min(etape, etapes.length - 1)];
  const dateIso = naissance.trim() === '' ? undefined : analyserDateNaissance(naissance);
  const moyenneNombre = moyenne.trim() === '' ? undefined : Number(moyenne.replace(',', '.'));
  const moyenneValide = moyenneNombre === undefined || (!Number.isNaN(moyenneNombre) && moyenneNombre >= 0 && moyenneNombre <= 100);

  function choisirCycle(id: string) {
    setCycle(id);
    const niveaux = referentiel.donnees?.niveaux.filter((n) => cycleDe(n.code) === id) ?? [];
    setNiveau(niveaux.length === 1 ? niveaux[0].code : null);
    setOption(null);
  }

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

  const peutContinuer = {
    prenom: prenom.trim().length > 0,
    classe: !!niveau,
    option: !!option,
    province: !!province,
    infos: dateIso !== null && moyenneValide && langues.length > 0,
  }[courante];
  const derniere = etape === etapes.length - 1;

  const pied = (
    <>
      {erreur && <Texte v="petit" c="danger" centre>{erreur}</Texte>}
      <Bouton titre={courante === 'prenom' ? 'Commencer' : derniere ? 'Créer mon profil' : 'Continuer'} onPress={derniere ? creer : () => setEtape(etape + 1)} desactive={!peutContinuer} chargement={envoi} />
    </>
  );

  if (courante === 'prenom') {
    return (
      <Ecran bords={['top', 'bottom']} pied={pied}>
        <View style={{ paddingTop: ESPACE.xl * 2 }}>
          <Logo taille={40} />
          <Texte v="geant" style={{ marginTop: ESPACE.xl }}>Construis{'\n'}ton avenir.</Texte>
          <Texte c="doux" style={{ marginTop: ESPACE.s, marginBottom: ESPACE.xl }}>Métiers, écoles, bourses : tout ce qui est fait pour toi.</Texte>
          <Champ accessibilityLabel="Ton prénom" value={prenom} onChangeText={setPrenom} placeholder="Ton prénom" maxLength={40} autoCapitalize="words" />
        </View>
      </Ecran>
    );
  }

  const provinces = (referentiel.donnees?.provinces ?? []).filter((p) => sansAccent(p).includes(sansAccent(rechercheProvince.trim())));

  return (
    <Ecran bords={['top', 'bottom']} pied={pied}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: ESPACE.m, marginBottom: ESPACE.l }}>
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={() => setEtape(etape - 1)} hitSlop={12}>
          <ArrowLeft size={24} color={t.c.texte} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Barre valeur={etape / (etapes.length - 1)} />
        </View>
      </View>

      {courante === 'classe' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Tu es en quelle classe, {prenom.trim()} ?</Texte>
          <Etat chargement={referentiel.chargement} erreur={referentiel.erreur} onReessayer={referentiel.recharger} />
          {referentiel.donnees && CYCLES.map((c) => {
            const niveaux = referentiel.donnees!.niveaux.filter((n) => cycleDe(n.code) === c.id);
            return (
              <View key={c.id}>
                <Option libelle={c.nom} actif={cycle === c.id} onPress={() => choisirCycle(c.id)} />
                {cycle === c.id && niveaux.length > 1 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: ESPACE.s, marginBottom: ESPACE.m, marginTop: 4 }}>
                    {niveaux.map((n) => (
                      <Choix key={n.code} libelle={n.libelle.split(' ')[0]} actif={niveau === n.code} onPress={() => setNiveau(n.code)} />
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}

      {courante === 'option' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Quelle est ton option ?</Texte>
          <Etat chargement={options.chargement} erreur={options.erreur} onReessayer={options.recharger} />
          {options.donnees?.map((o) => (
            <Option key={o.slug} libelle={o.nom} detail={o.section.charAt(0).toUpperCase() + o.section.slice(1)} actif={option === o.slug} onPress={() => setOption(o.slug)} />
          ))}
        </>
      )}

      {courante === 'province' && (
        <>
          <Texte v="titre" style={{ marginBottom: ESPACE.l }}>Tu habites où ?</Texte>
          <Champ icone={Search} accessibilityLabel="Chercher une province" value={rechercheProvince} onChangeText={setRechercheProvince} placeholder="Chercher une province" />
          <View style={{ marginTop: ESPACE.m }}>
            {provinces.map((p) => (
              <Option key={p} libelle={p} actif={province === p} onPress={() => setProvince(p)} />
            ))}
          </View>
        </>
      )}

      {courante === 'infos' && (
        <>
          <Texte v="titre">Pour trouver tes bourses</Texte>
          <Texte c="doux" style={{ marginTop: ESPACE.xs }}>Facultatif. Ces informations restent privées.</Texte>

          <Etiquette>Date de naissance</Etiquette>
          <Champ accessibilityLabel="Date de naissance, jour, mois, année" value={naissance} onChangeText={setNaissance} placeholder="JJ/MM/AAAA" keyboardType="numbers-and-punctuation" maxLength={10} />
          {dateIso === null && <Texte v="petit" c="danger" style={{ marginTop: 6 }}>Exemple : 14/05/2009</Texte>}

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
        </>
      )}
    </Ecran>
  );
}
