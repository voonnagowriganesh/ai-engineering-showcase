import { Reveal } from './Reveal';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({ index, eyebrow, title, description, align = 'left' }: SectionHeadingProps) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <div
        className={`mb-5 flex items-center gap-3 text-sm text-signal ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        <span className="label-mono text-xs text-amber">{index}</span>
        <span className="h-px w-8 bg-signal/40" />
        <span className="label-mono text-xs text-ink-faint">{eyebrow}</span>
      </div>
      <h2 className="font-display text-4xl font-medium leading-[1.08] text-ink sm:text-5xl">{title}</h2>
      {description ? <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">{description}</p> : null}
    </Reveal>
  );
}
