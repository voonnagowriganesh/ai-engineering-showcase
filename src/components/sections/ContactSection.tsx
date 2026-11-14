import { useId, useState } from 'react';
import {
  ArrowRight,
  Check,
  Mail,
  Tag,
  User,
  MessageSquare,
} from 'lucide-react';
import { identity, socials } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import { ContactValidator, type ValidationErrors } from '@/services/ContactService';
import { contactGateway } from '@/services/container';

export function ContactSection(): React.JSX.Element {
  const formId = useId();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    botcheck: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText(identity.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validation = ContactValidator.validate(formData);
    setErrors(validation);
    if (!ContactValidator.isValid(validation)) return;

    setSubmitting(true);
    try {
      const result = await contactGateway.send(formData);
      if (result.ok) {
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '', botcheck: '' });
        setErrors({});
        setTimeout(() => setSent(false), 5000);
      } else {
        setServerError(result.error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-[#061910] via-[#082216] to-[#04120a] py-24 text-white"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/4 -translate-y-1/2 size-[36rem] rounded-full bg-emerald-500/10 blur-[130px]"
      />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/25 bg-[#071d12]/90 p-8 shadow-2xl backdrop-blur-md sm:p-12 lg:p-14">
          {/* Subtle background graphics */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.15),transparent_60%)]" />

          <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* ══════════════════════════════════════════════════════════════════
                LEFT SIDE: GRAPHIC + INFO (5 cols)
                ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:col-span-5">
              {/* Pill badge */}
              <Reveal direction="down" distance={10}>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/70 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <span>CONTACT</span>
                </div>
              </Reveal>

              {/* Title */}
              <Reveal direction="up" delay={0.1}>
                <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Let's Build Something Intelligent Together.
                </h2>
              </Reveal>

              {/* Subtitle */}
              <Reveal direction="up" delay={0.15}>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  I'm open to opportunities, collaborations and interesting AI product ideas. Feel
                  free to reach out!
                </p>
              </Reveal>

              {/* Contact Links */}
              <Reveal direction="up" delay={0.2}>
                <div className="mt-7 space-y-3.5">
                  <div
                    onClick={copyEmail}
                    className="group flex cursor-pointer items-center gap-3 text-xs text-slate-300 transition-colors hover:text-emerald-300"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 transition-all group-hover:bg-emerald-500 group-hover:text-slate-950">
                      {copied ? <Check size={16} /> : <Mail size={16} />}
                    </div>
                    <span className="font-medium">{identity.email}</span>
                  </div>

                  {/* Pulled from the shared `socials` list rather than
                      hardcoded here, so a changed handle only needs updating
                      in one place instead of drifting out of sync. */}
                  {socials
                    .filter((social) => social.id !== 'email')
                    .map((social) => (
                      <a
                        key={social.id}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 text-xs text-slate-300 transition-colors hover:text-emerald-300"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/60 text-emerald-400 transition-all group-hover:bg-emerald-500 group-hover:text-slate-950">
                          <Icon icon={social.icon} size={15} />
                        </div>
                        <span className="font-medium">{social.handle}</span>
                      </a>
                    ))}
                </div>
              </Reveal>

              {/* Sunrise Hiker Mountain Illustration on left */}
              <Reveal direction="up" delay={0.3}>
                <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-500/20 max-w-xs">
                  <img
                    src="/images/contact_hiker.png"
                    alt="Sunrise exploration"
                    className="h-28 w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                RIGHT SIDE: FORM (7 cols)
                ══════════════════════════════════════════════════════════════════ */}
            <div className="relative lg:col-span-7">
              <Reveal direction="left" delay={0.15}>
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4 rounded-3xl border border-emerald-500/25 bg-[#05160d]/80 p-6 shadow-xl backdrop-blur-md sm:p-8"
                >
                  {/* Honeypot — invisible to people, irresistible to bots.
                      Dropped from the earlier rewrite along with the rest of
                      the validation below; both are back. */}
                  <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor={`${formId}-botcheck`}>Leave this field empty</label>
                    <input
                      id={`${formId}-botcheck`}
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.botcheck}
                      onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
                    />
                  </div>

                  {/* Name Input */}
                  <div>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-400/80"
                      />
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        aria-invalid={errors.name ? true : undefined}
                        className="w-full rounded-2xl border border-emerald-500/30 bg-[#071f13] py-3.5 pr-4 pl-11 text-xs text-white placeholder-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    {errors.name ? <p className="mt-1.5 pl-1 text-[0.6875rem] text-rose-400">{errors.name}</p> : null}
                  </div>

                  {/* Email Input */}
                  <div>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-400/80"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        aria-invalid={errors.email ? true : undefined}
                        className="w-full rounded-2xl border border-emerald-500/30 bg-[#071f13] py-3.5 pr-4 pl-11 text-xs text-white placeholder-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    {errors.email ? <p className="mt-1.5 pl-1 text-[0.6875rem] text-rose-400">{errors.email}</p> : null}
                  </div>

                  {/* Subject Input */}
                  <div>
                    <div className="relative">
                      <Tag
                        size={16}
                        className="absolute top-1/2 left-4 -translate-y-1/2 text-emerald-400/80"
                      />
                      <input
                        type="text"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        aria-invalid={errors.subject ? true : undefined}
                        className="w-full rounded-2xl border border-emerald-500/30 bg-[#071f13] py-3.5 pr-4 pl-11 text-xs text-white placeholder-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    {errors.subject ? <p className="mt-1.5 pl-1 text-[0.6875rem] text-rose-400">{errors.subject}</p> : null}
                  </div>

                  {/* Message Input */}
                  <div>
                    <div className="relative">
                      <MessageSquare
                        size={16}
                        className="absolute top-4 left-4 text-emerald-400/80"
                      />
                      <textarea
                        rows={4}
                        placeholder="Your Message..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        aria-invalid={errors.message ? true : undefined}
                        className="w-full resize-none rounded-2xl border border-emerald-500/30 bg-[#071f13] py-3.5 pr-4 pl-11 text-xs text-white placeholder-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                      />
                    </div>
                    {errors.message ? <p className="mt-1.5 pl-1 text-[0.6875rem] text-rose-400">{errors.message}</p> : null}
                  </div>

                  {serverError ? (
                    <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[0.6875rem] text-amber-300">
                      {serverError}
                    </p>
                  ) : null}

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-400 px-8 py-3 text-xs font-bold text-[#021c0e] shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(52,211,153,0.5)] disabled:opacity-50"
                    >
                      <span>{submitting ? 'Sending...' : sent ? 'Sent Successfully!' : 'Send Message'}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </button>

                    {/* Ambient seedling graphic on bottom right */}
                    <div className="hidden sm:block">
                      <img
                        src="/images/contact_plant.png"
                        alt="Growth seedling"
                        className="h-16 w-auto object-contain opacity-80"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </form>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
