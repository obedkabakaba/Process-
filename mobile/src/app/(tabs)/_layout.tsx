import { Tabs } from 'expo-router/js-tabs';
import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSession } from '../../lib/session';
import { couleurs } from '../../lib/theme';

const icone = (emoji: string) =>
  function Icone({ focused }: { focused: boolean }) {
    return <Text style={{ fontSize: 22, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>;
  };

export default function Onglets() {
  const { pret, eleve } = useSession();

  // Tant que le profil enregistré n'est pas relu, on affiche l'écran de démarrage.
  if (!pret) {
    return (
      <View style={styles.demarrage}>
        <Text style={styles.logo}>Kesho</Text>
        <Text style={styles.devise}>Ton avenir commence aujourd'hui</Text>
        <ActivityIndicator color={couleurs.blanc} style={{ marginTop: 24 }} />
      </View>
    );
  }
  // Sans profil, on commence par la création du profil.
  if (!eleve) return <Redirect href="/bienvenue" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: couleurs.primaire,
        tabBarInactiveTintColor: couleurs.texteDoux,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: { backgroundColor: couleurs.carte, borderTopColor: couleurs.bordure, height: 72, paddingTop: 8, paddingBottom: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: icone('🏠') }} />
      <Tabs.Screen name="explorer" options={{ title: 'Explorer', tabBarIcon: icone('🧭') }} />
      <Tabs.Screen name="scout" options={{ title: 'Scout', tabBarIcon: icone('🎯') }} />
      <Tabs.Screen name="radar" options={{ title: 'Radar', tabBarIcon: icone('📡') }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarIcon: icone('👤') }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  demarrage: { flex: 1, backgroundColor: couleurs.primaire, alignItems: 'center', justifyContent: 'center' },
  logo: { fontSize: 56, fontWeight: '900', color: couleurs.blanc, letterSpacing: -2 },
  devise: { fontSize: 16, color: couleurs.soleil, fontWeight: '600', marginTop: 4 },
});
