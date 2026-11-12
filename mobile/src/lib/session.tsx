import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Compte, Connexion, definirJeton, ecouterSessionExpiree, Eleve, obtenir, viderCache } from './api';
import { coffre } from './stockage';

const CLE_JETON = 'kesho.jeton';
const CLE_PROFIL = 'kesho:profil';

interface Session {
  pret: boolean;
  compte: Compte | null;
  eleve: Eleve | null;
  connecter: (connexion: Connexion) => Promise<void>;
  definirEleve: (eleve: Eleve) => Promise<void>;
  rafraichir: () => Promise<void>;
  deconnecter: () => Promise<void>;
}

const Contexte = createContext<Session | null>(null);

/**
 * Garde la session sur le téléphone : le jeton dans le coffre chiffré,
 * le profil (non sensible) dans le stockage courant pour un affichage immédiat, même hors-ligne.
 */
export function FournisseurSession({ children }: { children: ReactNode }) {
  const [pret, setPret] = useState(false);
  const [compte, setCompte] = useState<Compte | null>(null);
  const [eleve, setEleve] = useState<Eleve | null>(null);

  const memoriser = useCallback(async (c: Compte | null, e: Eleve | null) => {
    setCompte(c);
    setEleve(e);
    if (c) await AsyncStorage.setItem(CLE_PROFIL, JSON.stringify({ compte: c, eleve: e }));
  }, []);

  const deconnecter = useCallback(async () => {
    definirJeton(null);
    setCompte(null);
    setEleve(null);
    await Promise.all([coffre.effacer(CLE_JETON), AsyncStorage.removeItem(CLE_PROFIL), viderCache()]);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const jeton = await coffre.lire(CLE_JETON);
        const brut = await AsyncStorage.getItem(CLE_PROFIL);
        if (jeton && brut) {
          definirJeton(jeton);
          const sauve = JSON.parse(brut) as { compte: Compte; eleve: Eleve | null };
          setCompte(sauve.compte);
          setEleve(sauve.eleve);
        }
      } finally {
        setPret(true);
      }
    })();
  }, []);

  // Si le serveur ne reconnaît plus la session, on revient à l'écran de connexion.
  useEffect(() => {
    ecouterSessionExpiree(() => {
      deconnecter();
    });
    return () => ecouterSessionExpiree(null);
  }, [deconnecter]);

  const connecter = useCallback(
    async (connexion: Connexion) => {
      definirJeton(connexion.jeton);
      await coffre.ecrire(CLE_JETON, connexion.jeton);
      await memoriser(connexion.compte, connexion.eleve);
    },
    [memoriser],
  );

  const definirEleve = useCallback(async (nouveau: Eleve) => { if (compte) await memoriser(compte, nouveau); }, [compte, memoriser]);

  const rafraichir = useCallback(async () => {
    if (!compte) return;
    try {
      const moi = await obtenir<{ compte: Compte; eleve: Eleve | null }>('/moi');
      await memoriser(moi.compte, moi.eleve);
    } catch {
      // Hors-ligne : on garde le profil enregistré. Une session expirée est traitée par l'écouteur ci-dessus.
    }
  }, [compte, memoriser]);

  const valeur = useMemo(() => ({ pret, compte, eleve, connecter, definirEleve, rafraichir, deconnecter }), [pret, compte, eleve, connecter, definirEleve, rafraichir, deconnecter]);
  return <Contexte.Provider value={valeur}>{children}</Contexte.Provider>;
}

export function useSession(): Session {
  const session = useContext(Contexte);
  if (!session) throw new Error('useSession doit être utilisé dans FournisseurSession');
  return session;
}

export const estCurateur = (compte: Compte | null): boolean => compte?.role === 'curateur' || compte?.role === 'admin';
