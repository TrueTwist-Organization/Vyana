import type { ComponentType, ReactNode, SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import './site-footer.css';

type SocialIconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconInstagram({ size = 20, ...p }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function IconLinkedIn({ size = 20, ...p }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconFacebook({ size = 20, ...p }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function FooterNavLink({ to, children }: { to: string; children: ReactNode }) {
  if (/^https?:\/\//i.test(to) || to.startsWith('mailto:')) {
    return (
      <a href={to} className="site-footer-link">
        {children}
      </a>
    );
  }
  if (to.startsWith('/#')) {
    const id = to.slice(2);
    return (
      <Link to={{ pathname: '/', hash: `#${id}` }} className="site-footer-link">
        {children}
      </Link>
    );
  }
  return (
    <Link to={to} className="site-footer-link">
      {children}
    </Link>
  );
}

const EXPLORE_LINKS: { label: string; to: string }[] = [
  { label: 'Disclaimer', to: '/disclaimer' },
  { label: 'About us', to: '/about' },
  { label: 'Contact us', to: '/contact' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms & Conditions', to: '/terms' },
];

const SOCIAL: { label: string; href: string; Icon: ComponentType<SocialIconProps> }[] = [
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: IconInstagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/', Icon: IconLinkedIn },
  { label: 'Facebook', href: 'https://www.facebook.com/', Icon: IconFacebook },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="site-footer-glow" aria-hidden />

      <div className="site-footer-inner">
        <div className="site-footer-grid">
          <div className="site-footer-col site-footer-col--brand">
            <Link to="/" className="site-footer-brand-link" aria-label="Vyana home">
              <img
                src="/assets/vyana-logo.png"
                alt="VYANA"
                className="site-footer-logo"
                width={280}
                height={140}
              />
            </Link>
            <p className="site-footer-desc">
              Ahmedabad&apos;s premier luxury real estate advisory. We specialise in bespoke residential portfolios and
              off-market assets for clients who expect discretion and depth.
            </p>
            <ul className="site-footer-social" aria-label="Social media">
              {SOCIAL.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="site-footer-social-link"
                    aria-label={`Vyana on ${label}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={20} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col">
            <h2 className="site-footer-heading">Company</h2>
            <ul className="site-footer-links">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterNavLink to={item.to}>{item.label}</FooterNavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="site-footer-col site-footer-col--contact" id="footer-contact">
            <h2 className="site-footer-heading">Contact nexus</h2>
            <ul className="site-footer-contact">
              <li>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ahmedabad%2C+Gujarat%2C+India"
                  className="site-footer-contact-row"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="site-footer-contact-icon" strokeWidth={1.5} aria-hidden />
                  <span>Ahmedabad, India</span>
                </a>
              </li>
              <li>
                <a href="tel:+919000000000" className="site-footer-contact-row">
                  <Phone className="site-footer-contact-icon" strokeWidth={1.5} aria-hidden />
                  <span>+91 90000 00000</span>
                </a>
              </li>
              <li>
                <a href="mailto:concierge@vyana.com" className="site-footer-contact-row">
                  <Mail className="site-footer-contact-icon" strokeWidth={1.5} aria-hidden />
                  <span>concierge@vyana.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="site-footer-ornament" aria-hidden>
          <span className="site-footer-ornament-ring" />
          <span className="site-footer-ornament-dot" />
        </div>

        <div className="site-footer-bottom">
          <p className="site-footer-copy">
            © {year} Vyana Exclusive Real Estate Hub. All rights reserved.
          </p>
          <nav className="site-footer-legal" aria-label="Legal">
            <Link to="/disclaimer" className="site-footer-legal-link">
              Disclaimer
            </Link>
            <Link to="/rera" className="site-footer-legal-link">
              RERA Compliance
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
