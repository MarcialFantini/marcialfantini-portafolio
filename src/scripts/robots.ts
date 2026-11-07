/**
 * Robot scenes: pause every loop while its scene is off screen, and wire the two
 * scenes that react to the visitor.
 * - data-listen="board": cheers when a KPI goes up, waves when a tab is picked.
 * - data-listen="uc":    thinks while the visitor types, delivers the message on send.
 */
const timers = new WeakMap<HTMLElement, number>();

function setMood(el: HTMLElement, mood: string, ms = 0) {
  const prev = timers.get(el);
  if (prev) window.clearTimeout(prev);
  el.dataset.mood = "idle";
  void el.offsetWidth; // restart the animation even for the same mood
  el.dataset.mood = mood;
  if (ms) timers.set(el, window.setTimeout(() => (el.dataset.mood = el.dataset.base || "idle"), ms));
}

function bindBoard(el: HTMLElement) {
  const board = document.querySelector<HTMLElement>("[data-board]");
  if (!board) return;
  let last = 0;
  board.addEventListener("board:tick", (e) => {
    const diff = (e as CustomEvent<{ diff: number }>).detail?.diff ?? 0;
    const now = Date.now();
    if (diff <= 0 || now - last < 3500) return;
    last = now;
    setMood(el, "happy", 1700);
  });
  board.addEventListener("board:select", () => setMood(el, "wave", 1800));
}

function bindForm(el: HTMLElement) {
  const form = document.querySelector<HTMLFormElement>(".uc__form");
  const input = form?.querySelector<HTMLInputElement>("input[name=text]");
  if (!form || !input) return;
  input.addEventListener("focus", () => {
    el.dataset.base = "think";
    setMood(el, "think");
  });
  input.addEventListener("blur", () => {
    el.dataset.base = "idle";
    if (el.dataset.mood === "think") setMood(el, "idle");
  });
  form.addEventListener("submit", () => {
    if (input.value.trim()) setMood(el, "send", 2600);
  });
}

function setup() {
  const scenes = document.querySelectorAll<HTMLElement>("[data-rb]");
  if (!scenes.length) return;
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) e.target.classList.toggle("rb-paused", !e.isIntersecting);
  });
  scenes.forEach((el) => {
    if (el.dataset.bound) return;
    el.dataset.bound = "1";
    io.observe(el);
    if (el.dataset.listen === "board") bindBoard(el);
    if (el.dataset.listen === "uc") bindForm(el);
  });
}

document.addEventListener("astro:page-load", setup);

export {};
