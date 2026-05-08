import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import './legal-pages.css';

const easeLux = [0.22, 1, 0.36, 1] as const;

type ShellProps = { title: ReactNode; children: ReactNode };

function AnimatedP({ index, children }: { index: number; children: ReactNode }) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.p
      className="legal-page-p"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.52,
        delay: reduceMotion ? 0 : 0.12 + index * 0.085,
        ease: easeLux,
      }}
    >
      {children}
    </motion.p>
  );
}

function LegalShell({ title, children }: ShellProps) {
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="legal-page" aria-labelledby="legal-page-title">
      <div className="legal-page-inner">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: easeLux }}
        >
          <Link to="/" className="legal-page-back">
            ← Back to home
          </Link>
        </motion.div>
        <motion.h1
          id="legal-page-title"
          className="legal-page-title"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.58, delay: reduceMotion ? 0 : 0.04, ease: easeLux }}
        >
          {title}
        </motion.h1>
        <div className="legal-page-body">{children}</div>
      </div>
    </article>
  );
}

export function DisclaimerPage() {
  return (
    <LegalShell title="Disclaimer">
      <AnimatedP index={0}>
        Information on this website is offered for general guidance only. It does not constitute legal, financial, or
        investment advice, and should not be treated as a substitute for professional counsel tailored to your
        situation.
      </AnimatedP>
      <AnimatedP index={1}>
        Listing details, prices, availability, and amenities may change without notice. Illustrations, renders, and
        photographs are representative; final specifications are governed by developer agreements and approved plans.
      </AnimatedP>
      <AnimatedP index={2}>
        Vyana is not liable for any loss arising from reliance on site content or third-party links. For mandates,
        title verification, and Registrations, rely on formal documentation and your qualified advisors.
      </AnimatedP>
    </LegalShell>
  );
}

export function AboutUsPage() {
  return (
    <LegalShell title="About us">
      <AnimatedP index={0}>
        Vyana is Ahmedabad&apos;s luxury real estate advisory—built around discretion, deep inventory knowledge, and
        long-term relationships rather than one-off transactions.
      </AnimatedP>
      <AnimatedP index={1}>
        We work with buyers, investors, and families who expect curated shortlists, honest pricing context, and meticulous
        support from first conversation through handover.
      </AnimatedP>
      <AnimatedP index={2}>
        Our team blends on-ground expertise across prime corridors with structured processes for documentation and
        coordination, so you move with clarity at every stage.
      </AnimatedP>
    </LegalShell>
  );
}

function ContactCard({
  index,
  href,
  children,
  icon: Icon,
}: {
  index: number;
  href: string;
  children: ReactNode;
  icon: typeof Mail;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  const external = /^https?:\/\//i.test(href);
  const content = (
    <>
      <Icon className="legal-contact-card-icon" strokeWidth={1.5} aria-hidden />
      <span>{children}</span>
    </>
  );
  return (
    <motion.div
      className="legal-contact-card"
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.14 + index * 0.08, ease: easeLux }}
    >
      {external ? (
        <a href={href} className="legal-contact-card-link" target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      ) : (
        <a href={href} className="legal-contact-card-link">
          {content}
        </a>
      )}
    </motion.div>
  );
}

export function ContactUsPage() {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <LegalShell title="Contact us">
      <AnimatedP index={0}>
        Reach our concierge for listings, private viewings, or advisory enquiries. We respond thoughtfully—usually within
        one business day.
      </AnimatedP>
      <div className="legal-contact-cards">
        <ContactCard index={0} href="tel:+919000000000" icon={Phone}>
          +91 90000 00000
        </ContactCard>
        <ContactCard index={1} href="mailto:concierge@vyana.com" icon={Mail}>
          concierge@vyana.com
        </ContactCard>
        <ContactCard
          index={2}
          href="https://www.google.com/maps/search/?api=1&query=Ahmedabad%2C+Gujarat%2C+India"
          icon={MapPin}
        >
          Ahmedabad, India
        </ContactCard>
      </div>
      <motion.div
        className="legal-page-form-wrap"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: reduceMotion ? 0 : 0.38, ease: easeLux }}
      >
        <p className="legal-page-form-label">Send a note</p>
        <form
          className="legal-page-form"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input type="text" name="name" autoComplete="name" placeholder="Name" className="legal-page-input" />
          <input type="email" name="email" autoComplete="email" placeholder="Email" className="legal-page-input" />
          <textarea name="message" placeholder="How can we help?" rows={4} className="legal-page-textarea" />
          <button type="submit" className="legal-page-submit">
            Submit enquiry
          </button>
        </form>
      </motion.div>
    </LegalShell>
  );
}

export function TermsPage() {
  return (
    <LegalShell title="Terms & Conditions">
      <AnimatedP index={0}>
        These terms govern your use of Vyana&apos;s website and introductory advisory enquiries. Full legal agreements
        are provided before any mandate or transaction.
      </AnimatedP>
      <AnimatedP index={1}>
        By continuing, you agree to receive property-related communications in line with applicable Indian law. For
        binding engagement terms, request our formal advisory agreement.
      </AnimatedP>
      <AnimatedP index={2}>
        You agree not to misuse the site, scrape data without consent, or misrepresent your identity. We may update
        these terms; continued use after changes constitutes acceptance of the revised terms.
      </AnimatedP>
    </LegalShell>
  );
}

export function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <AnimatedP index={0}>
        Vyana respects your privacy. Information you share—name, contact, preferences—is used only to respond to
        enquiries and to deliver relevant listings and updates you opt into.
      </AnimatedP>
      <AnimatedP index={1}>
        We do not sell personal data. You may ask to access, correct, or delete your details by writing to the email
        shown on our contact page or in the footer.
      </AnimatedP>
      <AnimatedP index={2}>
        We use reasonable safeguards appropriate to the nature of the data we hold. Where we rely on service providers,
        they are expected to process data only as instructed and in compliance with applicable law.
      </AnimatedP>
    </LegalShell>
  );
}

export function ReraPage() {
  return (
    <LegalShell title="RERA compliance">
      <AnimatedP index={0}>
        Vyana operates as a real estate advisory. Project-specific marketing materials reference respective
        developers&apos; RERA registrations where applicable.
      </AnimatedP>
      <AnimatedP index={1}>
        Before reserving any unit, verify the current RERA status, project registration number, and disclosure documents
        on the Gujarat RERA portal or with our team during due diligence.
      </AnimatedP>
    </LegalShell>
  );
}
