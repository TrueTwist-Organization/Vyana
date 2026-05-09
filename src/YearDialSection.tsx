import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './year-dial-section.css';

type Chapter = {
  year: number;
  phaseTitle: string;
  eliteTitle: boolean;
  stats: [{ num: string; label: string }, { num: string; label: string }];
  tags: string[];
  quote: string;
  details: [string, string, string];
  videoUrl: string;
};

const CHAPTERS: Chapter[] = [
  {
    year: 2015,
    phaseTitle: 'Foundation Year',
    eliteTitle: false,
    stats: [
      { num: '2015', label: 'Est. Year' },
      { num: '3', label: 'Core Team' },
    ],
    tags: ['Residential', 'Ahmedabad', 'Advisory'],
    quote:
      'Vyana began as a focused residential advisory — built on transparent conversations and long-term relationships over quick commissions.',
    details: [
      'Focused exclusively on Ahmedabad residential market',
      'Careful shortlisting over volume-driven sales',
      'Transparent pricing as core brand promise',
    ],
    videoUrl: '/video for vyana/residantial/download.mp4',
  },
  {
    year: 2017,
    phaseTitle: 'Building Trust',
    eliteTitle: false,
    stats: [
      { num: '500+', label: 'Clients' },
      { num: '98%', label: 'Referrals' },
    ],
    tags: ['Repeat Clients', 'Neighbourhoods', 'Benchmarks'],
    quote:
      'Deepened inventory knowledge across builders and neighbourhoods — earning repeat clients through honest pricing and consistent follow-through.',
    details: [
      'Expanded builder relationships across 8+ micro-markets',
      'Repeat client rate exceeded industry average by 3x',
      'Introduced honest pricing benchmark reports',
    ],
    videoUrl: '/video for vyana/residantial/download (2).mp4',
  },
  {
    year: 2019,
    phaseTitle: 'Expansion Phase',
    eliteTitle: false,
    stats: [
      { num: '3×', label: 'Business Growth' },
      { num: '₹200Cr+', label: 'Transactions' },
    ],
    tags: ['Commercial', 'Investment', 'Mandates'],
    quote:
      'Commercial mandates and investment-led transactions joined core residential work — same documentation discipline, bigger scope.',
    details: [
      'Launched commercial advisory vertical',
      'First investment-grade property mandate closed',
      'Documentation-first approach adopted companywide',
    ],
    videoUrl: '/video for vyana/comracial/c1.mp4',
  },
  {
    year: 2021,
    phaseTitle: 'Digital Growth',
    eliteTitle: false,
    stats: [
      { num: '12', label: 'Cities' },
      { num: '10K+', label: 'Leads/Year' },
    ],
    tags: ['Digital Listings', 'Marketing', 'Lead Workflows'],
    quote:
      'Digital listings and structured marketing augmented on-ground visits — busy clients could move faster without losing clarity.',
    details: [
      'Launched structured digital listing portal',
      'CRM-based lead management introduced',
      'Virtual site tours enabled remote buyers',
    ],
    videoUrl: '/video for vyana/comracial/c10.mp4',
  },
  {
    year: 2024,
    phaseTitle: 'Elite Portfolio',
    eliteTitle: true,
    stats: [
      { num: '1200+', label: 'Properties Closed' },
      { num: '9', label: 'Years Strong' },
    ],
    tags: ['Luxury', 'Premium Mandates', 'Investment'],
    quote:
      "Premium investment properties and luxury residential mandates — Vyana's most curated collection yet, for clients who expect the exceptional.",
    details: [
      'Launched The Elite Collection — curated luxury inventory',
      'Average transaction value up 4x since founding',
      'City-wide mandates across residential and commercial',
    ],
    videoUrl: '/video for vyana/industrial/Vyana Reality (1).mp4',
  },
];

const YEARS = [2015, 2017, 2019, 2021, 2024] as const;
const CHAPTER_LABELS = ['Foundation', 'Trust', 'Expansion', 'Digital', 'Elite'] as const;
const PROGRESS_PERCENTS = [20, 40, 60, 80, 100] as const;

