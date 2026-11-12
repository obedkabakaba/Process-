import { TextStyle } from 'react-native';

/** Une police : famille chargée (ou police du système) et graisse associée. */
export interface Police { fontFamily?: string; fontWeight?: TextStyle['fontWeight'] }

export interface Couleurs {
  fond: string;
  surface: string;
  /** Fond des champs, des segments et des zones en retrait. */
  retrait: string;
  bordure: string;
  texte: string;
  texteDoux: string;
  texteFaible: string;
  /** Couleur d'action principale (boutons, liens, sélection). */
  accent: string;
  surAccent: string;
  /** Ombre portée sous les boutons en relief. */
  accentRelief: string;
  accentDoux: string;
  surAccentDoux: string;
  /** Grande carte mise en avant. */
  hero: string;
  surHero: string;
  heroDoux: string;
  heroAccent: string;
  succes: string;
  succesDoux: string;
  alerte: string;
  alerteDoux: string;
  danger: string;
  dangerDoux: string;
}

export interface Formes {
  rayonS: number;
  rayonM: number;
  rayonL: number;
  /** Rayon des boutons (999 = pilule). */
  rayonBouton: number;
  largeurBordure: number;
  /** Boutons et cartes avec un rebord épais en bas. */
  relief: boolean;
  /** Cartes avec ombre légère (mode clair uniquement) plutôt que bordure. */
  ombre: boolean;
  /** Affiche des emojis à la place des icônes. */
  emojis: boolean;
  /** Titres de section en petites capitales. */
  sectionsCapitales: boolean;
}

export interface Polices { titre: Police; gras: Police; demi: Police; moyen: Police; corps: Police; espacementTitre: number }

export interface Theme { id: string; nom: string; sombre: boolean; c: Couleurs; f: Formes; p: Polices }

export interface Apparence { id: string; nom: string; resume: string; clair: Couleurs; sombre: Couleurs; f: Formes; p: Polices }

const INTER: Polices = {
  titre: { fontFamily: 'Inter_700Bold' }, gras: { fontFamily: 'Inter_700Bold' }, demi: { fontFamily: 'Inter_600SemiBold' },
  moyen: { fontFamily: 'Inter_500Medium' }, corps: { fontFamily: 'Inter_400Regular' }, espacementTitre: -0.6,
};

const ETATS_CLAIR = { succes: '#0B7A53', succesDoux: '#E3F4EC', alerte: '#9A5B00', alerteDoux: '#FBF0D9', danger: '#C22A2A', dangerDoux: '#FCE8E6' };
const ETATS_SOMBRE = { succes: '#4ADE9F', succesDoux: '#12382B', alerte: '#F5B94A', alerteDoux: '#3A2C10', danger: '#FF7B72', dangerDoux: '#411C1A' };

