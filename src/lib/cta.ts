// Primary call to action, shared by every "diagnóstico" button on the site.
// With site.bookingUrl set it opens the online calendar in a new tab;
// while it is empty it falls back to the contact form, and the copy stops promising a booking.
import site from "../data/site.json";

const bookingUrl = (site.bookingUrl ?? "").trim();
const external = bookingUrl.length > 0;

export const cta = external
  ? {
      href: bookingUrl,
      label: "Agendar diagnóstico de 30 minutos",
      short: "Agendar diagnóstico",
      external: true,
    }
  : {
      href: "/contacto?servicio=Diagn%C3%B3stico%20gratis",
      label: "Pedir diagnóstico de 30 minutos",
      short: "Pedir diagnóstico",
      external: false,
    };

// Spread onto the <a>: new tab only for the external calendar.
export const ctaTarget = cta.external ? { target: "_blank", rel: "noopener" } : {};
