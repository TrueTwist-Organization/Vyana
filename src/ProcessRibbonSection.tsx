import type { LucideIcon } from 'lucide-react';
import { FileCheck, Handshake, Key, Search } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef } from 'react';
import './process-ribbon.css';

type Step = {
  num: string;
  title: string;
  body: string;
  side: 'left' | 'right';
  foldTilt: 'left' | 'right';
  ribbonShift: 'right' | 'left';
  Icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Discovery',
    side: 'right',
    foldTilt: 'right',
    ribbonShift: 'right',
    Icon: Search,
    body:
      'We understand your requirements and find the perfect match from our exclusive listings.',
  },
  {
    num: '02',
    title: 'Site visits',
    side: 'left',
    foldTilt: 'left',
    ribbonShift: 'left',
    Icon: Handshake,
    body:
      'We arrange curated, personalised tours of selected properties at your convenience.',
  },
  {
    num: '03',
    title: 'Negotiation',
    side: 'right',
    foldTilt: 'right',
    ribbonShift: 'right',
    Icon: Key,
    body:
      'Our legal and financial experts ensure the best terms and price engineering for you.',
  },
  {
    num: '04',
    title: 'Handover',
    side: 'left',
    foldTilt: 'left',
    ribbonShift: 'left',
    Icon: FileCheck,
    body:
      'Smooth documentation, clear titles, and an exquisite handover ceremony for your new legacy.',
  },
];

const springView = { type: 'spring' as const, stiffness: 68, damping: 17, mass: 0.88 };

/** Normalised S-spine: x swings 100±, y 0→100 (stretches with SVG height) */
const SPINE_D =
  'M 100 0.5 C 138 8, 152 16, 100 24 C 48 32, 32 42, 100 49 C 168 56, 172 66, 100 73 C 28 80, 38 90, 100 97 L 100 99.5';

