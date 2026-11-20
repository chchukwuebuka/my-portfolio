import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, SplitText };
