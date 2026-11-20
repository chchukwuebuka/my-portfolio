import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "./BlockReveal";
import ScrollHighlightText from "./ScrollHighlightText";
import styles from "./About.module.css";

export const About = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const slideImgRef = useRef<HTMLImageElement | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  const { about, profile } = portfolioData;
  const photos = profile.photos;
  const currentPhoto = photos[activeSlide] ?? photos[0];

  const animateSlide = useCallback((nextIndex: number) => {
    setActiveSlide(nextIndex);
    if (
      slideImgRef.current &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      gsap.fromTo(
        slideImgRef.current,
        { opacity: 0.35, scale: 1.035 },
        { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }
      );
    }
  }, []);

  const handleNext = useCallback(() => {
    animateSlide((activeSlide + 1) % photos.length);
  }, [activeSlide, photos.length, animateSlide]);

  const handlePrev = useCallback(() => {
    animateSlide((activeSlide - 1 + photos.length) % photos.length);
  }, [activeSlide, photos.length, animateSlide]);

  // Calm auto-advance when visible and not hovered/focused, respecting reduced motion
  useEffect(() => {
    if (paused || photos.length <= 1) return;
    if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % photos.length;
        if (slideImgRef.current) {
          gsap.fromTo(
            slideImgRef.current,
            { opacity: 0.35, scale: 1.035 },
            { opacity: 1, scale: 1, duration: 0.55, ease: "power2.out" }
          );
        }
        return next;
      });
    }, 5500);

    return () => window.clearInterval(timer);
  }, [paused, photos.length]);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-about-left]", {
          y: 24,
          opacity: 0,
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        });

        gsap.from("[data-about-note]", {
          y: 18,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-about-note]",
            start: "top 86%",
            once: true,
          },
        });

        gsap.from("[data-about-cred]", {
          y: 18,
          opacity: 0,
          duration: 0.58,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-about-creds]",
            start: "top 86%",
            once: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="about-heading"
    >
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.left}>
            <span className="eyebrow" data-about-left>
              <span className="eyebrow-index">05</span>
              <span>/ {about.eyebrow}</span>
            </span>
            <BlockReveal blockColor="#B89A6A">
              <h2 id="about-heading" className={styles.heading}>
                {about.heading}
              </h2>
            </BlockReveal>

            <figure
              className={styles.portraitBlock}
              data-about-left
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              aria-roledescription="carousel"
              aria-label="Engineering session photos"
            >
              <div className={styles.portraitFrame}>
                <img
                  ref={slideImgRef}
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  className={styles.portraitImg}
                  style={{ objectPosition: currentPhoto.objectPosition }}
                  loading="lazy"
                />
              </div>

              <div className={styles.slideIndicators} role="tablist" aria-label="Select photo">
                {photos.map((photo, idx) => (
                  <button
                    key={photo.src}
                    type="button"
                    role="tab"
                    aria-selected={idx === activeSlide}
                    aria-label={`Show photo ${idx + 1}: ${photo.caption}`}
                    onClick={() => animateSlide(idx)}
                    className={`${styles.slideBar} ${idx === activeSlide ? styles.slideBarActive : ""
                      }`}
                  >
                    <span className={styles.slideBarTrack} />
                  </button>
                ))}
              </div>

              <figcaption className={styles.portraitCaption}>
                <span>{currentPhoto.caption}</span>
                <div className={styles.slideControls}>
                  <span className={styles.slideCounter}>
                    0{activeSlide + 1} / 0{photos.length}
                  </span>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={styles.slideBtn}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className={styles.slideBtn}
                    aria-label="Next photo"
                  >
                    <ChevronRight size={14} aria-hidden="true" />
                  </button>
                </div>
              </figcaption>
            </figure>

            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeLink}
              data-about-left
            >
              <FileText size={16} aria-hidden="true" />
              <span>View Résumé (PDF)</span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </div>

          <div className={styles.right}>
            <ScrollHighlightText
              paragraphs={about.paragraphs}
              keywords={[
                "systems",
                "scale",
                "frontend",
                "full-stack",
                "interfaces",
                "apis",
                "databases",
                "deployment",
                "maintainable",
                "purpose",
              ]}
            />

            <p className={styles.note} data-about-note>
              {about.approachNote}
            </p>

            <div className={styles.credentialsBlock} data-about-creds>
              <h3 className={styles.credentialsTitle}>
                Education &amp; Verified Credentials
              </h3>
              <ul className={styles.credentialsList}>
                {about.credentials.map((cred) => (
                  <li
                    key={cred.title}
                    className={styles.credentialItem}
                    data-about-cred
                  >
                    <div className={styles.credentialMain}>
                      <span className={styles.credentialName}>{cred.title}</span>
                      <span className={styles.credentialIssuer}>
                        {cred.issuer}
                      </span>
                      <p className={styles.credentialDetail}>{cred.detail}</p>
                    </div>
                    <div className={styles.credentialRight}>
                      <span className={styles.credentialDate}>{cred.date}</span>
                        {
                          cred.certificateImage ? (
                            <a
                              href={cred.certificateImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.credentialLink}
                            >
                              <span>Certificate</span>
                              <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                          ): cred.url ? (
                          <a
                            href={cred.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.credentialLink}
                          >
                            <span>Verify</span>
                            <ArrowUpRight size={13} aria-hidden="true" />
                          </a>
                        ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
