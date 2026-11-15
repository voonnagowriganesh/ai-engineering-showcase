import { useId, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Loader2,
  Phone,
  Send,
  TriangleAlert,
} from 'lucide-react';
import { identity, navSections, services, socials } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import { ContactValidator, type ContactField, type ValidationErrors } from '@/services/ContactService';
import { contactGateway, hasHostedContactDelivery } from '@/services/container';
import { track } from '@/lib/analytics';

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; via: 'hosted' | 'mailto' }
  | { kind: 'error'; message: string };

const EMPTY = { name: '', email: '', subject: '', message: '', botcheck: '' };
const FIELD_ORDER: readonly ContactField[] = ['name', 'email', 'subject', 'message'];
const SECTION_INDEX = navSections.find((s) => s.id === 'contact')?.index ?? '';

/* ── Form ─────────────────────────────────────────────────────────────────── */

function ContactForm(): React.JSX.Element {
  const formId = useId();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const fieldId = (field: string): string => `${formId}-${field}`;

  const update = (field: keyof typeof EMPTY, value: string): void => {
    setValues((v) => ({ ...v, [field]: value }));
    if (field !== 'botcheck' && errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (status.kind === 'error' || status.kind === 'sent') setStatus({ kind: 'idle' });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (status.kind === 'sending') return;

    const found = ContactValidator.validate(values);
    setErrors(found);
    if (!ContactValidator.isValid(found)) {
      const first = FIELD_ORDER.find((f) => found[f]);
      if (first) document.getElementById(fieldId(first))?.focus();
      return;
    }

    // Honeypot hit: report success so bots get no signal.
    if (values.botcheck) {
      setStatus({ kind: 'sent', via: 'hosted' });
      return;
    }

    setStatus({ kind: 'sending' });
    const result = await contactGateway.send(values);
    track('contact-submit', { ok: result.ok });
    if (result.ok) {
      setStatus({ kind: 'sent', via: hasHostedContactDelivery ? 'hosted' : 'mailto' });
      if (hasHostedContactDelivery) setValues(EMPTY);
    } else {
      setStatus({ kind: 'error', message: result.error });
    }
  };

  const inputClass = (field: ContactField): string =>
    `mt-2 w-full rounded-2xl border bg-white/[0.05] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:bg-white/[0.08] focus-visible:ring-2 ${
      errors[field]
        ? 'border-rose-400/70 focus-visible:ring-rose-400/40'
        : 'border-[#2A305A] focus:border-[#7C5DFA]/70 focus-visible:ring-[#7C5DFA]/35'
    }`;

  const errorText = (field: ContactField): React.JSX.Element | null =>
    errors[field] ? (
      <span id={`${fieldId(field)}-error`} className="mt-1.5 block text-xs font-normal text-rose-300">
        {errors[field]}
      </span>
    ) : null;

  const sending = status.kind === 'sending';

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(event)}
      aria-label="Contact form"
      className="relative overflow-hidden rounded-[2rem] border border-[#2A305A] bg-[#151934]/80 p-6 text-left shadow-[0_30px_80px_-30px_rgba(124,93,250,0.45)] backdrop-blur-md sm:p-8"
    >
      {/* Soft violet sheen in the card's corner, matching the section glow. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-[#7C5DFA]/20 blur-3xl"
      />

      <div className="relative grid gap-5 sm:grid-cols-2">
        <label className="block min-w-0 text-sm font-medium text-slate-200" htmlFor={fieldId('name')}>
          Name
          <input
            id={fieldId('name')}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? `${fieldId('name')}-error` : undefined}
            placeholder="Your name"
            className={inputClass('name')}
          />
          {errorText('name')}
        </label>

        <label className="block min-w-0 text-sm font-medium text-slate-200" htmlFor={fieldId('email')}>
          Email
          <input
            id={fieldId('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? `${fieldId('email')}-error` : undefined}
            placeholder="you@company.com"
            className={inputClass('email')}
          />
          {errorText('email')}
        </label>
      </div>

      <label className="relative mt-5 block text-sm font-medium text-slate-200" htmlFor={fieldId('subject')}>
        Subject
        <input
          id={fieldId('subject')}
          name="subject"
          type="text"
          autoComplete="off"
          value={values.subject}
          onChange={(e) => update('subject', e.target.value)}
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? `${fieldId('subject')}-error` : undefined}
          placeholder="A role, a project, a collaboration…"
          className={inputClass('subject')}
        />
        {errorText('subject')}
      </label>

      <label className="relative mt-5 block text-sm font-medium text-slate-200" htmlFor={fieldId('message')}>
        Message
        <textarea
          id={fieldId('message')}
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${fieldId('message')}-error` : undefined}
          placeholder="Tell me about the problem worth solving…"
          className={`${inputClass('message')} resize-y`}
        />
        {errorText('message')}
      </label>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={fieldId('botcheck')}>Leave this field empty</label>
        <input
          id={fieldId('botcheck')}
          name="botcheck"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.botcheck}
          onChange={(e) => update('botcheck', e.target.value)}
        />
      </div>

      <div className="relative mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button
          type="submit"
          disabled={sending}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7C5DFA] to-[#9277FF] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(124,93,250,0.7)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_36px_-8px_rgba(124,93,250,0.85)] focus-visible:ring-2 focus-visible:ring-[#9277FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#151934] focus-visible:outline-none disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {sending ? 'Sending…' : hasHostedContactDelivery ? 'Send message' : 'Send via email app'}
        </button>
        {!hasHostedContactDelivery ? (
          <span className="text-xs text-slate-400">Opens your email app with the message ready to send.</span>
        ) : null}
      </div>

      <div role="status" aria-live="polite" className="relative">
        {status.kind === 'sent' ? (
          <p className="mt-5 flex items-start gap-2 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-slate-100">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-300" />
            {status.via === 'mailto'
              ? 'Your email app should now be open with the message ready. Just hit send.'
              : 'Thanks, your message is on its way. I usually reply within a day or two.'}
          </p>
        ) : null}
        {status.kind === 'error' ? (
          <p className="mt-5 flex items-start gap-2 rounded-2xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-slate-100">
            <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-300" />
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */

export function ContactSection(): React.JSX.Element {
  const [copied, setCopied] = useState(false);

  // Only confirm when the copy actually worked; clipboard access can be denied
  // (permissions, non-secure context), in which case open the mail client.
  const copyEmail = async (): Promise<void> => {
    track('email-click', { action: 'copy' });
    try {
      await navigator.clipboard.writeText(identity.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${identity.email}`;
    }
  };

  const chip =
    'inline-flex items-center gap-2 rounded-full border border-[#2A305A] bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:-translate-y-0.5 hover:border-[#7C5DFA]/70 hover:bg-[#7C5DFA]/10 hover:text-white focus-visible:ring-2 focus-visible:ring-[#9277FF] focus-visible:outline-none';

  return (
    // A deep band in both themes, like the closing page of a deck. The site's
    // light canvas eases into it through the soft top gradient below.
    <section id="contact" className="relative overflow-hidden bg-[#0B0E1E] py-24 text-white sm:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7C5DFA]/60 to-transparent" />
        <div className="absolute top-0 left-1/4 size-80 rounded-full bg-[#7C5DFA]/30 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 size-80 rounded-full bg-[#9277FF]/20 blur-[120px]" />
        {/* Dot grid, faded towards the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(146,119,255,0.18)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-xs font-semibold tracking-[0.3em] text-[#9277FF] uppercase">
            {SECTION_INDEX ? `${SECTION_INDEX} / ` : ''}Contact
          </span>
          <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
            Let&rsquo;s build something{' '}
            <span className="bg-gradient-to-r from-[#9277FF] via-[#B9A8FF] to-[#7C5DFA] bg-clip-text text-transparent">
              intelligent
            </span>{' '}
            together.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Open to AI product, backend and full-stack engineering conversations, based in {identity.location}.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div className="min-w-0">
            <Reveal>
              <span className="font-mono text-xs font-semibold tracking-[0.25em] text-slate-400 uppercase">
                What I can help with
              </span>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="group min-w-0 rounded-2xl border border-[#2A305A] bg-[#151934]/70 p-4 transition hover:-translate-y-0.5 hover:border-[#7C5DFA]/60 hover:bg-[#151934]"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#7C5DFA]/15 text-[#B9A8FF] transition group-hover:bg-[#7C5DFA] group-hover:text-white">
                        <Icon icon={service.icon} size={15} />
                      </span>
                      <h3 className="min-w-0 font-display text-base font-bold text-white">{service.title}</h3>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-400">{service.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void copyEmail()}
                aria-label={copied ? 'Email address copied' : `Copy email address ${identity.email}`}
                className="group inline-flex max-w-full items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1B1F3B] transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#9277FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E1E] focus-visible:outline-none"
              >
                {copied ? (
                  <Check size={15} className="shrink-0 text-emerald-600" />
                ) : (
                  <Copy size={15} className="shrink-0 text-[#7C5DFA]" />
                )}
                <span className="truncate">{copied ? 'Copied to clipboard' : identity.email}</span>
              </button>
              <a
                href={identity.resumeUrl}
                download={identity.resumeFileName}
                onClick={() => track('resume-download', { from: 'contact' })}
                className={chip}
              >
                <Download size={15} /> Download resume
              </a>
              <a href={`tel:${identity.phone.replace(/\s+/g, '')}`} className={chip}>
                <Phone size={15} /> {identity.phone}
              </a>
            </Reveal>

            <Reveal delay={0.15} className="mt-5 flex flex-wrap gap-3">
              {socials
                .filter((social) => social.id !== 'email')
                .map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track('social-click', { network: social.id, from: 'contact' })}
                    className={chip}
                  >
                    <Icon icon={social.icon} size={15} />
                    {social.label}
                    <ArrowUpRight size={13} className="text-slate-500" />
                  </a>
                ))}
            </Reveal>
          </div>

          <Reveal delay={0.1} className="min-w-0">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
