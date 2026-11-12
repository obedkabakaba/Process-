import * as Linking from 'expo-linking';
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Check, CircleHelp, ExternalLink, ShieldCheck, X } from 'lucide-react-native';
import { View } from 'react-native';
import { symboleType } from '../../components/icones';
import { BandeauHorsLigne, Bouton, Carte, Ecran, ESPACE, Etat, Pastille, Section, Texte, Vignette } from '../../components/ui';
import { Evaluation, mesurer, Opportunite } from '../../lib/api';
import { formaterDate, formaterDelai } from '../../lib/format';
import { useSession } from '../../lib/session';
import { useChargement } from '../../lib/useChargement';
import { useTheme } from '../../theme/ThemeProvider';

export default function FicheOpportunite() {
  const t = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { eleve } = useSession();
  const { donnees, chargement, erreur, horsLigne, recharger } = useChargement<{ opportunite: Opportunite; evaluation: Evaluation | null }>(eleve ? `/scout/eleves/${eleve.id}/opportunites/${id}` : null);

  useEffect(() => {
    if (id) mesurer('opportunite_ouverte', { id });
  }, [id]);

  if (!donnees) {
    return (
      <Ecran bords={['bottom']}>
        <Etat chargement={chargement} erreur={erreur} onReessayer={recharger} />
      </Ecran>
    );
  }
  const { opportunite: o, evaluation } = donnees;
  const type = symboleType(o.type);
  const eligibilite = evaluation?.eligibilite;
  const aspect = {
    ok: { icone: Check, couleur: t.c.succes, fond: t.c.succesDoux },
    non: { icone: X, couleur: t.c.danger, fond: t.c.dangerDoux },
    a_verifier: { icone: CircleHelp, couleur: t.c.alerte, fond: t.c.alerteDoux },
  };
  const lien = o.urlOfficielle && !o.demo ? o.urlOfficielle : null;

  return (
    <Ecran bords={['bottom']} pied={lien ? <Bouton titre="Ouvrir le site officiel" icone={ExternalLink} onPress={() => { mesurer('site_officiel_ouvert', { id }); Linking.openURL(lien); }} /> : undefined}>
      <BandeauHorsLigne visible={horsLigne} />
      <Vignette icone={type.icone} emoji={type.emoji} taille={56} />
      <Texte v="note" c="doux" style={{ marginTop: ESPACE.m }}>{type.nom} · {o.organisme}</Texte>
      <Texte v="titre" accessibilityRole="header" style={{ marginTop: 2 }}>{o.titre}</Texte>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
        {o.demo ? <Pastille texte="Exemple de démonstration" /> : o.verifiee ? <Pastille icone={ShieldCheck} ton="succes" texte="Vérifiée par Kesho" /> : <Pastille ton="alerte" texte={`Confiance ${o.scoreConfiance} %`} />}
        {o.coutUsd === 0 && <Pastille texte="Gratuit" />}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: ESPACE.l }}>
        <Carte style={{ flex: 1 }}>
          <Texte v="note" c="doux">Date limite</Texte>
          <Texte v="fort" style={{ marginTop: 2 }}>{o.dateLimite ? formaterDate(o.dateLimite) : 'Sur le site officiel'}</Texte>
          {evaluation && evaluation.joursRestants !== null && <Texte v="note" c="accent" style={{ marginTop: 2 }}>{formaterDelai(evaluation.joursRestants)}</Texte>}
        </Carte>
        <Carte style={{ flex: 1 }}>
          <Texte v="note" c="doux">Lieu</Texte>
          <Texte v="fort" numberOfLines={2} style={{ marginTop: 2 }}>{o.enLigne ? 'En ligne' : o.lieu}</Texte>
        </Carte>
      </View>

      <Texte style={{ marginTop: ESPACE.m }}>{o.description}</Texte>

      {eligibilite && eligibilite.criteres.length > 0 && (
        <Section titre={eligibilite.eligible ? 'Tu peux postuler' : eligibilite.presqueEligible ? 'Tu y es presque' : 'Critères'}>
          <Carte>
            {eligibilite.criteres.map((c, i) => {
              const a = aspect[c.statut];
              return (
                <View key={c.code} style={{ flexDirection: 'row', gap: 12, marginTop: i === 0 ? 0 : 14 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: a.fond, alignItems: 'center', justifyContent: 'center' }}>
                    <a.icone size={14} color={a.couleur} strokeWidth={3} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Texte v="fort">{c.libelle}</Texte>
                    {c.detail && <Texte v="petit" c="doux">{c.detail}</Texte>}
                  </View>
                </View>
              );
            })}
          </Carte>
        </Section>
      )}

      {o.avantages.length > 0 && (
        <Section titre="Ce que tu gagnes">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {o.avantages.map((x) => (
              <Pastille key={x} texte={x} ton="accent" />
            ))}
          </View>
        </Section>
      )}

      {o.documents.length > 0 && (
        <Section titre="À préparer">
          <Carte>
            {o.documents.map((d, i) => (
              <View key={d} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: i === 0 ? 0 : 12 }}>
                <View style={{ width: 20, height: 20, borderRadius: 6, borderWidth: 2, borderColor: t.c.bordure }} />
                <Texte style={{ flex: 1 }}>{d}</Texte>
              </View>
            ))}
          </Carte>
        </Section>
      )}

      <Texte v="note" c="faible" centre style={{ marginTop: ESPACE.l }}>Kesho ne demande jamais d'argent pour une opportunité.</Texte>
    </Ecran>
  );
}
