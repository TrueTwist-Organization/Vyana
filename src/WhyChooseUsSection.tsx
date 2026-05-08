import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Building2, ShieldCheck, Handshake, KeyRound } from 'lucide-react';

type Tier = 'raise' | 'lower';
type Kind = 'icon' | 'visual';

const REASONS: {
  step: string;
  kind: Kind;
  tier: Tier;
  /** Full-bleed front photo (served from /public/assets) */
  frontImage: string;
  Icon?: LucideIcon;
  title: string;
  description: string;
  backHint: string;
}[] = [
  {
    step: '01',
    kind: 'icon',
    tier: 'lower',
    Icon: Building2,
    frontImage: '/assets/residential.png',
    title: 'Deep local expertise',
    description:
      'We live the Ahmedabad market—inventory, pricing, and growth corridors—so every recommendation is grounded in real data, not generic brochures.',
    backHint: 'Hyper-local insight. Better decisions.',
  },
  {
    step: '02',
    kind: 'visual',
    tier: 'raise',
    Icon: ShieldCheck,
    frontImage: '/assets/commercial.png',
    title: 'Transparent advisory',
    description:
      'Clear timelines, honest numbers, and paperwork you can trust. You always know where your deal stands and what comes next.',
    backHint: 'No surprises—only clarity.',
  },
  {
    step: '03',
    kind: 'icon',
    tier: 'lower',
    Icon: Handshake,
    frontImage: '/assets/investment.png',
    title: 'Builder-aligned, buyer-first',
    description:
      'Strong relationships with trusted developers mean early access and smoother closing—without ever compromising your interests.',
    backHint: 'Access and integrity together.',
  },
  {
    step: '04',
    kind: 'visual',
    tier: 'raise',
    Icon: KeyRound,
    frontImage: '/assets/farmhouse.png',
    title: 'End-to-end journey',
    description:
      'From first search and site visits to financing clarity and handover—we stay beside you until you step through the door.',
    backHint: 'From search to keys—one partner.',
  },
];

const MARQUEE_PAUSE_MS = 2600;
/** Pixels per second when auto-scrolling */
const MARQUEE_SPEED = 34;

function useHoverFinePointer() {
  const [ok, setOk] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)').matches : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const apply = () => setOk(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);
  return ok;
}

