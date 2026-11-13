/**
 * Composition root.
 *
 * The one place that knows which concrete implementations back the app's
 * interfaces. Components import the resolved instances from here, so swapping a
 * transport means editing this file and nothing else.
 */

import { identity } from '@/data/profile';
import {
  type ContactGateway,
  MailtoGateway,
  Web3FormsGateway,
} from '@/services/ContactService';

/** Vite inlines `import.meta.env` at build time; missing keys become undefined. */
const WEB3FORMS_KEY: string = import.meta.env['VITE_WEB3FORMS_KEY'] ?? '';

function resolveContactGateway(): ContactGateway {
  const web3forms = new Web3FormsGateway(WEB3FORMS_KEY);

  // Until a key is configured, fall back to the visitor's own mail client so the
  // form is still functional rather than a dead end.
  return web3forms.isConfigured ? web3forms : new MailtoGateway(identity.email);
}

export const contactGateway: ContactGateway = resolveContactGateway();

/** True when real server-side delivery is active (affects the form's copy). */
export const hasHostedContactDelivery: boolean = new Web3FormsGateway(WEB3FORMS_KEY).isConfigured;
