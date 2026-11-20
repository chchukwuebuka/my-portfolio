import { useLayoutEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "./BlockReveal";
import styles from "./Experience.module.css";

export const Experience = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-exp-header]", {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-exp-header]",
            start: "top 84%",
            once: true,
          },
        });

        const rows = gsap.utils.toArray<HTMLElement>("[data-exp-item]");
        rows.forEach((row) => {
          gsap.from(row, {
            y: 26,
            opacity: 0,
            duration: 0.68,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 86%",
              once: true,
            },
          });
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="experience-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className="eyebrow" data-exp-header>
              <span className="eyebrow-index">03</span>
              <span>/ EXPERIENCE</span>
            </span>
            <BlockReveal blockColor="#B89A6A">
              <h2 id="experience-heading" className={styles.heading}>
                Where I&apos;ve built and shipped.
              </h2>
            </BlockReveal>
          </div>
          <p className={styles.lead} data-exp-header>
            Progression from frontend engineering into full-stack product and
            institutional systems delivery across enterprise, education, event,
            AI, and Web3 teams.
          </p>
        </div>

        <ol className={styles.timeline}>
          {portfolioData.experiences.map((exp) => (
            <li key={exp.id} className={styles.item} data-exp-item>
              <div className={styles.metaCol}>
                <span className={styles.periodRow}>
                  <span
                    className={`${styles.marker} ${
                      exp.current ? styles.markerCurrent : ""
                    }`}
                    aria-hidden="true"
                  />
                  <span>{exp.period}</span>
                </span>
                <span className={styles.location}>{exp.location}</span>
              </div>

              <div className={styles.detailCol}>
                <div className={styles.roleHeader}>
                  <h3 className={styles.company}>{exp.company}</h3>
                  <span className={styles.role}>{exp.role}</span>
                </div>

                <p className={styles.summary}>{exp.summary}</p>

                <ul className={styles.contributions}>
                  {exp.contributions.map((item) => (
                    <li key={item} className={styles.contribution}>
                      {item}
                    </li>
                  ))}
                </ul>

                {exp.shippedLinks && exp.shippedLinks.length > 0 && (
                  <div className={styles.shippedBlock}>
                    <span className={styles.shippedLabel}>Shipped</span>
                    {exp.shippedLinks.map((link) => (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shippedLink}
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}

                <p className={styles.techLine}>{exp.technologies.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
