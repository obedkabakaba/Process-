import { Redirect, router, useFocusEffect } from 'expo-router';
import { CalendarDays, FilePlus2, LogOut, Rss, TriangleAlert } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { symboleType } from '../../components/icones';
import { Bouton, Carte, Ecran, ESPACE, Etat, Ligne, Pastille, Section, Segments, Texte, Vignette } from '../../components/ui';
import { FicheCuration, obtenir, Statistiques } from '../../lib/api';
import { estCurateur, useSession } from '../../lib/session';

type Statut = 'en_revue' | 'publiee' | 'rejetee';
const LIBELLES_MESURES: Record<string, string> = {
  profil_cree: 'Profils créés', test_termine: 'Tests terminés', consentement_accorde: 'Accords parentaux', opportunite_ouverte: 'Opportunités ouvertes',
  site_officiel_ouvert: 'Sites officiels ouverts', metier_ouvert: 'Métiers consultés', message_verifie: 'Messages vérifiés',
};

function Stat({ valeur, libelle }: { valeur: number; libelle: string }) {
  return (
    <Carte style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }}>
      <Texte v="sousTitre">{valeur}</Texte>
      <Texte v="note" c="doux" centre>{libelle}</Texte>
    </Carte>
  );
}

/** Tableau de bord des curateurs : ce qui attend une validation, et le suivi du pilote. */
export default function Curation() {
  const { compte, eleve, deconnecter } = useSession();
  const [statut, setStatut] = useState<Statut>('en_revue');
  const [stats, setStats] = useState<Statistiques | null>(null);
  const [fiches, setFiches] = useState<FicheCuration[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    setErreur(null);
    try {
      const [s, f] = await Promise.all([obtenir<Statistiques>('/curation/statistiques'), obtenir<FicheCuration[]>(`/curation/opportunites?statut=${statut}`)]);
      setStats(s);
      setFiches(f);
    } catch (e) {
      setErreur(e instanceof Error ? e.message : 'Erreur inconnue');
    }
  }, [statut]);

  useFocusEffect(useCallback(() => { charger(); }, [charger]));

  if (!estCurateur(compte)) return <Redirect href="/(tabs)" />;
  const mesures = Object.entries(stats?.septDerniersJours ?? {}).sort((a, b) => b[1] - a[1]);

  return (
    <Ecran bords={['bottom']}>
      {stats && (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Stat valeur={stats.eleves.inscrits} libelle="Élèves" />
          <Stat valeur={stats.eleves.testTermine} libelle="Tests faits" />
          <Stat valeur={stats.opportunites.en_revue ?? 0} libelle="À valider" />
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.m }}>
        <View style={{ flex: 1 }}><Bouton titre="Nouvelle fiche" icone={FilePlus2} onPress={() => router.push('/curation/fiche')} /></View>
      </View>
      <View style={{ flexDirection: 'row', gap: ESPACE.s, marginTop: ESPACE.s }}>
        <View style={{ flex: 1 }}><Bouton titre="Radar" variante="secondaire" icone={CalendarDays} onPress={() => router.push('/curation/radar')} /></View>
        <View style={{ flex: 1 }}><Bouton titre="Sources" variante="secondaire" icone={Rss} onPress={() => router.push('/curation/sources')} /></View>
      </View>

      <Section titre="Opportunités">
        <Segments<Statut>
          options={[{ valeur: 'en_revue', libelle: 'À valider' }, { valeur: 'publiee', libelle: 'Publiées' }, { valeur: 'rejetee', libelle: 'Rejetées' }]}
          valeur={statut}
          onChange={(v) => { setFiches(null); setStatut(v); }}
        />
        <View style={{ marginTop: ESPACE.m }}>
          <Etat chargement={!fiches && !erreur} erreur={erreur} onReessayer={charger} vide={fiches?.length === 0} messageVide={statut === 'en_revue' ? 'Rien à valider. Beau travail.' : 'Aucune fiche.'} />
          {fiches && fiches.length > 0 && (
            <Carte plat>
              {fiches.map((f, i) => {
                const type = symboleType(f.type);
                return (
                  <Ligne
                    key={f.id}
                    titre={f.titre}
                    sousTitre={`${type.nom} · ${f.organisme}`}
                    dernier={i === fiches.length - 1}
                    gauche={<Vignette icone={type.icone} emoji={type.emoji} taille={40} ton={f.incertitudes.length > 0 ? 'alerte' : 'accent'} />}
                    droite={<Pastille icone={f.incertitudes.length > 0 ? TriangleAlert : undefined} texte={`${f.scoreConfiance} %`} ton={f.scoreConfiance >= 90 ? 'succes' : f.scoreConfiance >= 70 ? 'neutre' : 'alerte'} />}
                    onPress={() => router.push({ pathname: '/curation/fiche', params: { id: f.id } })}
                  />
                );
              })}
            </Carte>
          )}
        </View>
      </Section>

      {mesures.length > 0 && (
        <Section titre="7 derniers jours">
          <Carte plat>
            {mesures.map(([type, nb], i) => (
              <Ligne key={type} titre={LIBELLES_MESURES[type] ?? type} dernier={i === mesures.length - 1} droite={<Texte v="fort">{nb}</Texte>} />
            ))}
          </Carte>
          {!!stats && stats.eleves.consentementEnAttente > 0 && <Texte v="note" c="faible" style={{ marginTop: ESPACE.s }}>{stats.eleves.consentementEnAttente} élève(s) en attente de l'accord d'un parent.</Texte>}
        </Section>
      )}

      {!eleve && (
        <View style={{ marginTop: ESPACE.l }}>
          <Bouton titre="Se déconnecter" variante="discret" icone={LogOut} onPress={async () => { await deconnecter(); router.replace('/bienvenue'); }} />
        </View>
      )}
    </Ecran>
  );
}
