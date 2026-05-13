import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Routes, Route, Navigate, useNavigate, useParams, Link, useLocation } from 'react-router-dom';
import { ChevronRight, MapPin, Menu, ChevronLeft, ChevronDown, Phone, Mail } from 'lucide-react';
import { HomeReveal } from './HomeReveal';
import { SiteFooter } from './SiteFooter';
import { PartnersSection } from './PartnersSection';
import { WhyChooseUsSection } from './WhyChooseUsSection';
import { YearDialSection } from './YearDialSection';
import { StrategicDominanceSection } from './StrategicDominanceSection';
import { ProcessRibbonSection } from './ProcessRibbonSection';
import {
  AboutUsPage,
  ContactUsPage,
  DisclaimerPage,
  PrivacyPage,
  ReraPage,
  TermsPage,
} from './LegalPages';
import {
  commercialClipsByTitle,
  industrialClipsByTitle,
  residentialClipsByTitle,
  type PropertyClip,
} from './vyanaVideoData';
import { WelcomeIntro } from './WelcomeIntro';

/** When false, main site still mounts (loads) but hero scroll video stays off so welcome intro is not starved. */
const IntroPlaybackContext = createContext<{ introComplete: boolean }>({ introComplete: true });

// --- DATA ---

type SubLocation = {
  title: string;
  price: string;
  region: string;
  location: string;
  img: string;
  desc: string;
  /** 2–3 cinematic previews per micro-market; opens detail on click */
  clips?: PropertyClip[];
};

type Category = {
  title: string;
  id: string;
  desc: string;
  img: string;
  /** If true, carousel card does not navigate; /elite/:id shows coming soon */
  comingSoon?: boolean;
};

const categories: Category[] = [
  { title: 'Residential', id: '01', desc: 'Luxury living spaces designed for the elite.', img: '/assets/residential-cutout.png' },
  { title: 'Commercial', id: '02', desc: 'State-of-the-art office spaces in prime locations.', img: '/assets/commercial-cutout.png' },
  {
    title: 'Industrial',
    id: '03',
    desc: 'Industrial and warehousing in high-growth corridors.',
    img: '/assets/investment-cutout.png',
  },
  {
    title: 'Farmhouse',
    id: '04',
    desc: 'Coming soon — peaceful retreats away from the city hustle.',
    img: '/assets/farmhouse-cutout.png',
    comingSoon: true,
  },
];

/** Shared micro-markets for Residential & Commercial (order: Gota → Vaishnodevi → Shela → Thaltej → Bopal) */
const LOCATIONS_WEST_MICRO: SubLocation[] = [
  {
    title: 'Iscon',
    price: 'On request',
    region: 'South-West corridor',
    location: 'Iscon · Ahmedabad West',
    img: '/assets/commercial-cutout.png',
    desc: 'High-profile commercial and residential nexus with landmark connectivity and luxury hospitality hubs.',
  },
  {
    title: 'Vaishnodevi',
    price: 'On request',
    region: 'North corridor',
    location: 'Vaishnodevi · Ahmedabad North',
    img: '/assets/residential.png',
    desc: 'Premium pockets with estate-scale layouts and quick access to SP Ring Road and the northern growth axis.',
  },
  {
    title: 'Shela',
    price: 'On request',
    region: 'South corridor',
    location: 'Shela · Ahmedabad South',
    img: '/assets/farmhouse.png',
    desc: 'Low-rise enclaves and plotted communities with club living and calm, tree-lined avenues.',
  },
  {
    title: 'Thaltej',
    price: 'On request',
    region: 'Premier district',
    location: 'Thaltej · Ahmedabad',
    img: '/assets/investment.png',
    desc: 'Signature towers, private cores, sky amenities, and clear views over the western skyline.',
  },
  {
    title: 'Bopal',
    price: 'On request',
    region: 'Emerging district',
    location: 'Bopal · Ahmedabad West',
    img: '/assets/hero_bg.jpg',
    desc: 'Balanced mix of mid-rise living, retail frontage, and sustained rental and end-user demand.',
  },
];

/** Residential micro-market hero images (subset of west Ahmedabad) */
const RESIDENTIAL_LOCATION_IMAGES: Record<string, string> = {
  Shela: '/assets/residential-shela.png',
  Thaltej: '/assets/residential-thaltej.png',
};

const LOCATIONS_RESIDENTIAL: SubLocation[] = LOCATIONS_WEST_MICRO.map((loc) => ({
  ...loc,
  img: RESIDENTIAL_LOCATION_IMAGES[loc.title] ?? loc.img,
  clips: residentialClipsByTitle(loc.title, loc.desc),
}));

/** Commercial micro-market hero images (west Ahmedabad) */
const COMMERCIAL_LOCATION_IMAGES: Record<string, string> = {
  Bopal: '/assets/commercial-bopal.png',
  Thaltej: '/assets/commercial-thaltej.png',
  Shela: '/assets/commercial-shela.png',
  Vaishnodevi: '/assets/commercial-vaishnodevi.png',
  Iscon: '/assets/commercial-iscon.png',
};

