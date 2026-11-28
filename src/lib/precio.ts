// Starting-price line for a service. `precioDesde` in src/data/servicios.json is optional and
// empty by default: while it is empty nothing is rendered, so no price is ever invented.
// The owner writes only the amount, e.g. "USD 1.500".
export function precioDesde(s: { precioDesde?: string }): string {
  const v = s.precioDesde?.trim();
  return v ? `Desde ${v} · precio cerrado por escrito` : "";
}
