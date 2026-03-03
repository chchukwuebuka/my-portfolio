"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import styles from "./styles.module.css";
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiCss3,
  SiPython,
  SiNextdotjs,
  SiPostgresql,
  SiGit,
  SiGodaddy,
  SiHeroku,
} from "react-icons/si";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  duration: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: Technology[];
  current: boolean;
}

interface Technology {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const Experience: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeExperience, setActiveExperience] = useState<string | null>(null);

  const experiences: Experience[] = [
    {
      id: "freelancer",
      title: "Viicsoft",
      company: "Full time",
      location: "hybrid",
      duration: "2 Years",
      startDate: "2024",
      endDate: "Present",
      description:
        "At Viicsoft, I have evolved beyond foundational development into solving advanced, full-stack engineering challenges. As a core member of the team, I contribute across the entire lifecycle of client and in-house projects from architecture and UI/UX design to backend systems and deployment. While continuing to deliver high quality frontend solutions, I have expanded deeply into backend development, building robust, production ready APIs using Python and the Django REST Framework. Beyond traditional development, I actively integrate AI driven automation into our systems leveraging AI for intelligent workflows, process optimization, smart content generation, and operational efficiency across platforms. This hands on, innovation-driven role continuously sharpens my ability to design scalable, end-to-end software solutions, automate complex processes, and deliver high-performance systems under real-world deadlines.",
      achievements: [
        "Completed 5+ client projects",
        "Achieved 98% client satisfaction rate",
        "Generated $50K+ in revenue",
      ],
      technologies: [
        { name: "Python", icon: <SiPython size={18} />, color: "#3776ab" },
        { name: "Next.js", icon: <SiNextdotjs size={18} />, color: "#ffffff" },
        { name: "CSS", icon: <SiCss3 size={18} />, color: "#264de4" },
        { name: "GoDaddy", icon: <SiGodaddy size={18} />, color: "#FF9900" },
        { name: "Heroku", icon: <SiHeroku size={18} />, color: "#CC6699" },
      ],
      current: true,
    },
    {
      id: "open-source-dev",
      title: "Genesys Tech Hub",
      company: "Various Projects",
      location: "Physical",
      duration: "2 year",
      startDate: "2022",
      endDate: "24",
      description:
        "As a motivated Frontend Developer Intern, I thrived within the dynamic and innovative ecosystem of Genesys Tech Hub. This immersive internship was the perfect platform to gain hands-on experience engineering responsive web applications with modern technologies like React and TypeScript. The Hub's emphasis on mentorship and industry best practices was crucial as I excelled in a collaborative Agile environment, contributing directly to real-world problem-solving and feature development.",
      achievements: [
        "Maintained 6+ repositories with 1K+ stars",
        "Spoke at 3 tech conferences",
      ],
      technologies: [
        {
          name: "JavaScript",
          icon: <SiJavascript size={18} />,
          color: "#F7DF1E",
        },
        {
          name: "TypeScript",
          icon: <SiTypescript size={18} />,
          color: "#3178C6",
        },
        { name: "React", icon: <SiReact size={18} />, color: "#61DAFB" },
        { name: "CSS", icon: <SiCss3 size={18} />, color: "#264de4" },
      ],
      current: false,
    },
    {
      id: "junior-freelancer",
      title: "SoundRig",
      company: "SoundRig",
      location: "Remote",
      duration: "1 year",
      startDate: "2024",
      endDate: "2025",
      description:
        "I led the frontend implementation of a Web3-based music platform built on blockchain technology, developing responsive and intuitive user interfaces that seamlessly interact with decentralized systems. My focus was on delivering a smooth user experience while integrating wallet connectivity, smart contract interactions, and real-time performance optimization. Through this project, I strengthened my expertise in modern frontend architecture, decentralized application (dApp) workflows, and building high-performance, user-centered web applications.",
      achievements: [
        "Completed 15+ small projects",
        "Learned 8+ programming languages",
        "Built first commercial application",
      ],
      technologies: [
        {
          name: "JavaScript",
          icon: <SiJavascript size={18} />,
          color: "#f7df1e",
        },
        { name: "React", icon: <SiReact size={18} />, color: "#61dafb" },
        {
          name: "PostgreSQL",
          icon: <SiPostgresql size={18} />,
          color: "#336791",
        },
        { name: "Git", icon: <SiGit size={18} />, color: "#F05032" },
      ],
      current: false,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={styles.experienceSection} id="experience">
      <div className={styles.experienceContainer}>
        {/* Header */}
        <div
          className={`${styles.experienceHeader} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.headerTag}>
            <Sparkles size={16} />
            Career Path
          </div>
          <h2 className={styles.experienceTitle}>Professional Experience</h2>
          <p className={styles.experienceSubtitle}>
            A timeline of my professional journey, highlighting the roles, projects, and technologies that have shaped my expertise.
          </p>
        </div>

        {/* Timeline */}
        <div
          className={`${styles.timelineContainer} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.timelineLine}></div>

          {experiences.map((experience, index) => (
            <div
              key={experience.id}
              className={`${styles.timelineItem} ${
                activeExperience === experience.id ? styles.active : ""
              }`}
              style={
                {
                  "--animation-delay": `${index * 0.15}s`,
                } as React.CSSProperties
              }
              onMouseEnter={() => setActiveExperience(experience.id)}
              onMouseLeave={() => setActiveExperience(null)}
            >
              <div className={styles.timelineMarker}>
                <div className={styles.markerDot}>
                  {experience.current && (
                    <div className={styles.pulseRing}></div>
                  )}
                  <Briefcase size={20} />
                </div>
              </div>

              <div className={styles.experienceCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.jobInfo}>
                    <h3 className={styles.jobTitle}>{experience.title}</h3>
                    <div className={styles.companyInfo}>
                      <span className={styles.companyName}>
                        {experience.company}
                      </span>
                      <div className={styles.jobMeta}>
                        <div className={styles.metaItem}>
                          <MapPin size={14} />
                          {experience.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.dateInfo}>
                    <div className={styles.dateRange}>
                      <Calendar size={14} />
                      {experience.startDate} — {experience.endDate}
                    </div>
                    {experience.current && (
                      <div className={styles.currentBadge}>
                        • Ongoing
                      </div>
                    )}
                  </div>
                </div>

                <p className={styles.jobDescription}>
                  {experience.description}
                </p>

                {experience.achievements.length > 0 && (
                  <div className={styles.achievementsSection}>
                    <h4 className={styles.sectionTitle}>Key Highlights</h4>
                    <ul className={styles.achievementsList}>
                      {experience.achievements.map(
                        (achievement, achievementIndex) => (
                          <li
                            key={achievementIndex}
                            className={styles.achievementItem}
                          >
                            <CheckCircle2 size={18} className={styles.achievementIcon} />
                            <span>{achievement}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                <div className={styles.technologiesSection}>
                  <h4 className={styles.sectionTitle}>Technologies</h4>
                  <div className={styles.techStack}>
                    {experience.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className={styles.techBadge}
                        style={
                          { "--tech-color": tech.color } as React.CSSProperties
                        }
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
      </div>
    </section>
  );
};

export default Experience;
