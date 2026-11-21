import { useEffect, useLayoutEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { getProjectBySlug, portfolioData } from "../data/portfolio";
import {
  trackExternalProjectClick,
  trackProjectView,
} from "../utils/analytics";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "../components/BlockReveal";
import { HoistPlatformPlate, UniversitySystemsPlate } from "../components/SystemDiagram";
import styles from "./ProjectDetail.module.css";

export const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const pageRef = useRef<HTMLElement | null>(null);
  const project = slug ? getProjectBySlug(slug) : undefined;

  useEffect(() => {
    if (project) {
      document.title = `${project.title} — ${portfolioData.profile.fullName}`;
      trackProjectView(project.title, project.category, project.slug);
    } else {
      document.title = `Project Not Found — ${portfolioData.profile.fullName}`;
    }
  }, [project]);

  useLayoutEffect(() => {
    if (!project) return;
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-case-hero]", {
          y: 22,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
        });

        const chapters = gsap.utils.toArray<HTMLElement>("[data-case-chapter]");
        chapters.forEach((chapter) => {
          gsap.from(chapter, {
            y: 24,
            opacity: 0,
            duration: 0.68,
            ease: "power3.out",
            scrollTrigger: {
              trigger: chapter,
              start: "top 86%",
              once: true,
            },
          });
        });
      }, pageRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [project]);

  if (!project) {
    return (
      <main id="main-content" className={styles.page}>
        <div className={`container ${styles.notFound}`}>
          <span className="eyebrow">
            <span className="eyebrow-index">404</span>
            <span>/ NOT FOUND</span>
          </span>
          <h1 className={styles.title}>Case study not found.</h1>
          <p className={styles.summary}>
            The project you requested does not exist or may have moved.
          </p>
          <Link to="/#work" className={styles.primaryLinkBtn}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Selected Work</span>
          </Link>
        </div>
      </main>
    );
  }

  const allProjects = portfolioData.projects;
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const prevProject =
    allProjects[(currentIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <main ref={pageRef} id="main-content" className={styles.page}>
      <article className="container">
        <div className={styles.topNav} data-case-hero>
          <Link to="/#work" className={styles.backLink}>
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to Selected Work</span>
          </Link>
          <Link to="/myworks" className={styles.backLink}>
            <span>All Projects Archive</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <header className={styles.header}>
          <span className="eyebrow" data-case-hero>
            <span className="eyebrow-index">{project.index}</span>
            <span>/ {project.category}</span>
          </span>

          <BlockReveal
            key={project.slug}
            animateOnScroll={false}
            blockColor="#B89A6A"
            duration={0.45}
          >
            <h1 className={styles.title}>{project.title}</h1>
          </BlockReveal>
          <p className={styles.tagline} data-case-hero>
            {project.tagline}
          </p>
          <p className={styles.summary} data-case-hero>
            {project.summary}
          </p>
        </header>

        <div className={styles.metaGrid} data-case-hero>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Role</span>
            <span className={styles.metaValue}>{project.role}</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Organization</span>
            <span className={styles.metaValue}>
              {project.organization ?? "Independent"}
            </span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Timeline</span>
            <span className={styles.metaValue}>{project.year}</span>
          </div>
          <div className={styles.metaCell}>
            <span className={styles.metaLabel}>Category</span>
            <span className={styles.metaValue}>{project.category}</span>
          </div>
        </div>

        {project.links.length > 0 && (
          <div className={styles.linksBar}>
            {project.links.map((link, idx) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  idx === 0 && link.kind === "primary"
                    ? styles.primaryLinkBtn
                    : styles.portalLinkBtn
                }
                onClick={() =>
                  trackExternalProjectClick(
                    project.title,
                    project.category,
                    link.url,
                    "case_study_header"
                  )
                }
              >
                <span>{link.label}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        )}

        {/* Primary Visual */}
        {project.gallery && project.gallery.length > 0 ? (
          <section className={styles.gallerySection} aria-labelledby="ch-captures">
            <div className={styles.galleryHeader}>
              <span className="eyebrow">
                <span className="eyebrow-index">CAPTURES</span>
                <span>/ LIVE INSTITUTIONAL INTERFACES</span>
              </span>
              <h2 id="ch-captures" className={styles.chapterTitle}>
                Portals &amp; Public Entry Interfaces
              </h2>
            </div>

            <div className={styles.galleryGrid}>
              {project.gallery.map((item, idx) => (
                <figure
                  key={item.id}
                  className={`${styles.galleryItem} ${
                    idx === 2 ? styles.galleryItemWide : ""
                  }`}
                >
                  <div className={styles.galleryThumb}>
                    <img
                      src={item.image}
                      alt={item.title}
                      loading={idx < 2 ? "eager" : "lazy"}
                    />
                  </div>
                  <figcaption className={styles.galleryItemInfo}>
                    <div className={styles.galleryItemTop}>
                      <span className={styles.galleryItemTitle}>
                        {item.title}
                      </span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.galleryItemLink}
                        >
                          <span>Open</span>
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <p className={styles.galleryItemCaption}>{item.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        ) : (
          <div className={styles.visualWrap}>
            {project.image && project.visualType === "mobile-screenshot" ? (
              <div className={styles.mobileShowcase}>
                <div className={styles.mobileFrame}>
                  <img src={project.image} alt={project.imageAlt} />
                </div>
                <div className={styles.mobileDetails}>
                  <span className="eyebrow">
                    <span className="eyebrow-index">UI</span>
                    <span>/ KEY PRODUCT HIGHLIGHTS</span>
                  </span>
                  <h2 className={styles.mobileDetailsTitle}>
                    Designed for practical everyday use.
                  </h2>
                  <ul className={styles.mobileDetailsList}>
                    {project.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.imageAlt}
                className={styles.heroScreenshot}
              />
            ) : project.visualType === "university-systems" ? (
              <UniversitySystemsPlate />
            ) : (
              <HoistPlatformPlate />
            )}
          </div>
        )}

        {/* Technical Storytelling Chapters */}
        <div className={styles.chapters}>
          <section className={styles.chapter} aria-labelledby="ch-problem" data-case-chapter>
            <div className={styles.chapterLabel}>
              <span className="eyebrow">
                <span className="eyebrow-index">01</span>
                <span>/ CONTEXT</span>
              </span>
              <h2 id="ch-problem" className={styles.chapterTitle}>
                Problem Statement
              </h2>
            </div>
            <div className={styles.chapterBody}>
              <p className={styles.bodyText}>{project.caseStudy.problem}</p>
            </div>
          </section>

          <section className={styles.chapter} aria-labelledby="ch-objectives" data-case-chapter>
            <div className={styles.chapterLabel}>
              <span className="eyebrow">
                <span className="eyebrow-index">02</span>
                <span>/ GOALS</span>
              </span>
              <h2 id="ch-objectives" className={styles.chapterTitle}>
                Project Objectives
              </h2>
            </div>
            <div className={styles.chapterBody}>
              <ul className={styles.bulletList}>
                {project.caseStudy.objectives.map((item) => (
                  <li key={item} className={styles.bulletItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.chapter} aria-labelledby="ch-role" data-case-chapter>
            <div className={styles.chapterLabel}>
              <span className="eyebrow">
                <span className="eyebrow-index">03</span>
                <span>/ OWNERSHIP</span>
              </span>
              <h2 id="ch-role" className={styles.chapterTitle}>
                Role &amp; Contributions
              </h2>
            </div>
            <div className={styles.chapterBody}>
              <ul className={styles.bulletList}>
                {project.caseStudy.contributions.map((item) => (
                  <li key={item} className={styles.bulletItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className={styles.chapter} aria-labelledby="ch-approach" data-case-chapter>
            <div className={styles.chapterLabel}>
              <span className="eyebrow">
                <span className="eyebrow-index">04</span>
                <span>/ ARCHITECTURE</span>
              </span>
              <h2 id="ch-approach" className={styles.chapterTitle}>
                Technical Approach
              </h2>
            </div>
            <div className={styles.chapterBody}>
              <p className={styles.bodyText}>
                {project.caseStudy.technicalApproach}
              </p>

              <div className={styles.archList}>
                {project.caseStudy.architecture.map((layer) => (
                  <div key={layer.layer} className={styles.archItem}>
                    <span className={styles.archLayer}>{layer.layer}</span>
                    <p className={styles.archDetail}>{layer.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.chapter} aria-labelledby="ch-challenges" data-case-chapter>
            <div className={styles.chapterLabel}>
              <span className="eyebrow">
                <span className="eyebrow-index">05</span>
                <span>/ EXECUTION</span>
              </span>
              <h2 id="ch-challenges" className={styles.chapterTitle}>
                Challenges &amp; Solutions
              </h2>
            </div>
            <div className={styles.chapterBody}>
              <div className={styles.challengeList}>
                {project.caseStudy.challenges.map((entry) => (
                  <div key={entry.challenge} className={styles.challengeCard}>
                    <div className={styles.challengeRow}>
                      <span className={styles.challengeTag}>Challenge</span>
                      <p className={styles.challengeText}>{entry.challenge}</p>
                    </div>
                    <div className={styles.challengeRow}>
                      <span
                        className={`${styles.challengeTag} ${styles.solutionTag}`}
                      >
                        Solution Implemented
                      </span>
                      <p className={styles.solutionText}>{entry.solution}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.chapter} aria-labelledby="ch-stack" data-case-chapter>
            <div className={styles.chapterLabel}>
              <span className="eyebrow">
                <span className="eyebrow-index">06</span>
                <span>/ STACK</span>
              </span>
              <h2 id="ch-stack" className={styles.chapterTitle}>
                Technologies Used
              </h2>
            </div>
            <div className={styles.chapterBody}>
              <div className={styles.stackRow}>
                {project.technologies.map((tech) => (
                  <span key={tech} className={styles.stackItem}>
                    {tech}
                  </span>
                ))}
              </div>

              {project.caseStudy.note && (
                <p className={styles.privacyNote}>{project.caseStudy.note}</p>
              )}
            </div>
          </section>
        </div>

        {/* Related Project Navigation */}
        <nav className={styles.projectNav} aria-label="Adjacent projects">
          <Link to={`/work/${prevProject.slug}`} className={styles.navCard}>
            <span className={styles.navDir}>
              <ArrowLeft size={13} aria-hidden="true" />
              <span>Previous Project</span>
            </span>
            <span className={styles.navName}>{prevProject.title}</span>
            <span className={styles.navCat}>{prevProject.category}</span>
          </Link>

          <Link
            to={`/work/${nextProject.slug}`}
            className={`${styles.navCard} ${styles.navCardNext}`}
          >
            <span className={styles.navDir}>
              <span>Next Project</span>
              <ArrowRight size={13} aria-hidden="true" />
            </span>
            <span className={styles.navName}>{nextProject.title}</span>
            <span className={styles.navCat}>{nextProject.category}</span>
          </Link>
        </nav>
      </article>
    </main>
  );
};

export default ProjectDetail;
