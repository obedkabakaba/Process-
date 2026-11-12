import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

/** Mot-symbole Kesho : le nom en minuscules, suivi d'un point de couleur (le soleil qui se lève). */
export function Logo({ taille = 28, couleur, point }: { taille?: number; couleur?: string; point?: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }} accessibilityRole="header" accessibilityLabel="Kesho">
      <Text style={[t.p.titre, { fontSize: taille, lineHeight: taille * 1.15, color: couleur ?? t.c.texte, letterSpacing: -taille * 0.04 }]}>kesho</Text>
      <View style={{ width: taille * 0.2, height: taille * 0.2, borderRadius: taille, backgroundColor: point ?? t.c.accent, marginLeft: taille * 0.06, marginBottom: taille * 0.2 }} />
    </View>
  );
}
