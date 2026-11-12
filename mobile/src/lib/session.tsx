import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Eleve, ErreurApi, lire } from './api';

const CLE = 'kesho:eleve';

interface Session {
  pret: boolean;
  eleve: Eleve | null;
  definirEleve: (eleve: Eleve) => Promise<void>;
  rafraichir: () => Promise<void>;
  deconnecter: () => Promise<void>;
}

const Contexte = createContext<Session | null>(null);

/** Garde le profil de l'élève sur le téléphone pour qu'il le retrouve à chaque ouverture. */
export function FournisseurSession({ children }: { children: ReactNode }) {
  const [pret, setPret] = useState(false);
  const [eleve, setEleve] = useState<Eleve | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(CLE)
      .then((brut) => {
        if (brut) setEleve(JSON.parse(brut) as Eleve);
      })
      .finally(() => setPret(true));
  }, []);

  const definirEleve = useCallback(async (nouveau: Eleve) => {
    setEleve(nouveau);
    await AsyncStorage.setItem(CLE, JSON.stringify(nouveau));
  }, []);

  const deconnecter = useCallback(async () => {
    setEleve(null);
    await AsyncStorage.removeItem(CLE);
  }, []);

  const rafraichir = useCallback(async () => {
    if (!eleve) return;
    try {
      const { donnees } = await lire<Eleve>(`/eleves/${eleve.id}`);
      await definirEleve(donnees);
    } catch (erreur) {
      // Le profil n'existe plus côté serveur : on repart de zéro.
      if (erreur instanceof ErreurApi && erreur.statut === 404) await deconnecter();
    }
  }, [eleve, definirEleve, deconnecter]);

  const valeur = useMemo(() => ({ pret, eleve, definirEleve, rafraichir, deconnecter }), [pret, eleve, definirEleve, rafraichir, deconnecter]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useSession(): Session {
  const session = useContext(Contexte);
  if (!session) throw new Error('useSession doit être utilisé dans FournisseurSession');
  return session;
}
