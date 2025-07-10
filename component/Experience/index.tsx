"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  Award,
  TrendingUp,
  Users,
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
      location: "Physical",
      duration: "1 year",
      startDate: "2024",
      endDate: "Present",
      description:
        "At Viicsoft, I am moving beyond foundational concepts to tackle advanced, full-stack challenges. As an integral part of the team, I contribute directly to the entire lifecycle of client projects. While continuing to deliver high-quality frontend solutions, I have significantly expanded my expertise into backend development, where I am gaining hands-on experience building robust APIs with Python and the Django REST Framework. This dynamic, hands-on role is continually honing my ability to architect and deliver scalable, end-to-end software solutions under real-world deadlines.",
      achievements: [
        "Completed 3+ client projects",
        "Achieved 98% client satisfaction rate",
        "Generated $50K+ in revenue",
      ],
      technologies: [
        { name: "Python", icon: <SiPython size={20} />, color: "#3776ab" },
        { name: "Next.js", icon: <SiNextdotjs size={20} />, color: "#000000" },
        { name: "CSS", icon: <SiCss3 size={20} />, color: "#264de4" },
        { name: "GoDaddy", icon: <SiGodaddy size={20} />, color: "#FF9900" },
        { name: "Heroku", icon: <SiHeroku size={16} />, color: "#CC6699" },
      ],
      current: true,
    },
    {
      id: "open-source-dev",
      title: "Genesys Tech Hub",
      company: "Various Projects",
      location: "Physical",
      duration: "2 year",
      startDate: "2023",
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
          icon: <SiJavascript size={20} />,
          color: "#F7DF1E",
        },
        {
          name: "TypeScript",
          icon: <SiTypescript size={20} />,
          color: "#3178C6",
        },
        { name: "React", icon: <SiReact size={20} />, color: "#61DAFB" },
        { name: "CSS", icon: <SiCss3 size={20} />, color: "#264de4" },
      ],
      current: false,
    },

    {
      id: "junior-freelancer",
      title: "SoundRig",
      company: "SoundRig",
      location: "Remote",
      duration: "2 years",
      startDate: "2024",
      endDate: "2025",
      description:
        "Building responsive web applications and learning modern development practices. Focused on creating user-friendly interfaces and optimizing performance.",
      achievements: [
        "Completed 15+ small projects",
        "Learned 8+ programming languages",
        "Built first commercial application",
      ],
      technologies: [
        {
          name: "JavaScript",
          icon: <SiJavascript size={20} />,
          color: "#f7df1e",
        },
        { name: "React", icon: <SiReact size={20} />, color: "#61dafb" },
        {
          name: "PostgreSQL",
          icon: <SiPostgresql size={20} />,
          color: "#336791",
        },
        { name: "Git", icon: <SiGit size={20} />, color: "#F05032" },
      ],
      current: false,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalYears = experiences.reduce((total, exp) => {
    const years = Number.parseInt(exp.duration.split(" ")[0]);
    return total + years;
  }, 0);

  return (
    <section className={styles.experienceSection} id="experience">
      <div className={styles.experienceContainer}>
        {/* Header */}
        <div
          className={`${styles.experienceHeader} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Briefcase size={32} />
            </div>
            <h2 className={styles.experienceTitle}>Professional Experience</h2>
            <p className={styles.experienceSubtitle}>
              My journey through different roles and technologies
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <TrendingUp size={20} />
              <span>{totalYears}+ Years Experience</span>
            </div>
            <div className={styles.statItem}>
              <Users size={20} />
              <span>{experiences.length} Positions</span>
            </div>
            <div className={styles.statItem}>
              <Award size={20} />
              <span>90+ Projects Completed</span>
            </div>
          </div>
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
                  "--animation-delay": `${index * 0.2}s`,
                } as React.CSSProperties
              }
            >
              <div className={styles.timelineMarker}>
                <div
                  className={styles.markerDot}
                  onMouseEnter={() => setActiveExperience(experience.id)}
                  onMouseLeave={() => setActiveExperience(null)}
                >
                  {experience.current && (
                    <div className={styles.pulseRing}></div>
                  )}
                  <Briefcase size={16} />
                </div>
                <div className={styles.markerLine}></div>
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
                          <span>{experience.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {experience.current && (
                    <div className={styles.currentBadge}>
                      <div className={styles.currentDot}></div>
                      <span>Current</span>
                    </div>
                  )}
                </div>

                <div className={styles.durationInfo}>
                  <div className={styles.durationItem}>
                    <Calendar size={14} />
                    <span>
                      {experience.startDate} - {experience.endDate}
                    </span>
                  </div>
                  <div className={styles.durationItem}>
                    <Clock size={14} />
                    <span>{experience.duration}</span>
                  </div>
                </div>

                <p className={styles.jobDescription}>
                  {experience.description}
                </p>

                <div className={styles.achievementsSection}>
                  <h4 className={styles.achievementsTitle}>Key Achievements</h4>
                  <ul className={styles.achievementsList}>
                    {experience.achievements.map(
                      (achievement, achievementIndex) => (
                        <li
                          key={achievementIndex}
                          className={styles.achievementItem}
                        >
                          <div className={styles.achievementBullet}></div>
                          <span>{achievement}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className={styles.technologiesSection}>
                  <h4 className={styles.techTitle}>Technologies Used</h4>
                  <div className={styles.techStack}>
                    {experience.technologies.map((tech, techIndex) => (
                      <div
                        key={techIndex}
                        className={styles.techBadge}
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

        {/* Summary */}
        {/* <div
          className={`${styles.experienceSummary} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <Award size={24} />
              <h3>Career Highlights</h3>
            </div>
            <div className={styles.summaryStats}>
              <div className={styles.summaryStat}>
                <div className={styles.statNumber}>90+</div>
                <div className={styles.statLabel}>Projects Completed</div>
              </div>
              <div className={styles.summaryStat}>
                <div className={styles.statNumber}>12+</div>
                <div className={styles.statLabel}>Technologies Mastered</div>
              </div>
              <div className={styles.summaryStat}>
                <div className={styles.statNumber}>50+</div>
                <div className={styles.statLabel}>
                  Open Source Contributions
                </div>
              </div>
              <div className={styles.summaryStat}>
                <div className={styles.statNumber}>98%</div>
                <div className={styles.statLabel}>Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
};

export default Experience;
