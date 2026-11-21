// Presentation data for the demo projects on /proyectos and /proyectos/[slug].
// Every project is a DEMO built to show what can be done, never client work.
// Lines and features describe what each system does; they never claim results.
import type { CollectionEntry } from "astro:content";
import StockUI from "../demos-ui/StockUI.astro";
import VentasUI from "../demos-ui/VentasUI.astro";
import PedidosUI from "../demos-ui/PedidosUI.astro";

export type GroupKey = "gestion" | "venta" | "integracion" | "reservas" | "sitios" | "otros";
export type Field = "paper" | "bone" | "mist" | "cornflower" | "lime" | "night";

/** Buyer-facing groups. Each owns a colour (tile visual + detail hero field) and a drawn motif. */
export const GROUPS: Record<GroupKey, { label: string; field: Field }> = {
  gestion: { label: "Gestión interna", field: "cornflower" },
  venta: { label: "Venta online", field: "lime" },
  integracion: { label: "Integraciones", field: "night" },
  reservas: { label: "Reservas y turnos", field: "mist" },
  sitios: { label: "Sitios y contenido", field: "bone" },
  otros: { label: "Otros", field: "bone" },
};
export const GROUP_ORDER: GroupKey[] = ["gestion", "venta", "integracion", "reservas", "sitios", "otros"];

const BY_CATEGORY: Record<string, GroupKey> = {
  panel: "gestion",
  dashboard: "gestion",
  ecommerce: "venta",
  integracion: "integracion",
  reservas: "reservas",
  landing: "sitios",
  blog: "sitios",
};

/** Group from the frontmatter `categoria`; "otro" falls back to the first tag that names a category. */
export function groupOf(p: CollectionEntry<"proyectos">): GroupKey {
  const direct = BY_CATEGORY[p.data.categoria];
  if (direct) return direct;
  const tag = p.data.tags.find((t) => BY_CATEGORY[t]);
  return tag ? BY_CATEGORY[tag] : "otros";
}

/** The three demos with a drawn, live interface. */
export const FEATURED = [
  { id: "inventario-distribuidora", Ui: StockUI },
  { id: "dashboard-ventas", Ui: VentasUI },
  { id: "tracker-pedidos", Ui: PedidosUI },
] as const;
export const UI_BY_ID: Record<string, (typeof FEATURED)[number]["Ui"]> = Object.fromEntries(FEATURED.map((f) => [f.id, f.Ui]));

/** Sector of the sample business (same labels as the home). */
export const RUBRO: Record<string, string> = {
  "inventario-distribuidora": "Distribución",
  "dashboard-ventas": "Venta mayorista",
  "tracker-pedidos": "Pedidos",
  "integracion-mercadolibre-erp": "Comercio online",
  "automatizacion-crm-whatsapp": "Salud",
  "catalogo-ferreteria": "Ferretería",
  "ecommerce-marca": "Muebles",
  "blog-consultora": "Consultoría",
};

/** One line: what the system lets the business do. */
export const LINEA: Record<string, string> = {
  "inventario-distribuidora": "Stock por depósito siempre al día, con aviso de reposición antes de que falte mercadería.",
  "dashboard-ventas": "Las ventas del mes, los productos que más salen y la comparación con el año anterior, en una sola pantalla.",
  "tracker-pedidos": "Cada cliente mayorista sigue el estado de su pedido en tiempo real, sin llamar para preguntar.",
  "integracion-mercadolibre-erp": "Stock y pedidos de MercadoLibre y TiendaNube sincronizados con el ERP, sin cargar dos veces.",
  "automatizacion-crm-whatsapp": "Recordatorios de turnos por WhatsApp y consultas nuevas derivadas solas al especialista.",
  "catalogo-ferreteria": "Catálogo mayorista con búsqueda por código y lista en PDF lista para enviar.",
  "ecommerce-marca": "Tienda propia con stock sincronizado con producción y seguimiento de envíos.",
  "blog-consultora": "Publicaciones por área y por autor, con suscripción al newsletter integrada.",
};

/** Key features for the typographic panel on detail pages without a drawn interface. */
export const FEATURES: Record<string, string[]> = {
  "integracion-mercadolibre-erp": ["Stock unificado entre canales", "Pedidos que entran solos al ERP", "Factura electrónica automática"],
  "automatizacion-crm-whatsapp": ["Recordatorio 24 h antes del turno", "Confirmación con un toque", "Consulta nueva derivada al especialista"],
  "catalogo-ferreteria": ["Búsqueda por categoría y código", "Lista en PDF filtrada", "Pensado para usar en el depósito"],
  "ecommerce-marca": ["Catálogo con variantes", "Stock sincronizado con producción", "Panel de envíos"],
  "blog-consultora": ["Perfil por autor", "Posts por área de servicio", "Suscripción al newsletter"],
};

const CONNECTORS = new Set(["de", "del", "para", "con", "a", "en", "y", "la", "el", "los", "las", "por"]);

/** Splits a name into big words and small lowercase connectors (the home's title pattern). */
export function titleParts(name: string): { t: string; small: boolean }[] {
  return name.split(/\s+/).map((w) => ({ t: w, small: CONNECTORS.has(w.toLowerCase()) }));
}
