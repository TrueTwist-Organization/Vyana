import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Scroll-reveal wrapper (fade + translate) — mirrors IntersectionObserver “reveal / active” pattern */
export function HomeReveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const narrow = window.matchMedia('(max-width: 767px)').matches;
    // Mobile: easy to trigger; desktop: stronger threshold for staged reveal.
    // Never set visible back to false — hiding on scroll-out left sections blank (opacity: 0).
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      narrow
        ? { threshold: 0.02, rootMargin: '0px 0px 0px 0px' }
        : { threshold: 0.22, rootMargin: '-4% 0px -8% 0px' },
    );
    io.observe(el);

    // Prime: IO sometimes fires late on mobile / emulators — show if already on screen.
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.top < vh * 0.92 && r.bottom > vh * 0.05) setVisible(true);

    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? 'home-reveal home-reveal--visible' : 'home-reveal'}>
      {children}
    </div>
  );
}

/** Scroll-snap disabled — sections flow normally. This function is kept for compatibility but does nothing. */
export function useHomeScrollSnapClass(_enabled: boolean) {
  useEffect(() => {
    document.documentElement.classList.remove('home-snap-active');
  }, []);
}
