import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, REDUCED_MOTION_QUERY } from "../utils/gsap";
import styles from "./ScrollHighlightText.module.css";

interface ScrollHighlightTextProps {
  paragraphs: string[];
  keywords?: string[];
  leadFirst?: boolean;
}

const DEFAULT_KEYWORDS = [
  "products",
  "systems",
  "frontend",
  "backend",
  "apis",
  "deployment",
  "automation",
  "scale",
  "interfaces",
  "databases",
  "purpose",
];

/**
 * Scroll-scrubbed word highlight-block reveal adapted from NavigateIO / Codegrid.
 * Words emerge from dark pill blocks into crisp typography as the reader scrolls,
 * without scroll-trapping pins and staying permanently legible once revealed.
 */
export const ScrollHighlightText = ({
  paragraphs,
  keywords = DEFAULT_KEYWORDS,
  leadFirst = true,
}: ScrollHighlightTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const normalizedSet = new Set(keywords.map((k) => k.toLowerCase()));

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const words = Array.from(
        container.querySelectorAll<HTMLElement>("[data-scroll-word]")
      );
      if (words.length === 0) return;

      const pillRgb = "38, 38, 38";
      const totalWords = words.length;
      const overlapWords = Math.min(14, Math.max(6, Math.round(totalWords * 0.2)));

      // Initialize subtle pre-reveal state
      words.forEach((word) => {
        const span = word.querySelector<HTMLElement>("[data-scroll-word-text]");
        word.style.opacity = "0.22";
        word.style.backgroundColor = `rgba(${pillRgb}, 0.55)`;
        if (span) span.style.opacity = "0.18";
      });

      let maxProgress = 0;

      const updateWords = (progress: number) => {
        // Keep revealed words permanently readable as the user scrolls past
        const revealProgress = Math.max(maxProgress, Math.min(1, progress));
        maxProgress = revealProgress;

        const timelineScale =
          1 / Math.max(1, (totalWords - 1) / totalWords + overlapWords / totalWords);

        words.forEach((word, index) => {
          const wordText = word.querySelector<HTMLElement>("[data-scroll-word-text]");
          const wordStart = (index / totalWords) * timelineScale;
          const wordEnd = ((index + overlapWords) / totalWords) * timelineScale;
          const duration = Math.max(0.001, wordEnd - wordStart);

          const wordProgress =
            revealProgress <= wordStart
              ? 0
              : revealProgress >= wordEnd
                ? 1
                : (revealProgress - wordStart) / duration;

          word.style.opacity = String(0.22 + 0.78 * wordProgress);

          const backgroundFadeStart =
            wordProgress >= 0.65 ? (wordProgress - 0.65) / 0.35 : 0;
          const backgroundOpacity = Math.max(0, (1 - backgroundFadeStart) * 0.85);
          word.style.backgroundColor = `rgba(${pillRgb}, ${backgroundOpacity})`;

          const textRevealThreshold = 0.45;
          const textRevealProgress =
            wordProgress >= textRevealThreshold
              ? (wordProgress - textRevealThreshold) / (1 - textRevealThreshold)
              : 0;
          if (wordText) {
            wordText.style.opacity = String(
              0.18 + 0.82 * Math.pow(textRevealProgress, 0.65)
            );
          }
        });
      };

      const st = ScrollTrigger.create({
        trigger: container,
        start: "top 86%",
        end: "bottom 54%",
        scrub: true,
        onUpdate: (self) => updateWords(self.progress),
      });

      // Ensure already-in-view text updates immediately
      updateWords(st.progress);

      return () => {
        st.kill();
        words.forEach((word) => {
          const span = word.querySelector<HTMLElement>("[data-scroll-word-text]");
          word.style.opacity = "";
          word.style.backgroundColor = "";
          if (span) span.style.opacity = "";
        });
      };
    });

    return () => mm.revert();
  }, [paragraphs]);

  return (
    <div ref={containerRef} className={styles.wrapper}>
      {paragraphs.map((text, pIndex) => {
        const tokens = text.split(/\s+/).filter(Boolean);
        return (
          <p
            key={text}
            className={`${styles.paragraph} ${
              leadFirst && pIndex === 0 ? styles.lead : ""
            }`}
          >
            {tokens.map((token, wIndex) => {
              const clean = token.toLowerCase().replace(/[.,!?;:"'—–-]/g, "");
              const isKeyword = normalizedSet.has(clean);
              return (
                <span
                  key={`${pIndex}-${wIndex}-${token}`}
                  data-scroll-word
                  className={`${styles.word} ${
                    isKeyword ? styles.keywordWrap : ""
                  }`}
                >
                  <span
                    data-scroll-word-text
                    className={`${styles.wordText} ${
                      isKeyword ? styles.keyword : ""
                    }`}
                  >
                    {token}
                  </span>
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};

export default ScrollHighlightText;
