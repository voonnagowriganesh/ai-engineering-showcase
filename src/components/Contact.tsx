import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2, Download, Loader2, Mail, Phone, Send, TriangleAlert } from 'lucide-react';
import { FaGithub, FaLinkedinIn, FaMedium } from 'react-icons/fa6';
import { identity, services } from '../data/content';
import { track } from '../lib/analytics';
import { Reveal } from './Reveal';
import { BackgroundArt } from './BackgroundArt';

const socialLinks = [
  { network: 'github', label: 'GitHub', href: identity.github, icon: FaGithub },
  { network: 'linkedin', label: 'LinkedIn', href: identity.linkedin, icon: FaLinkedinIn },
  { network: 'medium', label: 'Medium', href: identity.medium, icon: FaMedium },
];

/* ── Form logic ──────────────────────────────────────────────────────────── */

type Field = 'name' | 'email' | 'message';
type Values = Record<Field, string> & { botcheck: string };
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent'; via: 'web3forms' | 'mailto' }
  | { kind: 'error'; message: string };

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const REQUEST_TIMEOUT_MS = 15_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ACCESS_KEY = (import.meta.env.VITE_WEB3FORMS_KEY ?? '').trim();
const formConnected = ACCESS_KEY.length > 0 && !ACCESS_KEY.startsWith('your-access-key');

function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (!name) errors.name = 'Please tell me your name.';
  else if (name.length < 2) errors.name = 'That looks a little short.';

  const email = values.email.trim();
  if (!email) errors.email = 'An email address is required.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'That email address looks incomplete.';

  const message = values.message.trim();
  if (!message) errors.message = 'Tell me a little about what you have in mind.';
  else if (message.length < 15) errors.message = 'A few more words would help (15 characters minimum).';
  else if (message.length > 4000) errors.message = 'Please keep it under 4000 characters.';
  return errors;
}

async function sendViaWeb3Forms(values: Values): Promise<{ ok: true } | { ok: false; error: string }> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        access_key: ACCESS_KEY,
        name: values.name.trim(),
        email: values.email.trim(),
        subject: `Portfolio enquiry from ${values.name.trim()}`,
        message: values.message.trim(),
        from_name: 'Portfolio — voonnagowriganesh',
        replyto: values.email.trim(),
      }),
    });
    const payload = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string };
    if (response.ok && payload.success !== false) return { ok: true };
    return { ok: false, error: payload.message ?? `Delivery failed (${response.status}). Please email me directly.` };
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { ok: false, error: 'That took too long. Check your connection and try again.' };
    }
    return { ok: false, error: 'Could not reach the mail service. Please email me directly instead.' };
  } finally {
    window.clearTimeout(timeout);
  }
}

/** No key configured: open the visitor's own mail app with the message ready, so the form is never a dead end. */
function openMailto(values: Values) {
  const body = `${values.message.trim()}\n\n— ${values.name.trim()} (${values.email.trim()})`;
  window.location.href =
    `mailto:${identity.email}` +
    `?subject=${encodeURIComponent(`Portfolio enquiry from ${values.name.trim()}`)}` +
    `&body=${encodeURIComponent(body)}`;
}

