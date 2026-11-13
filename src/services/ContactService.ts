/**
 * Contact form transport.
 *
 * The form component depends on the `ContactGateway` interface, never on
 * Web3Forms directly — swapping to Formspree, Resend or a real backend is a
 * one-line change at the composition root and touches no UI code.
 */

export interface ContactMessage {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
  /** Anti-spam honeypot. Must be empty for a legitimate submission. */
  readonly botcheck?: string;
}

export type SubmitResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly error: string };

export interface ContactGateway {
  /** True when the gateway is configured and can actually deliver mail. */
  readonly isConfigured: boolean;
  send(message: ContactMessage): Promise<SubmitResult>;
}

/* ── Validation ───────────────────────────────────────────────────────────── */

export type ContactField = keyof Omit<ContactMessage, 'botcheck'>;
export type ValidationErrors = Partial<Record<ContactField, string>>;

/** RFC-5322-lite: good enough to catch typos without rejecting valid addresses. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export class ContactValidator {
  static validate(message: ContactMessage): ValidationErrors {
    const errors: ValidationErrors = {};

    const name = message.name.trim();
    if (name.length === 0) errors.name = 'Please tell me your name.';
    else if (name.length < 2) errors.name = 'That looks a little short.';

    const email = message.email.trim();
    if (email.length === 0) errors.email = 'An email address is required.';
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'That email address looks incomplete.';

    const subject = message.subject.trim();
    if (subject.length === 0) errors.subject = 'Add a short subject.';

    const body = message.message.trim();
    if (body.length === 0) errors.message = 'Tell me a little about the project.';
    else if (body.length < 15) errors.message = 'A few more words would help — 15 characters minimum.';
    else if (body.length > 4000) errors.message = 'Please keep it under 4000 characters.';

    return errors;
  }

  static isValid(errors: ValidationErrors): boolean {
    return Object.keys(errors).length === 0;
  }
}

/* ── Web3Forms implementation ─────────────────────────────────────────────── */

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const REQUEST_TIMEOUT_MS = 15_000;

interface Web3FormsResponse {
  readonly success?: boolean;
  readonly message?: string;
}

export class Web3FormsGateway implements ContactGateway {
  readonly #accessKey: string;
  readonly #endpoint: string;

  constructor(accessKey: string, endpoint: string = WEB3FORMS_ENDPOINT) {
    this.#accessKey = accessKey.trim();
    this.#endpoint = endpoint;
  }

  get isConfigured(): boolean {
    return this.#accessKey.length > 0 && !this.#accessKey.startsWith('your-access-key');
  }

  async send(message: ContactMessage): Promise<SubmitResult> {
    if (!this.isConfigured) {
      return {
        ok: false,
        error: 'The form is not connected yet. Please email me directly — the address is just below.',
      };
    }

    // Silently accept honeypot hits so bots get no signal from the response.
    if (message.botcheck && message.botcheck.length > 0) {
      return { ok: true };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(this.#endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: this.#accessKey,
          name: message.name.trim(),
          email: message.email.trim(),
          subject: message.subject.trim(),
          message: message.message.trim(),
          from_name: 'Portfolio — voonnagowriganesh',
          replyto: message.email.trim(),
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as Web3FormsResponse;

      if (response.ok && payload.success !== false) return { ok: true };

      return {
        ok: false,
        error: payload.message ?? `Delivery failed (${response.status}). Please email me directly.`,
      };
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { ok: false, error: 'That took too long. Check your connection and try again.' };
      }
      return {
        ok: false,
        error: 'Could not reach the mail service. Please email me directly instead.',
      };
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Fallback used when no access key is configured: opens the visitor's own mail
 * client with the message prefilled, so the form is never a dead end.
 */
export class MailtoGateway implements ContactGateway {
  readonly #address: string;

  constructor(address: string) {
    this.#address = address;
  }

  get isConfigured(): boolean {
    return true;
  }

  send(message: ContactMessage): Promise<SubmitResult> {
    const body = `${message.message.trim()}\n\n— ${message.name.trim()} (${message.email.trim()})`;
    const href =
      `mailto:${this.#address}` +
      `?subject=${encodeURIComponent(message.subject.trim())}` +
      `&body=${encodeURIComponent(body)}`;

    if (typeof window !== 'undefined') window.location.href = href;
    return Promise.resolve({ ok: true });
  }
}
