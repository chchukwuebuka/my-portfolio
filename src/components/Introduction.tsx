import { useLayoutEffect, useRef } from "react";
import { portfolioData } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "./BlockReveal";
import ScrollHighlightText from "./ScrollHighlightText";
import styles from "./Introduction.module.css";

export const Introduction = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { introduction } = portfolioData;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-intro-pillar]", {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-intro-pillars]",
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
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="positioning-heading"
    >
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.left}>
            <span className="eyebrow">
              <span className="eyebrow-index">01</span>
              <span>/ {introduction.eyebrow}</span>
            </span>
            <BlockReveal blockColor="#B89A6A">
              <h2 id="positioning-heading" className={styles.heading}>
                {introduction.heading}
              </h2>
            </BlockReveal>
          </div>

          <div className={styles.right}>
            <ScrollHighlightText
              paragraphs={introduction.paragraphs}
              keywords={[
                "ai",
                "automation",
                "automated",
                "products",
                "systems",
                "frontend",
                "backend",
                "api",
                "workflow",
                "deployment",
                "full-stack",
              ]}
            />
          </div>
        </div>

        <div className={styles.pillars} data-intro-pillars>
          {introduction.pillars.map((pillar) => (
            <div key={pillar.label} className={styles.pillar} data-intro-pillar>
              <span className={styles.pillarLabel}>{pillar.label}</span>
              <p className={styles.pillarValue}>{pillar.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Introduction;
