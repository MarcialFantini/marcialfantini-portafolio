/**
 * Makes the robot crews and the example panels respond to the visitor:
 * - eyes follow the pointer (fine pointers only)
 * - a robot hops when the pointer reaches it or it is tapped
 * - the hero orders panel takes a new order every few seconds and advances the rest
 * - "Reponer" in the stock panel restocks the item and the crew celebrates
 * - closing a sale in the automation panel fires its chain of effects, step by step
 * Nothing runs under prefers-reduced-motion except the restock button, which still updates the number.
 */
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const cleanups: (() => void)[] = [];

function poke(scene: Element | null | undefined) {
  if (!scene || reduced()) return;
  scene.classList.remove("rb-poke");
  void (scene as HTMLElement).offsetWidth;
  scene.classList.add("rb-poke");
  window.setTimeout(() => scene.classList.remove("rb-poke"), 650);
}

function bindEyes() {
  if (reduced() || !window.matchMedia("(pointer: fine)").matches) return;
  let frame = 0;
  let px = 0;
  let py = 0;
  const update = () => {
    frame = 0;
    document.querySelectorAll<HTMLElement>("[data-rb]:not(.rb-paused)").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = px - (r.left + r.width / 2);
      const dy = py - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      el.style.setProperty("--ex", `${((dx / d) * 1.6).toFixed(2)}px`);
      el.style.setProperty("--ey", `${((dy / d) * 1.2).toFixed(2)}px`);
    });
  };
  const onMove = (e: PointerEvent) => {
    px = e.clientX;
    py = e.clientY;
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  cleanups.push(() => window.removeEventListener("pointermove", onMove));
}

function bindPokes() {
  document.querySelectorAll<HTMLElement>("[data-rb]:not(.cap__graph)").forEach((el) => {
    const go = () => poke(el);
    el.addEventListener("pointerenter", go);
    el.addEventListener("click", go);
    cleanups.push(() => {
      el.removeEventListener("pointerenter", go);
      el.removeEventListener("click", go);
    });
  });
}

const ESTADOS = ["Nuevo", "En preparación", "Despachado", "Entregado"];
const TONOS = ["new", "mid", "mid", "ok"];

function bindOrders() {
  const panel = document.querySelector<HTMLElement>("[data-orders]");
  const list = panel?.querySelector<HTMLUListElement>(".hero__rows");
  if (!panel || !list || reduced()) return;
  const crew = panel.closest(".hero__floor")?.querySelector("[data-rb]");
  const first = list.querySelector(".hero__pn")?.textContent ?? "Pedido 1042";
  let n = parseInt(first.replace(/\D/g, ""), 10) || 1042;
  let visible = false;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(panel);

  const tick = () => {
    if (!visible || document.hidden) return;
    const rows = [...list.children] as HTMLLIElement[];
    const template = rows[0];
    rows.forEach((li, i) => {
      const next = Math.min(i + 1, ESTADOS.length - 1);
      const state = li.querySelector<HTMLElement>(".hero__state");
      if (!state) return;
      state.textContent = ESTADOS[next];
      state.className = `hero__state hero__state--${TONOS[next]}`;
      li.classList.remove("is-fresh");
    });
    const fresh = template.cloneNode(true) as HTMLLIElement;
    n += 1;
    const qty = 1 + Math.floor(Math.random() * 12);
    fresh.querySelector(".hero__pn")!.textContent = `Pedido ${n}`;
    fresh.querySelector(".soft")!.textContent = `${qty} ${qty === 1 ? "caja" : "cajas"}`;
    const st = fresh.querySelector<HTMLElement>(".hero__state")!;
    st.textContent = ESTADOS[0];
    st.className = `hero__state hero__state--${TONOS[0]}`;
    fresh.classList.add("is-fresh");
    list.prepend(fresh);
    list.lastElementChild?.remove();
    poke(crew);
  };
  const id = window.setInterval(tick, 4000);
  cleanups.push(() => {
    window.clearInterval(id);
    io.disconnect();
  });
}

function bindRestock() {
  document.querySelectorAll<HTMLElement>("[data-stock]").forEach((box) => {
    const crew = box.querySelector("[data-rb]");
    const onClick = (e: Event) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-restock]");
      if (!btn) return;
      const cell = btn.closest("td");
      const row = btn.closest("tr");
      const qty = cell?.querySelector("[data-qty]");
      if (qty) qty.textContent = btn.dataset.restock ?? qty.textContent;
      cell?.classList.remove("is-low");
      row?.classList.add("is-fresh");
      window.setTimeout(() => row?.classList.remove("is-fresh"), 1200);
      btn.remove();
      poke(crew);
    };
    box.addEventListener("click", onClick);
    cleanups.push(() => box.removeEventListener("click", onClick));
  });
}

function bindAuto() {
  document.querySelectorAll<HTMLElement>("[data-auto]").forEach((box) => {
    const steps = [...box.querySelectorAll<HTMLLIElement>("[data-step]")];
    const btn = box.querySelector<HTMLButtonElement>("[data-auto-run]");
    const num = box.querySelector("[data-auto-n]");
    const crew = box.querySelector("[data-rb]");
    let timers: number[] = [];
    let played = false;
    const clear = () => {
      timers.forEach((t) => window.clearTimeout(t));
      timers = [];
    };
    const settle = () => {
      steps.forEach((li) => {
        li.classList.remove("is-pending", "is-fresh");
        const st = li.querySelector("[data-state]");
        if (st) st.textContent = "Listo";
      });
      if (btn) btn.disabled = false;
    };
    const run = (fresh: boolean) => {
      clear();
      if (fresh && num) num.textContent = String((parseInt(num.textContent ?? "0", 10) || 0) + 1);
      if (reduced()) return settle();
      if (btn) btn.disabled = true;
      steps.forEach((li) => {
        li.classList.add("is-pending");
        li.classList.remove("is-fresh");
        const st = li.querySelector("[data-state]");
        if (st) st.textContent = "Esperando";
      });
      poke(crew);
      steps.forEach((li, i) => {
        timers.push(
          window.setTimeout(() => {
            li.classList.remove("is-pending");
            li.classList.add("is-fresh");
            const st = li.querySelector("[data-state]");
            if (st) st.textContent = "Listo";
            poke(crew);
            timers.push(window.setTimeout(() => li.classList.remove("is-fresh"), 700));
          }, 800 * (i + 1))
        );
      });
      timers.push(window.setTimeout(() => btn && (btn.disabled = false), 800 * steps.length + 200));
    };
    const onClick = () => run(true);
    btn?.addEventListener("click", onClick);
    // Play once the first time it scrolls into view, so the visitor sees the chain happen.
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !played) {
        played = true;
        run(false);
      }
    }, { threshold: 0.5 });
    io.observe(box);
    cleanups.push(() => {
      clear();
      io.disconnect();
      btn?.removeEventListener("click", onClick);
    });
  });
}

function setup() {
  cleanups.splice(0).forEach((fn) => fn());
  bindEyes();
  bindPokes();
  bindOrders();
  bindRestock();
  bindAuto();
}

document.addEventListener("astro:page-load", setup);

export {};
