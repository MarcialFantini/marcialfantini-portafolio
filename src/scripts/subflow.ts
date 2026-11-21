/**
 * Motion vocabulary for the inner pages (services, projects, about, contact, 404).
 * Same language as the home chapters, driven by data attributes so pages stay declarative:
 *
 *   [data-sub-title]   heading whose words rise one by one. An h1 plays on load, anything else on scroll.
 *                      Child elements (e.g. <small>) rise as one unit.
 *   [data-stagger]     direct children rise in sequence when the container scrolls in.
 *   [data-reveal]      one element rises when it scrolls in. Optional value "left" / "right" slides sideways.
 *   [data-count]       number counts up from 0 to the value of the attribute (es-AR format) when it scrolls in.
 *   [data-grow]        bar or line grows from the left (scaleX); "y" grows from the bottom (scaleY).
 *   [data-parallax]    drifts vertically while scrolling; the value is the travel in px (default 60).
 *
 * Content is visible without JS and under prefers-reduced-motion: start states are only set from here.
 * Component-specific moments (pins, loops) live in each component's own script using ../scripts/motion.
 */
import { gsap, ScrollTrigger, onPage, reduced } from "./motion";

const fmt = new Intl.NumberFormat("es-AR");

function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.subSplit) return Array.from(el.querySelectorAll<HTMLElement>(":scope .sw"));
  const units: HTMLElement[] = [];
  const nodes = Array.from(el.childNodes);
  el.textContent = "";
  for (const node of nodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? "").split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          el.append(" ");
          continue;
        }
        const span = document.createElement("span");
        span.className = "sw";
        span.textContent = part;
        el.append(span);
        units.push(span);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && (node as Element).tagName === "BR") {
      el.append(node);
    } else {
      const span = document.createElement("span");
      span.className = "sw";
      span.append(node);
      el.append(span);
      units.push(span);
    }
  }
  el.dataset.subSplit = "1";
  return units;
}

function setup(): (() => void) | void {
  const root = document.querySelector<HTMLElement>("[data-subflow]");
  if (!root) return;
  // The hero title is hidden by an inline pre-paint class; always release it, motion or not.
  const release = () => document.documentElement.classList.remove("sub-pre");
  if (reduced()) {
    release();
    return;
  }

  const ctx = gsap.context(() => {
    const onEnter = (trigger: Element) => ({ trigger, start: "top 85%", once: true });

    gsap.utils.toArray<HTMLElement>("[data-sub-title]").forEach((el) => {
      const words = splitWords(el);
      const isHero = el.tagName === "H1";
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(words, {
        yPercent: 70,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.07,
        delay: isHero ? 0.05 : 0,
        scrollTrigger: isHero ? undefined : onEnter(el),
      });
    });
    release();

    gsap.utils.toArray<HTMLElement>("[data-hero-follow]").forEach((el, i) => {
      gsap.from(el, { y: 24, autoAlpha: 0, duration: 0.7, ease: "power2.out", delay: 0.35 + i * 0.1 });
    });

    gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
      gsap.from(el.children, {
        y: 36,
        autoAlpha: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: onEnter(el),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
      const dir = el.dataset.reveal;
      const from = dir === "left" ? { x: -48 } : dir === "right" ? { x: 48 } : { y: 36 };
      gsap.from(el, { ...from, autoAlpha: 0, duration: 0.8, ease: "power2.out", scrollTrigger: onEnter(el) });
    });

    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      if (!Number.isFinite(end)) return;
      const box = { v: 0 };
      el.textContent = fmt.format(0);
      gsap.to(box, {
        v: end,
        duration: 1.2,
        ease: "power2.out",
        onUpdate: () => (el.textContent = fmt.format(Math.round(box.v))),
        scrollTrigger: onEnter(el),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
      const vertical = el.dataset.grow === "y";
      gsap.from(el, {
        ...(vertical ? { scaleY: 0, transformOrigin: "50% 100%" } : { scaleX: 0, transformOrigin: "0% 50%" }),
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: onEnter(el),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
      const travel = Number(el.dataset.parallax) || 60;
      gsap.fromTo(
        el,
        { y: travel },
        { y: -travel, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.5 } }
      );
    });
  }); // not scoped to root: Field sections live outside the hero

  ScrollTrigger.refresh();
  return () => ctx.revert();
}

onPage(setup);
