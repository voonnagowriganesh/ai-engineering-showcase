import type { ComponentType, SVGProps } from 'react';

export type IconType = ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;

export interface NavItem {
  id: string;
  label: string;
}

export interface Identity {
  name: string;
  initials: string;
  role: string;
  roles: readonly string[];
  tagline: string;
  statements: readonly string[];
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  medium: string;
  availability: string;
  /** Served from public/; used for every Resume download link. */
  resumeUrl: string;
  resumeFileName: string;
}

export interface Metric {
  value: string;
  countTo: number;
  suffix?: string;
  label: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  startYear: string;
  location: string;
  status: 'current' | 'past';
  summary: string;
  responsibilities: readonly string[];
  stack: readonly string[];
  accent: readonly [string, string];
  /** Company logo under public/. Falls back to the generative glyph. */
  logo?: string;
  /** Work under NDA: the card states why there is no case study. */
  confidential?: boolean;
}

export interface ProjectLink {
  label: string;
  href: string;
}

export interface ProjectMetric {
  value: string;
  label: string;
}

export type ProjectVisual =
  | 'voice'
  | 'resume'
  | 'inventory'
  | 'community'
  | 'auth'
  | 'food'
  | 'crime';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  featured: boolean;
  visual: ProjectVisual;
  palette: readonly [string, string];
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
  metrics?: readonly ProjectMetric[];
  links: readonly ProjectLink[];
  /** Real project artwork under public/; ProjectVisual is the fallback. */
  image?: string;
}

export interface SkillItem {
  name: string;
}

export interface SkillDomain {
  id: string;
  title: string;
  blurb: string;
  icon: IconType;
  skills: readonly SkillItem[];
}

export type ToolCategory =
  | 'AI & GenAI'
  | 'Backend'
  | 'Frontend'
  | 'Database'
  | 'Data Science'
  | 'DevOps & Cloud';

export interface ToolItem {
  id: string;
  name: string;
  icon: IconType;
  category: ToolCategory;
}

export interface Education {
  degree: string;
  specialisation?: string;
  institution: string;
  university?: string;
  period: string;
  location: string;
  cgpa?: string;
  cgpaMax?: number;
}

export type CredentialKind = 'certificate' | 'badge' | 'internship';

export interface Credential {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  kind: CredentialKind;
  detail: string;
  credentialId?: string;
  verifyUrl?: string;
  /** Path to the certificate file under public/, e.g. /certificates/x.pdf */
  assetUrl?: string;
  /** Issuer logo under public/; replaces the kind icon on the card. */
  logo?: string;
}

export interface Strength {
  title: string;
  icon: IconType;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  deliverables: readonly string[];
  icon: IconType;
}
