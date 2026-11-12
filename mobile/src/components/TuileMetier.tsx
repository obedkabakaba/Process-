import { View } from 'react-native';
import { Metier } from '../lib/api';
import { symboleDomaine } from './icones';
import { Carte, Texte, Vignette } from './ui';

/** Tuile compacte d'un métier : icône du domaine, nom, compatibilité. */
export function TuileMetier({ metier, onPress, largeur }: { metier: Metier; onPress: () => void; largeur?: number }) {
  const s = symboleDomaine(metier.domaine);
  return (
    <Carte onPress={onPress} etiquette={metier.nom} style={{ width: largeur, flex: largeur ? undefined : 1, minHeight: 148, justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Vignette icone={s.icone} emoji={metier.emoji} taille={40} />
        {metier.compatibilite !== undefined && <Texte v="fort" c="accent">{metier.compatibilite} %</Texte>}
      </View>
      <View>
        <Texte v="fort" numberOfLines={2}>{metier.nom}</Texte>
        <Texte v="note" c="doux" numberOfLines={1} style={{ marginTop: 2 }}>{metier.domaine}</Texte>
      </View>
    </Carte>
  );
}
