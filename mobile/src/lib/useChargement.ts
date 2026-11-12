import { useCallback, useEffect, useState } from 'react';
import { lire } from './api';

interface Etat<T> { donnees: T | null; chargement: boolean; erreur: string | null; horsLigne: boolean }

/** Charge une ressource de l'API, avec état de chargement, d'erreur et repli hors-ligne. */
export function useChargement<T>(chemin: string | null) {
  const [etat, setEtat] = useState<Etat<T>>({ donnees: null, chargement: chemin !== null, erreur: null, horsLigne: false });

  const charger = useCallback(async () => {
    if (chemin === null) return;
    setEtat((e) => ({ ...e, chargement: true, erreur: null }));
    try {
      const { donnees, horsLigne } = await lire<T>(chemin);
      setEtat({ donnees, chargement: false, erreur: null, horsLigne });
    } catch (e) {
      setEtat((precedent) => ({ ...precedent, chargement: false, erreur: e instanceof Error ? e.message : 'Erreur inconnue' }));
    }
  }, [chemin]);

  useEffect(() => {
    charger();
  }, [charger]);

  return { ...etat, recharger: charger };
}
