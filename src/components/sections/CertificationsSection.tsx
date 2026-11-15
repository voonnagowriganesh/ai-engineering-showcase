import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, ExternalLink, FileText, X } from 'lucide-react';
import { certificationsList } from '@/data/profile';
import { Reveal } from '@/components/ui/Reveal';
import { Icon } from '@/components/ui/primitives';
import { useScrollLock } from '@/hooks/useScroll';
import { useReducedMotion } from '@/hooks/useInteractions';
import { track } from '@/lib/analytics';
import type { Credential, CredentialKind } from '@/domain/models';

type RingMode = 'spin' | 'scroll';

const KIND_LABEL: Record<CredentialKind, string> = {
  certificate: 'Certificate',
  badge: 'Verified badge',
  internship: 'Internship',
};

/** Degrees per 60 Hz frame the ring drifts while nobody is touching it. */
const IDLE_DRIFT = 0.12;
const FRAME_MS = 1000 / 60;
/** Per-frame easing factor converted to the actual frame time, so the ring
 * moves at the same speed on 60 Hz, 120 Hz and throttled displays. */
const ease = (perFrame: number, dt: number): number => 1 - (1 - perFrame) ** (dt / FRAME_MS);
/** How long the ring waits after the last interaction before drifting again. */
const IDLE_DELAY_MS = 1600;

interface RingApi {
  readonly stageRef: React.RefObject<HTMLDivElement | null>;
  readonly ringRef: React.RefObject<HTMLDivElement | null>;
  readonly cardRefs: React.RefObject<(HTMLButtonElement | null)[]>;
  readonly front: number;
  readonly goTo: (index: number) => void;
  readonly wasDrag: () => boolean;
  readonly onPointerDown: (e: React.PointerEvent) => void;
}

/**
 * A ring of `count` cards placed at `rotateY(i × 360°/count) translateZ(r)`,
 * with the whole ring rotated. All motion state lives in a ref and is written
 * straight to the DOM from one rAF loop, so spinning never re-renders React;
 * only a change of front card does. The loop runs only while the stage is on
 * screen. It reads scroll position and pointer movement — it never writes
 * scroll or calls preventDefault — so there is nothing for Lenis to fight.
 */