function ContactForm() {
  const [values, setValues] = useState<Values>({ name: '', email: '', message: '', botcheck: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const update = (field: keyof Values, value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    if (field !== 'botcheck' && errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
    if (status.kind === 'error' || status.kind === 'sent') setStatus({ kind: 'idle' });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === 'sending') return;

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = (['name', 'email', 'message'] as const).find((f) => found[f]);
      if (first) document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    // Honeypot hit: report success so bots get no signal.
    if (values.botcheck) {
      setStatus({ kind: 'sent', via: 'web3forms' });
      return;
    }

    if (!formConnected) {
      openMailto(values);
      track('contact-submit', { ok: true });
      setStatus({ kind: 'sent', via: 'mailto' });
      return;
    }

    setStatus({ kind: 'sending' });
    const result = await sendViaWeb3Forms(values);
    track('contact-submit', { ok: result.ok });
    if (result.ok) {
      setStatus({ kind: 'sent', via: 'web3forms' });
      setValues({ name: '', email: '', message: '', botcheck: '' });
    } else {
      setStatus({ kind: 'error', message: result.error });
    }
  };

  const inputClass = (field: Field) =>
    `mt-2 w-full rounded-2xl border bg-paper/[0.06] px-4 py-3 text-sm text-paper placeholder:text-paper/35 outline-none transition focus:bg-paper/10 focus:ring-2 ${
      errors[field] ? 'border-amber/70 focus:ring-amber/40' : 'border-paper/15 focus:border-paper/40 focus:ring-paper/15'
    }`;

  const sending = status.kind === 'sending';

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label="Contact form"
      className="relative rounded-[2rem] border border-paper/10 bg-paper/[0.04] p-6 text-left backdrop-blur-sm sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-medium text-paper/80" htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'contact-name-error' : undefined}
            placeholder="Your name"
            className={inputClass('name')}
          />
          {errors.name ? (
            <span id="contact-name-error" className="mt-1.5 block text-xs text-amber-light">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="block text-sm font-medium text-paper/80" htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'contact-email-error' : undefined}
            placeholder="you@company.com"
            className={inputClass('email')}
          />
          {errors.email ? (
            <span id="contact-email-error" className="mt-1.5 block text-xs text-amber-light">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label className="mt-5 block text-sm font-medium text-paper/80" htmlFor="contact-message">
        Message
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? 'contact-message-error' : undefined}
          placeholder="A role, a project, or a problem worth solving…"
          className={`${inputClass('message')} resize-y`}
        />
        {errors.message ? (
          <span id="contact-message-error" className="mt-1.5 block text-xs text-amber-light">
            {errors.message}
          </span>
        ) : null}
      </label>

      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-botcheck">Leave this field empty</label>
        <input
          id="contact-botcheck"
          name="botcheck"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.botcheck}
          onChange={(e) => update('botcheck', e.target.value)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          {sending ? 'Sending…' : formConnected ? 'Send message' : 'Send via email app'}
        </button>
        {!formConnected ? (
          <span className="text-xs text-paper/50">Opens your email app with the message ready to send.</span>
        ) : null}
      </div>

      <div role="status" aria-live="polite" className="min-h-0">
        {status.kind === 'sent' ? (
          <p className="mt-5 flex items-start gap-2 rounded-2xl border border-sage-light/30 bg-sage/15 px-4 py-3 text-sm text-paper">
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-sage-light" />
            {status.via === 'mailto'
              ? 'Your email app should now be open with the message ready. Just hit send.'
              : 'Thanks, your message is on its way. I usually reply within a day or two.'}
          </p>
        ) : null}
        {status.kind === 'error' ? (
          <p className="mt-5 flex items-start gap-2 rounded-2xl border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-paper">
            <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber-light" />
            {status.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-28 text-paper">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-signal/30 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-amber/20 blur-[120px]" />
      </div>
      <BackgroundArt variant="dot-grid" />

      <div className="relative mx-auto max-w-6xl px-5">
        <Reveal className="mx-auto max-w-3xl text-center">
          <span className="label-mono text-xs text-amber">08 / Contact</span>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-paper sm:text-5xl lg:text-6xl">
            Let&rsquo;s build something intelligent together.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paper/70 sm:text-lg">
            Open to AI product, backend and full-stack engineering conversations, based in {identity.location}.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="min-w-0">
            <Reveal>
              <span className="label-mono text-xs text-paper/50">What I can help with</span>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {services.map((service) => (
                  <div key={service.id} className="rounded-2xl border border-paper/10 bg-paper/[0.04] p-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-paper/10 text-amber-light">
                        <service.icon size={15} />
                      </span>
                      <h3 className="font-display text-base font-semibold text-paper">{service.title}</h3>
                    </div>
                    <p className="mt-2.5 text-xs leading-relaxed text-paper/60">{service.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-3">
              <a
                href={`mailto:${identity.email}`}
                onClick={() => track('email-click', { from: 'contact' })}
                className="group inline-flex max-w-full items-center gap-2 rounded-full bg-paper px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
              >
                <Mail size={15} className="shrink-0" />
                <span className="truncate">{identity.email}</span>
                <ArrowUpRight size={15} className="shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href={identity.resumeUrl}
                download={identity.resumeFileName}
                onClick={() => track('resume-download', { from: 'contact' })}
                className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-3 text-sm font-semibold text-paper transition hover:border-paper/50 hover:bg-paper/10"
              >
                <Download size={15} /> Download resume
              </a>
              <a
                href={`tel:${identity.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-5 py-3 text-sm font-semibold text-paper transition hover:border-paper/50 hover:bg-paper/10"
              >
                <Phone size={15} /> {identity.phone}
              </a>
            </Reveal>

            <Reveal delay={0.15} className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.network}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('social-click', { network: link.network })}
                  className="flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-5 py-2.5 text-sm font-medium text-paper/85 transition hover:border-paper/40 hover:bg-paper/10 hover:text-paper"
                >
                  <link.icon size={15} />
                  {link.label}
                </a>
              ))}
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
