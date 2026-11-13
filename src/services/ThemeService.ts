import { Observable } from '@/lib/Observable';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'vgg.theme';
const DOM_ATTRIBUTE = 'data-theme';

/**
 * Owns the light/dark theme for the whole document.
 *
 * Responsibilities:
 *  - resolve a stored preference (or the OS setting) into a concrete theme
 *  - reflect that theme onto <html data-theme> so CSS can react
 *  - keep `<meta name="theme-color">` in sync for mobile browser chrome
 *  - re-resolve automatically while the preference is "system"
 *
 * The same resolution logic runs as an inline script in index.html before first
 * paint; keep the two in sync if the storage key or attribute ever changes.
 */
export class ThemeService {
  readonly preference: Observable<ThemePreference>;
  readonly resolved: Observable<ResolvedTheme>;

  readonly #storage: Pick<Storage, 'getItem' | 'setItem'> | null;
  readonly #media: MediaQueryList | null;
  #detachMedia: (() => void) | null = null;

  constructor(storage: Pick<Storage, 'getItem' | 'setItem'> | null = safeLocalStorage()) {
    this.#storage = storage;
    this.#media =
      typeof window !== 'undefined' && window.matchMedia
        ? window.matchMedia('(prefers-color-scheme: dark)')
        : null;

    const preference = this.#readStoredPreference();
    this.preference = new Observable<ThemePreference>(preference);
    this.resolved = new Observable<ResolvedTheme>(this.#resolve(preference));
  }

  /** Apply the current theme to the DOM and begin tracking the OS setting. */
  start(): void {
    this.#apply(this.resolved.value);
    this.#attachMediaListener();
  }

  /** Detach OS listeners. Call from an effect cleanup. */
  stop(): void {
    this.#detachMedia?.();
    this.#detachMedia = null;
  }

  /** Explicitly choose a preference and persist it. */
  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
    this.#persist(preference);

    const next = this.#resolve(preference);
    this.resolved.set(next);
    this.#apply(next);
  }

  /** Flip between light and dark, pinning the result as an explicit choice. */
  toggle(): ResolvedTheme {
    const next: ResolvedTheme = this.resolved.value === 'dark' ? 'light' : 'dark';
    this.setPreference(next);
    return next;
  }

  /* ── internals ──────────────────────────────────────────────────────── */

  #readStoredPreference(): ThemePreference {
    const stored = this.#storage?.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'dark';
  }

  #persist(preference: ThemePreference): void {
    try {
      this.#storage?.setItem(STORAGE_KEY, preference);
    } catch {
      // Private browsing or blocked storage — the theme still works this session.
    }
  }

  #resolve(preference: ThemePreference): ResolvedTheme {
    if (preference !== 'system') return preference;
    return this.#media?.matches ? 'dark' : 'light';
  }

  #apply(theme: ResolvedTheme): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    root.setAttribute(DOM_ATTRIBUTE, theme);

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) {
      meta.content = theme === 'dark' ? '#05030f' : '#f4f3fd';
    }
  }

  #attachMediaListener(): void {
    const media = this.#media;
    if (!media) return;

    const handler = (): void => {
      // Only the "system" preference follows the OS.
      if (this.preference.value !== 'system') return;
      const next = this.#resolve('system');
      this.resolved.set(next);
      this.#apply(next);
    };

    media.addEventListener('change', handler);
    this.#detachMedia = () => media.removeEventListener('change', handler);
  }
}

function safeLocalStorage(): Pick<Storage, 'getItem' | 'setItem'> | null {
  try {
    if (typeof window === 'undefined') return null;
    // Touch the API: Safari in private mode throws on access, not on read.
    window.localStorage.getItem(STORAGE_KEY);
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Shared instance. Injectable via the ThemeProvider for tests. */
export const themeService = new ThemeService();
