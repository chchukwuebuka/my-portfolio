"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  Code,
  Palette,
  Library,
  Zap,
  Star,
  TrendingUp,
} from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiPython,
  SiSass,
  SiNextdotjs,
//   SiCss3,
//   SiHtml5,
  SiJavascript,
  SiDjango,
  SiTailwindcss,
} from "react-icons/si";
import styles from "./styles.module.css";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  level: number;
  description: string;
}

const Skills: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVisible, setIsVisible] = useState(false);

  const skills: Skill[] = [
    // Programming Languages
    {
      id: "javascript",
      name: "JavaScript",
      category: "Programming Languages",
      icon: <SiJavascript size={48} />,
      color: "#F7DF1E",
      level: 98,
      description: "Modern ES6+ JavaScript development",
    },
    {
      id: "typescript",
      name: "TypeScript",
      category: "Programming Languages",
      icon: <SiTypescript size={48} />,
      color: "#3178C6",
      level: 98,
      description: "Type-safe JavaScript development",
    },
    {
      id: "python",
      name: "Python",
      category: "Programming Languages",
      icon: <SiPython size={48} />,
      color: "#3776AB",
      level: 90,
      description: "Backend development and data science",
    },
    // Markup & Style
//     {
//       id: "css",
//       name: "CSS",
//       category: "Markup & Style",
//       icon: <SiCss3 size={48} />,
//       color: "#1572B6",
//       level: 95,
//       description: "Advanced CSS3 and responsive design",
//     },
//     {
//       id: "html",
//       name: "HTML",
//       category: "Markup & Style",
//       icon: <SiHtml5 size={48} />,
//       color: "#E34F26",
//       level: 95,
//       description: "Semantic HTML5 markup",
//     },
    {
      id: "sass",
      name: "Sass",
      category: "Markup & Style",
      icon: <SiSass size={48} />,
      color: "#CC6699",
      level: 88,
      description: "CSS preprocessing and organization",
    },
    {
      id: "tailwind",
      name: "Tailwind CSS",
      category: "Markup & Style",
      icon: <SiTailwindcss size={48} />,
      color: "#06B6D4",
      level: 85,
      description: "Utility-first CSS framework",
    },
    // Libraries
    {
      id: "react",
      name: "React.js",
      category: "Libraries",
      icon: <SiReact size={48} />,
      color: "#61DAFB",
      level: 95,
      description: "Modern React with hooks and context",
    },
    {
      id: "Next.js",
      name: "Next.js",
      category: "Libraries",
      icon: <SiNextdotjs size={48} />,
      color: "#000000",
      level: 95,
      description: "Modern Next.js with hooks and context",
    },
    {
      id: "Django REST Framework",
      name: "Django REST Framework",
      category: "Libraries",
      icon: <SiDjango size={48} />,
      color: "#092e20",
      level: 95,
      description: "Modern Django REST Framework",
    },
  ];

  const categories = [
    { id: "all", name: "All Skills", icon: <Star size={16} /> },
    {
      id: "Programming Languages",
      name: "Programming",
      icon: <Code size={16} />,
    },
    { id: "Markup & Style", name: "Design", icon: <Palette size={16} /> },
    { id: "Libraries", name: "Libraries", icon: <Library size={16} /> },
  ];

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.skillsSection} id="skills">
      <div className={styles.skillsContainer}>
        {/* Header */}
        <div
          className={`${styles.skillsHeader} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Zap size={32} />
            </div>
            <h2 className={styles.skillsTitle}>Skills & Expertise</h2>
            <p className={styles.skillsSubtitle}>
              Technologies and tools I use to bring ideas to life
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <TrendingUp size={20} />
              <span>{skills.length}+ Technologies</span>
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
              placeholder="Search skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div
          className={`${styles.categoryFilter} ${
            isVisible ? styles.visible : ""
          }`}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`${styles.categoryBtn} ${
                selectedCategory === category.id ? styles.active : ""
              }`}
            >
              {category.icon}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div
          className={`${styles.skillsGrid} ${isVisible ? styles.visible : ""}`}
        >
          {filteredSkills.map((skill, index) => (
            <div
              key={skill.id}
              className={styles.skillCard}
              style={
                {
                  "--skill-color": skill.color,
                  "--animation-delay": `${index * 0.1}s`,
                } as React.CSSProperties
              }
            >
              <div className={styles.skillCardInner}>
                <div className={styles.skillHeader}>
                  <div className={styles.skillIcon}>
                    <span className={styles.skillEmoji}>{skill.icon}</span>
                  </div>
                  <div className={styles.skillInfo}>
                    <h3 className={styles.skillName}>{skill.name}</h3>
                    <p className={styles.skillCategory}>{skill.category}</p>
                  </div>
                  <div className={styles.skillLevelBadge}>{skill.level}%</div>
                </div>

                <p className={styles.skillDescription}>{skill.description}</p>

                <div className={styles.skillProgress}>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={
                        {
                          "--progress": `${skill.level}%`,
                        } as React.CSSProperties
                      }
                    ></div>
                  </div>
                </div>

                <div className={styles.skillOverlay}>
                  <div className={styles.overlayContent}>
                    <div className={styles.overlayIcon}>{skill.icon}</div>
                    <span className={styles.overlayText}>Expert Level</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredSkills.length === 0 && (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <h3>No skills found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
