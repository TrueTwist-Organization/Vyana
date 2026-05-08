import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import './strategic-dominance.css';

type TabId = 'residential' | 'commercial' | 'plotting';

const TABS: { id: TabId; label: string }[] = [
  { id: 'residential', label: 'Residential' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'plotting', label: 'Plotting' },
];

/** Center + zoom: west Ahmedabad (Vaishnodevi · Bopal · Shela · Thaltej · Iscon) */
const MAP_EMBED_SRC =
  'https://www.google.com/maps?q=23.045,72.495&z=11&hl=en&output=embed';

/** User order: Vaishnodevi, Bopal, Shela, Thaltej, Iscon */
const EXCLUSIVE_HUBS: { num: string; name: string }[] = [
  { num: '01', name: 'Vaishnodevi' },
  { num: '02', name: 'Bopal' },
  { num: '03', name: 'Shela' },
  { num: '04', name: 'Thaltej' },
  { num: '05', name: 'Iscon' },
];

function TerritoryMap() {
  return (
    <div className="sd-map-frame sd-map-frame--real">
      <iframe
        className="sd-map-iframe"
        title="Ahmedabad — Vyana exclusive hubs (Google Maps)"
        src={MAP_EMBED_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

const headerEase = [0.22, 1, 0.36, 1] as const;

export function StrategicDominanceSection() {
  const [tab, setTab] = useState<TabId>('residential');
  const baseId = useId();
  const reduceMotion = useReducedMotion();
  const tTrans = reduceMotion ? { duration: 0 } : { duration: 0.52, ease: headerEase };

  const titleContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.09,
        delayChildren: reduceMotion ? 0 : 0.04,
      },
    },
  };

  const titleWord = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, ease: headerEase },
    },
  };

  const hubListVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.07, delayChildren: reduceMotion ? 0 : 0.06 },
    },
  };

  const hubItemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.48, ease: headerEase },
    },
  };

  return (
    <section className="sd-section" id="strategic-dominance" aria-labelledby={`${baseId}-heading`}>
      <div className="sd-inner">
        <header className="sd-header">
          <motion.p
            className="sd-kicker font-bold uppercase section-kicker"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ ...tTrans, delay: reduceMotion ? 0 : 0 }}
          >
            Prime Territories
          </motion.p>
          <motion.h2
            id={`${baseId}-heading`}
            className="font-artful px-2 section-display-title sd-elite-title"
            variants={titleContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.85 }}
          >
            <motion.span variants={titleWord} className="section-title-word sd-title-part" style={{ display: 'inline-block' }}>
              Strategic{' '}
            </motion.span>
            <motion.span
              variants={titleWord}
              className="section-title-word section-title-word--gold sd-title-part"
              style={{ display: 'inline-block' }}
            >
              Dominance
            </motion.span>
          </motion.h2>
          <motion.div
            className="sd-tabs"
            role="tablist"
            aria-label="Property categories"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.9 }}
            transition={{ ...tTrans, delay: reduceMotion ? 0 : 0.2 }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={tab === t.id}
                aria-controls={`${baseId}-panel`}
                className={`sd-tab${tab === t.id ? ' sd-tab--active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </motion.div>
        </header>

        <div
          className="sd-grid"
          role="tabpanel"
          id={`${baseId}-panel`}
          aria-labelledby={`${baseId}-tab-${tab}`}
        >
          <div className="sd-col sd-col--hubs">
            <motion.h3
              className="sd-hubs-heading"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={{ ...tTrans, delay: reduceMotion ? 0 : 0.05 }}
            >
              Exclusive Hubs
            </motion.h3>
            <motion.ul
              className="sd-hub-grid"
              variants={hubListVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-10% 0px' }}
            >
              {EXCLUSIVE_HUBS.map((h) => (
                <motion.li key={h.num + h.name} className="sd-hub-card" variants={hubItemVariants}>
                  <span className="sd-hub-num">{h.num}</span>
                  <span className="sd-hub-name">{h.name}</span>
                  <ArrowUpRight className="sd-hub-arrow" strokeWidth={1.6} aria-hidden />
                </motion.li>
              ))}
            </motion.ul>
          </div>

          <motion.div
            className="sd-col sd-col--map"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-8% 0px' }}
            transition={{ ...tTrans, delay: reduceMotion ? 0 : 0.08 }}
          >
            <TerritoryMap />
            <motion.p
              className="sd-map-caption"
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true, margin: '-6% 0px' }}
              transition={{ duration: reduceMotion ? 0 : 0.45, delay: reduceMotion ? 0 : 0.15 }}
            >
              Google Maps — Ahmedabad west corridor. Tap map to interact; zoom for Vaishnodevi, Bopal, Shela, Thaltej &
              Iscon.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
