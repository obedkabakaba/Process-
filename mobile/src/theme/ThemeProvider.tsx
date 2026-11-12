import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { APPARENCE_PAR_DEFAUT, construireTheme, Theme } from './apparences';

export type Mode = 'systeme' | 'clair' | 'sombre';
const CLE = 'kesho:apparence';

interface Reglages {
  theme: Theme;
  apparence: string;
  mode: Mode;
  choisirApparence: (id: string) => void;
  choisirMode: (mode: Mode) => void;
}

const Contexte = createContext<Reglages | null>(null);

/** Fournit l'apparence choisie par l'utilisateur et le mode clair ou sombre. */
export function FournisseurTheme({ children }: { children: ReactNode }) {
  const systeme = useColorScheme();
  const [apparence, setApparence] = useState(APPARENCE_PAR_DEFAUT);
  const [mode, setMode] = useState<Mode>('systeme');

  useEffect(() => {
    AsyncStorage.getItem(CLE).then((brut) => {
      if (!brut) return;
      const sauve = JSON.parse(brut) as { apparence?: string; mode?: Mode };
      if (sauve.apparence) setApparence(sauve.apparence);
      if (sauve.mode) setMode(sauve.mode);
    });
  }, []);

  const enregistrer = useCallback((a: string, m: Mode) => {
    AsyncStorage.setItem(CLE, JSON.stringify({ apparence: a, mode: m })).catch(() => undefined);
  }, []);

  const choisirApparence = useCallback((id: string) => { setApparence(id); enregistrer(id, mode); }, [mode, enregistrer]);
  const choisirMode = useCallback((m: Mode) => { setMode(m); enregistrer(apparence, m); }, [apparence, enregistrer]);

  const sombre = mode === 'systeme' ? systeme === 'dark' : mode === 'sombre';
  const theme = useMemo(() => construireTheme(apparence, sombre), [apparence, sombre]);
  const valeur = useMemo(() => ({ theme, apparence, mode, choisirApparence, choisirMode }), [theme, apparence, mode, choisirApparence, choisirMode]);

  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useReglagesTheme(): Reglages {
  const r = useContext(Contexte);
  if (!r) throw new Error('useReglagesTheme doit être utilisé dans FournisseurTheme');
  return r;
}

export function useTheme(): Theme {
  return useReglagesTheme().theme;
}

/** Crée des styles qui dépendent du thème, recalculés seulement quand il change. */
export function useStyles<T>(fabrique: (t: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => fabrique(theme), [theme, fabrique]);
}
