import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Award, BadgeCheck, ChevronLeft, ChevronRight, ExternalLink, FileText, GraduationCap, X } from 'lucide-react';
import { certifications } from '../data/content';
import { SectionHeading } from './SectionHeading';
import { track } from '../lib/analytics';
import type { Credential, CredentialKind } from '../types';

const kindMeta: Record<CredentialKind, { icon: typeof Award; label: string; color: string }> = {
  certificate: { icon: Award, label: 'Certificate', color: '#4338CA' },
  badge: { icon: BadgeCheck, label: 'Verified Badge', color: '#2F7A64' },
  internship: { icon: GraduationCap, label: 'Internship', color: '#E8793C' },
};

type RingMode = 'spin' | 'scroll';

/** Degrees per 60 Hz frame the ring drifts while nobody is touching it. */
const IDLE_DRIFT = 0.12;
/** How long the ring waits after the last interaction before drifting again. */
const IDLE_DELAY_MS = 1600;
const FRAME_MS = 1000 / 60;
/** Per-frame easing factor converted to the actual frame time, so the ring
 * moves at the same speed on 60 Hz, 120 Hz and throttled displays. */
const ease = (perFrame: number, dt: number) => 1 - (1 - perFrame) ** (dt / FRAME_MS);

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const onChange = () => setReduced(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

/**
 * A ring of `count` cards placed at `rotateY(i × 360°/count) translateZ(r)`,
 * with the whole ring rotated. All motion state lives in a ref and is written
 * straight to the DOM from one rAF loop, so spinning never re-renders React;
 * only a change of front card does. The loop runs only while the stage is on
 * screen.
 */
function useRing(count: number, mode: RingMode, paused: boolean, reduced: boolean) {
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
    const layout = () => {
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
    let lastTime = 0;
    const frontOf = (rotation: number) => ((Math.round(-rotation / step) % count) + count) % count;

    const render = () => {
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

    const tick = (now: number) => {
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

    const onMove = (e: PointerEvent) => {
      const st = state.current;
      if (!st.dragging) return;
      const dx = e.clientX - st.lastX;
      st.lastX = e.clientX;
      st.dragMoved += Math.abs(dx);
      st.lastDelta = dx * (stage.clientWidth < 640 ? 0.45 : 0.3);
      st.rotation += st.lastDelta;
    };
    const onUp = () => {
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
    const onEnter = () => {
      state.current.hovering = true;
      if (modeRef.current === 'spin' && state.current.target === null) snap();
    };
    const onLeave = () => {
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

function CertFace({ cert, hint }: { cert: Credential; hint?: string }) {
  const meta = kindMeta[cert.kind];
  return (
    <>
      {cert.logo ? (
        <span className="flex h-10 w-[4.5rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-white px-1.5 py-1">
          <img
            src={cert.logo}
            alt=""
            width={64}
            height={34}
            draggable={false}
            className="max-h-full max-w-full object-contain"
          />
        </span>
      ) : (
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${meta.color}14`, color: meta.color }}
        >
          <meta.icon size={18} />
        </span>
      )}
      <h3 className="mt-4 line-clamp-2 shrink-0 font-display text-[0.95rem] font-semibold leading-snug text-ink sm:line-clamp-3">
        {cert.title}
      </h3>
      <p className="mt-1 shrink-0 truncate text-xs font-medium text-ink-soft">{cert.issuer}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-3">
        <span className="label-mono text-[10px] text-ink-faint">{cert.issued}</span>
        {hint ? <span className="text-[11px] font-semibold text-signal">{hint}</span> : null}
      </div>
    </>
  );
}

const faceClass = 'flex flex-col rounded-[1.5rem] border border-ink/10 bg-paper p-5 text-left shadow-card';

interface OpenCard {
  index: number;
  from: { x: number; y: number; scale: number };
}

export function Certifications() {
  const reduced = useReducedMotion();
  const [mode, setMode] = useState<RingMode>('spin');
  const [open, setOpen] = useState<OpenCard | null>(null);
  const [hiddenIndex, setHiddenIndex] = useState<number | null>(null);
  const ring = useRing(certifications.length, mode, open !== null, reduced);

  // Same background lock the project modal uses (native scroll only here).
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('modal-open');
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const openCard = (index: number) => {
    const el = ring.cardRefs.current[index];
    if (!el) return;
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
    track('cert-flip', { id: certifications[index]?.id ?? String(index) });
  };

  const onCardClick = (index: number) => {
    if (ring.wasDrag()) return;
    if (mode === 'scroll' || index === ring.front) openCard(index);
    else ring.goTo(index);
  };

  const count = certifications.length;
  const frontCert = certifications[ring.front];
  const openCert = open ? certifications[open.index] : null;
  const arrowClass =
    'flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink-soft shadow-soft transition hover:border-signal/40 hover:text-signal';

  return (
    <section id="certifications" className="relative overflow-hidden bg-paper-deep py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            index="07"
            eyebrow="Certifications"
            title={`${count} verified credentials.`}
            description="Swipe to spin the ring. Tap the front card to see the credential."
          />
          <div
            role="group"
            aria-label="Ring mode"
            className="inline-flex shrink-0 gap-1 self-start rounded-full border border-ink/10 bg-paper p-1 md:self-auto"
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
                  mode === value ? 'bg-ink text-paper' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* The stage clips the ring (which is wider than a phone screen) and
            fades its edges; `touch-action: pan-y` keeps vertical page scroll
            working while a horizontal swipe spins the ring. */}
        <div
          ref={ring.stageRef}
          onPointerDown={ring.onPointerDown}
          className={`relative mt-10 h-[330px] touch-pan-y select-none overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [perspective:1100px] [perspective-origin:50%_40%] sm:h-[390px] lg:h-[430px] lg:[perspective:1400px] ${
            mode === 'spin' ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        >
          <div
            ref={ring.ringRef}
            className="absolute left-1/2 top-[46%] -ml-[77.5px] -mt-[107.5px] h-[215px] w-[155px] [transform-style:preserve-3d] sm:-ml-[97.5px] sm:-mt-[130px] sm:h-[260px] sm:w-[195px] lg:-ml-[107.5px] lg:-mt-[142.5px] lg:h-[285px] lg:w-[215px]"
            style={{ willChange: 'transform' }}
          >
            {certifications.map((cert, i) => (
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
                  i === ring.front ? 'border-signal/40 shadow-lift' : ''
                } ${hiddenIndex === i ? 'invisible' : ''}`}
              >
                <CertFace cert={cert} hint={i === ring.front ? 'Tap to flip →' : undefined} />
              </button>
            ))}
          </div>
          <div className="pointer-events-none absolute bottom-4 left-1/2 h-11 w-[min(70%,520px)] -translate-x-1/2 rounded-full bg-signal/20 blur-xl" />
        </div>

        {/* Arrows sit beside the dots, under the ring, so they stay in view
            with the ring on short phone screens. */}
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
            {certifications.map((cert, i) => (
              <button
                key={cert.id}
                type="button"
                onClick={() => ring.goTo(i)}
                aria-label={cert.title}
                aria-current={i === ring.front}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === ring.front ? 'w-6 bg-signal' : 'w-2 bg-ink/15 hover:bg-ink/30'
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
        <p className="mt-3 min-h-[1.25rem] text-center text-xs text-ink-faint" aria-live="polite">
          {frontCert ? (
            <>
              <span className="font-semibold text-ink">{frontCert.title}</span> · {frontCert.issuer}
            </>
          ) : null}
        </p>
      </div>

      {/* Flip view: a copy of the tapped card flies from its spot on the ring
          to the centre and turns over to show the credential details. */}
      <AnimatePresence onExitComplete={() => setHiddenIndex(null)}>
        {open && openCert ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(null)}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
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
                  className={`${faceClass} absolute inset-0 overflow-y-auto [backface-visibility:hidden] [transform:rotateY(180deg)]`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(null)}
                    aria-label="Close"
                    className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-ink/10 text-ink-soft hover:text-signal"
                  >
                    <X size={15} />
                  </button>
                  <span
                    className="self-start rounded-full px-2.5 py-1 text-[10px] font-semibold"
                    style={{ backgroundColor: `${kindMeta[openCert.kind].color}10`, color: kindMeta[openCert.kind].color }}
                  >
                    {kindMeta[openCert.kind].label}
                  </span>
                  <h3 className="mt-3 pr-8 font-display text-lg font-semibold leading-snug text-ink">{openCert.title}</h3>
                  <p className="mt-1 text-sm font-medium text-ink-soft">{openCert.issuer}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{openCert.detail}</p>

                  <dl className="mt-4 text-xs">
                    <div className="flex justify-between border-t border-ink/10 py-2.5">
                      <dt className="text-ink-faint">Issued</dt>
                      <dd className="font-semibold text-ink">{openCert.issued}</dd>
                    </div>
                    {openCert.credentialId ? (
                      <div className="flex justify-between gap-4 border-t border-ink/10 py-2.5">
                        <dt className="shrink-0 text-ink-faint">Credential ID</dt>
                        <dd className="break-all text-right font-mono font-semibold text-ink">{openCert.credentialId}</dd>
                      </div>
                    ) : null}
                  </dl>

                  {openCert.verifyUrl || openCert.assetUrl ? (
                    <div className="mt-auto flex flex-wrap gap-2">
                      {openCert.verifyUrl ? (
                        <a
                          href={openCert.verifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:-translate-y-0.5"
                        >
                          Verify <ExternalLink size={13} />
                        </a>
                      ) : null}
                      {openCert.assetUrl ? (
                        <a
                          href={openCert.assetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 self-start rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink transition hover:-translate-y-0.5"
                        >
                          View certificate <FileText size={13} />
                        </a>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
