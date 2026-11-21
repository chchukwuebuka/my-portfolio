import { portfolioData } from "../data/portfolio";
import {
  trackContactClick,
  trackGitHubClick,
  trackLinkedInClick,
} from "../utils/analytics";
import Monogram from "./Monogram";
import styles from "./Footer.module.css";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.identity}>
          <Monogram size={26} />
          <div className={styles.identityText}>
            <span className={styles.name}>{portfolioData.profile.fullName}</span>
            <span className={styles.meta}>
              {portfolioData.profile.role} · {portfolioData.profile.location}
            </span>
          </div>
        </div>

        <p className={styles.note}>Designed and built with intention.</p>

        <div className={styles.right}>
          <a
            href={portfolioData.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={() =>
              trackGitHubClick("footer", portfolioData.contact.github)
            }
          >
            GitHub
          </a>
          <a
            href={portfolioData.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onClick={() =>
              trackLinkedInClick("footer", portfolioData.contact.linkedin)
            }
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${portfolioData.contact.email}`}
            className={styles.link}
            onClick={() => trackContactClick("email", "footer")}
          >
            Email
          </a>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.copyright}>© {year}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
