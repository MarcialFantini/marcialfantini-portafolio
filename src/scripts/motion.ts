// Shared motion setup for the chapter sections.
// The site uses Astro's ClientRouter, so every section script must (re)initialise on "astro:page-load"
// and clean up before the next swap. Use onPage() for that; it handles both.
//
//   import { gsap, ScrollTrigger, onPage, reduced } from "../../scripts/motion";
//   onPage(() => {
//     const root = document.querySelector<HTMLElement>("#ciclo");
//     if (!root) return;
//     const ctx = gsap.context(() => { /* tweens and ScrollTriggers scoped to root */ }, root);
//     return () => ctx.revert();
//   });
//
// Content must be readable without JS: set hidden start states from JS (gsap.from / fromTo), never in CSS.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const reduced = (): boolean => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function onPage(setup: () => (() => void) | void): void {
  let cleanup: (() => void) | undefined;
  document.addEventListener("astro:page-load", () => {
    cleanup?.();
    cleanup = setup() || undefined;
  });
  document.addEventListener("astro:before-swap", () => {
    cleanup?.();
    cleanup = undefined;
  });
}

export { gsap, ScrollTrigger };
