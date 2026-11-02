import {
  Atom,
  Braces,
  Code2,
  FileCode,
  Github,
  GitBranch,
  Globe,
  Paintbrush,
  Shield,
  Sparkles,
  Wind,
  type LucideIcon,
} from 'lucide-react';

export const SKILL_ICONS: Record<string, LucideIcon> = {
  code: Code2,
  paintbrush: Paintbrush,
  wind: Wind,
  sparkles: Sparkles,
  braces: Braces,
  'file-code': FileCode,
  atom: Atom,
  globe: Globe,
  github: Github,
  'git-branch': GitBranch,
  shield: Shield,
};

export const SKILL_ICON_KEYS = Object.keys(SKILL_ICONS);

export function getSkillIcon(key: string): LucideIcon {
  return SKILL_ICONS[key] ?? Code2;
}
