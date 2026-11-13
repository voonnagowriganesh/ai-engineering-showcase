import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  readonly children: ReactNode;
  /** Rendered instead of the children when a descendant throws. */
  readonly fallback?: ReactNode;
  /** Label used in the console group, to locate which boundary caught it. */
  readonly label?: string;
}

interface State {
  readonly error: Error | null;
}

/**
 * Catches render-time errors so one broken decorative layer cannot blank the
 * whole page.
 *
 * Deliberately a class: `componentDidCatch` / `getDerivedStateFromError` have no
 * hook equivalent — error boundaries are the one place React still requires a
 * class component.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Kept to console rather than shipped anywhere: no analytics on this site.
    console.error(`[${this.props.label ?? 'ErrorBoundary'}]`, error, info.componentStack);
  }

  override render(): ReactNode {
    if (this.state.error !== null) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}
