import { ArrowLeft, Check, ChevronRight, LucideIcon, WifiOff } from 'lucide-react-native';
import { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleProp, Text, TextInput, TextInputProps, TextProps, TextStyle, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../theme/apparences';
import { useStyles, useTheme } from '../theme/ThemeProvider';

export const ESPACE = { xs: 4, s: 8, m: 16, l: 24, xl: 32 };

// ----- Texte -----

type Variante = 'geant' | 'titre' | 'sousTitre' | 'section' | 'fort' | 'corps' | 'petit' | 'note';
type Couleur = 'texte' | 'doux' | 'faible' | 'accent' | 'surAccent' | 'succes' | 'alerte' | 'danger' | 'surHero' | 'heroDoux' | 'heroAccent';

function couleurTexte(t: Theme, c: Couleur): string {
  const table: Record<Couleur, string> = {
    texte: t.c.texte, doux: t.c.texteDoux, faible: t.c.texteFaible, accent: t.c.surAccentDoux, surAccent: t.c.surAccent,
    succes: t.c.succes, alerte: t.c.alerte, danger: t.c.danger, surHero: t.c.surHero, heroDoux: t.c.heroDoux, heroAccent: t.c.heroAccent,
  };
  return table[c];
}

function styleTexte(t: Theme, v: Variante): TextStyle {
  switch (v) {
    case 'geant': return { ...t.p.titre, fontSize: 34, lineHeight: 40, letterSpacing: t.p.espacementTitre };
    case 'titre': return { ...t.p.titre, fontSize: 26, lineHeight: 32, letterSpacing: t.p.espacementTitre };
    case 'sousTitre': return { ...t.p.titre, fontSize: 20, lineHeight: 26, letterSpacing: t.p.espacementTitre / 2 };
    case 'section': return { ...t.p.demi, fontSize: 17, lineHeight: 22 };
    case 'fort': return { ...t.p.demi, fontSize: 15, lineHeight: 20 };
    case 'corps': return { ...t.p.corps, fontSize: 15, lineHeight: 22 };
    case 'petit': return { ...t.p.moyen, fontSize: 13, lineHeight: 18 };
    case 'note': return { ...t.p.moyen, fontSize: 12, lineHeight: 16 };
  }
}

export function Texte({ v = 'corps', c = 'texte', centre, style, ...props }: TextProps & { v?: Variante; c?: Couleur; centre?: boolean }) {
  const t = useTheme();
  return <Text {...props} style={[styleTexte(t, v), { color: couleurTexte(t, c) }, centre && { textAlign: 'center' }, style]} />;
}

// ----- Icône -----

/** Affiche une icône, ou son emoji dans les apparences qui les préfèrent. */
export function Icone({ icone: I, emoji, taille = 20, couleur }: { icone: LucideIcon; emoji?: string; taille?: number; couleur?: string }) {
  const t = useTheme();
  if (t.f.emojis && emoji) return <Text style={{ fontSize: taille * 0.95, lineHeight: taille * 1.2 }}>{emoji}</Text>;
  return <I size={taille} color={couleur ?? t.c.texte} strokeWidth={2} />;
}

type Ton = 'accent' | 'neutre' | 'succes' | 'alerte' | 'danger';

function couleursTon(t: Theme, ton: Ton): { fond: string; texte: string } {
  switch (ton) {
    case 'accent': return { fond: t.c.accentDoux, texte: t.c.surAccentDoux };
    case 'succes': return { fond: t.c.succesDoux, texte: t.c.succes };
    case 'alerte': return { fond: t.c.alerteDoux, texte: t.c.alerte };
    case 'danger': return { fond: t.c.dangerDoux, texte: t.c.danger };
    case 'neutre': return { fond: t.c.retrait, texte: t.c.texteDoux };
  }
}

/** Icône dans un carré arrondi teinté. */
export function Vignette({ icone, emoji, ton = 'accent', taille = 44 }: { icone: LucideIcon; emoji?: string; ton?: Ton; taille?: number }) {
  const t = useTheme();
  const c = couleursTon(t, ton);
  return (
    <View style={{ width: taille, height: taille, borderRadius: Math.min(t.f.rayonM, taille / 3), backgroundColor: c.fond, alignItems: 'center', justifyContent: 'center' }}>
      <Icone icone={icone} emoji={emoji} taille={taille * 0.48} couleur={c.texte} />
    </View>
  );
}

// ----- Structure -----

export function Ecran({ children, defilant = true, bords = ['top'], pied }: { children: ReactNode; defilant?: boolean; bords?: ('top' | 'bottom')[]; pied?: ReactNode }) {
  const s = useStyles(styles);
  return (
    <SafeAreaView style={s.ecran} edges={bords}>
      {defilant ? (
        <ScrollView contentContainerStyle={s.contenu} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[s.contenu, { flex: 1 }]}>{children}</View>
      )}
      {pied && <View style={s.pied}>{pied}</View>}
    </SafeAreaView>
  );
}

