import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface MarqueeProps {
  readonly children: ReactNode;
  readonly reverse?: boolean;
  /** Seconds for one full cycle. Lower is faster. */
  readonly durationSeconds?: number;
  readonly className?: string;
  readonly pauseOnHover?: boolean;
}

/**
 * Infinite horizontal ticker.
 *
 * The track renders its children twice and translates by exactly -50%, so the
 * second copy lands precisely where the first began — a seamless loop with no
 * JS, no measurement and no reflow. The duplicate is `aria-hidden` so screen
 * readers announce the list once.
 */
export function Marquee({
  children,
  reverse = false,
  durationSeconds = 42,
  className,
  pauseOnHover = true,
}: MarqueeProps): React.JSX.Element {
  return (
    <div className={cn('group/marquee mask-edges relative flex overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max shrink-0 items-center',
          reverse ? 'animate-marquee-reverse' : 'animate-marquee',
          pauseOnHover && 'group-hover/marquee:[animation-play-state:paused]',
        )}
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden="true" className="flex shrink-0 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}
