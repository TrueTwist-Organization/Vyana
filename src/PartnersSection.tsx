import { useReducedMotion } from 'framer-motion';

const PARTNERS: { id: string; label: string; logoSrc?: string }[] = [
  { id: 'shivalik', label: 'Shivalik' },
  { id: 'adani', label: 'Adani Realty' },
  { id: 'goyal', label: 'Goyal & Co.' },
  { id: 'godrej', label: 'Godrej Garden City' },
  { id: 'shilp', label: 'Shilp' },
];

function PartnerLogoFallback({ id }: { id: string }) {
  switch (id) {
    case 'shivalik':
      return (
        <span className="partners-fallback-txt partners-fallback-txt--shivalik" aria-hidden>
          SHIVALIK
        </span>
      );
    case 'adani':
      return (
        <span className="partners-fallback-adani" aria-hidden>
          <span className="partners-fallback-adani-mark">adani</span>
          <span className="partners-fallback-adani-realty">Realty</span>
        </span>
      );
    case 'goyal':
      return (
        <span className="partners-fallback-goyal" aria-hidden>
          <span className="partners-fallback-goyal-icon">G</span>
          <span className="partners-fallback-goyal-text">Goyal &amp; Co.</span>
        </span>
      );
    case 'godrej':
      return (
        <span className="partners-fallback-godrej" aria-hidden>
          GODREJ GARDEN CITY AHMEDABAD
        </span>
      );
    case 'shilp':
      return (
        <span className="partners-fallback-txt partners-fallback-txt--shilp" aria-hidden>
          SHILP
        </span>
      );
    default:
      return null;
  }
}

function partnerItemClass(p: (typeof PARTNERS)[number]) {
  const emphasis = p.id === 'shivalik' || p.id === 'adani';
  return `partners-item${emphasis ? ' partners-item--emphasis' : ''}`;
}

function PartnerFace({ p }: { p: (typeof PARTNERS)[number] }) {
  return (
    <>
      <div className="partners-circle">
        {p.logoSrc ? (
          <img src={p.logoSrc} alt="" className="partners-circle-img" />
        ) : (
          <PartnerLogoFallback id={p.id} />
        )}
      </div>
      <span className="partners-label">{p.label}</span>
    </>
  );
}

export function PartnersSection() {
  const reduceMotion = useReducedMotion();
  const isReduce = reduceMotion === true;
  const marqueePartners = isReduce ? PARTNERS : [...PARTNERS, ...PARTNERS];

  return (
    <section className="partners-section" aria-labelledby="partners-heading">
      <p className="partners-sr-summary">
        Partner network: {PARTNERS.map((p) => p.label).join(', ')}.
      </p>
      <div className="partners-section-inner">
        <div className="partners-panel">
          <h2 id="partners-heading" className="partners-heading">
            Our Partners
          </h2>

          <ul className="partners-list partners-list--desktop">
            {PARTNERS.map((p) => (
              <li key={p.id} className={partnerItemClass(p)}>
                <PartnerFace p={p} />
              </li>
            ))}
          </ul>

          <div className={`partners-marquee${isReduce ? ' partners-marquee--static' : ''}`} aria-hidden="true">
            <div
              className={`partners-marquee-track${isReduce ? ' partners-marquee-track--static' : ''}`}
            >
              {marqueePartners.map((p, i) => (
                <div key={`${p.id}-${i}`} className={`partners-marquee-slide ${partnerItemClass(p)}`}>
                  <PartnerFace p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
