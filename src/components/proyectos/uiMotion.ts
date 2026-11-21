// Motion for drawn demo interfaces ([data-ui]) inside a root, same vocabulary as the home's Demos chapter:
// assemble once on scroll (rows, bars, counters), then a small looping state change that only plays
// while the screen is visible. Transform/opacity only. Reduced motion: nothing runs, screens stay drawn.
import { gsap, ScrollTrigger, reduced } from "../../scripts/motion";

export function animateUis(root: HTMLElement): (() => void) | void {
  if (reduced()) return;
  const fmt = new Intl.NumberFormat("es-AR");

  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>("[data-ui]").forEach((ui) => {
      const all = (sel: string) => Array.from(ui.querySelectorAll<HTMLElement>(sel));

      const intro = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      intro.from(all("[data-row]"), { opacity: 0, y: 14, duration: 0.5, stagger: 0.06 }, 0);
      const gx = all("[data-grow-x]");
      if (gx.length) intro.from(gx, { scaleX: 0, transformOrigin: "0% 50%", duration: 0.8, stagger: 0.04 }, 0.2);
      const gy = all("[data-grow-y]");
      if (gy.length) intro.from(gy, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.8, stagger: 0.04 }, 0.2);
      all("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        if (!Number.isFinite(to)) return;
        const pre = el.dataset.pre ?? "";
        const o = { v: 0 };
        intro.to(o, { v: to, duration: 1.1, ease: "power2.out", onUpdate: () => { el.textContent = pre + fmt.format(Math.round(o.v)); } }, 0.15);
      });

      const loop = gsap.timeline({ paused: true, repeat: -1, yoyo: true, repeatDelay: 2.6, delay: 1.2, defaults: { ease: "power2.out" } });
      const off = all("[data-off]"), on = all("[data-on]"), fill = all("[data-fill]"), bump = all("[data-bump]");
      if (off.length) loop.to(off, { opacity: 0, duration: 0.3 }, 0);
      if (on.length) loop.to(on, { opacity: 1, duration: 0.4 }, 0.2);
      if (fill.length) loop.to(fill, { scaleX: 1, duration: 0.7 }, 0.2);
      if (bump.length) loop.to(bump, { scaleY: 1.03, transformOrigin: "50% 100%", duration: 0.6 }, 0.2);
      const hasLoop = off.length + on.length + fill.length + bump.length > 0;

      let visible = false, ready = false;
      intro.eventCallback("onComplete", () => { ready = true; if (visible && hasLoop) loop.play(); });
      ScrollTrigger.create({ trigger: ui, start: "top 85%", once: true, onEnter: () => intro.play() });
      // Paused while off-screen.
      ScrollTrigger.create({
        trigger: ui, start: "top bottom", end: "bottom top",
        onToggle: (self) => {
          visible = self.isActive;
          if (!ready || !hasLoop) return;
          if (visible) loop.play(); else loop.pause();
        },
      });
    });
  }, root);
  return () => ctx.revert();
}