export const APPARENCES: Apparence[] = [
  {
    id: 'aube', nom: 'Aube', resume: "L'identité Kesho",
    clair: {
      fond: '#F7F6F3', surface: '#FFFFFF', retrait: '#EEECE7', bordure: '#E4E1DA', texte: '#0E1116', texteDoux: '#565B66', texteFaible: '#8C919C',
      accent: '#F4511E', surAccent: '#FFFFFF', accentRelief: '#C23E14', accentDoux: '#FDE9E1', surAccentDoux: '#B03A12',
      hero: '#0E1116', surHero: '#FFFFFF', heroDoux: '#A9AFBC', heroAccent: '#FF8A5C', ...ETATS_CLAIR,
    },
    sombre: {
      fond: '#0B0D10', surface: '#15181D', retrait: '#1D2127', bordure: '#272C34', texte: '#F3F4F6', texteDoux: '#A4AAB6', texteFaible: '#6E7480',
      accent: '#FF6B3D', surAccent: '#160702', accentRelief: '#C44A22', accentDoux: '#34190F', surAccentDoux: '#FF9A78',
      hero: '#1B1F26', surHero: '#FFFFFF', heroDoux: '#A4AAB6', heroAccent: '#FF8A5C', ...ETATS_SOMBRE,
    },
    f: { rayonS: 10, rayonM: 16, rayonL: 24, rayonBouton: 14, largeurBordure: 1, relief: false, ombre: true, emojis: false, sectionsCapitales: false },
    p: { ...INTER, titre: { fontFamily: 'Sora_700Bold' }, espacementTitre: -0.8 },
  },
  {
    id: 'sable', nom: 'Sable', resume: 'Calme et chaleureux',
    clair: {
      fond: '#F4EFE6', surface: '#FBF8F2', retrait: '#EAE3D6', bordure: '#DFD6C6', texte: '#211F1C', texteDoux: '#5F5A52', texteFaible: '#8F887C',
      accent: '#B8552F', surAccent: '#FFFFFF', accentRelief: '#8E3F21', accentDoux: '#F1DDD0', surAccentDoux: '#8E3F21',
      hero: '#2A2723', surHero: '#F6F1E7', heroDoux: '#B9B1A3', heroAccent: '#E39B78', ...ETATS_CLAIR,
    },
    sombre: {
      fond: '#1B1A18', surface: '#252320', retrait: '#2E2B27', bordure: '#3A3631', texte: '#EFEAE0', texteDoux: '#B0A99C', texteFaible: '#7D776C',
      accent: '#DB7F5B', surAccent: '#1D0D06', accentRelief: '#A85A3C', accentDoux: '#3A251B', surAccentDoux: '#EDA587',
      hero: '#302D29', surHero: '#F6F1E7', heroDoux: '#B0A99C', heroAccent: '#E8A281', ...ETATS_SOMBRE,
    },
    f: { rayonS: 8, rayonM: 14, rayonL: 20, rayonBouton: 12, largeurBordure: 1, relief: false, ombre: false, emojis: false, sectionsCapitales: false },
    p: { ...INTER, titre: { fontFamily: 'Fraunces_600SemiBold' }, espacementTitre: -0.4 },
  },
  {
    id: 'graphite', nom: 'Graphite', resume: 'Minimal, noir et blanc',
    clair: {
      fond: '#FFFFFF', surface: '#FFFFFF', retrait: '#F4F4F4', bordure: '#E7E7E7', texte: '#0D0D0D', texteDoux: '#5D5D5D', texteFaible: '#8F8F8F',
      accent: '#0D0D0D', surAccent: '#FFFFFF', accentRelief: '#000000', accentDoux: '#F1F1F1', surAccentDoux: '#0D0D0D',
      hero: '#F4F4F4', surHero: '#0D0D0D', heroDoux: '#5D5D5D', heroAccent: '#0D0D0D', ...ETATS_CLAIR,
    },
    sombre: {
      fond: '#0D0D0D', surface: '#171717', retrait: '#212121', bordure: '#2C2C2C', texte: '#ECECEC', texteDoux: '#A6A6A6', texteFaible: '#707070',
      accent: '#FFFFFF', surAccent: '#0D0D0D', accentRelief: '#CFCFCF', accentDoux: '#242424', surAccentDoux: '#FFFFFF',
      hero: '#1C1C1C', surHero: '#FFFFFF', heroDoux: '#A6A6A6', heroAccent: '#FFFFFF', ...ETATS_SOMBRE,
    },
    f: { rayonS: 10, rayonM: 16, rayonL: 22, rayonBouton: 999, largeurBordure: 1, relief: false, ombre: false, emojis: false, sectionsCapitales: false },
    p: { ...INTER, titre: { fontFamily: 'Inter_600SemiBold' }, espacementTitre: -0.9 },
  },
  {
    id: 'emeraude', nom: 'Émeraude', resume: 'Net et contrasté',
    clair: {
      fond: '#FFFFFF', surface: '#FFFFFF', retrait: '#F3F3F3', bordure: '#E8E8E8', texte: '#000000', texteDoux: '#545454', texteFaible: '#8A8A8A',
      accent: '#000000', surAccent: '#FFFFFF', accentRelief: '#000000', accentDoux: '#E4F8EC', surAccentDoux: '#04663A',
      hero: '#06C167', surHero: '#00210F', heroDoux: '#0A4A2A', heroAccent: '#00210F', ...ETATS_CLAIR,
    },
    sombre: {
      fond: '#000000', surface: '#121212', retrait: '#1C1C1C', bordure: '#2A2A2A', texte: '#FFFFFF', texteDoux: '#ADADAD', texteFaible: '#757575',
      accent: '#06C167', surAccent: '#00210F', accentRelief: '#04914D', accentDoux: '#0C2B1B', surAccentDoux: '#3FE08F',
      hero: '#06C167', surHero: '#00210F', heroDoux: '#0A4A2A', heroAccent: '#00210F', ...ETATS_SOMBRE,
    },
    f: { rayonS: 6, rayonM: 10, rayonL: 14, rayonBouton: 8, largeurBordure: 1, relief: false, ombre: false, emojis: false, sectionsCapitales: false },
    p: { ...INTER, titre: { fontFamily: 'Inter_800ExtraBold' }, gras: { fontFamily: 'Inter_800ExtraBold' }, espacementTitre: -1 },
  },
  {
    id: 'elan', nom: 'Élan', resume: 'Vif et motivant',
    clair: {
      fond: '#FFFFFF', surface: '#FFFFFF', retrait: '#F7F7F7', bordure: '#E5E5E5', texte: '#3C3C3C', texteDoux: '#777777', texteFaible: '#AFAFAF',
      accent: '#58CC02', surAccent: '#FFFFFF', accentRelief: '#46A302', accentDoux: '#DDF4FF', surAccentDoux: '#1899D6',
      hero: '#1CB0F6', surHero: '#FFFFFF', heroDoux: '#DDF4FF', heroAccent: '#FFFFFF',
      succes: '#46A302', succesDoux: '#D7FFB8', alerte: '#B86E00', alerteDoux: '#FFF1C2', danger: '#EA2B2B', dangerDoux: '#FFDFE0',
    },
    sombre: {
      fond: '#131F24', surface: '#131F24', retrait: '#202F36', bordure: '#37464F', texte: '#F1F7FB', texteDoux: '#A6B5BD', texteFaible: '#6B7C85',
      accent: '#93D333', surAccent: '#131F24', accentRelief: '#79B933', accentDoux: '#202F36', surAccentDoux: '#49C0F8',
      hero: '#1899D6', surHero: '#FFFFFF', heroDoux: '#CFEFFF', heroAccent: '#FFFFFF',
      succes: '#93D333', succesDoux: '#24361C', alerte: '#FFC800', alerteDoux: '#3B3212', danger: '#FF6B6B', dangerDoux: '#40201F',
    },
    f: { rayonS: 12, rayonM: 16, rayonL: 20, rayonBouton: 16, largeurBordure: 2, relief: true, ombre: false, emojis: false, sectionsCapitales: false },
    p: {
      titre: { fontFamily: 'Nunito_900Black' }, gras: { fontFamily: 'Nunito_800ExtraBold' }, demi: { fontFamily: 'Nunito_700Bold' },
      moyen: { fontFamily: 'Nunito_700Bold' }, corps: { fontFamily: 'Nunito_600SemiBold' }, espacementTitre: -0.2,
    },
  },
  {
    id: 'classique', nom: 'Classique', resume: 'Le premier design, coloré',
    clair: {
      fond: '#F6F4FF', surface: '#FFFFFF', retrait: '#ECE8FB', bordure: '#E4E0F5', texte: '#14102B', texteDoux: '#6B6785', texteFaible: '#9591AB',
      accent: '#5B2EFF', surAccent: '#FFFFFF', accentRelief: '#3A14C9', accentDoux: '#EDE8FF', surAccentDoux: '#3A14C9',
      hero: '#5B2EFF', surHero: '#FFFFFF', heroDoux: '#E3DBFF', heroAccent: '#FFB800', ...ETATS_CLAIR,
    },
    sombre: {
      fond: '#110E22', surface: '#1B1733', retrait: '#252043', bordure: '#322C55', texte: '#F3F0FF', texteDoux: '#ACA6CC', texteFaible: '#766F99',
      accent: '#8B6BFF', surAccent: '#0F0A26', accentRelief: '#6747E0', accentDoux: '#2A2350', surAccentDoux: '#C2B2FF',
      hero: '#4A25D6', surHero: '#FFFFFF', heroDoux: '#D6CCFF', heroAccent: '#FFC933', ...ETATS_SOMBRE,
    },
    f: { rayonS: 10, rayonM: 16, rayonL: 24, rayonBouton: 16, largeurBordure: 1, relief: false, ombre: false, emojis: true, sectionsCapitales: false },
    p: { titre: { fontWeight: '800' }, gras: { fontWeight: '700' }, demi: { fontWeight: '600' }, moyen: { fontWeight: '500' }, corps: { fontWeight: '400' }, espacementTitre: -0.5 },
  },
];

export const APPARENCE_PAR_DEFAUT = 'aube';

export function construireTheme(id: string, sombre: boolean): Theme {
  const a = APPARENCES.find((x) => x.id === id) ?? APPARENCES[0];
  return { id: a.id, nom: a.nom, sombre, c: sombre ? a.sombre : a.clair, f: a.f, p: a.p };
}