function useRing(count: number, mode: RingMode, paused: boolean, reduced: boolean): RingApi {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [front, setFront] = useState(0);
  const step = 360 / count;

  const state = useRef({
    rotation: 0,
    target: null as number | null,
    radius: 300,
    dragging: false,
    dragMoved: 0,
    lastX: 0,
    lastDelta: 0,
    hovering: false,
    lastInteraction: 0,
  });
  const modeRef = useRef(mode);
  const pausedRef = useRef(paused);
  modeRef.current = mode;
  pausedRef.current = paused;

  const snap = useCallback(() => {
    const st = state.current;
    st.target = Math.round(st.rotation / step) * step;
    if (reduced) {
      st.rotation = st.target;
      st.target = null;
    }
  }, [step, reduced]);

  const goTo = useCallback(
    (index: number) => {
      const st = state.current;
      const base = -index * step;
      st.target = base + Math.round((st.rotation - base) / 360) * 360;
      st.lastInteraction = performance.now();
      if (reduced) {
        st.rotation = st.target;
        st.target = null;
      }
    },
    [step, reduced],
  );

  useEffect(() => {
    if (mode === 'spin') {
      snap();
      state.current.lastInteraction = performance.now();
    }
  }, [mode, snap]);

  // Radius follows card width so neighbours never overlap at any screen size.
  useEffect(() => {
    const layout = (): void => {
      const ring = ringRef.current;
      const stage = stageRef.current;
      if (!ring || !stage) return;
      const width = stage.clientWidth;
      const gap = width < 640 ? 10 : width < 1024 ? 40 : 90;
      const radius = Math.round(ring.offsetWidth / 2 / Math.tan(Math.PI / count) + gap);
      state.current.radius = radius;
      cardRefs.current.forEach((el, i) => {
        if (el) el.style.transform = `rotateY(${i * step}deg) translateZ(${radius}px)`;
      });
    };
    layout();
    window.addEventListener('resize', layout);
    return () => window.removeEventListener('resize', layout);
  }, [count, step]);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return undefined;

    let raf = 0;
    let lastFront = -1;
    const frontOf = (rotation: number): number => ((Math.round(-rotation / step) % count) + count) % count;

    const render = (): void => {
      const st = state.current;
      ring.style.transform = `translateZ(${-st.radius}px) rotateY(${st.rotation.toFixed(2)}deg)`;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const angle = (((i * step + st.rotation) % 360) + 540) % 360 - 180;
        const facing = (Math.cos((angle * Math.PI) / 180) + 1) / 2;
        el.style.opacity = (0.14 + 0.86 * facing ** 1.6).toFixed(3);
        el.style.zIndex = String(Math.round(facing * 100));
      });
      const f = frontOf(st.rotation);
      if (f !== lastFront) {
        lastFront = f;
        setFront(f);
      }
    };

    let lastTime = 0;
    const tick = (now: number): void => {
      const st = state.current;
      // lastTime is 0 on the first frame after the ring scrolls back into view.
      const resumed = lastTime === 0;
      const dt = resumed ? FRAME_MS : Math.min(64, now - lastTime);
      lastTime = now;
      if (!pausedRef.current) {
        if (modeRef.current === 'scroll') {
          const rect = stage.getBoundingClientRect();
          const vh = window.innerHeight;
          const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
          const want = -progress * 360;
          // Jump straight to the scroll angle when coming back into view
          // rather than visibly spinning to catch up.
          st.rotation += (want - st.rotation) * (reduced || resumed ? 1 : ease(0.14, dt));
        } else if (!st.dragging) {
          if (st.target !== null) {
            const d = st.target - st.rotation;
            st.rotation += d * ease(0.11, dt);
            if (Math.abs(d) < 0.15) {
              st.rotation = st.target;
              st.target = null;
              st.lastInteraction = now;
            }
          } else if (!st.hovering && !reduced && now - st.lastInteraction > IDLE_DELAY_MS) {
            st.rotation -= IDLE_DRIFT * (dt / FRAME_MS);
          }
        }
      }
      render();
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      lastTime = 0;
      if (entry?.isIntersecting) raf = requestAnimationFrame(tick);
    });
    observer.observe(stage);
    render();

    const onMove = (e: PointerEvent): void => {
      const st = state.current;
      if (!st.dragging) return;
      const dx = e.clientX - st.lastX;
      st.lastX = e.clientX;
      st.dragMoved += Math.abs(dx);
      st.lastDelta = dx * (stage.clientWidth < 640 ? 0.45 : 0.3);
      st.rotation += st.lastDelta;
    };
    const onUp = (): void => {
      const st = state.current;
      if (!st.dragging) return;
      st.dragging = false;
      st.lastInteraction = performance.now();
      if (reduced || Math.abs(st.lastDelta) < 0.4) {
        snap();
        return;
      }
      // Aim the fling at the card it would coast to, then glide there.
      st.target = Math.round((st.rotation + st.lastDelta * 16) / step) * step;
    };
    const canHover = window.matchMedia('(hover: hover)').matches;
    const onEnter = (): void => {
      state.current.hovering = true;
      if (modeRef.current === 'spin' && state.current.target === null) snap();
    };
    const onLeave = (): void => {
      state.current.hovering = false;
      state.current.lastInteraction = performance.now();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    if (canHover) {
      stage.addEventListener('pointerenter', onEnter);
      stage.addEventListener('pointerleave', onLeave);
    }
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [count, step, reduced, snap]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const st = state.current;
    st.dragMoved = 0;
    if (modeRef.current !== 'spin') return;
    st.dragging = true;
    st.lastX = e.clientX;
    st.lastDelta = 0;
    st.target = null;
  }, []);

  const wasDrag = useCallback(() => state.current.dragMoved > 6, []);

  return { stageRef, ringRef, cardRefs, front, goTo, wasDrag, onPointerDown };
}

