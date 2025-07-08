"use client";

import React from "react";
import { useState } from "react";
import {
  Code,
  Wrench,
  FolderOpen,
  Briefcase,
  GraduationCap,
  FileText,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "../../src/contexts/ThemeContext";
import styles from "./styles.module.css";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

const Navbar: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      id: "skills",
      label: "Skills",
      icon: <Wrench size={16} />,
      href: "#skills",
    },
    {
      id: "projects",
      label: "Projects",
      icon: <FolderOpen size={16} />,
      href: "#projects",
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase size={16} />,
      href: "#experience",
    },
    {
      id: "education",
      label: "Education",
      icon: <GraduationCap size={16} />,
      href: "#education",
    },
    {
      id: "resume",
      label: "Resume",
      icon: <FileText size={16} />,
      href: "#resume",
    },
  ];

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <div className={styles.brand}>
          <Code size={20} className={styles.brandIcon} />
          <span className={styles.brandText}>Chukwuebuka</span>
        </div>

        {/* Navigation Items */}
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.id} className={styles.navItem}>
              <a href={item.href} className={styles.navLink}>
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* Right Side Actions */}
        <div className={styles.actions}>
          <button
            className={styles.actionButton}
            onClick={toggleSearch}
            aria-label="Search"
          >
            <Search size={18} />
          </button>

          <button
            className={styles.actionButton}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Search Overlay */}
        {isSearchOpen && (
          <div className={styles.searchOverlay}>
            <input
              type="text"
              placeholder="Search..."
              className={styles.searchInput}
              autoFocus
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
