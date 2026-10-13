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

/* Film: UN wrapper alto [data-film] con un único stage sticky; las escenas son
   capas apiladas [data-film-scene] con un tramo [data-from, data-to] del progreso
   global P (0..1). Cada capa recibe --p (local, lineal), --e (easeInOutCubic) y
   --o (opacidad de entrada: la capa nueva se funde encima de la saliente). */
interface Layer {
  el: HTMLElement;
  from: number;
  to: number;
  first: boolean;
  p: number;
  o: number;
  active: boolean;
  late: boolean;
  done: boolean;
}
let filmEl: HTMLElement | null = null;
let layers: Layer[] = [];
/* Tramo (fracción de P) del fundido de entrada y margen de activación */
const FADE = 0.02;
const PAD = 0.01;
/* Header fijo: .is-over-film cuando una escena del film cruza la franja del header. */
const HEADER_PROBE = 36;
let header: HTMLElement | null = null;
let headerOver = false;
let headerIo: IntersectionObserver | null = null;
/* CTA persistente: visible desde que termina El giro hasta que arranca el cierre */
let filmCta: HTMLElement | null = null;
let ctaOn = false;
const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

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
    el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
  });
  el.addEventListener("pointerleave", () => {
    el.style.transform = "";
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

  // Film: lecturas primero (todas), escrituras al final del frame
  const filmWrites: { l: Layer; p: number; o: number; active: boolean; late: boolean; done: boolean }[] = [];
  let overFilm = false;
  let showCta = false;
  if (filmEl) {
    const r = filmEl.getBoundingClientRect();
    // El stage sticky cubre el viewport mientras el wrapper cruza la franja del header
    if (r.top <= HEADER_PROBE && r.bottom > HEADER_PROBE) overFilm = true;
    const span = r.height - vh;
    const P = span > 0 ? clamp01(-r.top / span) : 0;
    if (layers.length > 2 && r.top <= 0 && r.bottom > vh * 0.5) {
      showCta = P >= layers[1].to && P < layers[layers.length - 1].from - 0.005;
    }
    for (const l of layers) {
      const p = clamp01((P - l.from) / (l.to - l.from));
      const o = l.first ? 1 : clamp01((P - l.from) / FADE);
      const active = P >= l.from - PAD && P <= l.to + FADE + PAD;
      const done = P > l.to;
      const late = p >= 0.6;
      if (Math.abs(p - l.p) > 0.0004 || Math.abs(o - l.o) > 0.004 || active !== l.active || late !== l.late || done !== l.done) {
        filmWrites.push({ l, p, o, active, late, done });
      }
    }
  }

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

  if (overFilm !== headerOver) {
    headerOver = overFilm;
    header?.classList.toggle("is-over-film", overFilm);
  }

  if (showCta !== ctaOn && filmCta) {
    ctaOn = showCta;
    filmCta.classList.toggle("is-on", showCta);
    filmCta.tabIndex = showCta ? 0 : -1;
    filmCta.setAttribute("aria-hidden", showCta ? "false" : "true");
  }

  for (const w of filmWrites) {
    const { l } = w;
    if (w.p !== l.p) {
      l.el.style.setProperty("--p", w.p.toFixed(4));
      l.el.style.setProperty("--e", easeInOutCubic(w.p).toFixed(4));
    }
    if (w.o !== l.o) l.el.style.setProperty("--o", w.o.toFixed(3));
    if (w.active !== l.active) l.el.classList.toggle("is-active", w.active);
    if (w.late !== l.late) l.el.classList.toggle("is-late", w.late);
    if (w.done !== l.done) l.el.classList.toggle("is-done", w.done);
    l.p = w.p;
    l.o = w.o;
    l.active = w.active;
    l.late = w.late;
    l.done = w.done;
  }

  if (pointerDirty && glow) {
    glow.style.transform = `translate3d(${mx}px,${my}px,0)`;
    pointerDirty = false;
  }
}

function setup() {
  // Titulares de sección entran solos, sin tocar cada componente
  document.querySelectorAll("main h2").forEach((h) => {
    if (!h.closest(".reveal, .reveal-stagger, [data-scene], [data-film]")) h.classList.add("reveal");
  });

  header = document.querySelector<HTMLElement>("[data-site-header]");
  headerOver = false;
  headerIo?.disconnect();
  headerIo = null;

  if (reduce) {
    revealAll();
    // Sin pin: las anclas (posicionadas por offset) no sirven; el capítulo pasa a cada capa estática
    document.querySelectorAll<HTMLElement>("[data-film-anchor]").forEach((a) => {
      const layer = document.querySelector<HTMLElement>(`[data-film-scene="${a.dataset.filmAnchor}"]`);
      if (layer) {
        layer.id = a.id;
        layer.dataset.chapter = a.dataset.chapter ?? "";
      }
      a.remove();
    });
    buildRail();
    // Film estático (sin pin): un IO sobre la franja superior del viewport alcanza
    const scenes = document.querySelectorAll<HTMLElement>("[data-film]");
    if (header && scenes.length) {
      const hit = new Set<Element>();
      headerIo = new IntersectionObserver(
        (entries) => {
          for (const e of entries) (e.isIntersecting ? hit.add(e.target) : hit.delete(e.target));
          header!.classList.toggle("is-over-film", hit.size > 0);
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - HEADER_PROBE - 1)}px 0px` }
      );
      scenes.forEach((s) => headerIo!.observe(s));
    }
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
  filmEl = document.querySelector<HTMLElement>("[data-film]");
  layers = Array.from(document.querySelectorAll<HTMLElement>("[data-film-scene]")).map((el, i) => ({
    el,
    from: parseFloat(el.dataset.from ?? "0"),
    to: parseFloat(el.dataset.to ?? "1"),
    first: i === 0,
    p: -1,
    o: -1,
    active: el.classList.contains("is-active"),
    late: false,
    done: false,
  }));
  filmCta = document.querySelector<HTMLElement>("[data-film-cta]");
  ctaOn = false;
  bar = document.querySelector<HTMLElement>(".page-progress");
  glow = document.querySelector<HTMLElement>(".spotlight");
  document.querySelectorAll<HTMLElement>(".btn-sunset, .btn-ghost").forEach(bindMagnet);

  buildRail();
  bindCards();
  initCursor();
  // Si hay intro, el hero espera a que la cortina termine
  const delay = document.querySelector(".intro") ? 1750 : 0;
  window.setTimeout(() => requestAnimationFrame(() => document.body.classList.add("is-loaded")), delay);
  schedule();
}

function bindCards() {
  document.querySelectorAll<HTMLElement>(".card-pop").forEach((el) => {
    if (el.dataset.tilt) return;
    el.dataset.tilt = "1";
    el.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--ry", `${((px - 0.5) * 7).toFixed(2)}deg`);
      el.style.setProperty("--rx", `${((0.5 - py) * 7).toFixed(2)}deg`);
      el.style.setProperty("--sx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--sy", `${(py * 100).toFixed(1)}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
  });
}

let ring: HTMLElement | null = null;
let ringX = -100;
let ringY = -100;
let tx = -100;
let ty = -100;
let ringRaf = 0;

function ringLoop() {
  ringX += (tx - ringX) * 0.2;
  ringY += (ty - ringY) * 0.2;
  if (ring) ring.style.transform = `translate3d(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px,0)`;
  ringRaf = Math.abs(tx - ringX) + Math.abs(ty - ringY) > 0.4 ? requestAnimationFrame(ringLoop) : 0;
}

function initCursor() {
  if (reduce || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  ring = document.querySelector<HTMLElement>(".cursor-ring");
  if (!ring) {
    ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    document.body.appendChild(ring);
  }
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
      if (ring) {
        tx = e.clientX;
        ty = e.clientY;
        ring.classList.add("is-on");
        const hot = (e.target as Element).closest("a, button, .card-pop, input, textarea, select");
        ring.classList.toggle("is-hot", !!hot);
        if (!ringRaf) ringRaf = requestAnimationFrame(ringLoop);
      }
    },
    { passive: true }
  );
}

// astro:page-load se dispara en la carga inicial y en cada navegación del ClientRouter
document.addEventListener("astro:page-load", setup);
