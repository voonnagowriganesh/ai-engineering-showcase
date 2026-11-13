/**
 * Domain models for the portfolio.
 *
 * These interfaces are the contract between content (`src/data`) and
 * presentation (`src/components`). Components depend on these types, never on
 * the concrete data module, so content can be swapped, fetched from a CMS, or
 * mocked in tests without touching a single component.
 */

import type { IconType } from 'react-icons';
import type { LucideIcon } from 'lucide-react';

/** Any renderable icon — lucide (UI glyphs) or react-icons (brand marks). */
export type IconComponent = LucideIcon | IconType;

/* ──────────────────────────────────────────────────────────────────────────
   Shared value objects
   ────────────────────────────────────────────────────────────────────────── */

/** A link that may point inside the document or out to the web. */
export interface Link {
  readonly label: string;
  readonly href: string;
  /** External links get rel/target hardening applied automatically. */
  readonly external?: boolean;
}

/** A single headline metric, e.g. "40% faster API response". */
export interface Metric {
  readonly value: string;
  readonly label: string;
  /** Optional numeric target so counters can animate up to it. */
  readonly countTo?: number;
  readonly suffix?: string;
  readonly prefix?: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Identity
   ────────────────────────────────────────────────────────────────────────── */

export interface SocialProfile {
  readonly id: string;
  readonly label: string;
  readonly handle: string;
  readonly href: string;
  readonly icon: IconComponent;
}

export interface Identity {
  readonly fullName: string;
  readonly shortName: string;
  readonly initials: string;
  readonly role: string;
  readonly positioning: readonly string[];
  readonly tagline: string;
  readonly headline: readonly string[];
  readonly supportingStatement: readonly string[];
  readonly location: string;
  readonly email: string;
  readonly phone: string;
  readonly availability: string;
  readonly avatarUrl: string;
  readonly resumeUrl: string;
  readonly resumeFileName: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Experience
   ────────────────────────────────────────────────────────────────────────── */

export type EmploymentStatus = 'current' | 'past';

export interface Experience {
  readonly id: string;
  readonly company: string;
  readonly role: string;
  readonly period: string;
  readonly startYear: string;
  readonly location: string;
  readonly status: EmploymentStatus;
  readonly summary: string;
  readonly responsibilities: readonly string[];
  readonly stack: readonly string[];
  /** Set when an employer's specifics are under NDA. */
  readonly confidential?: boolean;
}

/* ──────────────────────────────────────────────────────────────────────────
   Skills
   ────────────────────────────────────────────────────────────────────────── */

/**
 * Deliberately no percentage ratings. Self-assigned "95% Python" numbers read
 * as noise to engineers and conflict with the accuracy rules in the source
 * profile; grouped, honest capability lists carry far more signal.
 */
export interface Skill {
  readonly name: string;
  readonly icon?: IconComponent;
}

export interface SkillDomain {
  readonly id: string;
  readonly title: string;
  readonly blurb: string;
  readonly icon: LucideIcon;
  readonly skills: readonly Skill[];
}

/* ──────────────────────────────────────────────────────────────────────────
   Projects
   ────────────────────────────────────────────────────────────────────────── */

export type ProjectCategory = 'AI Engineering' | 'Agentic AI' | 'Full-Stack' | 'Machine Learning';

export interface Project {
  readonly id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly category: ProjectCategory;
  readonly year: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly stack: readonly string[];
  readonly metrics?: readonly Metric[];
  readonly links?: readonly Link[];
  /** Drives bento sizing: `feature` spans two columns on desktop. */
  readonly emphasis: 'feature' | 'standard';
  /** Gradient pair (from, to) used for the generative card artwork. */
  readonly palette: readonly [string, string];
  readonly icon: LucideIcon;
}

/* ──────────────────────────────────────────────────────────────────────────
   Credentials
   ────────────────────────────────────────────────────────────────────────── */

export type CredentialKind = 'certificate' | 'badge' | 'internship';

export interface Credential {
  readonly id: string;
  readonly title: string;
  readonly issuer: string;
  readonly issued: string;
  readonly kind: CredentialKind;
  /** Local file served from /public, or a remote verification page. */
  readonly assetUrl?: string;
  readonly verifyUrl?: string;
  readonly credentialId?: string;
  readonly detail?: string;
  readonly icon: IconComponent;
}

/* ──────────────────────────────────────────────────────────────────────────
   Services & education
   ────────────────────────────────────────────────────────────────────────── */

export interface Service {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly deliverables: readonly string[];
  readonly icon: LucideIcon;
}

export interface Education {
  readonly degree: string;
  readonly specialisation: string;
  readonly institution: string;
  readonly university: string;
  readonly period: string;
  readonly location: string;
}

/* ──────────────────────────────────────────────────────────────────────────
   Navigation
   ────────────────────────────────────────────────────────────────────────── */

export interface NavSection {
  readonly id: string;
  readonly label: string;
  readonly icon: LucideIcon;
  /** Short mono label used in the side rail + command palette. */
  readonly index: string;
}
