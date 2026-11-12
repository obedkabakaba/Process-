import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { couleurs, espace, rayon } from '../lib/theme';

export function Ecran({ children, defilant = true, bords = ['top'] }: { children: ReactNode; defilant?: boolean; bords?: ('top' | 'bottom')[] }) {
  return (
    <SafeAreaView style={styles.ecran} edges={bords}>
      {defilant ? (
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.contenu, { flex: 1 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Titre({ children, style }: { children: ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text accessibilityRole="header" style={[styles.titre, style]}>{children}</Text>;
}

export function SousTitre({ children }: { children: ReactNode }) {
  return <Text style={styles.sousTitre}>{children}</Text>;
}

export function Section({ titre, children, action }: { titre: string; children: ReactNode; action?: ReactNode }) {
  return (
    <View style={styles.section}>
      <View style={styles.enteteSection}>
        <Text accessibilityRole="header" style={styles.titreSection}>{titre}</Text>
        {action}
      </View>
      {children}
    </View>
  );
}

export function Carte({ children, onPress, style, etiquette }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; etiquette?: string }) {
  if (!onPress) return <View style={[styles.carte, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={etiquette} onPress={onPress} style={({ pressed }) => [styles.carte, pressed && styles.presse, style]}>
      {children}
    </Pressable>
  );
}

type Variante = 'primaire' | 'secondaire' | 'discret';

export function Bouton({ titre, onPress, variante = 'primaire', desactive, chargement }: { titre: string; onPress: () => void; variante?: Variante; desactive?: boolean; chargement?: boolean }) {
  const inactif = desactive || chargement;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactif }}
      disabled={inactif}
      onPress={onPress}
      style={({ pressed }) => [styles.bouton, styles[`bouton_${variante}`], inactif && styles.boutonInactif, pressed && styles.presse]}
    >
      {chargement ? <ActivityIndicator color={variante === 'primaire' ? couleurs.blanc : couleurs.primaire} /> : <Text style={[styles.texteBouton, styles[`texteBouton_${variante}`]]}>{titre}</Text>}
    </Pressable>
  );
}

type Ton = 'neutre' | 'primaire' | 'succes' | 'alerte' | 'danger' | 'soleil';
const TONS: Record<Ton, { fond: string; texte: string }> = {
  neutre: { fond: couleurs.fond, texte: couleurs.texteDoux },
  primaire: { fond: couleurs.primaireClair, texte: couleurs.primaireFonce },
  succes: { fond: couleurs.succesClair, texte: '#046C4E' },
  alerte: { fond: couleurs.alerteClair, texte: '#92400E' },
  danger: { fond: couleurs.dangerClair, texte: '#991B1B' },
  soleil: { fond: couleurs.soleilClair, texte: '#7A5600' },
};

export function Puce({ texte, ton = 'neutre' }: { texte: string; ton?: Ton }) {
  return (
    <View style={[styles.puce, { backgroundColor: TONS[ton].fond }]}>
      <Text style={[styles.textePuce, { color: TONS[ton].texte }]}>{texte}</Text>
    </View>
  );
}

export function Choix({ libelle, actif, onPress }: { libelle: string; actif: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={onPress} style={[styles.choix, actif && styles.choixActif]}>
      <Text style={[styles.texteChoix, actif && styles.texteChoixActif]}>{libelle}</Text>
    </Pressable>
  );
}

export function Onglets<T extends string>({ options, valeur, onChange }: { options: { valeur: T; libelle: string }[]; valeur: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.onglets} accessibilityRole="tablist">
      {options.map((o) => (
        <Pressable key={o.valeur} accessibilityRole="tab" accessibilityState={{ selected: o.valeur === valeur }} onPress={() => onChange(o.valeur)} style={[styles.onglet, o.valeur === valeur && styles.ongletActif]}>
          <Text style={[styles.texteOnglet, o.valeur === valeur && styles.texteOngletActif]}>{o.libelle}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Barre({ valeur, couleur = couleurs.primaire }: { valeur: number; couleur?: string }) {
  const largeur = Math.max(0, Math.min(1, valeur)) * 100;
  return (
    <View style={styles.barre} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(largeur) }}>
      <View style={[styles.barreRemplie, { width: `${largeur}%`, backgroundColor: couleur }]} />
    </View>
  );
}

/** Affiche le chargement, l'erreur (avec bouton pour réessayer) ou un état vide. */
export function Etat({ chargement, erreur, vide, messageVide, onReessayer }: { chargement?: boolean; erreur?: string | null; vide?: boolean; messageVide?: string; onReessayer?: () => void }) {
  if (chargement) return <ActivityIndicator style={{ marginVertical: espace.xl }} size="large" color={couleurs.primaire} />;
  if (erreur) {
    return (
      <View style={styles.etat}>
        <Text style={styles.emojiEtat}>📡</Text>
        <Text style={styles.texteEtat}>{erreur}</Text>
        {onReessayer && <Bouton titre="Réessayer" variante="secondaire" onPress={onReessayer} />}
      </View>
    );
  }
  if (vide) {
    return (
      <View style={styles.etat}>
        <Text style={styles.emojiEtat}>🌱</Text>
        <Text style={styles.texteEtat}>{messageVide ?? 'Rien à afficher pour le moment.'}</Text>
      </View>
    );
  }
  return null;
}

export function BandeauHorsLigne({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={styles.horsLigne}>
      <Text style={styles.texteHorsLigne}>📴 Hors-ligne : tu vois les dernières informations enregistrées.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: couleurs.fond },
  contenu: { padding: espace.m, paddingBottom: espace.xl, width: '100%', maxWidth: 560, alignSelf: 'center' },
  titre: { fontSize: 28, fontWeight: '800', color: couleurs.texte, letterSpacing: -0.5 },
  sousTitre: { fontSize: 16, color: couleurs.texteDoux, marginTop: espace.xs, lineHeight: 22 },
  section: { marginTop: espace.l },
  enteteSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: espace.s },
  titreSection: { fontSize: 18, fontWeight: '700', color: couleurs.texte },
  carte: { backgroundColor: couleurs.carte, borderRadius: rayon.moyen, padding: espace.m, borderWidth: 1, borderColor: couleurs.bordure, marginBottom: espace.s },
  presse: { opacity: 0.75 },
  bouton: { minHeight: 52, borderRadius: rayon.moyen, alignItems: 'center', justifyContent: 'center', paddingHorizontal: espace.l, marginTop: espace.s },
  bouton_primaire: { backgroundColor: couleurs.primaire },
  bouton_secondaire: { backgroundColor: couleurs.primaireClair },
  bouton_discret: { backgroundColor: 'transparent' },
  boutonInactif: { opacity: 0.45 },
  texteBouton: { fontSize: 16, fontWeight: '700' },
  texteBouton_primaire: { color: couleurs.blanc },
  texteBouton_secondaire: { color: couleurs.primaireFonce },
  texteBouton_discret: { color: couleurs.primaire },
  puce: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginRight: 6, marginBottom: 6 },
  textePuce: { fontSize: 12, fontWeight: '700' },
  choix: { borderWidth: 1.5, borderColor: couleurs.bordure, backgroundColor: couleurs.carte, borderRadius: 999, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center', marginRight: 8, marginBottom: 8 },
  choixActif: { borderColor: couleurs.primaire, backgroundColor: couleurs.primaireClair },
  texteChoix: { fontSize: 14, color: couleurs.texte, fontWeight: '600' },
  texteChoixActif: { color: couleurs.primaireFonce },
  onglets: { flexDirection: 'row', backgroundColor: couleurs.bordure, borderRadius: rayon.moyen, padding: 4, marginTop: espace.m },
  onglet: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderRadius: rayon.petit, paddingHorizontal: 6 },
  ongletActif: { backgroundColor: couleurs.carte },
  texteOnglet: { fontSize: 13, fontWeight: '700', color: couleurs.texteDoux, textAlign: 'center' },
  texteOngletActif: { color: couleurs.primaireFonce },
  barre: { height: 10, borderRadius: 999, backgroundColor: couleurs.bordure, overflow: 'hidden' },
  barreRemplie: { height: '100%', borderRadius: 999 },
  etat: { alignItems: 'center', paddingVertical: espace.xl },
  emojiEtat: { fontSize: 40, marginBottom: espace.s },
  texteEtat: { fontSize: 15, color: couleurs.texteDoux, textAlign: 'center', marginBottom: espace.s, lineHeight: 21 },
  horsLigne: { backgroundColor: couleurs.alerteClair, borderRadius: rayon.petit, padding: espace.s, marginBottom: espace.s },
  texteHorsLigne: { color: '#92400E', fontSize: 13, fontWeight: '600' },
});