export function YearDialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const dialRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const positionPill = useCallback(() => {
    const dial = dialRef.current;
    const pill = pillRef.current;
    const btn = btnRefs.current[activeIndex];
    if (!dial || !pill || !btn) return;
    const trackRect = dial.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    pill.style.left = `${btnRect.left - trackRect.left}px`;
    pill.style.width = `${btnRect.width}px`;
  }, [activeIndex]);

  useLayoutEffect(() => {
    positionPill();
  }, [activeIndex, positionPill]);

  useEffect(() => {
    const onResize = () => positionPill();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [positionPill]);

  const setIndex = (i: number) => {
    if (i === activeIndex || i < 0 || i >= CHAPTERS.length) return;
    setActiveIndex(i);
  };

  const ch = CHAPTERS[activeIndex];
  const n = activeIndex + 1;

  return (
    <section className="year-dial-section" aria-labelledby="year-dial-heading" id="year-dial">
      <div className="year-dial-root">
        <div className="year-dial-inner">
          <header className="yd-header">
            <p className="yd-eyebrow">Vyana Real Estate · Est. 2015</p>
            <h2 id="year-dial-heading" className="yd-title">
              <span className="yd-title-line1">A Decade of</span>
              <span className="yd-title-line2">Trusted Excellence</span>
            </h2>
            <p className="yd-subtitle">
              From first listings to city-wide mandates — how Vyana grew without outgrowing personal service.
            </p>
          </header>

          <div className="yd-dial-wrap">
            <div ref={dialRef} className="yd-dial" role="tablist" aria-label="Timeline by year">
              <span ref={pillRef} className="yd-dial-pill" aria-hidden="true" />
              {YEARS.map((y, i) => (
                <button
                  key={y}
                  type="button"
                  ref={(el) => {
                    btnRefs.current[i] = el;
                  }}
                  role="tab"
                  aria-selected={i === activeIndex}
                  className={`yd-dial-btn${i === activeIndex ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="yd-progress-wrap">
            <div className="yd-progress-track">
              <div className="yd-progress-fill" style={{ width: `${PROGRESS_PERCENTS[activeIndex]}%` }} />
            </div>
            <div className="yd-labels" role="tablist" aria-label="Timeline chapters">
              {CHAPTER_LABELS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  className={`yd-label-btn${i === activeIndex ? ' is-active' : ''}`}
                  onClick={() => setIndex(i)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="yd-portal-viewport">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="yd-portal-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Large Background Year Outline */}
                <motion.div
                  className="yd-bg-year-outline"
                  initial={{ opacity: 0, scale: 0.8, y: 100 }}
                  animate={{ opacity: 0.1, scale: 1, y: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  {ch.year}
                </motion.div>

                <div className="yd-portal-grid">
                  <div className="yd-portal-left">
                    <motion.div
                      className="yd-chapter-tag"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <span className="yd-gold-dot" />
                      CHAPTER {String(n).padStart(2, '0')}
                    </motion.div>

                    <div className="yd-portal-title-wrap">
                      <motion.h3
                        className={`yd-portal-title${ch.eliteTitle ? ' is-elite-glow' : ''}`}
                        initial={{ opacity: 0, filter: 'blur(20px)', y: 30 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      >
                        {ch.phaseTitle}
                      </motion.h3>
                    </div>

                    <div className="yd-portal-stats">
                      {ch.stats.map((stat, idx) => (
                        <motion.div
                          key={stat.label}
                          className="yd-stat-pill"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                          <span className="yd-stat-val">{stat.num}</span>
                          <span className="yd-stat-key">{stat.label}</span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.p
                      className="yd-portal-quote"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {ch.quote}
                    </motion.p>
                  </div>

                  <div className="yd-portal-right">
                    <div className="yd-cinematic-frame">
                      <div className="yd-frame-corner top-left" />
                      <div className="yd-frame-corner top-right" />
                      <div className="yd-frame-corner bottom-left" />
                      <div className="yd-frame-corner bottom-right" />

                      <motion.video
                        key={ch.videoUrl}
                        className="yd-portal-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        initial={{ scale: 1.2, filter: 'grayscale(1) brightness(0.5)' }}
                        animate={{ scale: 1, filter: 'grayscale(0) brightness(1)' }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <source src={ch.videoUrl} type="video/mp4" />
                      </motion.video>
                    </div>
                  </div>
                </div>

                <div className="yd-portal-tags">
                  {ch.tags.map((t, idx) => (
                    <motion.span
                      key={t}
                      className="yd-portal-tag"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + idx * 0.05 }}
                    >
                      {t}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