function CertFace({ cert, hint }: { readonly cert: Credential; readonly hint?: string | undefined }): React.JSX.Element {
  return (
    <>
      <div className="flex h-12 items-center">
        {cert.logo ? (
          <img src={cert.logo} alt="" className="max-h-11 max-w-[7rem] rounded-lg object-contain" loading="lazy" />
        ) : (
          <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-[#7C5DFA] to-[#4A3E8C] text-white">
            <Icon icon={cert.icon} size={20} />
          </span>
        )}
      </div>
      <h3 className="mt-4 line-clamp-2 shrink-0 font-display text-[0.95rem] font-bold leading-snug text-[#1B1F3B] dark:text-white sm:line-clamp-3">
        {cert.title}
      </h3>
      <p className="mt-1 shrink-0 truncate text-xs font-medium text-[#4A3E8C] dark:text-[#9277FF]">{cert.issuer}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-3">
        <span className="font-mono text-[0.625rem] text-[#374151] dark:text-slate-400">{cert.issued}</span>
        {hint ? <span className="text-[0.6875rem] font-semibold text-[#7C5DFA] dark:text-[#9277FF]">{hint}</span> : null}
      </div>
    </>
  );
}

const faceClass =
  'flex flex-col rounded-3xl border border-[#E2E4EB] bg-[#FFFFFF] p-5 text-left shadow-[0_10px_30px_-10px_rgba(27,31,59,0.06)] dark:border-[#2A305A] dark:bg-[#151934]';

interface OpenCard {
  readonly index: number;
  readonly from: { x: number; y: number; scale: number };
}

export function CertificationsSection(): React.JSX.Element {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<RingMode>('spin');
  const [open, setOpen] = useState<OpenCard | null>(null);
  const [hiddenIndex, setHiddenIndex] = useState<number | null>(null);
  const ring = useRing(certificationsList.length, mode, open !== null, reduced);

  useScrollLock(open !== null);

  // Focus into the flipped card on open; back to the ring card once the
  // closing flight has finished (it's `invisible`, so unfocusable, until then).
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastOpenedRef = useRef<number | null>(null);
  const isOpen = open !== null;
  useEffect(() => {
    if (isOpen) closeButtonRef.current?.focus({ preventScroll: true });
  }, [isOpen]);
  const handleExitComplete = (): void => {
    setHiddenIndex(null);
    const index = lastOpenedRef.current;
    lastOpenedRef.current = null;
    if (index !== null) {
      // Wait a frame for `invisible` to be removed before focusing.
      requestAnimationFrame(() => ring.cardRefs.current[index]?.focus({ preventScroll: true }));
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const openCard = (index: number): void => {
    const el = ring.cardRefs.current[index];
    if (!el) return;
    track('cert-flip', { id: certificationsList[index]?.id ?? String(index) });
    const rect = el.getBoundingClientRect();
    const modalWidth = Math.min(384, window.innerWidth - 32);
    setOpen({
      index,
      from: {
        x: rect.left + rect.width / 2 - window.innerWidth / 2,
        y: rect.top + rect.height / 2 - window.innerHeight / 2,
        scale: rect.width / modalWidth,
      },
    });
    setHiddenIndex(index);
    lastOpenedRef.current = index;
  };

  const onCardClick = (index: number): void => {
    if (ring.wasDrag()) return;
    if (mode === 'scroll' || index === ring.front) openCard(index);
    else ring.goTo(index);
  };

  const count = certificationsList.length;
  const frontCert = certificationsList[ring.front];
  const openCert = open ? certificationsList[open.index] : null;
  const arrowClass =
    'flex size-9 items-center justify-center rounded-full border border-[#E2E4EB] bg-[#FFFFFF] text-[#1B1F3B] shadow-sm transition-all hover:border-[#7C5DFA] hover:text-[#7C5DFA] dark:border-[#2A305A] dark:bg-[#151934] dark:text-white dark:hover:border-[#7C5DFA]';

  return (
    <section
      id="certifications"
      className="relative overflow-hidden bg-[#F4F5F8] py-20 text-[#1B1F3B] transition-colors dark:bg-[#0B0E1E] dark:text-white"
    >
      <div className="mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <Reveal direction="down" distance={10}>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E2E4FA] px-3.5 py-1 text-xs font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                <span className="size-1.5 rounded-full bg-[#7C5DFA]" />
                <span>CERTIFICATIONS</span>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-[#1B1F3B] dark:text-white sm:text-3xl lg:text-4xl">
                Professional Certifications
              </h2>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-2 text-xs text-[#374151] dark:text-[#D1D5DB] sm:text-sm">
                Swipe to spin the ring. Tap the front card to see the credential.
              </p>
            </Reveal>
          </div>

          <Reveal direction="left" delay={0.2}>
            <div
              role="group"
              aria-label="Ring mode"
              className="inline-flex gap-1 rounded-full border border-[#E2E4EB] bg-[#FFFFFF] p-1 dark:border-[#2A305A] dark:bg-[#151934]"
            >
              {(
                [
                  ['spin', 'Swipe & spin'],
                  ['scroll', 'Scroll to spin'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  onClick={() => setMode(value)}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    mode === value
                      ? 'bg-[#7C5DFA] text-white shadow-sm'
                      : 'text-[#374151] hover:text-[#1B1F3B] dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {/* The stage clips the ring (which is wider than a phone screen) and
            fades its edges; `touch-action: pan-y` keeps vertical page scroll
            working while a horizontal swipe spins the ring. */}
        <div
          ref={ring.stageRef}
          onPointerDown={ring.onPointerDown}
          className={`relative mt-8 h-[330px] touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [perspective:1100px] [perspective-origin:50%_40%] sm:h-[390px] lg:h-[430px] lg:[perspective:1400px] ${
            mode === 'spin' ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          <div
            ref={ring.ringRef}
            className="absolute left-1/2 top-[46%] -ml-[77.5px] -mt-[107.5px] h-[215px] w-[155px] [transform-style:preserve-3d] sm:-ml-[97.5px] sm:-mt-[130px] sm:h-[260px] sm:w-[195px] lg:-ml-[107.5px] lg:-mt-[142.5px] lg:h-[285px] lg:w-[215px]"
            style={{ willChange: 'transform' }}
          >
            {certificationsList.map((cert, i) => (
              <button
                key={cert.id}
                ref={(el) => {
                  ring.cardRefs.current[i] = el;
                }}
                type="button"
                tabIndex={i === ring.front ? 0 : -1}
                aria-label={`${cert.title}, ${cert.issuer}`}
                onClick={() => onCardClick(i)}
                className={`${faceClass} absolute inset-0 transition-[border-color,box-shadow] duration-300 ${
                  i === ring.front
                    ? 'border-[#7C5DFA] shadow-[0_20px_45px_-15px_rgba(124,93,250,0.35)] dark:border-[#9277FF]'
                    : ''
                } ${hiddenIndex === i ? 'invisible' : ''}`}
              >
                <CertFace cert={cert} hint={i === ring.front ? 'Tap to flip →' : undefined} />
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 h-11 w-[min(70%,520px)] -translate-x-1/2 rounded-full bg-[#7C5DFA]/15 blur-xl dark:bg-[#7C5DFA]/20" />
        </div>

        {/* Arrows sit beside the dots */}
        <div className="mt-2 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => ring.goTo((ring.front - 1 + count) % count)}
            aria-label="Previous certification"
            className={arrowClass}
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2" role="group" aria-label="Choose certification">
            {certificationsList.map((cert, i) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => ring.goTo(i)}
                aria-label={cert.title}
                aria-current={i === ring.front}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === ring.front
                    ? 'w-6 bg-[#7C5DFA]'
                    : 'w-2 bg-[#E2E4EB] hover:bg-[#CBD5E1] dark:bg-[#2A305A] dark:hover:bg-[#3D467D]'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => ring.goTo((ring.front + 1) % count)}
            aria-label="Next certification"
            className={arrowClass}
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <p className="mt-3 min-h-5 text-center text-xs text-[#374151] dark:text-[#D1D5DB]" aria-live="polite">
          {frontCert ? (
            <>
              <span className="font-semibold text-[#1B1F3B] dark:text-white">{frontCert.title}</span> · {frontCert.issuer}
            </>
          ) : null}
        </p>
      </div>

      {/* Flip view modal */}
      <AnimatePresence onExitComplete={handleExitComplete}>
        {open && openCert ? (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="absolute inset-0 bg-[#1B1F3B]/60 backdrop-blur-md dark:bg-black/75"
            />
            <motion.div
              initial={open.from}
              animate={{ x: 0, y: 0, scale: 1 }}
              exit={open.from}
              transition={reduced ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 240 }}
              className="relative h-[26rem] w-full max-w-sm [perspective:1400px]"
            >
              <motion.div
                initial={{ rotateY: 0 }}
                animate={{ rotateY: 180 }}
                exit={{ rotateY: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative h-full w-full [transform-style:preserve-3d]"
              >
                <div className={`${faceClass} absolute inset-0 [backface-visibility:hidden]`}>
                  <CertFace cert={openCert} />
                </div>

                <div
                  role="dialog"
                  aria-modal="true"
                  aria-label={openCert.title}
                  data-lenis-prevent
                  className={`${faceClass} absolute inset-0 overflow-y-auto [backface-visibility:hidden] [transform:rotateY(180deg)]`}
                >
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label="Close"
                    className="absolute right-4 top-4 grid size-8 place-items-center rounded-full border border-[#E2E4EB] text-[#374151] hover:text-[#1B1F3B] dark:border-[#2A305A] dark:text-slate-400 dark:hover:text-white"
                  >
                    <X size={16} />
                  </button>
                  <span className="self-start rounded-full bg-[#E2E4FA] px-2.5 py-0.5 text-[0.6875rem] font-bold text-[#1B1F3B] dark:bg-[#7C5DFA]/20 dark:text-[#E2E4FA]">
                    {KIND_LABEL[openCert.kind]}
                  </span>
                  <h3 className="mt-3 pr-8 font-display text-lg font-bold leading-snug text-[#1B1F3B] dark:text-white">
                    {openCert.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#4A3E8C] dark:text-[#9277FF]">{openCert.issuer}</p>
                  {openCert.detail ? (
                    <p className="mt-3 text-sm leading-relaxed text-[#374151] dark:text-[#D1D5DB]">{openCert.detail}</p>
                  ) : null}

                  <dl className="mt-4 text-xs">
                    <div className="flex justify-between border-t border-[#E2E4EB] py-2.5 dark:border-[#2A305A]">
                      <dt className="text-[#374151] dark:text-slate-400">Issued</dt>
                      <dd className="font-semibold text-[#1B1F3B] dark:text-white">{openCert.issued}</dd>
                    </div>
                    {openCert.credentialId ? (
                      <div className="flex justify-between gap-4 border-t border-[#E2E4EB] py-2.5 dark:border-[#2A305A]">
                        <dt className="shrink-0 text-[#374151] dark:text-slate-400">Credential ID</dt>
                        <dd className="break-all text-right font-mono font-semibold text-[#1B1F3B] dark:text-white">{openCert.credentialId}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {openCert.assetUrl ? (
                      <a
                        href={openCert.assetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#1B1F3B] px-4 py-2 text-xs font-bold text-white hover:bg-[#4A3E8C] dark:bg-[#7C5DFA] dark:hover:bg-[#9277FF]"
                      >
                        <FileText size={13} /> View certificate
                      </a>
                    ) : null}
                    {openCert.verifyUrl ? (
                      <a
                        href={openCert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E4EB] px-4 py-2 text-xs font-bold text-[#1B1F3B] hover:border-[#7C5DFA] hover:text-[#7C5DFA] dark:border-[#2A305A] dark:text-[#E2E4FA]"
                      >
                        Verify <ExternalLink size={12} />
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
