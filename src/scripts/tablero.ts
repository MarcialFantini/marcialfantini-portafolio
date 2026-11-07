/* Tablero de KPIs (ejemplo ilustrativo): pestañas, cifras en vivo, gráfico y feed. */
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeOut = (t: number) => 1 - Math.pow(2, -10 * t);
const TICK_MS = 2400;
const ALERT_EVERY = 2; // el feed avanza cada 2 ticks

const render = (el: HTMLElement, v: number) => {
  const dec = Number(el.dataset.dec);
  el.textContent = `${el.dataset.pre}${v.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec })}${el.dataset.suf}`;
};

// Anima una cifra de su valor actual a `to`
function tween(el: HTMLElement, from: number, to: number, dur: number) {
  el.dataset.cur = String(to);
  if (reduce) return render(el, to);
  const t0 = performance.now();
  const step = (now: number) => {
    // El timestamp de rAF puede ser anterior a t0: sin el piso en 0, easeOut(p<0) se dispara.
    const p = Math.max(0, Math.min(1, (now - t0) / dur));
    render(el, from + (to - from) * easeOut(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function countUp(panel: HTMLElement) {
  panel.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const base = Number(el.dataset.to);
    tween(el, 0, el.dataset.cur ? Number(el.dataset.cur) : base, 900);
  });
}

// Variación en vivo alrededor del valor base. Devuelve el valor actual.
function moveValue(el: HTMLElement) {
  const base = Number(el.dataset.to);
  const j = Number(el.dataset.j);
  const dec = Number(el.dataset.dec);
  const max = el.dataset.max ? Number(el.dataset.max) : Infinity;
  const cur = el.dataset.cur ? Number(el.dataset.cur) : base;
  // Paseo aleatorio con tirón hacia la base: se lee como tendencia, no como ruido
  let next = cur + (Math.random() * 2 - 1) * j * 1.4 + (base - cur) * 0.25;
  next = Math.min(max, base + 2 * j, Math.max(0, base - 2 * j, Number(next.toFixed(dec))));
  next = Number(next.toFixed(dec));
  if (next === cur) next = Number((cur + (cur <= base ? j : -j) * 0.5).toFixed(dec)) || cur;
  if (next === cur) return cur;
  tween(el, cur, next, 650);
  showDelta(el, next - cur);
  // Lets the mascot react to the live numbers
  el.dispatchEvent(new CustomEvent("board:tick", { bubbles: true, detail: { diff: next - cur } }));
  el.classList.remove("is-tick");
  void el.offsetWidth;
  el.classList.add("is-tick");
  return next;
}

// Cada tick: la cifra principal siempre se mueve (y alimenta el gráfico); a veces, también una secundaria
function liveTick(panel: HTMLElement) {
  const main = panel.querySelector<HTMLElement>(".board__main [data-count]");
  if (main && Number(main.dataset.j) > 0) pushChart(panel, moveValue(main));
  const side = Array.from(panel.querySelectorAll<HTMLElement>(".board__side [data-count]")).filter((el) => Number(el.dataset.j) > 0);
  if (side.length && Math.random() < 0.6) moveValue(side[Math.floor(Math.random() * side.length)]);
}

/* ---------- Gráfico de tendencia en vivo ----------
   N+1 puntos: el último entra desde la derecha. Tras cada deslizamiento se redibuja
   con el primer punto descartado y el grupo vuelve a 0 sin transición: el corte no se ve. */
const N = 24;
const W = 300;
const H = 64;
const STEP = W / (N - 1);
interface Chart { data: number[]; lo: number; hi: number; g: SVGGElement; line: SVGPathElement; area: SVGPathElement; dot: HTMLElement; box: HTMLElement }
const charts = new WeakMap<HTMLElement, Chart>();

const yOf = (c: Chart, v: number) => 6 + (1 - (v - c.lo) / (c.hi - c.lo)) * (H - 12);

function drawChart(c: Chart) {
  const pts = c.data.map((v, i) => [i * STEP, yOf(c, v)]);
  let d = `M${pts[0][0]},${pts[0][1].toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
  }
  c.line.setAttribute("d", d);
  c.area.setAttribute("d", `${d} L${pts[pts.length - 1][0].toFixed(2)},${H} L0,${H} Z`);
}

function placeDot(c: Chart, animate: boolean) {
  const y = (yOf(c, c.data[c.data.length - 1]) / H) * c.box.clientHeight;
  c.dot.style.transition = animate ? "" : "none";
  c.dot.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
}

function slide(c: Chart, animate: boolean) {
  c.g.style.transition = "none";
  c.g.style.transform = animate ? "translateX(0px)" : `translateX(${-STEP}px)`;
  if (!animate) return;
  c.g.getBoundingClientRect();
  c.g.style.transition = "";
  c.g.style.transform = `translateX(${-STEP}px)`;
}

function initChart(panel: HTMLElement) {
  const box = panel.querySelector<HTMLElement>("[data-chart]");
  const main = panel.querySelector<HTMLElement>(".board__main [data-count]");
  if (!box || !main) return;
  const base = Number(main.dataset.to);
  const j = Number(main.dataset.j) || Math.max(1, base * 0.02);
  const c: Chart = {
    data: [],
    lo: base - 2.4 * j,
    hi: base + 2.4 * j,
    g: box.querySelector("g")!,
    line: box.querySelector(".board__chart-line")!,
    area: box.querySelector(".board__chart-area")!,
    dot: box.querySelector(".board__chart-dot")!,
    box,
  };
  let v = base;
  for (let i = 0; i <= N; i++) {
    v = Math.min(base + 2 * j, Math.max(base - 2 * j, v + (Math.random() * 2 - 1) * j * 1.2 + (base - v) * 0.2));
    c.data.push(v);
  }
  c.data[N] = base;
  box.querySelector(".board__chart-base")!.setAttribute("y1", yOf(c, base).toFixed(2));
  box.querySelector(".board__chart-base")!.setAttribute("y2", yOf(c, base).toFixed(2));
  charts.set(panel, c);
  drawChart(c);
  slide(c, false);
  box.classList.add("is-ready");
}

function pushChart(panel: HTMLElement, v: number) {
  const c = charts.get(panel);
  if (!c) return;
  c.data.shift();
  c.data.push(v);
  drawChart(c);
  slide(c, !reduce);
  placeDot(c, !reduce);
}

/* ---------- Feed de eventos ---------- */
interface Feed { list: string[]; idx: number; times: number[]; ul: HTMLElement; rows: HTMLElement[] }
const feeds = new WeakMap<HTMLElement, Feed>();

const ago = (ms: number) => {
  const s = Math.round(ms / 1000);
  return s < 3 ? "ahora" : s < 60 ? `hace ${s} s` : `hace ${Math.round(s / 60)} min`;
};

function initFeed(panel: HTMLElement) {
  const ul = panel.querySelector<HTMLElement>("[data-alerts]");
  if (!ul) return;
  const now = Date.now();
  feeds.set(panel, {
    list: JSON.parse(ul.dataset.alerts || "[]"),
    idx: 2,
    times: [now, now - 5000, now - 10000],
    ul,
    rows: Array.from(ul.querySelectorAll<HTMLElement>(".board__feed-row")),
  });
}

function refreshAgo(panel: HTMLElement) {
  const f = feeds.get(panel);
  if (!f) return;
  const now = Date.now();
  f.rows.forEach((r, i) => (r.querySelector(".board__feed-ago")!.textContent = ago(now - f.times[i])));
}

function nextAlert(panel: HTMLElement) {
  const f = feeds.get(panel);
  if (!f || f.list.length < 2) return;
  f.idx = (f.idx + 1) % f.list.length;
  f.times.unshift(Date.now());
  f.times.length = f.rows.length;
  for (let i = f.rows.length - 1; i > 0; i--) {
    f.rows[i].querySelector(".board__feed-t")!.textContent = f.rows[i - 1].querySelector(".board__feed-t")!.textContent;
  }
  f.rows[0].querySelector(".board__feed-t")!.textContent = f.list[f.idx];
  refreshAgo(panel);
  f.ul.classList.remove("is-push");
  void f.ul.offsetWidth;
  f.ul.classList.add("is-push");
}

// Muestra ▲/▼ con la diferencia junto a la cifra
function showDelta(el: HTMLElement, diff: number) {
  const d = el.nextElementSibling as HTMLElement | null;
  const v = d?.querySelector<HTMLElement>(".board__delta-v");
  if (!d || !v) return;
  const dec = Number(el.dataset.dec);
  v.textContent = (diff > 0 ? "+" : "−") + Math.abs(diff).toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  d.classList.toggle("is-up", diff > 0);
  d.classList.toggle("is-down", diff < 0);
  d.classList.remove("is-on");
  void d.offsetWidth;
  d.classList.add("is-on");
}

function initBoard(board: HTMLElement) {
  if (board.dataset.ready) return;
  board.dataset.ready = "1";
  const tabs = Array.from(board.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const panels = tabs.map((t) => board.querySelector<HTMLElement>(`#${t.getAttribute("aria-controls")}`)!);
  let current = 0;

  const select = (i: number, focus = false) => {
    tabs.forEach((t, j) => {
      const on = j === i;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      panels[j].hidden = !on;
    });
    current = i;
    if (focus) tabs[i].focus();
    countUp(panels[i]);
    const c = charts.get(panels[i]);
    if (c) placeDot(c, false);
    refreshAgo(panels[i]);
  };

  panels.forEach((p) => {
    initChart(p);
    initFeed(p);
  });
  const c0 = charts.get(panels[0]);
  if (c0) placeDot(c0, false);

  // Rotación automática: la barra de la pestaña activa marca el tiempo; al terminar, pasa a la siguiente.
  // Se detiene para siempre cuando el visitante elige una vista.
  const stopAuto = () => board.classList.add("is-manual");
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => {
      stopAuto();
      if (i !== current) select(i);
      board.dispatchEvent(new CustomEvent("board:select", { detail: { i } }));
    });
    t.addEventListener("keydown", (e) => {
      const k = e.key;
      let n = -1;
      if (k === "ArrowRight") n = (current + 1) % tabs.length;
      else if (k === "ArrowLeft") n = (current - 1 + tabs.length) % tabs.length;
      else if (k === "Home") n = 0;
      else if (k === "End") n = tabs.length - 1;
      if (n < 0) return;
      e.preventDefault();
      stopAuto();
      select(n, true);
      board.dispatchEvent(new CustomEvent("board:select", { detail: { i: n } }));
    });
    t.querySelector(".board__tab-bar")!.addEventListener("animationend", () => {
      if (!board.classList.contains("is-manual") && i === current) select((current + 1) % tabs.length);
    });
  });

  if (reduce) stopAuto();

  // Fuera de pantalla o con la pestaña oculta: todo en pausa (animaciones CSS y ticks en vivo).
  let visible = false;
  const paused = () => !visible || document.hidden;
  const sync = () => board.classList.toggle("is-paused", paused());
  new IntersectionObserver(([e]) => {
    const first = !visible && e.isIntersecting && !board.dataset.counted;
    visible = e.isIntersecting;
    sync();
    if (first) {
      board.dataset.counted = "1";
      countUp(panels[current]);
    }
  }, { threshold: 0.25 }).observe(board);
  document.addEventListener("visibilitychange", sync);
  sync();

  if (!reduce) {
    let n = 0;
    const id = window.setInterval(() => {
      if (!board.isConnected) return window.clearInterval(id);
      if (paused()) return;
      n++;
      liveTick(panels[current]);
      if (n % ALERT_EVERY === 0) nextAlert(panels[current]);
      else refreshAgo(panels[current]);
    }, TICK_MS);
  }
}

document.addEventListener("astro:page-load", () => {
  document.querySelectorAll<HTMLElement>("[data-board]").forEach(initBoard);
});

export {};
