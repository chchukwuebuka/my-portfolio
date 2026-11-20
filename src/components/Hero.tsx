import { useLayoutEffect, useRef } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import { smoothScrollTo } from "../utils/lenis";
import BlockReveal from "./BlockReveal";
import HeroShaderCanvas from "./HeroShaderCanvas";
import { HeroArchitectureVisual } from "./SystemDiagram";
import styles from "./Hero.module.css";

export const Hero = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { profile, hero } = portfolioData;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        tl.from("[data-hero-line-rule]", {
          scaleX: 0,
          duration: 0.48,
        })
          .from(
            "[data-hero-eyebrow]",
            {
              opacity: 0,
              x: -10,
              duration: 0.42,
            },
            "-=0.28"
          )
          .from(
            "[data-hero-fade]",
            {
              y: 18,
              opacity: 0,
              duration: 0.62,
              stagger: 0.08,
            },
            "+=0.28"
          )
          .from(
            "[data-hero-visual]",
            {
              y: 22,
              opacity: 0,
              duration: 0.72,
            },
            "-=0.58"
          )
          .from(
            "[data-hero-layer]",
            {
              y: 10,
              opacity: 0,
              duration: 0.45,
              stagger: 0.08,
            },
            "-=0.45"
          )
          .from(
            "[data-hero-bottom]",
            {
              opacity: 0,
              y: 10,
              duration: 0.5,
            },
            "-=0.35"
          );
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    const target = document.getElementById(href.slice(1));
    if (target) {
      smoothScrollTo(target);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      aria-label="Introduction"
    >
      <HeroShaderCanvas sectionRef={sectionRef} className={styles.shaderCanvas} />

      <div className={`container ${styles.heroInner}`}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <p className={styles.label}>
              <span
                className={styles.labelLine}
                data-hero-line-rule
                aria-hidden="true"
              />
              <span data-hero-eyebrow>{profile.eyebrow}</span>
            </p>

            <BlockReveal
              animateOnScroll={false}
              blockColor="#B89A6A"
              delay={0.08}
              stagger={0.11}
              duration={0.46}
            >
              <h1 className={styles.headline}>
                {hero.headlineLines.join(" ")}
              </h1>
            </BlockReveal>

            <p className={styles.description} data-hero-fade>
              {hero.description}
            </p>

            <div className={styles.ctaRow} data-hero-fade>
              <a
                href={hero.primaryCta.href}
                onClick={(e) => handleScrollTo(e, hero.primaryCta.href)}
                className={styles.primaryBtn}
              >
                <span>{hero.primaryCta.label}</span>
                <ArrowDownRight size={17} aria-hidden="true" />
              </a>

              <a
                href={hero.secondaryCta.href}
                onClick={(e) => handleScrollTo(e, hero.secondaryCta.href)}
                className={styles.secondaryBtn}
              >
                <span>{hero.secondaryCta.label}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>

            <div className={styles.availability} data-hero-fade>
              <span className={styles.availabilityDot} aria-hidden="true" />
              <span>{profile.availability}</span>
            </div>
          </div>

          <div className={styles.visualCol} data-hero-visual>
            <HeroArchitectureVisual />
          </div>
        </div>

        <div className={styles.bottomBar} data-hero-bottom>
          <span className={styles.bottomIdentity}>{profile.fullName}</span>
          <span>FULL-STACK · BACKEND SYSTEMS · AI AUTOMATION</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
