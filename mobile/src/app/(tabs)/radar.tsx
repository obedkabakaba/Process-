import { View } from 'react-native';
import { symboleType } from '../../components/icones';
import { BandeauHorsLigne, Carte, Ecran, ESPACE, Etat, Pastille, Texte } from '../../components/ui';
import { Evenement } from '../../lib/api';
import { formaterDate, jourEtMois } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';
import { useTheme } from '../../theme/ThemeProvider';

export default function Radar() {
  const t = useTheme();
  const { eleve } = useSession();
  const { donnees, chargement, erreur, horsLigne, recharger } = useChargement<Evenement[]>(eleve ? `/radar?niveau=${eleve.niveau}&province=${encodeURIComponent(eleve.province)}` : null);

  return (
    <Ecran>
      <Texte v="titre" accessibilityRole="header">Radar</Texte>
      <Texte c="doux" style={{ marginTop: 2 }}>Les dates de ta classe</Texte>
      <BandeauHorsLigne visible={horsLigne} />
      <View style={{ marginTop: ESPACE.l }}>
        <Etat chargement={chargement && !donnees} erreur={donnees ? null : erreur} onReessayer={recharger} vide={!!donnees && donnees.length === 0} messageVide="Aucune date à venir." />
        {donnees?.map((e) => {
          const type = symboleType(e.type);
          const d = jourEtMois(e.dateDebut);
          return (
            <Carte key={e.id} style={{ marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', gap: ESPACE.m }}>
                <View style={{ width: 54, height: 60, borderRadius: t.f.rayonS, backgroundColor: e.enCours ? t.c.accentDoux : t.c.retrait, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel={formaterDate(e.dateDebut)}>
                  <Texte v="sousTitre" c={e.enCours ? 'accent' : 'texte'}>{d.jour}</Texte>
                  <Texte v="note" c={e.enCours ? 'accent' : 'doux'}>{d.mois}</Texte>
                </View>
                <View style={{ flex: 1 }}>
                  <Texte v="note" c="doux">{type.nom}{e.dateFin ? ` · jusqu'au ${jourEtMois(e.dateFin).jour} ${jourEtMois(e.dateFin).mois}` : ''}</Texte>
                  <Texte v="fort" style={{ marginTop: 2, fontSize: 16, lineHeight: 21 }}>{e.titre}</Texte>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                    <Pastille ton={e.enCours ? 'succes' : e.dansJours <= 14 ? 'danger' : 'neutre'} texte={e.enCours ? 'En cours' : `Dans ${e.dansJours} j`} />
                    {e.aConfirmer && <Pastille texte="À confirmer" />}
                  </View>
                </View>
              </View>
            </Carte>
          );
        })}
        {!!donnees?.some((e) => e.aConfirmer) && <Texte v="note" c="faible" centre style={{ marginTop: ESPACE.s }}>« À confirmer » : période habituelle, en attente de la date officielle.</Texte>}
      </View>
    </Ecran>
  );
}
