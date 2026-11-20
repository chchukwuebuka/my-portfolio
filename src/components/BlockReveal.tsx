import React, { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, REDUCED_MOTION_QUERY } from "../utils/gsap";

interface BlockRevealProps {
  children: React.ReactElement;
  animateOnScroll?: boolean;
  delay?: number;
  blockColor?: string;
  stagger?: number;
  duration?: number;
}

/**
 * Editorial block-curtain line reveal inspired by LandoNorris / Codegrid.
 * Splits rendered lines with GSAP SplitText and sweeps a curtain block across each line.
 */
export const BlockReveal = ({
  children,
  animateOnScroll = true,
  delay = 0,
  blockColor = "#B89A6A",
  stagger = 0.11,
  duration = 0.52,
}: BlockRevealProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    let cancelled = false;
    let splitInstance: SplitText | null = null;
    const triggers: ScrollTrigger[] = [];
    const timelines: gsap.core.Timeline[] = [];

    const mm = gsap.matchMedia();

    mm.add(REDUCED_MOTION_QUERY, () => {
      const target = root.firstElementChild as HTMLElement | null;
      if (!target) return;

      const setup = () => {
        if (cancelled || !root.isConnected) return;

        splitInstance = SplitText.create(target, {
          type: "lines",
          linesClass: "block-line",
          lineThreshold: 0.15,
        });

        const lines: HTMLElement[] = [];
        const blocks: HTMLElement[] = [];

        splitInstance.lines.forEach((lineEl) => {
          const line = lineEl as HTMLElement;
          const wrapper = document.createElement("span");
          wrapper.className = "block-line-wrapper";
          line.parentNode?.insertBefore(wrapper, line);
          wrapper.appendChild(line);

          const block = document.createElement("span");
          block.className = "block-revealer";
          block.style.backgroundColor = blockColor;
          block.setAttribute("aria-hidden", "true");
          wrapper.appendChild(block);

          lines.push(line);
          blocks.push(block);
        });

        if (lines.length === 0) return;

        gsap.set(lines, { opacity: 0 });
        gsap.set(blocks, { scaleX: 0, transformOrigin: "left center" });

        const createLineTimeline = (
          block: HTMLElement,
          line: HTMLElement,
          index: number
        ) => {
          const tl = gsap.timeline({
            delay: delay + index * stagger,
            paused: animateOnScroll,
          });
          tl.to(block, { scaleX: 1, duration, ease: "power4.inOut" });
          tl.set(line, { opacity: 1 });
          tl.set(block, { transformOrigin: "right center" });
          tl.to(block, { scaleX: 0, duration, ease: "power4.inOut" });
          timelines.push(tl);
          return tl;
        };

        if (animateOnScroll) {
          const lineTimelines = blocks.map((block, index) =>
            createLineTimeline(block, lines[index], index)
          );
          const st = ScrollTrigger.create({
            trigger: root,
            start: "top 88%",
            once: true,
            onEnter: () => {
              lineTimelines.forEach((tl) => tl.play());
            },
          });
          triggers.push(st);
        } else {
          blocks.forEach((block, index) => {
            createLineTimeline(block, lines[index], index);
          });
        }
      };

      // Wait for web fonts to settle so line splits match final rendered wrapping
      if (document.fonts && document.fonts.status !== "loaded") {
        document.fonts.ready.then(setup);
      } else {
        setup();
      }

      return () => {
        cancelled = true;
        triggers.forEach((st) => st.kill());
        timelines.forEach((tl) => tl.kill());

        const wrappers = root.querySelectorAll(".block-line-wrapper");
        wrappers.forEach((wrapper) => {
          const line = wrapper.querySelector(".block-line");
          if (wrapper.parentNode && line) {
            wrapper.parentNode.insertBefore(line, wrapper);
            wrapper.remove();
          }
        });

        splitInstance?.revert();
      };
    });

    return () => {
      cancelled = true;
      mm.revert();
    };
  }, [animateOnScroll, delay, blockColor, stagger, duration]);

  return (
    <div ref={containerRef} className="block-reveal-scope">
      {children}
    </div>
  );
};

export default BlockReveal;
