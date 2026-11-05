/**
 * Motion — un único rAF para todo lo ligado al scroll.
 * Regla de rendimiento: nunca se escriben custom properties en <html>
 * (invalida el estilo de todo el árbol). Cada valor se escribe en el
 * elemento que lo consume y solo se anima transform/opacity.
 */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let revealIo: IntersectionObserver | null = null;
let chapterIo: IntersectionObserver | null = null;
let parallax: HTMLElement[] = [];
let hero: HTMLElement | null = null;
let bar: HTMLElement | null = null;
let glow: HTMLElement | null = null;
let mx = -999;
let my = -999;
let pointerDirty = false;
let ticking = false;

function revealAll() {
  document.querySelectorAll(".reveal, .reveal-stagger").forEach((el) => {
    el.setAttribute("data-revealed", "in");
  });
}

function buildRail() {
  document.querySelector(".chapter-rail")?.remove();
  chapterIo?.disconnect();
  chapterIo = null;

  const chapters = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
  if (chapters.length < 3) return;

  const rail = document.createElement("nav");
  rail.className = "chapter-rail";
  rail.setAttribute("aria-label", "Capítulos de la página");

  const links = chapters.map((ch, i) => {
    if (!ch.id) ch.id = `cap-${i + 1}`;
    const a = document.createElement("a");
    a.href = `#${ch.id}`;
    a.setAttribute("aria-current", i === 0 ? "true" : "false");
    const label = document.createElement("span");
    label.className = "chapter-rail__label";
    label.textContent = ch.dataset.chapter ?? "";
    const dot = document.createElement("span");
    dot.className = "chapter-rail__dot";
    a.append(label, dot);
    rail.appendChild(a);
    return a;
  });
  document.body.appendChild(rail);

  chapterIo = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const idx = chapters.indexOf(e.target as HTMLElement);
        links.forEach((l, j) => l.setAttribute("aria-current", j === idx ? "true" : "false"));
      }
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  chapters.forEach((c) => chapterIo!.observe(c));
}

function bindMagnet(el: HTMLElement) {
  if (el.dataset.magnet) return;
  el.dataset.magnet = "1";
  el.classList.add("magnetic");
  el.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.18;
    const y = (e.clientY - r.top - r.height / 2) * 0.28;
    // Vars consumidas por la propiedad CSS `translate`: no pisan el transform del hover
    el.style.setProperty("--mx", `${x.toFixed(1)}px`);
    el.style.setProperty("--my", `${y.toFixed(1)}px`);
  });
  el.addEventListener("pointerleave", () => {
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  });
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
}

function frame() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;

  if (bar) bar.style.transform = `scaleX(${(max > 0 ? Math.min(y / max, 1) : 0).toFixed(4)})`;

  if (hero) {
    const hr = hero.getBoundingClientRect();
    const hp = Math.max(0, Math.min(1, -hr.top / (hr.height * 0.85)));
    hero.style.setProperty("--hp", hp.toFixed(3));
  }

  for (const el of parallax) {
    const r = el.parentElement!.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) continue;
    const speed = parseFloat(el.dataset.parallax ?? "") || 0.15;
    el.style.setProperty("--p", `${((r.top + r.height / 2 - vh / 2) * -speed).toFixed(1)}px`);
  }

  if (pointerDirty && glow) {
    glow.style.transform = `translate3d(${mx}px,${my}px,0)`;
    pointerDirty = false;
  }
}

function setup() {
  // Titulares de sección entran solos, sin tocar cada componente
  document.querySelectorAll("main h2").forEach((h) => {
    if (!h.closest(".reveal, .reveal-stagger, [data-scene]")) h.classList.add("reveal");
  });

  if (reduce) {
    revealAll();
    buildRail();
    return;
  }

  revealIo?.disconnect();
  revealIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-revealed", "in");
        revealIo!.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  document
    .querySelectorAll(".reveal:not([data-revealed]), .reveal-stagger:not([data-revealed])")
    .forEach((el) => revealIo!.observe(el));

  parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
  hero = document.querySelector<HTMLElement>("[data-scene]");
  bar = document.querySelector<HTMLElement>(".page-progress");
  glow = document.querySelector<HTMLElement>(".spotlight");
  document.querySelectorAll<HTMLElement>(".btn-sunset, .btn-ghost").forEach(bindMagnet);

  buildRail();
  // Sin intro: los titulares con máscara (.mask-line) se revelan en el primer frame
  requestAnimationFrame(() => document.body.classList.add("is-loaded"));
  schedule();
}

if (!reduce) {
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX;
      my = e.clientY;
      pointerDirty = true;
      schedule();
    },
    { passive: true }
  );
}

// astro:page-load se dispara en la carga inicial y en cada navegación del ClientRouter
document.addEventListener("astro:page-load", setup);
