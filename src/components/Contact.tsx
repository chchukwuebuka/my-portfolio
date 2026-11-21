import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import {
  trackContactClick,
  trackFileDownload,
  trackGitHubClick,
  trackLinkedInClick,
} from "../utils/analytics";
import { gsap, REDUCED_MOTION_QUERY } from "../utils/gsap";
import BlockReveal from "./BlockReveal";
import styles from "./Contact.module.css";

export const Contact = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const { contact, profile } = portfolioData;

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-contact-left]", {
          y: 26,
          opacity: 0,
          duration: 0.72,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        });

        gsap.from("[data-contact-channel]", {
          y: 18,
          opacity: 0,
          duration: 0.55,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-contact-channels]",
            start: "top 85%",
            once: true,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const handleCopyEmail = async () => {
    trackContactClick("email_copy", "contact_section");
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      const input = document.createElement("input");
      input.value = contact.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    }
  };

  const channels = [
    {
      label: "LinkedIn",
      value: "linkedin.com/in/chukwuebuka-egwuete",
      href: contact.linkedin,
      external: true,
    },
    {
      label: "GitHub",
      value: "github.com/chchukwuebuka",
      href: contact.github,
      external: true,
    },
    {
      label: "X / Twitter",
      value: "@Ebuka__042",
      href: contact.twitter,
      external: true,
    },
    {
      label: "Phone",
      value: contact.phone,
      href: contact.phoneHref,
      external: false,
    },
    {
      label: "Résumé",
      value: "Download CV (PDF)",
      href: profile.resumeUrl,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="contact-heading"
    >
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.left}>
            <span className="eyebrow" data-contact-left>
              <span className="eyebrow-index">06</span>
              <span>/ {contact.eyebrow}</span>
            </span>

            <BlockReveal blockColor="#B89A6A">
              <h2 id="contact-heading" className={styles.heading}>
                {contact.heading}
              </h2>
            </BlockReveal>

            <p className={styles.description} data-contact-left>
              {contact.description}
            </p>

            <div className={styles.emailRow} data-contact-left>
              <a
                href={`mailto:${contact.email}`}
                className={styles.emailLink}
                onClick={() => trackContactClick("email", "contact_section")}
              >
                <span>{contact.email}</span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className={`${styles.copyBtn} ${
                  copied ? styles.copyBtnCopied : ""
                }`}
                aria-label="Copy email address to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} aria-hidden="true" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} aria-hidden="true" />
                    <span>Copy email</span>
                  </>
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied to clipboard." : ""}
              </span>
            </div>
          </div>

          <div className={styles.right} data-contact-channels>
            {channels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.external ? "_blank" : undefined}
                rel={channel.external ? "noopener noreferrer" : undefined}
                className={styles.channelRow}
                data-contact-channel
                onClick={() => {
                  if (channel.label === "LinkedIn") {
                    trackLinkedInClick("contact_section", channel.href);
                  } else if (channel.label === "GitHub") {
                    trackGitHubClick("contact_section", channel.href);
                  } else if (channel.label === "X / Twitter") {
                    trackContactClick("twitter", "contact_section");
                  } else if (channel.label === "Phone") {
                    trackContactClick("phone", "contact_section");
                  } else if (channel.label === "Résumé") {
                    trackFileDownload(
                      "Chukwuebuka_Emmanuel_Egwuete_CV.pdf",
                      "contact_section"
                    );
                  }
                }}
              >
                <span className={styles.channelLabel}>{channel.label}</span>
                <span className={styles.channelValue}>
                  <span>{channel.value}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
