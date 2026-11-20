import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { featuredProjects, portfolioData, type Project } from "../data/portfolio";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "./BlockReveal";
import { HoistPlatformPlate, UniversitySystemsPlate } from "./SystemDiagram";
import styles from "./SelectedWork.module.css";

const ProjectGalleryVisual = ({ project }: { project: Project }) => {
  const gallery = project.gallery ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const current = gallery[activeIdx] ?? gallery[0];

  if (!current) return null;

  const handleSelect = (idx: number) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    if (
      imgRef.current &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches
    ) {
      gsap.fromTo(
        imgRef.current,
        { opacity: 0.45, scale: 1.018 },
        { opacity: 1, scale: 1, duration: 0.42, ease: "power2.out" }
      );
    }
  };

  return (
    <div className={styles.galleryCard} data-project-media>
      <Link
        to={`/work/${project.slug}`}
        className={styles.galleryStageLink}
        aria-label={`View ${project.title} case study — currently showing ${current.title}`}
      >
        <div className={styles.galleryFrame}>
          <img
            ref={imgRef}
            src={current.image}
            alt={current.title}
            className={styles.galleryImg}
            loading="lazy"
          />
        </div>
      </Link>

      <div className={styles.galleryBar}>
        <div
          className={styles.galleryTabs}
          role="tablist"
          aria-label={`${project.title} portal previews`}
        >
          {gallery.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              onClick={() => handleSelect(idx)}
              className={`${styles.galleryTab} ${
                idx === activeIdx ? styles.galleryTabActive : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className={styles.galleryCaptionRow}>
          <span className={styles.galleryCaptionText}>{current.title}</span>
          {current.url && (
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.galleryOpenLink}
            >
              <span>Open</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProjectVisual = ({
  project,
  isLead = false,
}: {
  project: Project;
  isLead?: boolean;
}) => {
  if (project.visualType === "screenshot-gallery" && project.gallery?.length) {
    return <ProjectGalleryVisual project={project} />;
  }

  if (project.image && project.visualType === "mobile-screenshot") {
    return (
      <Link
        to={`/work/${project.slug}`}
        className={styles.mediaLink}
        aria-label={`View ${project.title} case study`}
        data-project-media
      >
        <div className={styles.mobileStage}>
          <div className={styles.phoneBezel}>
            <img
              src={project.image}
              alt={project.imageAlt}
              className={styles.phoneImg}
              loading="lazy"
            />
          </div>
          <div className={styles.mobileCaption}>
            <span className={styles.mobileCaptionLabel}>MOBILE PRODUCT UI</span>
            <p className={styles.mobileCaptionTitle}>
              Curated culinary discovery with contextual Sous Chef AI guidance.
            </p>
            <ul className={styles.mobileCaptionList}>
              <li>Regional &amp; global recipes</li>
              <li>AI meal planning &amp; prompts</li>
              <li>Saved favourites &amp; planner</li>
            </ul>
          </div>
        </div>
      </Link>
    );
  }

  if (project.image) {
    return (
      <Link
        to={`/work/${project.slug}`}
        className={styles.mediaLink}
        aria-label={`View ${project.title} case study`}
        data-project-media
      >
        <div
          className={`${styles.screenshotFrame} ${isLead ? styles.leadFrame : ""}`}
        >
          <div className={styles.parallaxWrap} data-parallax-img>
            <img
              src={project.image}
              alt={project.imageAlt}
              className={styles.screenshotImg}
              loading={isLead ? "eager" : "lazy"}
            />
          </div>
        </div>
      </Link>
    );
  }

  if (project.visualType === "university-systems") {
    return (
      <Link
        to={`/work/${project.slug}`}
        className={styles.mediaLink}
        aria-label={`View ${project.title} case study`}
        data-project-media
      >
        <div className={styles.diagramWrap}>
          <UniversitySystemsPlate />
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/work/${project.slug}`}
      className={styles.mediaLink}
      aria-label={`View ${project.title} case study`}
      data-project-media
    >
      <div className={styles.diagramWrap}>
        <HoistPlatformPlate />
      </div>
    </Link>
  );
};

