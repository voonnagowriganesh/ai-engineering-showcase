import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li';
}

/**
 * Scroll-triggered reveal. Built on framer-motion's whileInView so it rides
 * native scroll (no Lenis / scroll-hijack library in this project at all),
 * which sidesteps the whole "wheel events get preventDefault'd" bug class.
 */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
