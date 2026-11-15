/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Umami website ID. Leave unset to disable analytics entirely. */
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  /** Umami script URL; defaults to Umami Cloud. Set it for a self-hosted Umami. */
  readonly VITE_UMAMI_SCRIPT_URL?: string;
  /** Web3Forms access key. Without it the contact form falls back to mailto. */
  readonly VITE_WEB3FORMS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  umami?: {
    track: (event: string, data?: Record<string, string | number | boolean>) => void;
  };
}
