import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FournisseurSession } from '../lib/session';
import { couleurs } from '../lib/theme';

export default function Racine() {
  return (
    <SafeAreaProvider>
      <FournisseurSession>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: couleurs.fond },
            headerTintColor: couleurs.primaireFonce,
            headerTitleStyle: { fontWeight: '700', color: couleurs.texte },
            headerShadowVisible: false,
            headerBackButtonDisplayMode: 'minimal',
            contentStyle: { backgroundColor: couleurs.fond },
          }}
        >
          <Stack.Screen name="bienvenue" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="test" options={{ title: 'Test Mon ADN' }} />
          <Stack.Screen name="resultat" options={{ title: 'Mon ADN' }} />
          <Stack.Screen name="metier/[slug]" options={{ title: 'Métier' }} />
          <Stack.Screen name="opportunite/[id]" options={{ title: 'Opportunité' }} />
        </Stack>
      </FournisseurSession>
    </SafeAreaProvider>
  );
}
