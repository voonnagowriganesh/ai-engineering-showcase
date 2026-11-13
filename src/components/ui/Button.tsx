import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  readonly children: ReactNode;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly className?: string;
  readonly iconLeft?: ReactNode;
  readonly iconRight?: ReactNode;
  readonly fullWidth?: boolean;
}

export type ButtonProps = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>;

export type AnchorButtonProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className'>;

const BASE =
  'group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden ' +
  'rounded-full font-medium tracking-tight whitespace-nowrap ' +
  'transition-[transform,box-shadow,background-color,color,border-color] duration-300 ' +
  '[transition-timing-function:var(--ease-out-expo)] ' +
  'active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50';

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[0.8125rem]',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-[0.9375rem]',
};

const VARIANTS: Record<ButtonVariant, string> = {
  // Gradient fill with a soft coloured shadow that intensifies on hover.
  primary:
    'text-white shadow-[0_8px_30px_-8px_var(--color-accent-2)] ' +
    'hover:shadow-[0_14px_44px_-8px_var(--color-accent-2)] hover:-translate-y-0.5 ' +
    'bg-[linear-gradient(110deg,var(--color-accent)_0%,var(--color-accent-2)_55%,var(--color-accent-3)_100%)] ' +
    'bg-[length:200%_100%] bg-[position:0%_0%] hover:bg-[position:100%_0%] ' +
    '[transition:background-position_0.7s_var(--ease-out-expo),transform_0.3s,box-shadow_0.3s]',
  secondary:
    'bg-surface-2 text-ink border border-line hover:border-line-strong hover:-translate-y-0.5 ' +
    'hover:bg-elevated',
  outline:
    'border border-line-strong text-ink bg-transparent hover:-translate-y-0.5 ' +
    'hover:border-accent-2 hover:text-accent-2',
  ghost: 'text-ink-muted hover:text-ink hover:bg-surface-2',
};

function composeClassName(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean,
  className?: string,
): string {
  return cn(BASE, SIZES[size], VARIANTS[variant], fullWidth && 'w-full', className);
}

/** Icons shift slightly on hover — small motion that makes buttons feel alive. */
function ButtonContent({
  children,
  iconLeft,
  iconRight,
}: Pick<BaseProps, 'children' | 'iconLeft' | 'iconRight'>): React.JSX.Element {
  return (
    <>
      {iconLeft ? (
        <span className="transition-transform duration-300 group-hover/btn:-translate-x-0.5">
          {iconLeft}
        </span>
      ) : null}
      <span className="relative z-10">{children}</span>
      {iconRight ? (
        <span className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
          {iconRight}
        </span>
      ) : null}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = 'primary', size = 'md', className, iconLeft, iconRight, fullWidth = false, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={composeClassName(variant, size, fullWidth, className)}
      {...rest}
    >
      <ButtonContent iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </ButtonContent>
    </button>
  );
});

/**
 * Anchor styled as a button. External links get `rel` hardening automatically —
 * `noopener` closes the reverse-tabnabbing hole that `target="_blank"` opens.
 */
export const ButtonLink = forwardRef<HTMLAnchorElement, AnchorButtonProps>(function ButtonLink(
  {
    children,
    variant = 'primary',
    size = 'md',
    className,
    iconLeft,
    iconRight,
    fullWidth = false,
    target,
    rel,
    ...rest
  },
  ref,
) {
  const hardenedRel = target === '_blank' ? cn('noopener noreferrer', rel) : rel;

  return (
    <a
      ref={ref}
      className={composeClassName(variant, size, fullWidth, className)}
      target={target}
      rel={hardenedRel}
      {...rest}
    >
      <ButtonContent iconLeft={iconLeft} iconRight={iconRight}>
        {children}
      </ButtonContent>
    </a>
  );
});
