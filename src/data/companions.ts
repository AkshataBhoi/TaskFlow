export interface Companion {
  id: string;
  name: string;
  species: string;
  role: string;
  icon: string;
  badge: string;
  avatarBg: string;
  borderColor: string;
  gradient: string;
  description: string;
}

export const COMPANIONS: Companion[] = [
  {
    id: 'owl',
    name: 'Barnaby',
    species: 'Owl',
    role: 'Wise Focus Helper',
    icon: '🦉',
    badge: 'Default Companion',
    avatarBg: 'bg-amber-100 text-amber-800',
    borderColor: 'border-amber-300',
    gradient: 'from-amber-400/20 via-orange-400/10 to-transparent',
    description: 'Keeps sharp focus during long work sessions and organizes your daily task flow.',
  },
  {
    id: 'fox',
    name: 'Sly',
    species: 'Fox',
    role: 'Swift Task Specialist',
    icon: '🦊',
    badge: 'Agile & Fast',
    avatarBg: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-300',
    gradient: 'from-orange-400/20 via-red-400/10 to-transparent',
    description: 'Sprints through backlogs with rapid prioritization and high energy.',
  },
  {
    id: 'cat',
    name: 'Whiskers',
    species: 'Cat',
    role: 'Zen Deep Work Partner',
    icon: '🐱',
    badge: 'Calm & Steady',
    avatarBg: 'bg-purple-100 text-purple-800',
    borderColor: 'border-purple-300',
    gradient: 'from-purple-400/20 via-indigo-400/10 to-transparent',
    description: 'Promotes peaceful deep focus and stress-free productivity pacing.',
  },
  {
    id: 'bear',
    name: 'Bruno',
    species: 'Bear',
    role: 'Steady Power Focus',
    icon: '🐻',
    badge: 'Powerhouse',
    avatarBg: 'bg-amber-950/10 text-amber-900',
    borderColor: 'border-amber-400',
    gradient: 'from-amber-700/20 via-stone-700/10 to-transparent',
    description: 'Tackles heavy project loads and complex multi-step objectives.',
  },
  {
    id: 'rabbit',
    name: 'Pip',
    species: 'Rabbit',
    role: 'Sprint Master',
    icon: '🐰',
    badge: 'Speed Demon',
    avatarBg: 'bg-pink-100 text-pink-800',
    borderColor: 'border-pink-300',
    gradient: 'from-pink-400/20 via-rose-400/10 to-transparent',
    description: 'Breaks large goals into quick, actionable micro-tasks.',
  },
  {
    id: 'panda',
    name: 'Momo',
    species: 'Panda',
    role: 'Mindful Balance Guide',
    icon: '🐼',
    badge: 'Balance Master',
    avatarBg: 'bg-emerald-100 text-emerald-800',
    borderColor: 'border-emerald-300',
    gradient: 'from-emerald-400/20 via-teal-400/10 to-transparent',
    description: 'Encourages healthy focus-rest intervals and long-term consistency.',
  },
];
