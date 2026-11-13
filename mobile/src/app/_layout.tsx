import { Fraunces_600SemiBold } from '@expo-google-fonts/fraunces/600SemiBold';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Nunito_900Black } from '@expo-google-fonts/nunito/900Black';
import { Sora_700Bold } from '@expo-google-fonts/sora/700Bold';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FournisseurSession } from '../lib/session';
import { FournisseurTheme, useTheme } from '../theme/ThemeProvider';

function Navigation() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.c.fond }}>
      <StatusBar style={t.sombre ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.c.fond },
          headerTintColor: t.c.texte,
          headerTitleStyle: { ...t.p.demi, fontSize: 16, color: t.c.texte },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: t.c.fond },
        }}
      >
        <Stack.Screen name="bienvenue" options={{ headerShown: false }} />
        <Stack.Screen name="creation" options={{ headerShown: false }} />
        <Stack.Screen name="accord" options={{ headerShown: false }} />
        <Stack.Screen name="modifier" options={{ title: 'Mes informations' }} />
        <Stack.Screen name="curation/index" options={{ title: 'Espace curateur' }} />
        <Stack.Screen name="curation/fiche" options={{ title: 'Fiche' }} />
        <Stack.Screen name="curation/radar" options={{ title: 'Radar' }} />
        <Stack.Screen name="curation/sources" options={{ title: 'Sources' }} />
        <Stack.Screen name="curation/recherches" options={{ title: 'Recherches IA' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="test" options={{ headerShown: false }} />
        <Stack.Screen name="resultat" options={{ title: 'Mon ADN' }} />
        <Stack.Screen name="apparence" options={{ title: 'Apparence' }} />
        <Stack.Screen name="metier/[slug]" options={{ title: '' }} />
        <Stack.Screen name="opportunite/[id]" options={{ title: '' }} />
      </Stack>
    </View>
  );
}

export default function Racine() {
  const [policesPretes] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
    Sora_700Bold, Fraunces_600SemiBold, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black,
  });
  if (!policesPretes) return null;

  return (
    <SafeAreaProvider>
      <FournisseurTheme>
        <FournisseurSession>
          <Navigation />
        </FournisseurSession>
      </FournisseurTheme>
    </SafeAreaProvider>
  );
}