function WhyChooseFlipCard({
  item,
  index,
  reduceMotion,
  useHoverFlip,
}: {
  item: (typeof REASONS)[number];
  index: number;
  reduceMotion: boolean;
  useHoverFlip: boolean;
}) {
  const [flipped, setFlipped] = useState(false);

  const setIn = useCallback(() => {
    if (useHoverFlip) setFlipped(true);
  }, [useHoverFlip]);

  const setOut = useCallback(() => {
    if (useHoverFlip) setFlipped(false);
  }, [useHoverFlip]);

  const toggleClick = useCallback(() => {
    if (!useHoverFlip) setFlipped((f) => !f);
  }, [useHoverFlip]);

  const spring = reduceMotion ? { duration: 0 } : { type: 'spring' as const, stiffness: 76, damping: 18 };

  const faceBase = `why-choose-face why-choose-face--${item.kind}`;

  return (
    <motion.div
      className={`why-choose-timeline-item-wrap why-choose-timeline-item-wrap--${item.tier}`}
      animate={reduceMotion ? undefined : { y: [0, -7, 0] }}
      transition={{
        y: {
          repeat: Infinity,
          duration: 4.8 + index * 0.35,
          ease: 'easeInOut',
          delay: index * 0.25,
        },
      }}
    >
      <motion.div
        className="why-choose-timeline-card"
        initial={reduceMotion ? undefined : { opacity: 0, x: 64, rotateZ: -2.5 }}
        whileInView={{ opacity: 1, x: 0, rotateZ: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{
          opacity: {
            duration: reduceMotion ? 0 : 0.55,
            delay: reduceMotion ? 0 : 0.1 * index,
            ease: [0.22, 1, 0.36, 1],
          },
          x: {
            duration: reduceMotion ? 0 : 0.55,
            delay: reduceMotion ? 0 : 0.1 * index,
            ease: [0.22, 1, 0.36, 1],
          },
          rotateZ: {
            duration: reduceMotion ? 0 : 0.55,
            delay: reduceMotion ? 0 : 0.1 * index,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
      >
        <div
          className="why-choose-flip-scene"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseEnter={setIn}
          onMouseLeave={setOut}
          onClick={toggleClick}
          onKeyDown={(e) => {
            if (!useHoverFlip && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              toggleClick();
            }
          }}
          role="button"
          tabIndex={0}
          aria-pressed={flipped}
          aria-label={`${item.title}. ${useHoverFlip ? 'Hover to flip' : 'Press to flip'} for details.`}
        >
          <motion.div
            className="why-choose-flip"
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={spring}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`${faceBase} why-choose-face--front`}>
              <div
                className="why-choose-front-photo"
                style={{ backgroundImage: `url(${item.frontImage})` }}
                aria-hidden
              />
              {item.kind === 'icon' && item.Icon ? (
                <>
                  <div className="why-choose-front-photo-shade why-choose-front-photo-shade--icon" aria-hidden />
                  <div className="why-choose-front-inner why-choose-front-inner--icon">
                    <div className="why-choose-icon-ring" aria-hidden>
                      <item.Icon className="why-choose-icon" strokeWidth={1.35} />
                    </div>
                    <h3 className="why-choose-card-title">{item.title}</h3>
                    <p className="why-choose-card-teaser">{item.backHint}</p>
                    <span className="why-choose-step">{item.step}</span>
                  </div>
                </>
              ) : (
                <div className="why-choose-vis-overlay">
                  {item.Icon ? (
                    <div className="why-choose-icon-ring why-choose-icon-ring--float" aria-hidden>
                      <item.Icon className="why-choose-icon" strokeWidth={1.35} />
                    </div>
                  ) : null}
                  <h3 className="why-choose-card-title why-choose-card-title--on-visual">{item.title}</h3>
                  <span className="why-choose-step why-choose-step--on-visual">{item.step}</span>
                </div>
              )}
            </div>

            <div className={`${faceBase} why-choose-face--back`}>
              <span className="why-choose-step why-choose-step--back">{item.step}</span>
              <h3 className="why-choose-card-title why-choose-card-title--back">{item.title}</h3>
              <p className="why-choose-card-text why-choose-card-text--back">{item.description}</p>
              <p className="why-choose-flip-hint">{useHoverFlip ? 'Hover away to return' : 'Tap again to return'}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function WhyChooseUsSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const useHoverFlip = useHoverFinePointer();
  const trackRef = useRef<HTMLDivElement>(null);
  const chunkRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const userPauseUntilRef = useRef(0);

  const bumpUserPause = useCallback(() => {
    userPauseUntilRef.current = performance.now() + MARQUEE_PAUSE_MS;
  }, []);

  useEffect(() => {
    const rail = trackRef.current;
    const chunk = chunkRef.current;
    if (!rail || !chunk) return;

    let chunkWidth = 0;
    let rafId = 0;
    let prev = performance.now();
    let startX = 0;
    let startScroll = 0;

    const measure = () => {
      const next = chunk.nextElementSibling;
      chunkWidth =
        next instanceof HTMLElement && next.classList.contains('why-choose-marquee-chunk')
          ? next.offsetLeft - chunk.offsetLeft
          : chunk.offsetWidth;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(chunk);
    ro.observe(rail);

    const onPointerDown = (e: PointerEvent) => {
      bumpUserPause();
      if (e.pointerType === 'touch') return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      draggingRef.current = true;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add('why-choose-timeline-track--dragging');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      rail.scrollLeft = startScroll - (e.clientX - startX);
    };

    const onPointerUp = () => {
      draggingRef.current = false;
      rail.classList.remove('why-choose-timeline-track--dragging');
    };

    const onTouchStart = () => bumpUserPause();
    const onWheel = () => bumpUserPause();

    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.064);
      prev = now;

      if (
        !reduceMotion &&
        chunkWidth > 1 &&
        performance.now() >= userPauseUntilRef.current &&
        !draggingRef.current
      ) {
        let next = rail.scrollLeft + MARQUEE_SPEED * dt;
        while (next >= chunkWidth) next -= chunkWidth;
        rail.scrollLeft = next;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    rail.addEventListener('pointerdown', onPointerDown);
    rail.addEventListener('pointermove', onPointerMove);
    rail.addEventListener('pointerup', onPointerUp);
    rail.addEventListener('pointercancel', onPointerUp);
    rail.addEventListener('touchstart', onTouchStart, { passive: true });
    rail.addEventListener('touchend', bumpUserPause, { passive: true });
    rail.addEventListener('wheel', onWheel, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      rail.removeEventListener('pointerdown', onPointerDown);
      rail.removeEventListener('pointermove', onPointerMove);
      rail.removeEventListener('pointerup', onPointerUp);
      rail.removeEventListener('pointercancel', onPointerUp);
      rail.removeEventListener('touchstart', onTouchStart);
      rail.removeEventListener('touchend', bumpUserPause);
      rail.removeEventListener('wheel', onWheel);
    };
  }, [reduceMotion, bumpUserPause]);

  return (
    <section className="why-choose-section" id="why-choose" aria-labelledby="why-choose-heading">
      <div className="why-choose-inner why-choose-inner--timeline">
        <motion.div
          className="why-choose-header"
          initial={reduceMotion ? undefined : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-48px' }}
          transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="why-choose-kicker font-bold uppercase section-kicker">WHY VYANA</p>
          <h2 id="why-choose-heading" className="why-choose-title font-artful px-2 section-display-title why-choose-elite-title">
            <span className="section-title-word why-choose-title-part" style={{ display: 'inline-block' }}>
              Why Choose{' '}
            </span>
            <span
              className="section-title-word section-title-word--gold why-choose-title-part"
              style={{ display: 'inline-block' }}
            >
              Us
            </span>
          </h2>
          <p className="why-choose-lead">
            Premium real estate guidance with the warmth of a dedicated partner—crafted for buyers and investors who expect
            more than a listing page.
          </p>
        </motion.div>

        <div className="why-choose-timeline-panel">
          <div
            ref={trackRef}
            className="why-choose-timeline-track"
            role="region"
            aria-label="Why choose Vyana—auto-scrolls; swipe or drag horizontally to explore"
          >
            <div ref={chunkRef} className="why-choose-marquee-chunk">
              {REASONS.map((item, i) => (
                <WhyChooseFlipCard
                  key={`${item.step}-a`}
                  item={item}
                  index={i}
                  reduceMotion={reduceMotion}
                  useHoverFlip={useHoverFlip}
                />
              ))}
              <div className="why-choose-marquee-tail" aria-hidden />
            </div>
            <div className="why-choose-marquee-chunk" aria-hidden="true">
              {REASONS.map((item, i) => (
                <WhyChooseFlipCard
                  key={`${item.step}-b`}
                  item={item}
                  index={i}
                  reduceMotion={reduceMotion}
                  useHoverFlip={useHoverFlip}
                />
              ))}
              <div className="why-choose-marquee-tail" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
