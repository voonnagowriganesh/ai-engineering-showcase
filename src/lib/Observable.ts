/** Releases a subscription. Safe to call more than once. */
export type Unsubscribe = () => void;

export type Listener<T> = (value: T) => void;

/**
 * Minimal synchronous observable value.
 *
 * Services expose state through this rather than through React state so that
 * non-React code (the render loop, the scroll driver) can read and react to the
 * same source of truth. `useSyncExternalStore` bridges it back into React.
 */
export class Observable<T> {
  readonly #listeners = new Set<Listener<T>>();
  #value: T;

  constructor(initialValue: T) {
    this.#value = initialValue;
  }

  get value(): T {
    return this.#value;
  }

  /** Assign and notify. No-ops when the value is referentially unchanged. */
  set(next: T): void {
    if (Object.is(this.#value, next)) return;
    this.#value = next;
    this.#emit();
  }

  /** Derive the next value from the current one. */
  update(reducer: (current: T) => T): void {
    this.set(reducer(this.#value));
  }

  /**
   * Subscribe to changes. The listener is *not* invoked on subscribe — callers
   * that need the current value should read `.value` directly.
   */
  subscribe(listener: Listener<T>): Unsubscribe {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  /** Bound snapshot getter, shaped for `useSyncExternalStore`. */
  readonly getSnapshot = (): T => this.#value;

  /** Bound subscribe, shaped for `useSyncExternalStore`. */
  readonly subscribeTo = (listener: () => void): Unsubscribe => this.subscribe(listener);

  #emit(): void {
    // Iterate a copy: a listener may unsubscribe itself during notification.
    for (const listener of [...this.#listeners]) {
      listener(this.#value);
    }
  }
}