export function ProcessRibbonSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.88', 'end 0.12'],
  });

  const drawProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 9999 : 90,
    damping: reduceMotion ? 9999 : 28,
    restDelta: 0.0004,
  });

  const pathLength = useTransform(drawProgress, [0, 1], [0, 1]);

  return (
    <section className="pr-section" aria-labelledby="pr-heading" id="vyana-process">
      <div className="pr-glow" aria-hidden />
      <div className="pr-inner">
        <motion.header
          className="pr-header"
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="pr-kicker font-bold uppercase section-kicker">The experience</p>
          <h2 id="pr-heading" className="pr-title font-artful px-2 section-display-title pr-elite-title">
            <span className="section-title-word pr-title-part" style={{ display: 'inline-block' }}>
              Your journey with{' '}
            </span>
            <span
              className="section-title-word section-title-word--gold pr-title-part"
              style={{ display: 'inline-block' }}
            >
              Vyana
            </span>
          </h2>
          <p className="pr-lead">
            A deliberate four-stage process—transparent, discreet, and built for outcomes that last.
          </p>
        </motion.header>

        <div className="pr-slot pr-slot--top" aria-hidden>
          <div className="pr-slot-lip" />
          <motion.span
            className="pr-tab"
            initial={reduceMotion ? false : { opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...springView, delay: 0.05 }}
          >
            Start
          </motion.span>
        </div>

        <div className="pr-track-shell">
          <svg
            className="pr-spine-svg"
            viewBox="0 0 200 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="pr-spine-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(196,142,42,0.18)" />
                <stop offset="45%" stopColor="rgba(196,142,42,0.5)" />
                <stop offset="100%" stopColor="rgba(196,142,42,0.14)" />
              </linearGradient>
              <filter id="pr-spine-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="0.8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <motion.path
              d={SPINE_D}
              fill="none"
              stroke="url(#pr-spine-grad)"
              strokeWidth="1.15"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#pr-spine-glow)"
              pathLength={reduceMotion ? 1 : pathLength}
            />
          </svg>

          <div className="pr-track" ref={trackRef} role="list">
            {STEPS.map((step, i) => {
              const Icon = step.Icon;
              const isLast = i === STEPS.length - 1;
              const textFromX = step.side === 'right' ? 48 : -48;
              const labelDelay = reduceMotion ? 0 : 0.05 + i * 0.07;
              const bodyDelay = reduceMotion ? 0 : 0.14 + i * 0.07;

              return (
                <article
                  key={step.num}
                  role="listitem"
                  className={`pr-step pr-step--text-${step.side} pr-step--z-${i % 2}`}
                >
                  <div className="pr-step-grid">
                    <motion.div
                      className="pr-text"
                      initial={reduceMotion ? false : { opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, margin: '-8% 0px', amount: 0.35 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                    >
                      <motion.p
                        className="pr-step-label"
                        initial={reduceMotion ? false : { opacity: 0, x: textFromX }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-10% 0px', amount: 0.35 }}
                        transition={{ duration: 0.65, delay: labelDelay, ease: [0.22, 1, 0.36, 1] }}
                      >
                        Step {step.num}: {step.title}
                      </motion.p>
                      <motion.p
                        className="pr-step-body"
                        initial={reduceMotion ? false : { opacity: 0, x: textFromX * 0.65 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-10% 0px', amount: 0.35 }}
                        transition={{ duration: 0.72, delay: bodyDelay, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {step.body}
                      </motion.p>
                    </motion.div>

                    <div
                      className={`pr-ribbon-col pr-ribbon-col--${step.ribbonShift}${isLast ? '' : ' pr-ribbon-col--flow'}`}
                    >
                      {i > 0 ? (
                        <svg
                          className={`pr-swoosh pr-swoosh--${step.foldTilt}`}
                          viewBox="0 0 120 28"
                          preserveAspectRatio="none"
                          aria-hidden
                        >
                          <defs>
                            <linearGradient id={`pr-sw-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgba(196,142,42,0)" />
                              <stop offset="42%" stopColor="rgba(196,142,42,0.38)" />
                              <stop offset="100%" stopColor="rgba(196,142,42,0.08)" />
                            </linearGradient>
                          </defs>
                          <motion.path
                            d={
                              step.foldTilt === 'right'
                                ? 'M0 14 C32 3, 62 26, 120 14'
                                : 'M120 14 C88 3, 58 26, 0 14'
                            }
                            fill="none"
                            stroke={`url(#pr-sw-${i})`}
                            strokeWidth="2.25"
                            vectorEffect="non-scaling-stroke"
                            initial={reduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
                            whileInView={{ pathLength: 1 }}
                            viewport={{ once: true, amount: 0.55 }}
                            transition={{
                              duration: reduceMotion ? 0 : 1.15,
                              ease: [0.22, 1, 0.36, 1],
                              delay: reduceMotion ? 0 : 0.06 + i * 0.04,
                            }}
                          />
                        </svg>
                      ) : null}

                      <div className={`pr-fold-3d pr-fold-3d--${step.foldTilt}`}>
                        <span className="pr-fold-thickness" aria-hidden />
                        <span className="pr-fold-shadow" aria-hidden />
                        <motion.div
                          className={`pr-fold pr-fold--tilt-${step.foldTilt}`}
                          initial={reduceMotion ? false : { opacity: 0, rotateX: 14, y: 28, z: -20 }}
                          whileInView={{ opacity: 1, rotateX: 0, y: 0, z: 0 }}
                          viewport={{ once: true, margin: '-10%', amount: 0.4 }}
                          transition={{ ...springView, delay: reduceMotion ? 0 : 0.1 + i * 0.05 }}
                          style={{ transformStyle: 'preserve-3d' }}
                          whileHover={
                            reduceMotion
                              ? undefined
                              : {
                                  rotateX: -3,
                                  y: -4,
                                  transition: { type: 'spring', stiffness: 400, damping: 22 },
                                }
                          }
                        >
                          <div className="pr-fold-highlight" aria-hidden />
                          <div className="pr-fold-edge pr-fold-edge--left" aria-hidden />
                          <div className="pr-fold-edge pr-fold-edge--right" aria-hidden />
                          <span className="pr-fold-num">{step.num}</span>
                          <span className="pr-fold-title">{step.title}</span>
                        </motion.div>
                      </div>

                      <motion.div
                        className="pr-badge"
                        initial={
                          reduceMotion ? false : { scale: 0.5, opacity: 0, rotate: -28 }
                        }
                        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ ...springView, delay: reduceMotion ? 0 : 0.16 + i * 0.06 }}
                        whileHover={
                          reduceMotion
                            ? undefined
                            : {
                                scale: 1.06,
                                rotate: [0, -6, 6, 0],
                                transition: { duration: 0.55, ease: 'easeInOut' },
                              }
                        }
                      >
                        <motion.span
                          className="pr-badge-inner"
                          animate={
                            reduceMotion
                              ? undefined
                              : { y: [0, -2.5, 0] }
                          }
                          transition={{
                            duration: 3.6 + i * 0.35,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.2,
                          }}
                        >
                          <Icon className="pr-badge-icon" strokeWidth={1.35} aria-hidden />
                        </motion.span>
                      </motion.div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="pr-slot pr-slot--bottom" aria-hidden>
          <motion.span
            className="pr-tab pr-tab--bottom"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ ...springView, delay: 0.05 }}
          >
            Stop
          </motion.span>
          <div className="pr-slot-lip pr-slot-lip--bottom" />
        </div>
      </div>
    </section>
  );
}
