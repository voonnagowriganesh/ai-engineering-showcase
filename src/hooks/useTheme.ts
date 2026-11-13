import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  type ResolvedTheme,
  type ThemePreference,
  themeService,
  type ThemeService,
} from '@/services/ThemeService';

export interface ThemeApi {
  readonly theme: ResolvedTheme;
  readonly preference: ThemePreference;
  readonly isDark: boolean;
  readonly toggle: () => void;
  readonly setPreference: (preference: ThemePreference) => void;
}

/**
 * Bridges ThemeService into React.
 *
 * `useSyncExternalStore` is the right primitive here rather than `useState` +
 * an effect: the service is the single source of truth, non-React code reads
 * the same instance, and React stays tear-free during concurrent renders.
 *
 * @param service Injectable for tests; defaults to the shared instance.
 */
export function useTheme(service: ThemeService = themeService): ThemeApi {
  const theme = useSyncExternalStore(
    service.resolved.subscribeTo,
    service.resolved.getSnapshot,
    // Server/prerender snapshot — matches the default in index.html.
    () => 'dark' as const,
  );

  const preference = useSyncExternalStore(
    service.preference.subscribeTo,
    service.preference.getSnapshot,
    () => 'dark' as const,
  );

  useEffect(() => {
    service.start();
    return () => service.stop();
  }, [service]);

  const toggle = useCallback(() => {
    service.toggle();
  }, [service]);

  const setPreference = useCallback(
    (next: ThemePreference) => {
      service.setPreference(next);
    },
    [service],
  );

  return { theme, preference, isDark: theme === 'dark', toggle, setPreference };
}
