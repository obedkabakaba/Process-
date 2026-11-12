import {
  Backpack, BookOpen, Briefcase, Building2, CalendarDays, Calculator, Car, Clapperboard, ClipboardList, Cog, Crown, FileText,
  FlaskConical, FolderOpen, Globe, GraduationCap, Hammer, HandHeart, Handshake, HeartPulse, Laptop, LayoutGrid, ListChecks, LucideIcon,
  MapPin, MessagesSquare, Mic, Microscope, Music, Palette, PenLine, Pickaxe, Presentation, Receipt, Rocket, Scale, Shirt, Sparkles,
  Sprout, Stethoscope, Table2, Tent, TrendingUp, Trophy, Users, Utensils, Wrench, Zap,
} from 'lucide-react-native';

export interface Symbole { icone: LucideIcon; emoji: string }

const DEFAUT: Symbole = { icone: Sparkles, emoji: '✨' };

const DOMAINES: Record<string, Symbole> = {
  'Santé': { icone: HeartPulse, emoji: '🩺' },
  'Agriculture et élevage': { icone: Sprout, emoji: '🌾' },
  'Construction': { icone: Building2, emoji: '🏗️' },
  'Mines et énergie': { icone: Pickaxe, emoji: '⛏️' },
  'Industrie et transport': { icone: Cog, emoji: '⚙️' },
  'Numérique': { icone: Laptop, emoji: '💻' },
  'Création et médias': { icone: Palette, emoji: '🎨' },
  'Éducation et social': { icone: GraduationCap, emoji: '👩‍🏫' },
  'Droit et administration': { icone: Scale, emoji: '⚖️' },
  'Commerce et finance': { icone: TrendingUp, emoji: '📈' },
  'Tourisme et services': { icone: Utensils, emoji: '🏨' },
};

const TYPES: Record<string, Symbole & { nom: string }> = {
  bourse: { nom: 'Bourse', icone: GraduationCap, emoji: '🎓' },
  concours: { nom: 'Concours', icone: Trophy, emoji: '🏆' },
  programme: { nom: 'Programme', icone: Globe, emoji: '🌍' },
  formation: { nom: 'Formation', icone: BookOpen, emoji: '📚' },
  evenement: { nom: 'Événement', icone: MapPin, emoji: '📍' },
  stage: { nom: 'Stage', icone: Briefcase, emoji: '💼' },
  emploi: { nom: 'Emploi', icone: Briefcase, emoji: '💼' },
  aide: { nom: 'Aide', icone: HandHeart, emoji: '🤲' },
  examen: { nom: 'Examen', icone: FileText, emoji: '📝' },
  inscription: { nom: 'Inscription', icone: ClipboardList, emoji: '🖊️' },
  rentree: { nom: 'Rentrée', icone: Backpack, emoji: '🎒' },
  salon: { nom: 'Salon', icone: Tent, emoji: '🎪' },
};

const PROFILS: Record<string, Symbole & { nom: string }> = {
  R: { nom: 'Bâtisseur', icone: Hammer, emoji: '🛠️' },
  I: { nom: 'Chercheur', icone: Microscope, emoji: '🔬' },
  A: { nom: 'Créatif', icone: Palette, emoji: '🎨' },
  S: { nom: 'Aidant', icone: HandHeart, emoji: '🤝' },
  E: { nom: 'Leader', icone: Rocket, emoji: '🚀' },
  C: { nom: 'Organisateur', icone: LayoutGrid, emoji: '📊' },
};

/** Une icône par question du test (identifiant de question → icône). */
const QUESTIONS: Record<string, LucideIcon> = {
  r1: Wrench, i1: FlaskConical, a1: Palette, s1: HandHeart, e1: Briefcase, c1: Table2,
  r2: Sprout, i2: Calculator, a2: Music, s2: Presentation, e2: Mic, c2: FolderOpen,
  r3: Hammer, i3: Stethoscope, a3: PenLine, s3: HeartPulse, e3: Crown, c3: Receipt,
  r4: Car, i4: Laptop, a4: Clapperboard, s4: MessagesSquare, e4: Scale, c4: CalendarDays,
  r5: Zap, i5: Globe, a5: Shirt, s5: Users, e5: Handshake, c5: ListChecks,
};

export const symboleDomaine = (domaine: string): Symbole => DOMAINES[domaine] ?? DEFAUT;
export const symboleType = (type: string) => TYPES[type] ?? { ...DEFAUT, nom: type };
export const symboleProfil = (lettre: string) => PROFILS[lettre] ?? { ...DEFAUT, nom: lettre };
export const iconeQuestion = (id: string): LucideIcon => QUESTIONS[id] ?? Sparkles;