const LOCATIONS_COMMERCIAL: SubLocation[] = LOCATIONS_WEST_MICRO.map((loc) => ({
  ...loc,
  img: COMMERCIAL_LOCATION_IMAGES[loc.title] ?? loc.img,
  clips: commercialClipsByTitle(loc.title, loc.desc),
}));

const LOCATIONS_INDUSTRIAL: SubLocation[] = [
  {
    title: 'Naroda',
    price: 'On request',
    region: 'Industrial belt',
    location: 'Naroda · Ahmedabad East',
    img: '/assets/industrial-naroda.png',
    desc: 'Established industrial belt with legacy manufacturing, logistics access, and redevelopment upside.',
  },
  {
    title: 'Sanand',
    price: 'On request',
    region: 'GIDC corridor',
    location: 'Sanand · Ahmedabad West',
    img: '/assets/industrial-sanand.png',
    desc: 'GIDC-led growth node with large-format warehousing, automotive adjacency, and Narmada corridor connectivity.',
  },
].map((loc) => ({
  ...loc,
  clips: industrialClipsByTitle(loc.title, loc.desc),
}));

const subLocationsByCategory: Record<string, SubLocation[]> = {
  '01': LOCATIONS_RESIDENTIAL,
  '02': LOCATIONS_COMMERCIAL,
  '03': LOCATIONS_INDUSTRIAL,
};

