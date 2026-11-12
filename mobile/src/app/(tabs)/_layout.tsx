import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { CalendarDays, Compass, House, LucideIcon, Target, UserRound } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '../../components/Logo';
import { useSession } from '../../lib/session';
import { useTheme } from '../../theme/ThemeProvider';

const icone = (I: LucideIcon) =>
  function IconeOnglet({ focused }: { focused: boolean }) {
    const t = useTheme();
    return <I size={23} color={focused ? t.c.texte : t.c.texteFaible} strokeWidth={focused ? 2.4 : 1.9} />;
  };

export default function Onglets() {
  const { pret, eleve } = useSession();
  const t = useTheme();
  const insets = useSafeAreaInsets();

  if (!pret) {
    return (
      <View style={{ flex: 1, backgroundColor: t.c.fond, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <Logo taille={44} />
        <ActivityIndicator color={t.c.texteFaible} />
      </View>
    );
  }
  if (!eleve) return <Redirect href="/bienvenue" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.c.texte,
        tabBarInactiveTintColor: t.c.texteFaible,
        tabBarLabelStyle: { ...t.p.demi, fontSize: 11, lineHeight: 14 },
        tabBarItemStyle: { paddingVertical: 6 },
        tabBarStyle: { backgroundColor: t.c.fond, borderTopColor: t.c.bordure, borderTopWidth: t.f.largeurBordure, height: 66 + insets.bottom, paddingBottom: insets.bottom },
        sceneStyle: { backgroundColor: t.c.fond },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', tabBarIcon: icone(House) }} />
      <Tabs.Screen name="explorer" options={{ title: 'Explorer', tabBarIcon: icone(Compass) }} />
      <Tabs.Screen name="scout" options={{ title: 'Scout', tabBarIcon: icone(Target) }} />
      <Tabs.Screen name="radar" options={{ title: 'Radar', tabBarIcon: icone(CalendarDays) }} />
      <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarIcon: icone(UserRound) }} />
    </Tabs>
  );
}
