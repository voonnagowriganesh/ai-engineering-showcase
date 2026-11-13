import { useCallback, useId, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Check,
  Copy,
  Mail,
  MapPin,
  Phone,
  Send,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';
import { identity, socials } from '@/data/profile';
import { useClipboard } from '@/hooks/useInteractions';
import {
  ContactValidator,
  type ContactMessage,
  type ValidationErrors,
} from '@/services/ContactService';
import { contactGateway, hasHostedContactDelivery } from '@/services/container';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { Eyebrow, Icon } from '@/components/ui/primitives';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY_MESSAGE: ContactMessage = { name: '', email: '', subject: '', message: '' };

export function Contact(): React.JSX.Element {
  return (
    <Section id="contact" tone="magenta">
      <SectionHeader
        index="07"
        eyebrow="Contact"
        title="Let's build"
        titleAccent="something intelligent."
        description={identity.availability}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-14">
        <Reveal direction="right">
          <ContactForm />
        </Reveal>

        <Reveal direction="left" delay={0.08}>
          <ContactDetails />
        </Reveal>
      </div>
    </Section>
  );
}

/* ── Form ────────────────────────────────────────────────────────────────── */

function ContactForm(): React.JSX.Element {
  const formId = useId();
  const [values, setValues] = useState<ContactMessage>(EMPTY_MESSAGE);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  // Validation messages appear only after a first submit attempt, so the form
  // does not scold the visitor while they are still filling it in.
  const [submitted, setSubmitted] = useState(false);

  const handleChange = useCallback(
    (field: keyof ContactMessage) =>
      (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const next = event.target.value;
        setValues((current) => {
          const updated = { ...current, [field]: next };
          if (submitted) setErrors(ContactValidator.validate(updated));
          return updated;
        });
      },
    [submitted],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();
      setSubmitted(true);
      setServerError(null);

      const validation = ContactValidator.validate(values);
      setErrors(validation);
      if (!ContactValidator.isValid(validation)) {
        setStatus('error');
        return;
      }

      setStatus('submitting');
      const result = await contactGateway.send(values);

      if (result.ok) {
        setStatus('success');
        setValues(EMPTY_MESSAGE);
        setSubmitted(false);
        setErrors({});
        return;
      }

      setStatus('error');
      setServerError(result.error);
    },
    [values],
  );

  if (status === 'success') {
    return <SuccessPanel onReset={() => setStatus('idle')} />;
  }

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
      className="rounded-card border border-line bg-surface p-6 sm:p-8"
    >
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-botcheck`}>Leave this field empty</label>
        <input
          id={`${formId}-botcheck`}
          name="botcheck"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={(event) =>
            setValues((current) => ({ ...current, botcheck: event.target.value }))
          }
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-name`}
          label="Name"
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="name"
          placeholder="Your name"
        />
        <Field
          id={`${formId}-email`}
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
          placeholder="you@company.com"
        />
      </div>

      <div className="mt-5">
        <Field
          id={`${formId}-subject`}
          label="Subject"
          value={values.subject}
          onChange={handleChange('subject')}
          error={errors.subject}
          placeholder="What is this about?"
        />
      </div>

      <div className="mt-5">
        <Field
          id={`${formId}-message`}
          label="Message"
          multiline
          value={values.message}
          onChange={handleChange('message')}
          error={errors.message}
          placeholder="A few lines about the project, timeline and what you need from me."
        />
      </div>

      {/* Server-side failure */}
      <AnimatePresence>
        {serverError ? (
          <motion.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-5 flex items-start gap-2.5 overflow-hidden rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-[0.8125rem] text-amber-600 dark:text-amber-400"
          >
            <TriangleAlert size={15} className="mt-0.5 shrink-0" />
            {serverError}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={status === 'submitting'}
          iconRight={status === 'submitting' ? undefined : <Send size={16} />}
        >
          {status === 'submitting' ? 'Sending…' : 'Send message'}
        </Button>

        <p className="text-[0.75rem] leading-relaxed text-ink-subtle">
          {hasHostedContactDelivery
            ? 'Goes straight to my inbox. I usually reply within a day.'
            : 'Opens in your mail client — or email me directly below.'}
        </p>
      </div>
    </form>
  );
}

/* ── Field ───────────────────────────────────────────────────────────────── */

interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  readonly error?: string | undefined;
  readonly type?: string;
  readonly placeholder?: string;
  readonly autoComplete?: string;
  readonly multiline?: boolean;
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
  multiline = false,
}: FieldProps): React.JSX.Element {
  const errorId = `${id}-error`;

  const sharedClassName = cn(
    'w-full rounded-xl border bg-canvas px-4 py-3 text-[0.9375rem] text-ink',
    'transition-[border-color,box-shadow] duration-300 outline-none',
    'placeholder:text-ink-subtle/70',
    error
      ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgb(239_68_68/0.12)]'
      : 'border-line focus:border-accent-2 focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-accent-2)_14%,transparent)]',
  );

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.8125rem] font-medium text-ink-muted">
        {label}
      </label>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={5}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(sharedClassName, 'resize-y')}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={sharedClassName}
        />
      )}

      <AnimatePresence>
        {error ? (
          <motion.p
            id={errorId}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-1.5 text-[0.75rem] text-red-500"
          >
            {error}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* ── Success ─────────────────────────────────────────────────────────────── */

function SuccessPanel({ onReset }: { readonly onReset: () => void }): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="ring-gradient flex h-full flex-col items-center justify-center rounded-card border border-line bg-surface p-10 text-center"
      data-active="true"
    >
      <span className="relative grid size-16 place-items-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
        <Check size={28} />
        <span className="animate-pulse-ring absolute inset-0 rounded-2xl border border-emerald-500/40" />
      </span>

      <h3 className="mt-6 text-2xl font-semibold text-ink">Message sent</h3>
      <p className="mt-2.5 max-w-sm text-[0.9375rem] leading-relaxed text-ink-muted">
        Thanks for reaching out — I&apos;ll get back to you shortly.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="mt-7 rounded-full border border-line px-5 py-2.5 text-[0.8125rem] font-medium text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
      >
        Send another
      </button>
    </motion.div>
  );
}

/* ── Details ─────────────────────────────────────────────────────────────── */

function ContactDetails(): React.JSX.Element {
  const { copied, copy } = useClipboard();

  const rows = [
    { key: 'email', icon: Mail, label: 'Email', value: identity.email, href: `mailto:${identity.email}` },
    {
      key: 'phone',
      icon: Phone,
      label: 'Phone',
      value: identity.phone,
      href: `tel:${identity.phone.replace(/\s/g, '')}`,
    },
    { key: 'location', icon: MapPin, label: 'Location', value: identity.location },
  ] as const;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-card border border-line bg-surface p-6">
        <Eyebrow>Direct</Eyebrow>

        <ul className="mt-5 flex flex-col gap-1">
          {rows.map((row) => (
            <li key={row.key}>
              <div className="group flex items-center gap-3.5 rounded-xl px-2 py-3 transition-colors duration-300 hover:bg-surface-2">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-canvas text-accent-2">
                  <Icon icon={row.icon} size={17} />
                </span>

                <div className="min-w-0 flex-1">
                  <span className="block font-mono text-2xs tracking-wider text-ink-subtle uppercase">
                    {row.label}
                  </span>
                  {'href' in row && row.href ? (
                    <a
                      href={row.href}
                      className="block truncate text-[0.875rem] font-medium text-ink transition-colors hover:text-accent-2"
                    >
                      {row.value}
                    </a>
                  ) : (
                    <span className="block truncate text-[0.875rem] font-medium text-ink">
                      {row.value}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => void copy(row.value, row.key)}
                  aria-label={`Copy ${row.label}`}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-ink-subtle opacity-0 transition-[opacity,color] duration-300 group-hover:opacity-100 hover:text-ink focus-visible:opacity-100"
                >
                  {copied === row.key ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Socials */}
      <div className="rounded-card border border-line bg-surface p-6">
        <Eyebrow>Elsewhere</Eyebrow>
        <ul className="mt-5 flex flex-col gap-2">
          {socials.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3.5 rounded-xl border border-line px-4 py-3 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-2/40"
              >
                <Icon
                  icon={social.icon}
                  size={18}
                  className="shrink-0 text-ink-muted transition-colors duration-300 group-hover:text-accent-2"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.875rem] font-medium text-ink">{social.label}</span>
                  <span className="block truncate font-mono text-2xs text-ink-subtle">
                    {social.handle}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Availability callout */}
      <div className="ring-gradient rounded-card border border-line bg-surface p-6" data-active="true">
        <div className="flex items-start gap-3">
          <Sparkles size={17} className="mt-0.5 shrink-0 text-accent-2" />
          <p className="text-[0.875rem] leading-relaxed text-ink-muted">
            Currently an <span className="font-medium text-ink">{identity.role}</span> at Techgene
            Solutions, and open to freelance product builds alongside it.
          </p>
        </div>
      </div>
    </div>
  );
}
