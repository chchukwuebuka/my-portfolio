import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { portfolioData, type Project } from "../data/portfolio";
import {
  trackExternalProjectClick,
  trackProjectClick,
} from "../utils/analytics";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "../components/BlockReveal";
import styles from "./MyWorks.module.css";

type FilterValue = "all" | Project["filterGroup"];

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All Projects" },
  { value: "systems", label: "Education & Enterprise Systems" },
  { value: "fullstack", label: "Full Stack" },
  { value: "ai-web3", label: "AI & Web3" },
  { value: "frontend", label: "Frontend" },
];

const MyWorks = () => {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const pageRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.title = `Project Archive — ${portfolioData.profile.fullName}`;
  }, []);

  const filteredProjects =
    activeFilter === "all"
      ? portfolioData.projects
      : portfolioData.projects.filter((p) => p.filterGroup === activeFilter);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-archive-row]", {
          y: 18,
          opacity: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }, pageRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, [activeFilter]);

  return (
    <main ref={pageRef} id="main-content" className={styles.page}>
      <div className="container">
        <Link to="/" className={styles.backLink}>
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Home</span>
        </Link>

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <span className="eyebrow">
              <span className="eyebrow-index">ARCHIVE</span>
              <span>/ ALL SHIPPED WORK</span>
            </span>
            <BlockReveal animateOnScroll={false} blockColor="#B89A6A" duration={0.45}>
              <h1 className={styles.title}>Complete Project Index</h1>
            </BlockReveal>
          </div>
          <p className={styles.lead}>
            Production platforms, university portals, AI workflows, Web3
            applications, and client builds engineered across my career.
          </p>
        </header>

        <div
          className={styles.filters}
          role="tablist"
          aria-label="Filter projects by category"
        >
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`${styles.filterBtn} ${
                activeFilter === filter.value ? styles.filterBtnActive : ""
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <ol className={styles.list}>
          {filteredProjects.map((project) => (
            <li key={project.slug} className={styles.row} data-archive-row>
              <span className={styles.rowIndex}>{project.index}</span>

              <div className={styles.rowIdentity}>
                <Link to={`/work/${project.slug}`} className={styles.rowTitle}>
                  {project.title}
                </Link>
                <span className={styles.rowMeta}>
                  {project.category} · {project.year}
                </span>
              </div>

              <div className={styles.rowBody}>
                <p className={styles.rowDesc}>{project.summary}</p>
                <p className={styles.rowTech}>
                  {project.technologies.join(" / ")}
                </p>
              </div>

              <div className={styles.rowActions}>
                <Link
                  to={`/work/${project.slug}`}
                  className={styles.caseBtn}
                  onClick={() =>
                    trackProjectClick(
                      project.title,
                      project.category,
                      "archive_page"
                    )
                  }
                >
                  <span>Case study</span>
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                {project.links.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.extLink}
                    onClick={() =>
                      trackExternalProjectClick(
                        project.title,
                        project.category,
                        link.url,
                        "archive_page"
                      )
                    }
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export default MyWorks;
