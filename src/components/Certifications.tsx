import { Award, BadgeCheck, ExternalLink, GraduationCap } from 'lucide-react';
import { certifications } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';
import type { CredentialKind } from '../types';

const kindMeta: Record<CredentialKind, { icon: typeof Award; label: string; color: string }> = {
  certificate: { icon: Award, label: 'Certificate', color: '#4338CA' },
  badge: { icon: BadgeCheck, label: 'Verified Badge', color: '#2F7A64' },
  internship: { icon: GraduationCap, label: 'Internship', color: '#E8793C' },
};

export function Certifications() {
  return (
    <section id="certifications" className="relative bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          index="07"
          eyebrow="Certifications"
          title="11 verified credentials."
          description="Certificates, verified badges and internships collected while shipping the work above."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cred, i) => {
            const meta = kindMeta[cred.kind];
            return (
              <Reveal key={cred.id} delay={(i % 3) * 0.06}>
                <div className="group flex h-full flex-col rounded-[1.5rem] border border-ink/10 bg-paper p-5 shadow-card transition hover:-translate-y-1 hover:border-signal/30">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
                    >
                      <meta.icon size={18} />
                    </span>
                    <span className="label-mono text-right text-[10px] text-ink-faint">{cred.issued}</span>
                  </div>

                  <h3 className="mt-4 font-display text-base font-semibold leading-snug text-ink">{cred.title}</h3>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{cred.issuer}</p>
                  <p className="mt-3 flex-1 text-xs leading-relaxed text-ink-faint">{cred.detail}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-ink/5 pt-3">
                    <span
                      className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                      style={{ backgroundColor: `${meta.color}10`, color: meta.color }}
                    >
                      {meta.label}
                    </span>
                    {cred.verifyUrl ? (
                      <a
                        href={cred.verifyUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs font-semibold text-signal hover:underline"
                      >
                        Verify <ExternalLink size={11} />
                      </a>
                    ) : cred.credentialId ? (
                      <span className="text-[10px] text-ink-faint">ID: {cred.credentialId}</span>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
