import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BadgeCheck, FileText } from 'lucide-react';
import { credentials } from '@/data/profile';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import type { Credential, CredentialKind } from '@/domain/models';
import { cn } from '@/lib/utils';

type Filter = 'all' | CredentialKind;

const FILTER_LABELS: Readonly<Record<Filter, string>> = {
  all: 'All',
  badge: 'Badges',
  certificate: 'Certificates',
  internship: 'Internships',
};

const KIND_LABELS: Readonly<Record<CredentialKind, string>> = {
  badge: 'Badge',
  certificate: 'Certificate',
  internship: 'Internship',
};

export function Credentials(): React.JSX.Element {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: credentials.length,
      badge: 0,
      certificate: 0,
      internship: 0,
    };
    for (const credential of credentials) result[credential.kind] += 1;
    return result;
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? credentials : credentials.filter((c) => c.kind === filter)),
    [filter],
  );

  return (
    <Section id="credentials" tone="emerald">
      <SectionHeader
        index="05"
        eyebrow="Credentials"
        title="Eleven verified credentials,"
        titleAccent="each one openable."
        description="Every item below links to the actual certificate file or its public verification page — nothing here is a claim you have to take on trust."
      />

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <Reveal direction="up" className="mb-10">
        <div role="group" aria-label="Filter credentials" className="flex flex-wrap gap-2">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((option) => {
            const isActive = filter === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={isActive}
                className={cn(
                  'relative rounded-full border px-4 py-2 text-[0.8125rem] font-medium transition-colors duration-300',
                  isActive
                    ? 'border-transparent text-white'
                    : 'border-line text-ink-muted hover:border-line-strong hover:text-ink',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="credential-filter-pill"
                    className="absolute inset-0 rounded-full bg-[linear-gradient(110deg,var(--color-accent-2),var(--color-accent-3))]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">
                  {FILTER_LABELS[option]}
                  <span className="ml-1.5 font-mono text-2xs opacity-60">{counts[option]}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Reveal>

      <motion.ul layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((credential, index) => (
          <CredentialCard key={credential.id} credential={credential} index={index} />
        ))}
      </motion.ul>
    </Section>
  );
}

function CredentialCard({
  credential,
  index,
}: {
  readonly credential: Credential;
  readonly index: number;
}): React.JSX.Element {
  // Prefer a public verification page; fall back to the stored file.
  const href = credential.verifyUrl ?? credential.assetUrl;
  const isVerifiable = credential.verifyUrl !== undefined;

  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line bg-canvas text-accent-2 transition-transform duration-500 group-hover:scale-105">
          <Icon icon={credential.icon} size={21} />
        </span>

        <span
          className={cn(
            'flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] tracking-wide uppercase',
            isVerifiable
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
              : 'border-line bg-canvas text-ink-subtle',
          )}
        >
          {isVerifiable ? <BadgeCheck size={11} /> : <FileText size={11} />}
          {KIND_LABELS[credential.kind]}
        </span>
      </div>

      <h3 className="mt-5 text-[1.0625rem] leading-snug font-semibold text-balance text-ink">
        {credential.title}
      </h3>

      <p className="mt-2 text-[0.8125rem] font-medium text-gradient-static">{credential.issuer}</p>

      {credential.detail ? (
        <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-ink-muted">
          {credential.detail}
        </p>
      ) : (
        <div className="flex-1" />
      )}

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-4">
        <div className="min-w-0">
          <span className="block font-mono text-2xs text-ink-subtle">{credential.issued}</span>
          {credential.credentialId ? (
            <span
              className="mt-1 block max-w-[12rem] truncate font-mono text-[0.625rem] text-ink-subtle/70"
              title={credential.credentialId}
            >
              ID {credential.credentialId}
            </span>
          ) : null}
        </div>

        {href ? (
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-2xs tracking-wider text-accent-2 uppercase">
            {isVerifiable ? 'Verify' : 'Open'}
            <ArrowUpRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        ) : null}
      </div>
    </>
  );

  const sharedClassName =
    'ring-gradient edge-gradient group relative flex h-full flex-col rounded-card border border-line bg-surface p-6 ' +
    'transition-[transform,border-color,box-shadow] duration-500 [transition-timing-function:var(--ease-out-expo)] ' +
    'hover:-translate-y-1.5 hover:border-line-strong ' +
    'hover:shadow-[0_26px_70px_-30px_color-mix(in_oklab,var(--color-accent-2)_60%,transparent)]';

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClassName}>
          {body}
        </a>
      ) : (
        <div className={sharedClassName}>{body}</div>
      )}
    </motion.li>
  );
}