export function Section({ titre, children, action, onAction }: { titre: string; children: ReactNode; action?: string; onAction?: () => void }) {
  const s = useStyles(styles);
  return (
    <View style={s.section}>
      <View style={s.enteteSection}>
        <Texte v="section" accessibilityRole="header">{titre}</Texte>
        {action && onAction && (
          <Pressable accessibilityRole="button" onPress={onAction} hitSlop={12}>
            <Texte v="petit" c="accent">{action}</Texte>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

export function Carte({ children, onPress, style, etiquette, plat }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle>; etiquette?: string; plat?: boolean }) {
  const s = useStyles(styles);
  const base = [s.carte, plat && s.cartePlate, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={etiquette} onPress={onPress} style={({ pressed }) => [...base, pressed && s.presse]}>
      {children}
    </Pressable>
  );
}

/** Grande carte mise en avant, dans la couleur forte de l'apparence. */
export function Hero({ children, onPress, etiquette, style }: { children: ReactNode; onPress?: () => void; etiquette?: string; style?: StyleProp<ViewStyle> }) {
  const s = useStyles(styles);
  if (!onPress) return <View style={[s.hero, style]}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={etiquette} onPress={onPress} style={({ pressed }) => [s.hero, style, pressed && s.presse]}>
      {children}
    </Pressable>
  );
}

/** Ligne de liste : vignette, titre, sous-titre, élément à droite. */
export function Ligne({ titre, sousTitre, gauche, droite, onPress, dernier }: { titre: string; sousTitre?: string; gauche?: ReactNode; droite?: ReactNode; onPress?: () => void; dernier?: boolean }) {
  const s = useStyles(styles);
  const t = useTheme();
  const contenu = (
    <>
      {gauche}
      <View style={{ flex: 1 }}>
        <Texte v="fort" numberOfLines={2}>{titre}</Texte>
        {sousTitre && <Texte v="petit" c="doux" numberOfLines={1} style={{ marginTop: 2 }}>{sousTitre}</Texte>}
      </View>
      {droite ?? (onPress ? <ChevronRight size={18} color={t.c.texteFaible} /> : null)}
    </>
  );
  const style = [s.ligne, !dernier && s.ligneSeparee];
  if (!onPress) return <View style={style}>{contenu}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={titre} onPress={onPress} style={({ pressed }) => [...style, pressed && s.presse]}>
      {contenu}
    </Pressable>
  );
}

// ----- Actions -----

type VarianteBouton = 'primaire' | 'secondaire' | 'discret' | 'surHero';

export function Bouton({ titre, onPress, variante = 'primaire', desactive, chargement, icone: I, compact }: { titre: string; onPress: () => void; variante?: VarianteBouton; desactive?: boolean; chargement?: boolean; icone?: LucideIcon; compact?: boolean }) {
  const t = useTheme();
  const s = useStyles(styles);
  const inactif = desactive || chargement;
  const couleurs = {
    primaire: { fond: t.c.accent, texte: t.c.surAccent, relief: t.c.accentRelief },
    secondaire: { fond: t.c.retrait, texte: t.c.texte, relief: t.c.bordure },
    discret: { fond: 'transparent', texte: t.c.texteDoux, relief: 'transparent' },
    surHero: { fond: t.c.surHero, texte: t.c.hero, relief: t.c.heroDoux },
  }[variante];
  const enRelief = t.f.relief && variante !== 'discret';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactif }}
      disabled={inactif}
      onPress={onPress}
      style={({ pressed }) => [
        s.bouton,
        compact && s.boutonCompact,
        { backgroundColor: couleurs.fond },
        enRelief && { borderBottomWidth: pressed ? 0 : 4, borderBottomColor: couleurs.relief, marginTop: pressed ? 4 : 0 },
        inactif && { opacity: 0.4 },
        pressed && !enRelief && s.presse,
      ]}
    >
      {chargement ? (
        <ActivityIndicator color={couleurs.texte} />
      ) : (
        <>
          {I && <I size={18} color={couleurs.texte} strokeWidth={2.2} />}
          <Text style={[t.p.gras, { fontSize: compact ? 14 : 16, color: couleurs.texte, letterSpacing: t.f.relief ? 0.4 : 0 }]}>{t.f.relief ? titre.toUpperCase() : titre}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Pastille({ texte, ton = 'neutre', icone: I }: { texte: string; ton?: Ton; icone?: LucideIcon }) {
  const t = useTheme();
  const c = couleursTon(t, ton);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', backgroundColor: c.fond, borderRadius: 999, paddingHorizontal: 9, paddingVertical: 4 }}>
      {I && !t.f.emojis && <I size={12} color={c.texte} strokeWidth={2.4} />}
      <Text style={[t.p.demi, { fontSize: 12, color: c.texte }]}>{texte}</Text>
    </View>
  );
}

/** Choix sélectionnable (réponse, filtre). */
export function Choix({ libelle, actif, onPress, large }: { libelle: string; actif: boolean; onPress: () => void; large?: boolean }) {
  const t = useTheme();
  const s = useStyles(styles);
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={onPress} style={[s.choix, large && s.choixLarge, actif && { borderColor: t.c.accent, backgroundColor: t.c.accentDoux }]}>
      <Text style={[actif ? t.p.demi : t.p.moyen, { fontSize: large ? 16 : 14, color: actif ? t.c.surAccentDoux : t.c.texte }]}>{libelle}</Text>
    </Pressable>
  );
}

