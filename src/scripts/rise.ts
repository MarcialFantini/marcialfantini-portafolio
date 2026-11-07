/**
 * Entrances, triggered once as each part scrolls in:
 * - [data-rise]  the block rises (heading, then text, then picture, staggered via --i)
 * - [data-split] a heading rises word by word
 * - [data-drive] the mascot drives in
 * Content is visible by default; this script opts the page into the hidden-then-rise
 * state only when it can also reveal it, and never under reduced motion.
 */
let io: IntersectionObserver | null = null;
const SELECTOR = "[data-rise], [data-split], [data-drive]";

function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone || el.children.length) return;
  const words = (el.textContent ?? "").trim().split(/\s+/);
  el.setAttribute("aria-label", words.join(" "));
  el.textContent = "";
  words.forEach((w, i) => {
    const span = document.createElement("span");
    span.className = "w";
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--wi", String(i));
    span.textContent = w;
    el.append(span);
    if (i < words.length - 1) el.append(" ");
  });
  el.dataset.splitDone = "1";
}

function setup() {
  io?.disconnect();
  const items = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (!items.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

  document.querySelectorAll<HTMLElement>("[data-split]").forEach(splitWords);

  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("is-in");
        io!.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  document.documentElement.classList.add("rise-ready");
  items.forEach((el) => io!.observe(el));
}

document.addEventListener("astro:page-load", setup);

export {};
