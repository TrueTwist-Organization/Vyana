import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './year-dial-section.css';

type Chapter = {
  year: number;
  phaseTitle: string;
  eliteTitle: boolean;
  stats: [{ num: string; label: string }, { num: string; label: string }];
  tags: string[];
  quote: string;
  details: [string, string, string];
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
  },
];

const YEARS = [2015, 2017, 2019, 2021, 2024] as const;
const CHAPTER_LABELS = ['Foundation', 'Trust', 'Expansion', 'Digital', 'Elite'] as const;
const PROGRESS_PERCENTS = [20, 40, 60, 80, 100] as const;

export function YearDialSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
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
    setIsSwitching(true);
    window.setTimeout(() => {
      setActiveIndex(i);
      setIsSwitching(false);
    }, 220);
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

          <div className={`yd-content${isSwitching ? ' is-switching' : ''}`} aria-live="polite">
            <div className="yd-col-left">
              <p className="yd-chapter-meta">
                Chapter {String(n).padStart(2, '0')} of 05
              </p>
              <h3 className={`yd-phase-title${ch.eliteTitle ? ' is-elite' : ''}`}>{ch.phaseTitle}</h3>
              <div className="yd-stats">
                <div>
                  <div className="yd-stat-num">{ch.stats[0].num}</div>
                  <div className="yd-stat-label">{ch.stats[0].label}</div>
                </div>
                <div>
                  <div className="yd-stat-num">{ch.stats[1].num}</div>
                  <div className="yd-stat-label">{ch.stats[1].label}</div>
                </div>
              </div>
              <div className="yd-tags">
                {ch.tags.map((t) => (
                  <span key={t} className="yd-tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="yd-divider" aria-hidden="true" />
            <div className="yd-col-right">
              <div className="yd-ghost-year">{ch.year}</div>
              <blockquote className="yd-quote">{ch.quote}</blockquote>
              <ul className="yd-details">
                {ch.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