/** Rangée de filtres qui défile horizontalement. */
export function Filtres({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -ESPACE.m, flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: ESPACE.m, gap: ESPACE.s }}>
      {children}
    </ScrollView>
  );
}

export function Segments<T extends string>({ options, valeur, onChange }: { options: { valeur: T; libelle: string }[]; valeur: T; onChange: (v: T) => void }) {
  const t = useTheme();
  const s = useStyles(styles);
  return (
    <View style={s.segments} accessibilityRole="tablist">
      {options.map((o) => {
        const actif = o.valeur === valeur;
        return (
          <Pressable key={o.valeur} accessibilityRole="tab" accessibilityState={{ selected: actif }} onPress={() => onChange(o.valeur)} style={[s.segment, actif && s.segmentActif]}>
            <Text numberOfLines={1} style={[actif ? t.p.demi : t.p.moyen, { fontSize: 13, color: actif ? t.c.texte : t.c.texteDoux }]}>{o.libelle}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Champ({ icone: I, style, ...props }: TextInputProps & { icone?: LucideIcon }) {
  const t = useTheme();
  const s = useStyles(styles);
  return (
    <View style={[s.champ, props.multiline && { alignItems: 'flex-start', minHeight: 132, paddingVertical: 12 }]}>
      {I && <I size={18} color={t.c.texteFaible} />}
      <TextInput {...props} placeholderTextColor={t.c.texteFaible} style={[t.p.corps, s.saisie, props.multiline && { textAlignVertical: 'top', minHeight: 108 }, style]} />
    </View>
  );
}

export function Barre({ valeur, couleur, fond, hauteur = 8 }: { valeur: number; couleur?: string; fond?: string; hauteur?: number }) {
  const t = useTheme();
  const largeur = Math.max(0, Math.min(1, valeur)) * 100;
  return (
    <View style={{ height: hauteur, borderRadius: 999, backgroundColor: fond ?? t.c.retrait, overflow: 'hidden' }} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: Math.round(largeur) }}>
      <View style={{ height: '100%', width: `${largeur}%`, borderRadius: 999, backgroundColor: couleur ?? t.c.accent }} />
    </View>
  );
}

/** Ligne de choix avec coche, pour les listes longues. */
export function OptionListe({ libelle, detail, actif, onPress }: { libelle: string; detail?: string; actif: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: actif }} onPress={onPress}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: ESPACE.m, paddingVertical: 10, borderRadius: t.f.rayonM, borderWidth: Math.max(1.5, t.f.largeurBordure), borderColor: actif ? t.c.accent : t.c.bordure, backgroundColor: actif ? t.c.accentDoux : t.c.surface, marginBottom: ESPACE.s }}>
      <View style={{ flex: 1 }}>
        <Texte v="fort" c={actif ? 'accent' : 'texte'}>{libelle}</Texte>
        {detail && <Texte v="petit" c="doux" numberOfLines={1}>{detail}</Texte>}
      </View>
      {actif && <Check size={18} color={t.c.surAccentDoux} strokeWidth={2.6} />}
    </Pressable>
  );
}

