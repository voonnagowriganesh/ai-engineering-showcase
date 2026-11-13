import { useCallback } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { AnimatePresence, motion } from 'motion/react';
import { Copy, Download, ExternalLink, Moon, Search, Sun } from 'lucide-react';
import { credentials, identity, navSections, projects, socials } from '@/data/profile';
import { useClipboard } from '@/hooks/useInteractions';
import { useScrollLock, useScrollTo } from '@/hooks/useScroll';
import { useTheme } from '@/hooks/useTheme';
import { Icon } from '@/components/ui/primitives';

export interface CommandPaletteProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

/**
 * ⌘K / Ctrl-K command palette.
 *
 * Indexes every section, project and credential plus the theme and contact
 * actions, so the entire site is reachable from the keyboard. cmdk handles the
 * filtering, list virtualisation and roving focus; this component owns the
 * shell and the action wiring.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps): React.JSX.Element {
  const scrollTo = useScrollTo();
  const { isDark, toggle } = useTheme();
  const { copy } = useClipboard();

  useScrollLock(open);

  // NOTE: the ⌘K / Ctrl-K shortcut is bound in App, not here. This component is
  // lazy-loaded and only mounted after the first open, so a listener installed
  // here could never fire the very first time.

  const run = useCallback(
    (action: () => void): void => {
      onOpenChange(false);
      // Defer so the dialog's exit animation does not fight the scroll.
      window.setTimeout(action, 90);
    },
    [onOpenChange],
  );

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="command-palette"
          className="fixed inset-0 z-[150] flex items-start justify-center p-4 pt-[12vh] sm:p-6 sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            onClick={() => onOpenChange(false)}
            className="absolute inset-0 bg-canvas/70 backdrop-blur-md"
          />

          <motion.div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface shadow-[0_40px_100px_-30px_rgb(0_0_0/0.65)]"
            initial={{ opacity: 0, y: -14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <CommandPrimitive
              label="Site command palette"
              loop
              className="flex max-h-[min(32rem,70vh)] flex-col"
            >
              <div className="flex items-center gap-3 border-b border-line px-5">
                <Search size={17} className="shrink-0 text-ink-subtle" />
                <CommandPrimitive.Input
                  autoFocus
                  placeholder="Jump to a section, project or credential…"
                  className="h-14 w-full bg-transparent text-[0.9375rem] text-ink outline-none placeholder:text-ink-subtle"
                />
                <kbd className="hidden shrink-0 rounded-md border border-line bg-canvas px-2 py-1 font-mono text-[0.625rem] text-ink-subtle sm:block">
                  ESC
                </kbd>
              </div>

              <CommandPrimitive.List className="flex-1 overflow-y-auto overscroll-contain p-2">
                <CommandPrimitive.Empty className="px-4 py-10 text-center text-sm text-ink-subtle">
                  Nothing matched that.
                </CommandPrimitive.Empty>

                <Group heading="Navigate">
                  {navSections.map((section) => (
                    <Item
                      key={section.id}
                      value={`go ${section.label} ${section.id}`}
                      onSelect={() => run(() => scrollTo(section.id, -16))}
                      icon={<Icon icon={section.icon} size={16} />}
                      label={section.label}
                      hint={section.index}
                    />
                  ))}
                </Group>

                <Group heading="Projects">
                  {projects.map((project) => (
                    <Item
                      key={project.id}
                      value={`project ${project.title} ${project.category} ${project.stack.join(' ')}`}
                      onSelect={() => run(() => scrollTo('projects', -16))}
                      icon={<Icon icon={project.icon} size={16} />}
                      label={project.title}
                      hint={project.category}
                    />
                  ))}
                </Group>

                <Group heading="Credentials">
                  {credentials.map((credential) => {
                    const href = credential.verifyUrl ?? credential.assetUrl;
                    if (!href) return null;
                    return (
                      <Item
                        key={credential.id}
                        value={`credential ${credential.title} ${credential.issuer}`}
                        onSelect={() =>
                          run(() => window.open(href, '_blank', 'noopener,noreferrer'))
                        }
                        icon={<Icon icon={credential.icon} size={16} />}
                        label={credential.title}
                        hint={credential.issuer}
                      />
                    );
                  })}
                </Group>

                <Group heading="Actions">
                  <Item
                    value="download resume cv"
                    onSelect={() =>
                      run(() => {
                        const anchor = document.createElement('a');
                        anchor.href = identity.resumeUrl;
                        anchor.download = identity.resumeFileName;
                        anchor.click();
                      })
                    }
                    icon={<Download size={16} />}
                    label="Download résumé"
                    hint="PDF"
                  />
                  <Item
                    value="copy email address"
                    onSelect={() => run(() => void copy(identity.email, 'email'))}
                    icon={<Copy size={16} />}
                    label="Copy email address"
                    hint={identity.email}
                  />
                  <Item
                    value="toggle theme dark light appearance"
                    onSelect={() => run(toggle)}
                    icon={isDark ? <Sun size={16} /> : <Moon size={16} />}
                    label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                    hint="Appearance"
                  />
                  {socials.map((social) => (
                    <Item
                      key={social.id}
                      value={`open ${social.label} ${social.handle}`}
                      onSelect={() =>
                        run(() => window.open(social.href, '_blank', 'noopener,noreferrer'))
                      }
                      icon={<Icon icon={social.icon} size={16} />}
                      label={`Open ${social.label}`}
                      hint={<ExternalLink size={12} />}
                    />
                  ))}
                </Group>
              </CommandPrimitive.List>
            </CommandPrimitive>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ── Internal presentational pieces ──────────────────────────────────────── */

function Group({
  heading,
  children,
}: {
  readonly heading: string;
  readonly children: React.ReactNode;
}): React.JSX.Element {
  return (
    <CommandPrimitive.Group
      heading={heading}
      className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:tracking-[0.2em] [&_[cmdk-group-heading]]:text-ink-subtle [&_[cmdk-group-heading]]:uppercase"
    >
      {children}
    </CommandPrimitive.Group>
  );
}

function Item({
  value,
  onSelect,
  icon,
  label,
  hint,
}: {
  readonly value: string;
  readonly onSelect: () => void;
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly hint?: React.ReactNode;
}): React.JSX.Element {
  return (
    <CommandPrimitive.Item
      value={value}
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted transition-colors duration-150 data-[selected=true]:bg-surface-2 data-[selected=true]:text-ink"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-lg border border-line bg-canvas text-accent-2">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {hint ? (
        <span className="shrink-0 font-mono text-2xs text-ink-subtle">{hint}</span>
      ) : null}
    </CommandPrimitive.Item>
  );
}
