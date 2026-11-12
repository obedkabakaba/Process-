import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Rangement du jeton de session : coffre chiffré du téléphone sur Android et iOS,
 * stockage du navigateur sur le web (où le coffre n'existe pas).
 */
const web = Platform.OS === 'web';

export const coffre = {
  lire: (cle: string) => (web ? AsyncStorage.getItem(cle) : SecureStore.getItemAsync(cle)),
  ecrire: (cle: string, valeur: string) => (web ? AsyncStorage.setItem(cle, valeur) : SecureStore.setItemAsync(cle, valeur)),
  effacer: (cle: string) => (web ? AsyncStorage.removeItem(cle) : SecureStore.deleteItemAsync(cle)),
};