/** Libellé au-dessus d'un champ de formulaire. */
export function Etiquette({ children }: { children: ReactNode }) {
  return <Texte v="petit" c="doux" style={{ marginTop: ESPACE.l, marginBottom: ESPACE.s }}>{children}</Texte>;
}

/** En-tête d'un parcours en étapes : retour et barre de progression. */
export function EnteteEtapes({ progression, onRetour }: { progression: number; onRetour: () => void }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: ESPACE.m, marginBottom: ESPACE.l }}>
      <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={onRetour} hitSlop={12}>
        <ArrowLeft size={24} color={t.c.texte} />
      </Pressable>
      <View style={{ flex: 1 }}>
        <Barre valeur={progression} />
      </View>
    </View>
  );
}

/** Bandeau d'information ou d'alerte avec une action. */
export function Bandeau({ icone: I, titre, texte, ton = 'accent', action, onAction }: { icone: LucideIcon; titre: string; texte?: string; ton?: Ton; action?: string; onAction?: () => void }) {
  const t = useTheme();
  const c = couleursTon(t, ton);
  const contenu = (
    <>
      <I size={22} color={c.texte} strokeWidth={2.2} />
      <View style={{ flex: 1 }}>
        <Text style={[t.p.demi, { fontSize: 15, lineHeight: 20, color: c.texte }]}>{titre}</Text>
        {texte && <Text style={[t.p.corps, { fontSize: 13, lineHeight: 18, color: c.texte, opacity: 0.9, marginTop: 2 }]}>{texte}</Text>}
      </View>
      {action && <Text style={[t.p.gras, { fontSize: 13, color: c.texte }]}>{action}</Text>}
    </>
  );
  const style = { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 12, backgroundColor: c.fond, borderRadius: t.f.rayonM, padding: ESPACE.m };
  if (!onAction) return <View style={style}>{contenu}</View>;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${titre}. ${action ?? ''}`} onPress={onAction} style={({ pressed }) => [style, pressed && { opacity: 0.7 }]}>
      {contenu}
    </Pressable>
  );
}

// ----- États -----

export function Etat({ chargement, erreur, vide, messageVide, onReessayer }: { chargement?: boolean; erreur?: string | null; vide?: boolean; messageVide?: string; onReessayer?: () => void }) {
  const t = useTheme();
  if (chargement) return <ActivityIndicator style={{ marginVertical: ESPACE.xl }} color={t.c.texteDoux} />;
  if (erreur) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: ESPACE.xl, gap: ESPACE.m }}>
        <WifiOff size={28} color={t.c.texteFaible} />
        <Texte c="doux" centre>{erreur}</Texte>
        {onReessayer && <Bouton titre="Réessayer" variante="secondaire" compact onPress={onReessayer} />}
      </View>
    );
  }
  if (vide) return <Texte c="doux" centre style={{ paddingVertical: ESPACE.xl }}>{messageVide ?? 'Rien pour le moment.'}</Texte>;
  return null;
}

export function BandeauHorsLigne({ visible }: { visible: boolean }) {
  const t = useTheme();
  if (!visible) return null;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.c.alerteDoux, borderRadius: t.f.rayonS, padding: 10, marginBottom: ESPACE.m }}>
      <WifiOff size={15} color={t.c.alerte} />
      <Texte v="petit" c="alerte">Hors-ligne · dernières données enregistrées</Texte>
    </View>
  );
}

const styles = (t: Theme) => ({
  ecran: { flex: 1, backgroundColor: t.c.fond } as ViewStyle,
  contenu: { padding: ESPACE.m, paddingBottom: ESPACE.xl, width: '100%', maxWidth: 560, alignSelf: 'center' } as ViewStyle,
  pied: { paddingHorizontal: ESPACE.m, paddingTop: ESPACE.s, paddingBottom: ESPACE.m, width: '100%', maxWidth: 560, alignSelf: 'center', gap: ESPACE.s } as ViewStyle,
  section: { marginTop: ESPACE.l } as ViewStyle,
  enteteSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 } as ViewStyle,
  carte: {
    backgroundColor: t.c.surface, borderRadius: t.f.rayonM, padding: ESPACE.m,
    borderWidth: t.f.ombre && !t.sombre ? 0 : t.f.largeurBordure, borderColor: t.c.bordure,
    ...(t.f.relief ? { borderBottomWidth: 4 } : {}),
    ...(t.f.ombre && !t.sombre ? { shadowColor: '#1A1A1A', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 2 }, elevation: 2 } : {}),
  } as ViewStyle,
  cartePlate: { padding: 0, overflow: 'hidden' } as ViewStyle,
  hero: { backgroundColor: t.c.hero, borderRadius: t.f.rayonL, padding: ESPACE.l, ...(t.f.relief ? { borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.18)' } : {}) } as ViewStyle,
  presse: { opacity: 0.7 } as ViewStyle,
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: ESPACE.m, minHeight: 56 } as ViewStyle,
  ligneSeparee: { borderBottomWidth: 1, borderBottomColor: t.c.bordure } as ViewStyle,
  bouton: { minHeight: 52, borderRadius: t.f.rayonBouton, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: ESPACE.l } as ViewStyle,
  boutonCompact: { minHeight: 40, paddingHorizontal: ESPACE.m, alignSelf: 'flex-start' } as ViewStyle,
  choix: { borderWidth: Math.max(1.5, t.f.largeurBordure), borderColor: t.c.bordure, backgroundColor: t.c.surface, borderRadius: 999, paddingHorizontal: 14, minHeight: 40, justifyContent: 'center', ...(t.f.relief ? { borderBottomWidth: 4 } : {}) } as ViewStyle,
  choixLarge: { borderRadius: t.f.rayonM, minHeight: 56, paddingHorizontal: ESPACE.m } as ViewStyle,
  segments: { flexDirection: 'row', backgroundColor: t.c.retrait, borderRadius: t.f.rayonM, padding: 4 } as ViewStyle,
  segment: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: Math.max(4, t.f.rayonM - 4), paddingHorizontal: 6 } as ViewStyle,
  segmentActif: { backgroundColor: t.c.surface, ...(t.sombre ? { backgroundColor: t.c.bordure } : { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 }) } as ViewStyle,
  champ: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: t.c.retrait, borderRadius: t.f.rayonM, paddingHorizontal: 14, minHeight: 52, borderWidth: t.f.relief ? 2 : 0, borderColor: t.c.bordure } as ViewStyle,
  saisie: { flex: 1, fontSize: 16, color: t.c.texte, paddingVertical: 0, outlineStyle: 'none' } as unknown as TextStyle,
});
