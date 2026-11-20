import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import { smoothScrollTo } from "../utils/lenis";
import Monogram from "./Monogram";
import styles from "./Navbar.module.css";

const GitHubIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const progressRef = useRef<HTMLDivElement | null>(null);

  const isHome = location.pathname === "/";

  // Subtle champagne scroll progress hairline driven by GSAP ScrollTrigger
  useLayoutEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;

    const mm = gsap.matchMedia();
    mm.add(REDUCED_MOTION_QUERY, () => {
      const tween = gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.25,
            invalidateOnRefresh: true,
          },
        }
      );
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track active section on homepage
  useEffect(() => {
    if (!isHome) {
      setActiveSection(location.pathname.startsWith("/work") || location.pathname === "/myworks" ? "work" : "");
      return;
    }

    const sectionIds = portfolioData.nav.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isHome, location.pathname]);

  // Close mobile menu on Escape and lock body scroll while open
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleSectionLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setMenuOpen(false);

    if (isHome) {
      const target = document.getElementById(id);
      if (target) {
        smoothScrollTo(target);
        window.history.replaceState(null, "", `/#${id}`);
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled || menuOpen ? styles.headerScrolled : ""}`}>
        <div className={`container ${styles.inner}`}>
          <Link
            to="/"
            className={styles.brand}
            aria-label={`${portfolioData.profile.fullName} — Home`}
            onClick={() => {
              setMenuOpen(false);
              if (isHome) smoothScrollTo(0);
            }}
          >
            <Monogram size={28} />
            <span className={styles.brandName}>{portfolioData.profile.firstName}</span>
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            {portfolioData.nav.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleSectionLink(e, item.id)}
                className={`${styles.navLink} ${
                  activeSection === item.id ? styles.navLinkActive : ""
                }`}
                aria-current={activeSection === item.id ? "true" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a
              href={portfolioData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="GitHub profile"
              title="GitHub"
            >
              <GitHubIcon />
            </a>
            <a
              href={portfolioData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.iconLink}
              aria-label="LinkedIn profile"
              title="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          </div>

          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>

        <div className={styles.progressTrack} aria-hidden="true">
          <div ref={progressRef} className={styles.progressBar} />
        </div>
      </header>

      <div
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav aria-label="Mobile navigation">
          <ul className={styles.mobileNavList}>
            {portfolioData.nav.map((item, idx) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={(e) => handleSectionLink(e, item.id)}
                  className={styles.mobileNavLink}
                  tabIndex={menuOpen ? 0 : -1}
                >
                  <span>{item.label}</span>
                  <span className={styles.mobileIndex}>0{idx + 1}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.mobileFooter}>
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className={styles.mobileEmail}
            tabIndex={menuOpen ? 0 : -1}
          >
            {portfolioData.contact.email}
          </a>
          <div className={styles.mobileSocials}>
            <a
              href={portfolioData.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialLink}
              tabIndex={menuOpen ? 0 : -1}
            >
              GitHub <ArrowUpRight size={14} />
            </a>
            <a
              href={portfolioData.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialLink}
              tabIndex={menuOpen ? 0 : -1}
            >
              LinkedIn <ArrowUpRight size={14} />
            </a>
            <a
              href={portfolioData.profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileSocialLink}
              tabIndex={menuOpen ? 0 : -1}
            >
              Résumé <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
