import type { LucideIcon } from 'lucide-react';
import { BarChart4, CheckCircle2, Search, Users } from 'lucide-react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useEffect } from 'react';
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

export function ProcessRibbonSection() {
  const reduceMotion = useReducedMotion() ?? false;
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 0.88', 'end 0.12'],
  });

  // Infinite Auto-Scroll Logic
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    const scrollSpeed = 1.0; // Slightly faster for visibility

    const animate = () => {
      if (!isPaused.current) {
        scrollContainer.scrollLeft += scrollSpeed;
        
        // Loop back to start when half-way through the doubled content
        const halfWidth = scrollContainer.scrollWidth / 2;
        if (scrollContainer.scrollLeft >= halfWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const drawProgress = useSpring(scrollYProgress, {
    stiffness: reduceMotion ? 9999 : 90,
    damping: reduceMotion ? 9999 : 28,
    restDelta: 0.0004,
  });

  const pathLength = useTransform(drawProgress, [0, 1], [0, 1]);
  void pathLength;

  return (
    <section className="pr-section" aria-labelledby="pr-heading" id="vyana-process">
      <div className="pr-glow" aria-hidden />
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

        <div 
          className="pr-horizontal-track-container" 
          onMouseEnter={() => { isPaused.current = true; }}
          onMouseLeave={() => { isPaused.current = false; }}
        >
          <svg className="pr-horizontal-spine" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <path d="M0 50 Q 250 20, 500 50 T 1000 50" fill="none" stroke="rgba(196,142,42,0.3)" strokeWidth="1" />
          </svg>

          <div className="pr-horizontal-scroll" ref={scrollRef}>
            {/* Double the steps for a seamless infinite loop */}
            {[...STEPS, ...STEPS].map((step, i) => {
              const Icon = step.Icon;
              const isVideoStep = i % 2 === 0;
              void isVideoStep;
              return (
                <div key={`${step.num}-${i}`} className="pr-horiz-step-group">
                  {/* Main Journey Card FIRST */}
                  <motion.div 
                    className="pr-horiz-step is-video-step"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: (i % STEPS.length) * 0.1 + 0.1 }}
                  >
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
                  </motion.div>

                  {/* Informational Label Card SECOND */}
                  <div key={`${step.num}-label-${i}`} className="pr-label-card">
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
          </div>
        </div>
      </div>
    </section>
  );
}