export const SelectedWork = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [leadProject, ...otherProjects] = featuredProjects;
  const archiveCount = portfolioData.projects.length - featuredProjects.length;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        // Section header
        gsap.from("[data-work-header]", {
          y: 26,
          opacity: 0,
          duration: 0.72,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-work-header]",
            start: "top 84%",
            once: true,
          },
        });

        // Each project article enters with refined editorial timing
        const articles = gsap.utils.toArray<HTMLElement>("[data-project-article]");
        articles.forEach((article) => {
          const textItems = article.querySelectorAll("[data-project-text]");
          const media = article.querySelector("[data-project-media]");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: article,
              start: "top 82%",
              once: true,
            },
          });

          if (textItems.length) {
            tl.from(textItems, {
              y: 22,
              opacity: 0,
              duration: 0.65,
              stagger: 0.06,
              ease: "power3.out",
            });
          }

          if (media) {
            tl.from(
              media,
              {
                y: 28,
                opacity: 0,
                scale: 0.985,
                duration: 0.8,
                ease: "power3.out",
              },
              "-=0.45"
            );
          }
        });

        // Archive bar
        gsap.from("[data-archive-bar]", {
          y: 20,
          opacity: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-archive-bar]",
            start: "top 88%",
            once: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    // Subtle desktop-only depth scrub inside screenshot frames (never hijacks scroll)
    mm.add(`(min-width: 1024px) and ${REDUCED_MOTION_QUERY}`, () => {
      const ctx = gsap.context(() => {
        const imgs = gsap.utils.toArray<HTMLElement>("[data-parallax-img]");
        imgs.forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -2.5 },
            {
              yPercent: 2.5,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            }
          );
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="work"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="selected-work-heading"
    >
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.headerLeft}>
            <span className="eyebrow" data-work-header>
              <span className="eyebrow-index">02</span>
              <span>/ SELECTED WORK</span>
            </span>
            <BlockReveal blockColor="#B89A6A">
              <h2 id="selected-work-heading" className={styles.sectionTitle}>
                Systems built for real operations.
              </h2>
            </BlockReveal>
          </div>
          <p className={styles.sectionLead} data-work-header>
            Selected production platforms spanning event ticketing, university
            digital infrastructure, AI-assisted consumer software, Web3 music,
            and enterprise systems.
          </p>
        </div>

        <div className={styles.projectList}>
          {/* 01 — Flagship Lead Feature */}
          {leadProject && (
            <article className={styles.featuredLead} data-project-article>
              <div className={styles.leadTop}>
                <div className={styles.metaCol}>
                  <span className={styles.metaTag} data-project-text>
                    <span className={styles.metaNumber}>{leadProject.index}</span>
                    <span>/ {leadProject.category}</span>
                  </span>
                  <h3 className={styles.projectTitle} data-project-text>
                    <Link
                      to={`/work/${leadProject.slug}`}
                      className={styles.projectTitleLink}
                    >
                      {leadProject.title}
                    </Link>
                  </h3>
                  <p className={styles.projectTagline} data-project-text>
                    {leadProject.tagline}
                  </p>
                </div>

                <div className={styles.metaCol}>
                  <p className={styles.projectDesc} data-project-text>
                    {leadProject.summary}
                  </p>
                  <p className={styles.techLine} data-project-text>
                    {leadProject.technologies.join(" / ")}
                  </p>
                  <div className={styles.actions} data-project-text>
                    <Link
                      to={`/work/${leadProject.slug}`}
                      className={styles.caseStudyLink}
                    >
                      <span>View case study</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                    {leadProject.links[0] && (
                      <a
                        href={leadProject.links[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.liveLink}
                      >
                        <span>{leadProject.links[0].label}</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <ProjectVisual project={leadProject} isLead />
            </article>
          )}

          {/* 02 – 06 — Alternating Editorial Rows */}
          {otherProjects.map((project, idx) => {
            const isReversed = idx % 2 === 1;
            const primaryLink =
              project.links.find((l) => l.kind === "primary") ?? project.links[0];
            const showMultiLinks = project.links.length > 1;

            return (
              <article
                key={project.slug}
                data-project-article
                className={`${styles.projectRow} ${
                  isReversed ? styles.projectRowReversed : ""
                }`}
              >
                <div className={styles.metaCol}>
                  <span className={styles.metaTag} data-project-text>
                    <span className={styles.metaNumber}>{project.index}</span>
                    <span>/ {project.category}</span>
                  </span>

                  <h3 className={styles.projectTitle} data-project-text>
                    <Link
                      to={`/work/${project.slug}`}
                      className={styles.projectTitleLink}
                    >
                      {project.title}
                    </Link>
                  </h3>

                  <p className={styles.projectTagline} data-project-text>
                    {project.tagline}
                  </p>
                  <p className={styles.projectDesc} data-project-text>
                    {project.summary}
                  </p>
                  <p className={styles.techLine} data-project-text>
                    {project.technologies.join(" / ")}
                  </p>

                  {showMultiLinks && (
                    <div className={styles.portalLinks} data-project-text>
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.portalLink}
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className={styles.actions} data-project-text>
                    <Link
                      to={`/work/${project.slug}`}
                      className={styles.caseStudyLink}
                    >
                      <span>View case study</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                    {!showMultiLinks && primaryLink && (
                      <a
                        href={primaryLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.liveLink}
                      >
                        <span>{primaryLink.label}</span>
                        <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>

                <div className={styles.mediaCol}>
                  <ProjectVisual project={project} />
                </div>
              </article>
            );
          })}
        </div>

        {/* Archive Navigation Strip */}
        <div className={styles.archiveBar} data-archive-bar>
          <div className={styles.archiveInfo}>
            <span className={styles.archiveLabel}>COMPLETE ARCHIVE</span>
            <p className={styles.archiveTitle}>
              All {portfolioData.projects.length} shipped projects &amp; portals
            </p>
            <p className={styles.archiveSub}>
              Includes {archiveCount} additional client builds: CrispTV, Winner
              Chikezie Portfolio, and CRP Church.
            </p>
          </div>
          <Link to="/myworks" className={styles.archiveBtn}>
            <span>Explore full archive</span>
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SelectedWork;
