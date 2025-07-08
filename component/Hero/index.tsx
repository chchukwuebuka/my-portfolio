import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  SiReact,
  SiTypescript,
  SiPython,
  SiSass,
  SiNextdotjs,
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiDjango,
  SiTailwindcss,
} from "react-icons/si";
import styles from "./styles.module.css";
import { useTheme } from "../../src/contexts/ThemeContext";

// Interface updated to accept a ReactNode for the icon
interface TechSkill {
  name: string;
  icon: React.ReactNode;
  color: string;
}

interface SocialLink {
  name: string;
  icon: React.ReactNode;
  url: string;
  color: string;
}

const Hero: React.FC = () => {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useTheme();

  const socialLinks: SocialLink[] = [
    {
      name: "GitHub",
      icon: <Github size={20} />,
      url: "https://github.com/chchukwuebuka",
      color: "#333",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={20} />,
      url: "https://www.linkedin.com/in/chukwuebuka-egwuete",
      color: "#0077b5",
    },
    {
      name: "Twitter",
      icon: <Twitter size={20} />,
      url: "https://x.com/Ebuka__042?t=sqAmJKC0EnHPVSasVnmf3g&s=08",
      color: "#000000",
    },
    {
      name: "Email",
      icon: <Mail size={20} />,
      url: "https://mail.google.com/mail/?view=cm&to=emmanuel.henry71@gmail.com",
      color: "#ea4335",
    },
    {
      name: "Phone",
      icon: <Phone size={20} />,
      url: "tel:+2347032401339", // Replace with your actual phone number
      color: "#34a853", // You can choose any color you like
    },
  ];

  // techSkills array updated with components from react-icons
  const techSkills: TechSkill[] = [
    { name: "React", icon: <SiReact size={48} />, color: "#61dafb" },
    { name: "TypeScript", icon: <SiTypescript size={48} />, color: "#3178c6" },
    { name: "Next.js", icon: <SiNextdotjs size={48} />, color: "#000000" },
    { name: "Python", icon: <SiPython size={48} />, color: "#3776ab" },
    {
      name: "Django REST Framework",
      icon: <SiDjango size={48} />,
      color: "#092e20",
    },
    { name: "Sass", icon: <SiSass size={48} />, color: "#cc6699" },
    { name: "CSS", icon: <SiCss3 size={48} />, color: "#264de4" },
    { name: "HTML", icon: <SiHtml5 size={48} />, color: "#e34c26" },
    { name: "JavaScript", icon: <SiJavascript size={48} />, color: "#f7df1e" },
    {
      name: "Tailwind CSS",
      icon: <SiTailwindcss size={48} />,
      color: "#38bdf8",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSkillIndex((prev) => (prev + 1) % techSkills.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [techSkills.length]);

  const nextSkill = () => {
    setCurrentSkillIndex((prev) => (prev + 1) % techSkills.length);
  };

  const prevSkill = () => {
    setCurrentSkillIndex(
      (prev) => (prev - 1 + techSkills.length) % techSkills.length
    );
  };

  const currentSkill = techSkills[currentSkillIndex];

  return (
    <section
      className={
        isDarkMode ? styles.hero : `${styles.hero} ${styles.heroLight}`
      }
    >
      <div className={styles.backgroundPattern}>
        <div className={styles.gridPattern}></div>
        <div className={styles.gradientOverlay}></div>
      </div>
      <div className={styles.floatingElements}>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
        <div className={styles.floatingElement}></div>
      </div>
      <div className={styles.container}>
        <div
          className={`${styles.profileSection} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.profileImageWrapper}>
            <div className={styles.profileImageContainer}>
              <img
                src="/images/ebuka.jpg"
                alt="Profile"
                className={styles.profileImage}
              />
              <div className={styles.profileImageBorder}></div>
              <div className={styles.statusIndicator}>
                <div className={styles.statusDot}></div>
              </div>
            </div>
          </div>
          <div className={styles.profileContent}>
            <div className={styles.greeting}>
              <span className={styles.wave}>👋</span>
              <span>Hello, I'm</span>
            </div>
            <h1 className={styles.name}>
              <span className={styles.firstName}>Chukwuebuka</span>
              <span className={styles.lastName}>Egwuete</span>
            </h1>
            <div className={styles.roleContainer}>
              <span className={styles.roleText}>Full Stack Developer</span>
              <div className={styles.roleUnderline}></div>
            </div>
            <p className={styles.description}>
              Passionate about creating exceptional digital experiences through
              clean code and innovative solutions. I specialize in modern web
              technologies and love turning complex problems into simple,
              beautiful designs.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  style={
                    { "--social-color": social.color } as React.CSSProperties
                  }
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            {/* <div className={styles.ctaButtons}>
              <button className={styles.primaryButton}>
                <span>View My Work</span>
                <ExternalLink size={18} />
              </button>
              <button className={styles.secondaryButton}>Download CV</button>
            </div> */}
          </div>
        </div>

        <div
          className={`${styles.skillsSection} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.skillsCarousel}>
            <button
              className={styles.carouselButton}
              onClick={prevSkill}
              aria-label="Previous skill"
            >
              <ChevronLeft size={20} />
            </button>
            <div
              className={styles.skillCard}
              style={
                { "--skill-color": currentSkill.color } as React.CSSProperties
              }
            >
              <div className={styles.skillIcon}>{currentSkill.icon}</div>
              <div className={styles.skillName}>{currentSkill.name}</div>
              <div className={styles.skillProgress}>
                <div className={styles.skillProgressBar}></div>
              </div>
            </div>
            <button
              className={styles.carouselButton}
              onClick={nextSkill}
              aria-label="Next skill"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className={styles.skillIndicators}>
            {techSkills.map((_, index) => (
              <button
                key={index}
                className={`${styles.skillIndicator} ${
                  index === currentSkillIndex ? styles.active : ""
                }`}
                onClick={() => setCurrentSkillIndex(index)}
                aria-label={`Go to skill ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollText}>Scroll to explore</div>
        <div className={styles.scrollArrow}></div>
      </div>
    </section>
  );
};

export default Hero;