/** In-page anchor: same tab on home, navigate home + hash from other routes */
function HeaderHashLink({
  hashId,
  className,
  children,
  onNavigate,
}: {
  hashId: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const loc = useLocation();
  if (loc.pathname === '/') {
    return (
      <a
        href={`#${hashId}`}
        className={className}
        onClick={() => {
          onNavigate?.();
        }}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      to={{ pathname: '/', hash: hashId }}
      className={className}
      onClick={() => {
        onNavigate?.();
      }}
    >
      {children}
    </Link>
  );
}

// --- COMPONENTS ---

const AUTO_ADVANCE_MS = 3000;

function eliteBrandHeadline(categoryId: string): string {
  switch (categoryId) {
    case '02':
      return 'Own your office space';
    case '03':
      return 'Secure the right industrial footprint';
    case '01':
    default:
      return 'Own your next address';
  }
}

type SubCollectionProps = { category: Category; locations: SubLocation[]; onClear: () => void; initialRevealed?: boolean };

const immersiveBgVariants = {
  enter: (dir: number) => ({
    scale: 1.08,
    opacity: 0,
    x: dir >= 0 ? '5%' : '-5%',
  }),
  center: {
    scale: 1,
    opacity: 1,
    x: 0,
  },
  exit: (dir: number) => ({
    scale: 1.02,
    opacity: 0,
    x: dir >= 0 ? '-6%' : '6%',
  }),
};

const SubCollection = ({ category, locations, onClear, initialRevealed = false }: SubCollectionProps) => {
  const routerLocation = useLocation();
  const targetLocationName = routerLocation.state?.targetLocation;

  const initialIndex = useMemo(() => {
    if (targetLocationName) {
      const idx = locations.findIndex((l) => l.title === targetLocationName || l.location.includes(targetLocationName));
      if (idx !== -1) return idx;
    }
    return 0;
  }, [targetLocationName, locations]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Update active index if state changes while component is mounted
  useEffect(() => {
    if (targetLocationName) {
      const idx = locations.findIndex((l) => l.title === targetLocationName || l.location.includes(targetLocationName));
      if (idx !== -1) setActiveIndex(idx);
    }
  }, [targetLocationName, locations]);

  const [previewsRevealed, setPreviewsRevealed] = useState(initialRevealed);
  const [heroInView, setHeroInView] = useState(true);
  const [detailClip, setDetailClip] = useState<PropertyClip | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cardBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardsRailRef = useRef<HTMLDivElement>(null);
  const heroImmersiveRef = useRef<HTMLElement | null>(null);
  const prevHeroInViewRef = useRef(true);
  const blockCardClickRef = useRef(false);
  const advanceDirRef = useRef(1);
  const autoAdvanceActiveRef = useRef(true); // Track if auto-advance is still enabled

  const active = locations[activeIndex];
  const activeClips = active.clips ?? [];
  const bgStackZRef = useRef(0);
  const immersiveBgLayerZ = useMemo(() => {
    bgStackZRef.current += 1;
    return bgStackZRef.current;
  }, [activeIndex, category.id]);

  const resetAutoAdvance = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Stop auto-advance if disabled by user interaction, if only 1 location, or if previews are revealed
    if (!autoAdvanceActiveRef.current || locations.length <= 1 || previewsRevealed) return;

    timerRef.current = setInterval(() => {
      advanceDirRef.current = 1;
      setPreviewsRevealed(false);
      setActiveIndex((i) => (i + 1) % locations.length);
    }, AUTO_ADVANCE_MS);
  }, [locations.length, previewsRevealed]);

  const scrollActiveCardIntoView = useCallback(() => {
    const rail = cardsRailRef.current;
    const btn = cardBtnRefs.current[activeIndex];
    if (!rail || !btn) return;

    const row = rail.querySelector<HTMLElement>('.elite-immersive-cards');
    if (!row) return;

    const gapRaw = getComputedStyle(row).gap || getComputedStyle(row).columnGap || '0';
    const gapPx = Number.parseFloat(gapRaw) || 0;
    const cardW = btn.offsetWidth;
    if (cardW <= 0) return;
    const stride = cardW + gapPx;

    const approxVisible = Math.max(1, Math.floor(rail.clientWidth / stride));
    const visibleSlots = Math.min(3, approxVisible);
    const maxLeftIndex = Math.max(0, locations.length - visibleSlots);
    const centerBias = Math.floor(visibleSlots / 2);
    let leftIndex = activeIndex - centerBias;
    leftIndex = Math.max(0, Math.min(leftIndex, maxLeftIndex));

    const targetScroll = leftIndex * stride;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.scrollLeft = Math.min(targetScroll, maxScroll);
  }, [activeIndex, locations.length]);

  const skipScrollRef = useRef(true);

  useEffect(() => {
    // Only reset if we're not using initialRevealed or if it's a genuine category change
    if (!initialRevealed) {
      setActiveIndex(0);
      setPreviewsRevealed(false);
    }
    skipScrollRef.current = true;
    setDetailClip(null);
    prevHeroInViewRef.current = true;
    setHeroInView(true);
  }, [category.id, initialRevealed]);

  useEffect(() => {
    const el = heroImmersiveRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = entry.isIntersecting && entry.intersectionRatio > 0.06;
        setHeroInView(v);
      },
      { threshold: [0, 0.06, 0.12, 0.22] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [category.id]);

  useEffect(() => {
    if (heroInView && !prevHeroInViewRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollActiveCardIntoView());
      });
    }
    prevHeroInViewRef.current = heroInView;
  }, [heroInView, scrollActiveCardIntoView]);

  useEffect(() => {
    resetAutoAdvance();
    advanceDirRef.current = 1;
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [category.id, locations.length, resetAutoAdvance]);

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      const t = window.setTimeout(() => scrollActiveCardIntoView(), 80);
      return () => clearTimeout(t);
    }
    if (!heroInView || previewsRevealed) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(scrollActiveCardIntoView);
    });
    return () => cancelAnimationFrame(id);
  }, [activeIndex, scrollActiveCardIntoView, heroInView, previewsRevealed]);

  const go = (dir: number) => {
    autoAdvanceActiveRef.current = false; // Disable auto-advance on manual arrow click
    advanceDirRef.current = dir;
    setDetailClip(null);
    setPreviewsRevealed(false);
    setActiveIndex((i) => (i + dir + locations.length) % locations.length);
    resetAutoAdvance();
  };

  const handleLocationCardClick = (i: number) => {
    autoAdvanceActiveRef.current = false; // Disable auto-advance on manual card click
    setDetailClip(null);
    setPreviewsRevealed(true);
    setActiveIndex((prev) => {
      advanceDirRef.current = i > prev ? 1 : i < prev ? -1 : 1;
      return i;
    });
    resetAutoAdvance();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        scrollActiveCardIntoView();
        document.getElementById('elite-market-previews')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  };

  useEffect(() => {
    if (!detailClip) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [detailClip]);

  useEffect(() => {
    if (!detailClip) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailClip(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [detailClip]);

  useEffect(() => {
    const rail = cardsRailRef.current;
    if (!rail) return;

    let active = false;
    let dragging = false;
    let startX = 0;
    let startScroll = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      blockCardClickRef.current = false;
      active = true;
      dragging = false;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add('is-dragging');
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      if (!dragging && Math.abs(dx) > 8) dragging = true;
      if (dragging) {
        rail.scrollLeft = startScroll - dx;
      }
    };

    const endPointer = () => {
      if (!active) return;
      const wasDragging = dragging;
      active = false;
      dragging = false;
      rail.classList.remove('is-dragging');
      if (wasDragging) blockCardClickRef.current = true;
    };

    const onClickCapture = (e: Event) => {
      if (!blockCardClickRef.current) return;
      e.preventDefault();
      e.stopPropagation();
      blockCardClickRef.current = false;
    };

    rail.addEventListener('pointerdown', onPointerDown);
    rail.addEventListener('pointermove', onPointerMove);
    rail.addEventListener('pointerup', endPointer);
    rail.addEventListener('pointercancel', endPointer);
    rail.addEventListener('click', onClickCapture, true);

    return () => {
      rail.removeEventListener('pointerdown', onPointerDown);
      rail.removeEventListener('pointermove', onPointerMove);
      rail.removeEventListener('pointerup', endPointer);
      rail.removeEventListener('pointercancel', endPointer);
      rail.removeEventListener('click', onClickCapture, true);
    };
  }, [category.id, locations.length]);

  return (
    <>
      <motion.section
        ref={heroImmersiveRef}
        key={category.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="elite-immersive"
      >
        <div className="elite-immersive-bg" aria-hidden>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={activeIndex}
              className="elite-immersive-bg-slide"
              style={{ zIndex: immersiveBgLayerZ }}
              custom={advanceDirRef.current}
              variants={immersiveBgVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                duration: 0.95,
                ease: [0.25, 0.08, 0.25, 1],
                opacity: { duration: 1.05, ease: [0.35, 0, 0.25, 1] },
              }}
            >
              <img src={active.img} alt="" className="elite-immersive-bg-img" />
            </motion.div>
          </AnimatePresence>
          <div className="elite-immersive-bg-scrim" />
        </div>

        <div className="elite-immersive-inner">
          <div className="elite-immersive-grid">
            <div className="elite-immersive-copy">
              <motion.p
                className="elite-immersive-kicker gold-accent"
                key={`kicker-${activeIndex}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
              >
                {category.title.toUpperCase()}
              </motion.p>
              <motion.h2
                className="elite-immersive-headline font-artful"
                key={`headline-${activeIndex}`}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.04 }}
              >
                {active.title.toUpperCase()}
              </motion.h2>
              <motion.div
                className="elite-immersive-meta"
                key={`meta-${activeIndex}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.32, delay: 0.1 }}
              >
                <span className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                  <MapPin size={14} style={{ color: '#D4AF37', flexShrink: 0 }} />
                  {active.location}
                </span>
              </motion.div>
              {activeClips.length > 0 && !previewsRevealed ? (
                <motion.p
                  key={`hint-${activeIndex}`}
                  className="elite-immersive-hint"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 }}
                >
                  Tap a location card to open cinematic previews below.
                </motion.p>
              ) : null}
            </div>

            <div
              className="elite-immersive-carousel"
              onMouseEnter={() => {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
              }}
              onMouseLeave={() => resetAutoAdvance()}
            >
              <div
                ref={cardsRailRef}
                className="elite-immersive-cards-rail"
                role="region"
                aria-label="Property locations · drag to scroll"
              >
                <div className="elite-immersive-cards">
                  {locations.map((item, i) => (
                    <motion.button
                      key={item.title}
                      ref={(el) => {
                        cardBtnRefs.current[i] = el;
                      }}
                      type="button"
                      aria-label={`View ${item.title}`}
                      aria-current={i === activeIndex ? true : undefined}
                      className={`elite-mini-card-wrap${i === activeIndex ? ' elite-mini-card-wrap--active' : ''}`}
                      onClick={() => handleLocationCardClick(i)}
                      initial={{ opacity: 0, x: 28, scale: 0.94 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{
                        type: 'spring',
                        damping: 22,
                        stiffness: 280,
                        delay: 0.14 + i * 0.12,
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <div className="elite-mini-card">
                        <img src={item.img} alt="" className="elite-mini-card-img" />
                        <div className="elite-mini-card-glass">
                          <span className="elite-mini-card-region">{item.region}</span>
                          <span className="elite-mini-card-title">{item.title}</span>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
              <div className="elite-immersive-carousel-footer">
                <div className="elite-immersive-arrows">
                  <button type="button" className="elite-immersive-arrow" onClick={() => go(-1)} aria-label="Previous property">
                    <ChevronLeft size={22} />
                  </button>
                  <button type="button" className="elite-immersive-arrow" onClick={() => go(1)} aria-label="Next property">
                    <ChevronRight size={22} />
                  </button>
                </div>
                <span className="elite-immersive-index font-artful">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          <div className="elite-immersive-exit">
            <button type="button" onClick={onClear} className="elite-immersive-exit-btn">
              ✕ Exit collection ✕
            </button>
          </div>
        </div>
      </motion.section>

      <AnimatePresence>
        {previewsRevealed && activeClips.length > 0 ? (
          <motion.section
            key={`previews-${category.id}-${activeIndex}`}
            id="elite-market-previews"
            className="elite-previews-below"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            aria-label={`Video previews for ${active.title}`}
          >
            <div className="elite-previews-below-inner">
              <p className="elite-clips-strip-kicker">Private previews · {active.title}</p>
              <p className="elite-previews-below-lead">Tap a film for full building details.</p>
              <div className="elite-clips-grid">
                {activeClips.map((clip, ci) => (
                  <motion.button
                    key={clip.id}
                    type="button"
                    className="elite-clip-card"
                    onClick={() => setDetailClip(clip)}
                    initial={{ opacity: 0, y: 24, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 24,
                      delay: 0.06 + ci * 0.1,
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <video
                      className="elite-clip-card-video"
                      src={clip.videoSrc}
                      muted
                      playsInline
                      loop
                      autoPlay
                      aria-hidden
                    />
                    <div className="elite-clip-card-shade" aria-hidden />
                    <div className="elite-clip-card-meta">
                      <span className="elite-clip-card-eyebrow">{clip.tagline}</span>
                      <span className="elite-clip-card-name">{clip.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {detailClip ? (
          <motion.div
            className="elite-building-detail-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <button
              type="button"
              className="elite-building-detail-scrim"
              aria-label="Close details"
              onClick={() => setDetailClip(null)}
            />
            <motion.div
              className="elite-building-detail-sheet"
              initial={{ opacity: 0, y: 36, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="elite-building-detail-title"
            >
              <div className="elite-building-detail-layout">
                <div className="elite-building-detail-brand">
                  <div className="elite-building-detail-brand-main">
                    <span className="elite-building-detail-logo">
                      <img
                        src="/assets/vyana-logo.png"
                        alt=""
                        width={320}
                        height={120}
                        className="elite-building-detail-logo-img"
                        decoding="async"
                      />
                    </span>
                    <p className="elite-building-detail-brand-headline">{eliteBrandHeadline(category.id)}</p>
                    <p className="elite-building-detail-brand-sub">Vyana Exclusive Real Estate Hub</p>
                  </div>
                  <div className="elite-building-detail-brand-video-shell">
                    <video
                      key={detailClip.id}
                      className="elite-building-detail-video"
                      src={detailClip.videoSrc}
                      controls
                      playsInline
                      autoPlay
                      muted
                    />
                  </div>
                  <div className="elite-building-detail-brand-contact">
                    <a href="tel:+919000000000" className="elite-building-detail-brand-contact-row">
                      <Phone className="elite-building-detail-brand-contact-ic" strokeWidth={1.75} aria-hidden />
                      <span>+91 90000 00000</span>
                    </a>
                    <a href="mailto:concierge@vyana.com" className="elite-building-detail-brand-contact-row">
                      <Mail className="elite-building-detail-brand-contact-ic" strokeWidth={1.75} aria-hidden />
                      <span>concierge@vyana.com</span>
                    </a>
                  </div>
                </div>
                <div className="elite-building-detail-copy">
                  <div className="elite-building-detail-copy-top">
                    <p className="elite-building-detail-kicker gold-accent">{category.title.toUpperCase()}</p>
                    <button
                      type="button"
                      className="elite-building-detail-x"
                      onClick={() => setDetailClip(null)}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>
                  <h2 id="elite-building-detail-title" className="elite-building-detail-title font-artful">
                    {detailClip.name}
                  </h2>
                  <p className="elite-building-detail-tagline">{detailClip.tagline}</p>
                  <ul className="elite-building-detail-specs" aria-label="Offering tags">
                    {detailClip.specs.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                  <div className="elite-building-detail-desc-group">
                    {detailClip.description
                      .split(/\n\n+/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((para, i) => (
                        <p key={i} className="elite-building-detail-desc">
                          {para}
                        </p>
                      ))}
                  </div>
                  <ul className="elite-building-detail-highlights" aria-label="Highlights">
                    {detailClip.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <div className="elite-building-detail-actions">
                    <Link to="/contact" className="elite-building-detail-cta" onClick={() => setDetailClip(null)}>
                      Request private memo
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

    </>
  );
};


const HOMEPAGE_HERO_VIDEO_DESKTOP = '/assets/hero-scroll-optimized.mp4';
const HOMEPAGE_HERO_VIDEO_MOBILE = '/assets/hero-scroll-mobile.mp4';

function useHeroTouchDirectScrub() {
  const [direct, setDirect] = useState(false);
  useEffect(() => {
    const update = () => {
      const narrow = window.matchMedia('(max-width: 768px)').matches;
      const coarse = window.matchMedia('(pointer: coarse)').matches;
      setDirect(narrow || coarse);
    };
    update();
    const mqN = window.matchMedia('(max-width: 768px)');
    const mqC = window.matchMedia('(pointer: coarse)');
    mqN.addEventListener('change', update);
    mqC.addEventListener('change', update);
    return () => {
      mqN.removeEventListener('change', update);
      mqC.removeEventListener('change', update);
    };
  }, []);
  return direct;
}

const HomepageHero = () => {
  const { introComplete } = useContext(IntroPlaybackContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState(HOMEPAGE_HERO_VIDEO_DESKTOP);
  const touchDirectScrub = useHeroTouchDirectScrub();
  const { scrollYProgress } = useScroll({ target: containerRef });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 25,
    stiffness: 180,
    mass: 0.4,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleResize = () => {
      setVideoSrc(window.innerWidth <= 768 ? HOMEPAGE_HERO_VIDEO_MOBILE : HOMEPAGE_HERO_VIDEO_DESKTOP);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /** iOS: inline attrs + prime decoder (otherwise first frames often stay black). */
  useEffect(() => {
    if (!introComplete) return;
    const video = videoRef.current;
    if (!video) return;
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', 'true');
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const prime = () => {
      video.muted = true;
      void video.play().then(() => {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      });
    };

    if (video.readyState >= 2) prime();
    else video.addEventListener('loadeddata', prime, { once: true });

    return () => video.removeEventListener('loadeddata', prime);
  }, [videoSrc, introComplete]);

  /** First touch on hero unlocks iOS inline playback if autoplay policies blocked priming. */
  useEffect(() => {
    if (!introComplete) return;
    const root = containerRef.current;
    const video = videoRef.current;
    if (!root || !video) return;
    const onTouch = () => {
      video.muted = true;
      void video.play().catch(() => {});
    };
    root.addEventListener('touchstart', onTouch, { passive: true, capture: true });
    return () => root.removeEventListener('touchstart', onTouch, { capture: true });
  }, [videoSrc, introComplete]);

  useEffect(() => {
    if (!introComplete) return;
    let frameId: number;
    const video = videoRef.current;
    const lerp = touchDirectScrub ? 0.42 : 0.18;

    const updateLoop = () => {
      if (video && video.readyState >= 2) {
        const duration = video.duration;
        if (!isNaN(duration) && duration > 0) {
          const progress = touchDirectScrub ? scrollYProgress.get() : smoothProgress.get();
          const targetTime = progress * duration;
          const diff = targetTime - video.currentTime;
          if (Math.abs(diff) > 0.0001) {
            video.currentTime += diff * lerp;
          }
        }
      }
      frameId = requestAnimationFrame(updateLoop);
    };

    frameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(frameId);
  }, [smoothProgress, scrollYProgress, touchDirectScrub, introComplete]);

  const heroVideoSrc = introComplete ? videoSrc : undefined;

  return (
    <div
      ref={containerRef}
      style={{ height: '800vh', position: 'relative' }}
    >
      <section style={{ position: 'sticky', top: 0, height: '100dvh', width: '100%', overflow: 'hidden', background: '#000', isolation: 'isolate' }} aria-label="Vyana hero video">
        {heroVideoSrc ? (
        <video
          key={videoSrc}
          ref={videoRef}
          className="homepage-hero-video"
          src={heroVideoSrc}
          muted
          playsInline
          autoPlay={false}
          loop={false}
          preload="auto"
          controls={false}
          disablePictureInPicture
          onLoadedMetadata={() => {
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
            }
          }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
        />
        ) : null}
        <div className="homepage-hero-scrim" aria-hidden />

        {/* Branding text overlay */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '2rem' }}>
          <motion.div
            style={{ textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <h1 className="hero-text-mask" style={{
              fontSize: 'clamp(2.75rem, 14vw, 10rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '-0.02em'
            }}>
              Vyana<br />
              <span style={{ fontSize: '0.45em', letterSpacing: '0.3em', marginLeft: '0.2em' }}>Real Estate</span>
            </h1>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const EliteCollection = () => {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollWidth, setScrollWidth] = useState(1536);
  const [bgBuildingSrc, setBgBuildingSrc] = useState(categories[2].img);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const isMobile = w <= 768;
      const cardWidth = isMobile ? Math.min(260, Math.max(220, w - 32)) : 320;
      const gapPx = Math.round(2.75 * 16);
      setScrollWidth((cardWidth + gapPx) * 4);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let raf = 0;
    const tick = () => {
      if (cancelled) return;
      const track = trackRef.current;
      if (track) {
        const els = track.querySelectorAll<HTMLElement>('[data-elite-bg-src]');
        const cx = window.innerWidth / 2;
        let bestDist = Infinity;
        let bestSrc = '';
        els.forEach((el) => {
          const r = el.getBoundingClientRect();
          const c = r.left + r.width / 2;
          const d = Math.abs(c - cx);
          const src = el.dataset.eliteBgSrc;
          if (!src) return;
          if (d < bestDist) {
            bestDist = d;
            bestSrc = src;
          }
        });
        if (bestSrc) {
          setBgBuildingSrc((prev) => (prev === bestSrc ? prev : bestSrc));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="normal-section-wrap">
        <HomeReveal>
          <section className="elite-section" id="elite-collection">
            <div className="elite-section-building-bg" aria-hidden>
              <img src={bgBuildingSrc} alt="" className="elite-section-building-bg-img" key={bgBuildingSrc} />
            </div>
            <div className="elite-section-foreground">
              <div className="text-center px-4 elite-collection-heading">
                <p className="font-bold uppercase gold-accent section-kicker">PRIVATE INVENTORY</p>
                <h2 className="font-artful px-2 section-display-title">
                  <span className="section-title-word">The Elite </span>
                  <span className="section-title-word section-title-word--gold">Collection</span>
                </h2>
              </div>
              <div className="elite-carousel-track-wrap relative w-full">
                <motion.div
                  ref={trackRef}
                  className="flex items-end elite-carousel-row"
                  role="region"
                  aria-roledescription="carousel"
                  aria-label="The Elite Collection categories"
                  style={{ gap: '2.75rem', width: 'max-content', touchAction: 'pan-y' }}
                  animate={{ x: [-scrollWidth, 0] }}
                  transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                >
                  {[...categories, ...categories, ...categories].map((cat, i) => (
                    <Card
                      key={`${cat.id}-${i}`}
                      cat={cat}
                      onClick={cat.comingSoon ? undefined : () => navigate(`/elite/${cat.id}`)}
                    />
                  ))}
                </motion.div>
                <div className="elite-carousel-fade elite-carousel-fade--left" />
                <div className="elite-carousel-fade elite-carousel-fade--right" />
              </div>
            </div>
          </section>
        </HomeReveal>
      </div>

      <div className="normal-section-wrap">
        <HomeReveal>
          <PartnersSection />
        </HomeReveal>
      </div>

      <div className="normal-section-wrap">
        <HomeReveal>
          <StrategicDominanceSection />
        </HomeReveal>
      </div>

      <div className="normal-section-wrap">
        <HomeReveal>
          <YearDialSection />
        </HomeReveal>
      </div>

      <div className="normal-section-wrap">
        <HomeReveal>
          <WhyChooseUsSection />
        </HomeReveal>
      </div>

      <div className="normal-section-wrap">
        <HomeReveal>
          <ProcessRibbonSection />
        </HomeReveal>
      </div>
    </>
  );
};

const Card = ({ cat, onClick }: { cat: Category; onClick?: () => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [hoverable, setHoverable] = useState(false);
  const isSoon = Boolean(cat.comingSoon) || !onClick;

  useEffect(() => {
    setHoverable(window.matchMedia('(hover: hover)').matches);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      if (!cardRef.current) return;
      const narrow = window.innerWidth <= 768;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const cardCenter = rect.left + rect.width / 2;
      const distanceFromCenter = (cardCenter - centerX) / (window.innerWidth / 2);
      setRotation(distanceFromCenter * (narrow ? 14 : 35));
      setTranslateY(Math.abs(distanceFromCenter) * (narrow ? 48 : 120));
    };
    const interval = setInterval(updatePosition, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`elite-card elite-card--popout${isSoon ? ' elite-card--soon' : ''}`}
      data-elite-bg-src={cat.img}
      onClick={isSoon ? undefined : onClick}
      style={{ rotateZ: rotation, y: translateY, cursor: isSoon ? 'default' : undefined }}
      whileHover={hoverable && !isSoon ? { scale: 1.05 } : undefined}
      whileTap={!isSoon ? { scale: 0.98 } : undefined}
    >
      <div className="elite-card-popout-slot">
        <div className="elite-card-popout-visual" aria-hidden>
          <img src={cat.img} alt="" className="elite-card-popout-img" />
        </div>
      </div>
      <div className="elite-card-body-stack">
        <div className="elite-card-body-panel">
          <h3 className="elite-card-title">{cat.title}</h3>
          <p className="elite-card-desc">{cat.desc}</p>
          <button
            type="button"
            className={`read-more-btn${isSoon ? ' read-more-btn--soon' : ''}`}
            disabled={isSoon}
            tabIndex={isSoon ? -1 : 0}
            onClick={(e) => {
              if (isSoon) e.preventDefault();
            }}
          >
            {isSoon ? 'Coming soon' : 'Read More'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [mobileCollectionOpen, setMobileCollectionOpen] = useState(false);
  const collectionDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (collectionDropdownRef.current?.contains(e.target as Node)) return;
      setCollectionOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    setCollectionOpen(false);
    setIsMenuOpen(false);
    setMobileCollectionOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const clearMobile = () => {
      if (mq.matches) setIsMenuOpen(false);
    };
    mq.addEventListener('change', clearMobile);
    return () => mq.removeEventListener('change', clearMobile);
  }, []);

  const closeNav = () => {
    setIsMenuOpen(false);
    setCollectionOpen(false);
    setMobileCollectionOpen(false);
  };

  return (
    <header className={`site-header${isScrolled ? ' site-header--scrolled' : ''}`}>
      <div className="header-pill">
        <div className="header-pill-row">
          <Link
            to="/"
            className="header-wordmark"
            aria-label="Vyana — home"
            onClick={(e) => {
              closeNav();
              const onHomeRoot =
                location.pathname === '/' && !location.hash && !location.search;
              if (onHomeRoot) {
                e.preventDefault();
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                return;
              }
              e.preventDefault();
              navigate({ pathname: '/', hash: '', search: '' });
              queueMicrotask(() => {
                window.scrollTo(0, 0);
              });
            }}
          >
            <img
              src="/assets/vyana-logo.png"
              alt=""
              width={300}
              height={200}
              className="header-wordmark-img"
            />
          </Link>

          <nav className="header-nav-main" aria-label="Main">
            <div
              className={`header-dropdown-wrap${collectionOpen ? ' header-dropdown-wrap--open' : ''}`}
              ref={collectionDropdownRef}
            >
              <button
                type="button"
                className="header-nav-trigger"
                aria-expanded={collectionOpen}
                aria-haspopup="true"
                aria-controls="header-collection-menu"
                id="header-collection-button"
                onClick={() => setCollectionOpen((v) => !v)}
              >
                <span className="header-nav-trigger-label">Collection</span>
                <ChevronDown className="header-nav-chevron" size={14} strokeWidth={2.5} aria-hidden />
              </button>
              {collectionOpen ? (
                <div
                  className="header-dropdown"
                  id="header-collection-menu"
                  role="menu"
                  aria-labelledby="header-collection-button"
                >
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      to={`/elite/${c.id}`}
                      className="header-dropdown-link"
                      role="menuitem"
                      onClick={() => setCollectionOpen(false)}
                    >
                      {c.title}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>

            <Link to="/about" className="header-nav-link" onClick={() => setCollectionOpen(false)}>
              About us
            </Link>
            <HeaderHashLink
              hashId="vyana-process"
              className="header-nav-link"
              onNavigate={() => setCollectionOpen(false)}
            >
              The flow
            </HeaderHashLink>
          </nav>

          <Link to="/contact" className="header-cta" onClick={closeNav}>
            List your property
          </Link>

          <button
            type="button"
            className="header-menu-toggle"
            aria-expanded={isMenuOpen}
            aria-label="Menu"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="header-mobile-panel"
            >
              <div className="header-mobile-inner">
                <button
                  type="button"
                  className="header-mobile-sublabel"
                  aria-expanded={mobileCollectionOpen}
                  onClick={() => setMobileCollectionOpen((v) => !v)}
                >
                  Collection
                  <ChevronDown
                    size={16}
                    strokeWidth={2.5}
                    className={mobileCollectionOpen ? 'header-mobile-chevron header-mobile-chevron--open' : 'header-mobile-chevron'}
                    aria-hidden
                  />
                </button>
                {mobileCollectionOpen ? (
                  <div className="header-mobile-sublist">
                    {categories.map((c) => (
                      <Link key={c.id} to={`/elite/${c.id}`} className="header-mobile-sublink" onClick={closeNav}>
                        {c.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
                <Link to="/about" className="header-mobile-link" onClick={closeNav}>
                  About us
                </Link>
                <HeaderHashLink hashId="vyana-process" className="header-mobile-link" onNavigate={closeNav}>
                  The flow
                </HeaderHashLink>
                <Link to="/contact" className="header-mobile-cta" onClick={closeNav}>
                  List your property
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

function FarmhouseComingSoon({ onClear }: { onClear: () => void }) {
  return (
    <motion.section
      className="elite-coming-soon"
      initial={{ opacity: 0.85 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      aria-labelledby="farmhouse-coming-soon-title"
    >
      <p className="elite-coming-soon-kicker font-bold uppercase gold-accent">Farmhouse</p>
      <h1 id="farmhouse-coming-soon-title" className="elite-coming-soon-title font-artful">
        Coming soon
      </h1>
      <p className="elite-coming-soon-desc">
        Signature farmhouse estates are in curation. For early access once inventory opens, reach our concierge through
        Contact us.
      </p>
      <button type="button" onClick={onClear} className="elite-immersive-exit-btn">
        ✕ Back to collection ✕
      </button>
    </motion.section>
  );
}

function EliteCategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = categories.find((c) => c.id === categoryId);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  if (category.comingSoon) {
    return <FarmhouseComingSoon onClear={() => navigate('/')} />;
  }

  const locations = subLocationsByCategory[category.id];
  if (!locations?.length) {
    return <Navigate to="/" replace />;
  }

  return (
    <SubCollection
      key={category.id}
      category={category}
      locations={locations}
      onClear={() => navigate('/')}
    />
  );
}

function HubPage() {
  const { hubName } = useParams();
  const navigate = useNavigate();

  const location = useMemo(() => {
    return LOCATIONS_RESIDENTIAL.find(l => l.title.toLowerCase() === hubName?.toLowerCase());
  }, [hubName]);

  if (!location) {
    return <Navigate to="/" replace />;
  }

  // We wrap the single location in an array to reuse SubCollection components
  const category = categories[0]; // Default to Residential category for Hub pages

  return (
    <div className="hub-page-wrapper">
      <SubCollection
        category={category}
        locations={[location]}
        onClear={() => navigate('/')}
        initialRevealed={true}
      />
    </div>
  );
}

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    const raw = location.hash.replace(/^#/, '');
    if (!raw) return;
    const id = decodeURIComponent(raw);
    const el = document.getElementById(id);
    if (!el) return;
    const t = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  return (
    <>
      <HomepageHero />
      <EliteCollection />
    </>
  );
}

/** Session: after intro completes once, refresh on any route skips welcome video. */
const WELCOME_INTRO_SESSION_KEY = 'vyana_welcome_intro_seen';

/** Every real navigation starts at the top (hero), not mid-page / footer scroll. */
function ScrollToTop() {
  const { pathname, search, hash } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search, hash]);
  return null;
}

export default function App() {
  const [introFinished, setIntroFinished] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      if (window.sessionStorage.getItem(WELCOME_INTRO_SESSION_KEY) === '1') return true;
      const p = window.location.pathname;
      if (p === '/elite' || p.startsWith('/elite/')) return true;
      return false;
    } catch {
      return false;
    }
  });

  const handleIntroComplete = useCallback(() => {
    try {
      window.sessionStorage.setItem(WELCOME_INTRO_SESSION_KEY, '1');
    } catch {
      /* private mode / quota */
    }
    setIntroFinished(true);
  }, []);

  return (
    <>
      {!introFinished ? <WelcomeIntro onComplete={handleIntroComplete} /> : null}
      <main
        inert={!introFinished}
        className={introFinished ? 'app-visible' : 'app-hidden'}
        style={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}
      >
        <IntroPlaybackContext.Provider value={{ introComplete: introFinished }}>
        <Header />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/elite" element={<Navigate to="/elite/01" replace />} />
          <Route path="/elite/:categoryId" element={<EliteCategoryPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/hub/:hubName" element={<HubPage />} />
          <Route path="/rera" element={<ReraPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SiteFooter />
        </IntroPlaybackContext.Provider>
      </main>
    </>
  );
}
