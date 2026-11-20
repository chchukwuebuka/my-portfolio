import { useLayoutEffect, useRef } from "react";
import { portfolioData } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "./BlockReveal";
import styles from "./Capabilities.module.css";

export const Capabilities = () => {
  const sectionRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-cap-header]", {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-cap-header]",
            start: "top 84%",
            once: true,
          },
        });

        gsap.from("[data-cap-cell]", {
          y: 24,
          opacity: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-cap-matrix]",
            start: "top 82%",
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
      id="capabilities"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="capabilities-heading"
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className="eyebrow" data-cap-header>
              <span className="eyebrow-index">04</span>
              <span>/ ENGINEERING CAPABILITIES</span>
            </span>
            <BlockReveal blockColor="#B89A6A">
              <h2 id="capabilities-heading" className={styles.heading}>
                Technical breadth with practical depth.
              </h2>
            </BlockReveal>
          </div>
          <p className={styles.lead} data-cap-header>
            Core disciplines and technologies I work with in production — from
            component architecture to API design, relational data, and
            third-party system integrations.
          </p>
        </div>

        <div className={styles.matrix} data-cap-matrix>
          {portfolioData.capabilities.map((group) => (
            <div key={group.index} className={styles.cell} data-cap-cell>
              <div className={styles.cellHead}>
                <h3 className={styles.cellTitle}>{group.title}</h3>
                <span className={styles.cellIndex}>{group.index}</span>
              </div>
              <p className={styles.cellSummary}>{group.summary}</p>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item} className={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
