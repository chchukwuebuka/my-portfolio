"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Star,
  Filter,
  Zap,
} from "lucide-react";
import styles from "./styles.module.css";
import {
  SiTypescript,
  SiReact,
  SiCss3,
  SiNextdotjs,
  SiPython,
  SiJavascript,
} from "react-icons/si";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  date: string;
  status: "Now" | "Completed" | "In Progress";
  technologies: Technology[];
  image: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

interface Technology {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const Projects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTech, setSelectedTech] = useState<string>("all");
  const [isVisible, setIsVisible] = useState(false);

  const technologies: Technology[] = [
    { name: "TypeScript", icon: "🔷", color: "#3178C6" },
    { name: "React", icon: "⚛️", color: "#61DAFB" },
    { name: "Sass", icon: "💗", color: "#CC6699" },
    { name: "Svelte", icon: "🔥", color: "#FF3E00" },
    { name: "Node.js", icon: "🟢", color: "#339933" },
    { name: "Next.js", icon: "▲", color: "#000000" },
    { name: "Vue.js", icon: "💚", color: "#4FC08D" },
    { name: "Python", icon: "🐍", color: "#3776AB" },
  ];

  const projects: Project[] = [
    {
      id: "slick-portfolio-1",
      title: "Slick Portfolio",
      subtitle: "Website Template",
      description:
        "A modern, responsive portfolio website built with TypeScript and React. Features dark mode, smooth animations, and optimized performance.",
      duration: "1 day",
      date: "July 2025",
      status: "Now",
      technologies: [
        {
          name: "TypeScript",
          icon: <SiTypescript size={24} />,
          color: "#3178C6",
        },
        { name: "React", icon: <SiReact size={24} />, color: "#61DAFB" },
        { name: "Css", icon: <SiCss3 size={24} />, color: "#CC6699" },
      ],
      image:
        "/images/me.PNG",
      demoUrl: "https://chukwuebuka-eg-portfolio.netlify.app/",
      githubUrl: "https://github.com/chchukwuebuka/my-portfolio",
      featured: true,
    },
    {
      id: "Kuepass",
      title: "Kuepass",
      subtitle: "Event Management App",
      description:
        "Keupass is an event management platform that allows vendors to create and manage events, while enabling attendees to register and participate seamlessly.",
      duration: "3 weeks",
      date: "March 2025",
      status: "Completed",
      technologies: [
        { name: "Next.js", icon: <SiNextdotjs size={24} />, color: "#000000" },
        {
          name: "TypeScript",
          icon: <SiTypescript size={24} />,
          color: "#3178C6",
        },
        { name: "Python", icon: <SiPython size={24} />, color: "#3776AB" },
        { name: "Css", icon: <SiCss3 size={24} />, color: "#CC6699" },
      ],
      image:
        "/images/kuepass.PNG",
      demoUrl: "https://kuepass.com/",
      githubUrl: "https://github.com/chchukwuebuka/kuepassApp",
      featured: false,
    },
    {
      id: "CRP Church",
      title: "Church of Resurrection Power",
      subtitle: "CRP Church",
      description:
        "The Church of the Resurrection Power serves as the head church of the New Haven Archdeaconry in the Anglican Diocese of Enugu. Located at #6 Uduma Street, New Haven, it was established around 2000 and formally incorporated into the archdeaconry in 2011.",
      duration: "2 weeks",
      date: "Jenuary 2025",
      status: "Completed",
      technologies: [
        {
          name: "Javascript",
          icon: <SiJavascript size={24} />,
          color: "#F7DF1E",
        },
        { name: "React", icon: <SiReact size={24} />, color: "#61DAFB" },
        {
          name: "TypeScript",
          icon: <SiTypescript size={24} />,
          color: "#3178C6",
        },
        { name: "Python", icon: <SiPython size={24} />, color: "#3776AB" },
        { name: "Css", icon: <SiCss3 size={24} />, color: "#CC6699" },
      ],
      image:
        "/images/church.PNG",
      demoUrl: "https://churchofresurrectionpower.org/",
      githubUrl: "https://github.com/chchukwuebuka/CRP_Church",
      featured: true,
    },
    {
      id: "soundRig",
      title: "soundRig",
      subtitle: "soundRig",
      description:
        "SoundRig is a decentralized, blockchain-powered music platform built to empower independent artists and fans.",
      duration: "1 week",
      date: "Novenmber 2024",
      status: "Completed",
      technologies: [
        { name: "Css", icon: <SiCss3 size={24} />, color: "#CC6699" },
        { name: "Next.js", icon: <SiNextdotjs size={24} />, color: "#000000" },
        {
          name: "TypeScript",
          icon: <SiTypescript size={24} />,
          color: "#3178C6",
        },
      ],
      image:
        "/images/sound.PNG",
      demoUrl: "https://t.me/SoundrigBot/SoundRigApp",
      githubUrl: "https://github.com/SoundRigOfficial/soundrig-frontend",
      featured: false,
    },
  ];

  const allTechnologies = [
    "all",
    ...Array.from(
      new Set(projects.flatMap((p) => p.technologies.map((t) => t.name)))
    ),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech =
      selectedTech === "all" ||
      project.technologies.some((tech) => tech.name === selectedTech);
    return matchesSearch && matchesTech;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Now":
        return "#10B981";
      case "Completed":
        return "#3B82F6";
      case "In Progress":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  return (
    <section className={styles.projectsSection} id="projects">
      <div className={styles.projectsContainer}>
        {/* Header */}
        <div
          className={`${styles.projectsHeader} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Zap size={32} />
            </div>
            <h2 className={styles.projectsTitle}>Featured Projects</h2>
            <p className={styles.projectsSubtitle}>
              A showcase of my recent work and creative solutions
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <Star size={20} />
              <span>{projects.filter((p) => p.featured).length} Featured</span>
            </div>
            <div className={styles.statItem}>
              <Calendar size={20} />
              <span>{projects.length} Total Projects</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={`${styles.searchContainer} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.searchWrapper}>
            <Search className={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Technology Filter */}
        <div
          className={`${styles.techFilter} ${isVisible ? styles.visible : ""}`}
        >
          <div className={styles.filterHeader}>
            <Filter size={16} />
            <span>Filter by Technology</span>
          </div>
          <div className={styles.techButtons}>
            {allTechnologies.map((tech) => {
              const techData = technologies.find((t) => t.name === tech);
              return (
                <button
                  key={tech}
                  onClick={() => setSelectedTech(tech)}
                  className={`${styles.techBtn} ${
                    selectedTech === tech ? styles.active : ""
                  }`}
                  style={
                    tech !== "all" && techData
                      ? ({
                          "--tech-color": techData.color,
                        } as React.CSSProperties)
                      : {}
                  }
                >
                  {tech !== "all" && techData && (
                    <span className={styles.techIcon}>{techData.icon}</span>
                  )}
                  <span>{tech === "all" ? "All" : tech}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Projects Grid */}
        <div
          className={`${styles.projectsGrid} ${
            isVisible ? styles.visible : ""
          }`}
        >
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`${styles.projectCard} ${
                project.featured ? styles.featured : ""
              }`}
              style={
                {
                  "--animation-delay": `${index * 0.1}s`,
                } as React.CSSProperties
              }
            >
              <div className={styles.projectCardInner}>
                {/* Project Image */}
                <div className={styles.projectImage}>
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                  />
                  <div className={styles.imageOverlay}>
                    <div className={styles.overlayActions}>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                        >
                          <ExternalLink size={18} />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.actionBtn}
                        >
                          <Github size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                  {project.featured && (
                    <div className={styles.featuredBadge}>
                      <Star size={14} />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className={styles.projectContent}>
                  <div className={styles.projectHeader}>
                    <div className={styles.projectInfo}>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectSubtitle}>
                        {project.subtitle}
                      </p>
                    </div>
                    <div className={styles.projectLinks}>
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.linkBtn}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <p className={styles.projectDescription}>
                    {project.description}
                  </p>

                  <div className={styles.projectMeta}>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{project.duration}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{project.date}</span>
                    </div>
                    <div
                      className={styles.statusBadge}
                      style={
                        {
                          "--status-color": getStatusColor(project.status),
                        } as React.CSSProperties
                      }
                    >
                      {project.status}
                    </div>
                  </div>

                  <div className={styles.projectTechnologies}>
                    {project.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className={styles.techTag}
                        style={
                          { "--tech-color": tech.color } as React.CSSProperties
                        }
                        title={tech.name}
                      >
                        <span className={styles.techIcon}>{tech.icon}</span>
                        <span className={styles.techName}>{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No projects found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
