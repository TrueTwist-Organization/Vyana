import type { LucideIcon } from 'lucide-react';
import { BarChart4, CheckCircle2, Search, Users } from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring, type MotionValue } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import './process-ribbon.css';

type Step = {
  num: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  videoUrl: string;
};

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Discovery',
    Icon: Search,
    videoUrl: '/assets/video-journey/d-1.mp4',
    body: 'We understand your requirements and find the perfect match from our exclusive listings.',
  },
  {
    num: '02',
    title: 'Site visits',
    Icon: Users,
    videoUrl: '/assets/video-journey/s-2.mp4',
    body: 'We arrange curated, personalised tours of selected properties at your convenience.',
  },
  {
    num: '03',
    title: 'Negotiation',
    Icon: BarChart4,
    videoUrl: '/assets/video-journey/n-3.mp4',
    body: 'Our legal and financial experts ensure the best terms and price engineering for you.',
  },
  {
    num: '04',
    title: 'Handover',
    Icon: CheckCircle2,
    videoUrl: '/assets/video-journey/k-4.mp4',
    body: 'Smooth documentation, clear titles, and an exquisite handover ceremony for your new legacy.',
  },
];

/** One dot whose colour tracks a slice of the parent's scrollYProgress. */
function ProgressDot({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) {
  const bg = useTransform(
    progress,
    [index / total, (index + 1) / total],
    ['rgba(196,142,42,0.25)', 'rgba(196,142,42,1)'],
  );
  return <motion.div className="pr-progress-dot" style={{ backgroundColor: bg }} />;
}

function ProgressDots({ progress, total }: { progress: MotionValue<number>; total: number }) {
  return (
    <div className="pr-progress-dots" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <ProgressDot key={i} progress={progress} index={i} total={total} />
      ))}
    </div>
  );
}

export function ProcessRibbonSection() {
  const reduceMotion = useReducedMotion() ?? false;

  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollXPx, setScrollXPx] = useState(0);
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false,
  );

  useEffect(() => {
    const measure = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!trackRef.current || mobile) return;
      setScrollXPx(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollXPx]);
  const x = useSpring(rawX, {
    stiffness: reduceMotion ? 9999 : 120,
    damping: reduceMotion ? 9999 : 30,
    mass: 0.5,
  });

  /* On mobile: natural height (no scroll budget needed).
     On desktop: 100vh sticky + card strip travel.          */
  const outerStyle = isMobile
    ? { position: 'relative' as const }
    : { height: `calc(100vh + ${scrollXPx}px)`, position: 'relative' as const };

  const StepCards = () => (
    <>
      {STEPS.map((step, i) => {
        const Icon = step.Icon;
        return (
          <div key={step.num} className="pr-horiz-step-group">
            <div className={`pr-horiz-step${i % 2 === 0 ? ' pr-horiz-step--up' : ' pr-horiz-step--down'}`}>
              <div className="pr-card-wrapper">
                <div className="pr-card-main">
                  <video
                    className="pr-card-video"
                    src={step.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="pr-card-overlay" />
                  <div className="pr-card-icon-box">
                    <Icon size={54} className="pr-card-icon" />
                  </div>
                  <div className="pr-card-footer">
                    <h3 className="pr-card-title">{step.title}</h3>
                    <span className="pr-card-num">{step.num}</span>
                  </div>
                </div>
                <div className="pr-card-description">
                  <p>{step.body}</p>
                </div>
              </div>
            </div>

            <div className="pr-label-card">
              <div className="pr-label-header">
                <span className="pr-label-step">STEP {step.num}</span>
                <div className="pr-label-dot" />
              </div>
              <h3 className="pr-label-title">{step.title}</h3>
              <p className="pr-label-body">{step.body}</p>
            </div>
          </div>
        );
      })}
    </>
  );

  const Header = () => (
    <div className="pr-inner">
      <motion.header
        className="pr-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="pr-kicker">THE EXPERIENCE</p>
        <h2 id="pr-heading" className="pr-title">
          YOUR JOURNEY WITH <span className="pr-gold-text">VYANA</span>
        </h2>
        <p className="pr-lead">
          A deliberate four-stage process—transparent, discreet, and built for outcomes that last.
        </p>
      </motion.header>
    </div>
  );

  /* ── Mobile: plain vertical layout, no sticky, no scroll-jacking ── */
  if (isMobile) {
    return (
      <section className="pr-section-mobile" aria-labelledby="pr-heading" id="vyana-process">
        <div className="pr-glow" aria-hidden />
        <Header />
        <div className="pr-mobile-grid">
          {STEPS.map((step, i) => {
            const Icon = step.Icon;
            return (
              <motion.div
                key={step.num}
                className="pr-mobile-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="pr-card-main">
                  <video
                    className="pr-card-video"
                    src={step.videoUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  <div className="pr-card-overlay" />
                  <div className="pr-card-icon-box">
                    <Icon size={40} className="pr-card-icon" />
                  </div>
                  <div className="pr-card-footer">
                    <h3 className="pr-card-title">{step.title}</h3>
                    <span className="pr-card-num">{step.num}</span>
                  </div>
                </div>
                <div className="pr-mobile-card-info">
                  <span className="pr-label-step">STEP {step.num}</span>
                  <h3 className="pr-label-title">{step.title}</h3>
                  <p className="pr-label-body">{step.body}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    );
  }

  /* ── Desktop: sticky + scroll-driven horizontal ── */
  return (
    <div ref={outerRef} style={outerStyle}>
      <div className="pr-sticky-panel">
        <div className="pr-glow" aria-hidden />
        <Header />

        <div className="pr-horiz-viewport">
          <motion.div
            ref={trackRef}
            className="pr-horiz-track"
            style={reduceMotion ? undefined : { x }}
          >
            <StepCards />
          </motion.div>
        </div>

        <ProgressDots progress={scrollYProgress} total={STEPS.length} />
      </div>
    </div>
  );
}
