"use client";

import React from "react";
import { useState, useEffect } from "react";
import {
  Award,
  Calendar,
  Clock,
  CheckCircle,
  Star,
  Trophy,
  Zap,
} from "lucide-react";
import styles from "./styles.module.css";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issuerLogo: string | React.ReactNode;
  date: string;
  duration: string;
  description: string;
  skills: string[];
  certificateImage: string;
  verificationUrl?: string;
  credentialId?: string;
  featured: boolean;
  color: string;
}

const Certifications: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  const certifications: Certification[] = [
    {
      id: "freecodecamp-js",
      title: "Legacy JavaScript Algorithms and Data Structures",
      issuer: "freeCodeCamp",
      issuerLogo: (
        <img
          src="/images/freeLogo.PNG"
          alt="freeCodeCamp"
          style={{ width: 40, height: 40 }}
        />
      ),
      date: "November 24, 2024",
      duration: "300 hours",
      description:
        "Comprehensive certification covering JavaScript fundamentals, algorithms, data structures, and problem-solving techniques. Completed extensive projects and coding challenges.",
      skills: [
        "JavaScript",
        "Algorithms",
        "Data Structures",
        "Problem Solving",
        "ES6+",
        "Functional Programming",
      ],
      certificateImage: "/images/free.PNG",
      verificationUrl:
        "https:https://www.freecodecamp.org/certification/Ebuka_0racle/javascript-algorithms-and-data-structures",
      credentialId: "Ebuka_0racle",
      featured: true,
      color: "#0a0a23",
    },
    {
      id: "genesys-frontend",
      title: "Codename: Learnable Internship (Frontend)",
      issuer: "Genesys & Learnable",
      issuerLogo: (
        <img
          src="/images/logo.PNG"
          alt="Genesys"
          style={{ width: 40, height: 40 }}
        />
      ),
      date: "June 2024",
      duration: "6 months",
      description:
        "Intensive frontend development internship focusing on modern web technologies, collaboration, and real-world problem solving. Demonstrated strong learning abilities and technical skills.",
      skills: [
        "Frontend Development",
        "React",
        "JavaScript",
        "Collaboration",
        "Problem Solving",
        "Web Technologies",
      ],
      certificateImage: "/images/genesys.png",
      credentialId: "2023-Cohort",
      featured: true,
      color: "#ff6b35",
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleCertificateClick = (certId: string) => {
    setSelectedCert(selectedCert === certId ? null : certId);
  };

  return (
    <section className={styles.certificationsSection} id="certifications">
      <div className={styles.certificationsContainer}>
        {/* Header */}
        <div
          className={`${styles.certificationsHeader} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Trophy size={32} />
            </div>
            <h2 className={styles.certificationsTitle}>
              Certifications & Achievements
            </h2>
            <p className={styles.certificationsSubtitle}>
              Professional certifications and learning milestones
            </p>
          </div>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <Award size={20} />
              <span>{certifications.length} Certifications</span>
            </div>
            <div className={styles.statItem}>
              <Clock size={20} />
              <span>300+ Hours Learning</span>
            </div>
            <div className={styles.statItem}>
              <Star size={20} />
              <span>100% Completion Rate</span>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div
          className={`${styles.certificationsGrid} ${
            isVisible ? styles.visible : ""
          }`}
        >
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className={`${styles.certificationCard} ${
                cert.featured ? styles.featured : ""
              } ${selectedCert === cert.id ? styles.expanded : ""}`}
              style={
                {
                  "--cert-color": cert.color,
                  "--animation-delay": `${index * 0.2}s`,
                } as React.CSSProperties
              }
              onClick={() => handleCertificateClick(cert.id)}
            >
              <div className={styles.cardInner}>
                {/* Certificate Image */}
                <div className={styles.certificateImage}>
                  <img
                    src={cert.certificateImage || "/placeholder.svg"}
                    alt={`${cert.title} Certificate`}
                  />
                  <div className={styles.imageOverlay}>
                    {/* <div className={styles.overlayContent}>
                      <ExternalLink size={24} />
                      <span>View Certificate</span>
                    </div> */}
                  </div>
                  {cert.featured && (
                    <div className={styles.featuredBadge}>
                      <Star size={14} />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Certificate Content */}
                <div className={styles.certificateContent}>
                  <div className={styles.certHeader}>
                    <div className={styles.issuerInfo}>
                      <div className={styles.issuerLogo}>{cert.issuerLogo}</div>
                      <div className={styles.issuerDetails}>
                        <h3 className={styles.certTitle}>{cert.title}</h3>
                        <p className={styles.certIssuer}>{cert.issuer}</p>
                      </div>
                    </div>
                    <div className={styles.certActions}>
                      {cert.verificationUrl && (
                        <a
                          href={cert.verificationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.verifyBtn}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <CheckCircle size={16} />
                          <span>Verify</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className={styles.certMeta}>
                    <div className={styles.metaItem}>
                      <Calendar size={14} />
                      <span>{cert.date}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={14} />
                      <span>{cert.duration}</span>
                    </div>
                    {cert.credentialId && (
                      <div className={styles.credentialId}>
                        <span>ID: {cert.credentialId}</span>
                      </div>
                    )}
                  </div>

                  <p className={styles.certDescription}>{cert.description}</p>

                  {/* Skills */}
                  <div className={styles.skillsSection}>
                    <h4 className={styles.skillsTitle}>Skills Acquired</h4>
                    <div className={styles.skillsList}>
                      {cert.skills.map((skill, skillIndex) => (
                        <div key={skillIndex} className={styles.skillTag}>
                          <Zap size={12} />
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {selectedCert === cert.id && (
                    <div className={styles.expandedContent}>
                      <div className={styles.achievementHighlights}>
                        <h4 className={styles.highlightsTitle}>
                          Achievement Highlights
                        </h4>
                        <div className={styles.highlightsGrid}>
                          <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}>🏆</div>
                            <div className={styles.highlightText}>
                              <strong>Completion Rate:</strong> 100%
                            </div>
                          </div>
                          <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}>⚡</div>
                            <div className={styles.highlightText}>
                              <strong>Learning Hours:</strong> {cert.duration}
                            </div>
                          </div>
                          <div className={styles.highlightItem}>
                            <div className={styles.highlightIcon}>🎯</div>
                            <div className={styles.highlightText}>
                              <strong>Skills Mastered:</strong>{" "}
                              {cert.skills.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Summary */}
        <div
          className={`${styles.achievementSummary} ${
            isVisible ? styles.visible : ""
          }`}
        >
          <div className={styles.summaryCard}>
            <div className={styles.summaryHeader}>
              <Trophy size={24} />
              <h3>Learning Journey</h3>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.journeyStats}>
                <div className={styles.journeyStat}>
                  <div className={styles.statIcon}>📚</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statNumber}>2</div>
                    <div className={styles.statLabel}>
                      Certifications Earned
                    </div>
                  </div>
                </div>
                <div className={styles.journeyStat}>
                  <div className={styles.statIcon}>⏱️</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statNumber}>300+</div>
                    <div className={styles.statLabel}>Hours of Learning</div>
                  </div>
                </div>
                <div className={styles.journeyStat}>
                  <div className={styles.statIcon}>🚀</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statNumber}>12+</div>
                    <div className={styles.statLabel}>Skills Acquired</div>
                  </div>
                </div>
                <div className={styles.journeyStat}>
                  <div className={styles.statIcon}>🎯</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statNumber}>100%</div>
                    <div className={styles.statLabel}>Success Rate</div>
                  </div>
                </div>
              </div>
              <div className={styles.learningQuote}>
                <blockquote>
                  "Continuous learning is the key to staying relevant in the
                  ever-evolving world of technology."
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
