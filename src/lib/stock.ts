// Placeholder photography for the chapter redesign.
// Every slot in src/data/stock.json has a CC0 local file and, for most, an Unsplash hotlink (preferred).
// Usage: const p = stock("hero-deposito"); <img src={p.src} srcset={p.srcset} alt={p.alt} width={p.width} height={p.height} />
import data from "../data/stock.json";

type Entry = (typeof data)[number] & {
  unsplash?: { src: string; width: number; height: number; credit: string; page: string; photographerUrl: string };
};

const local = import.meta.glob<{ default: ImageMetadata }>("/src/assets/stock/*.jpg", { eager: true });

export interface StockPhoto {
  src: string;
  srcset?: string;
  alt: string;
  width: number;
  height: number;
  credit: string | null;
  page: string | null;
  placeholder: true;
}

const WIDTHS = [640, 1024, 1600, 2400];

export function stock(name: string, width = 1600): StockPhoto {
  const entry = (data as Entry[]).find((e) => e.file === `${name}.jpg`);
  if (!entry) throw new Error(`stock: unknown slot "${name}"`);

  if (entry.unsplash) {
    const u = entry.unsplash;
    const at = (w: number) => u.src.replace(/([?&])w=\d+/, `$1w=${w}`);
    const ratio = u.height / u.width;
    return {
      src: at(width),
      srcset: WIDTHS.map((w) => `${at(w)} ${w}w`).join(", "),
      alt: entry.alt,
      width,
      height: Math.round(width * ratio),
      credit: u.credit,
      page: u.page,
      placeholder: true,
    };
  }

  const img = local[`/src/assets/stock/${entry.file}`]?.default;
  if (!img) throw new Error(`stock: missing local file for "${name}"`);
  return { src: img.src, alt: entry.alt, width: img.width, height: img.height, credit: null, page: entry.page, placeholder: true };
}

/** All slots whose name starts with a prefix, e.g. stockGroup("rubro-"). */
export function stockGroup(prefix: string, width = 1600): (StockPhoto & { name: string })[] {
  return (data as Entry[])
    .map((e) => e.file.replace(/\.jpg$/, ""))
    .filter((n) => n.startsWith(prefix))
    .map((name) => ({ name, ...stock(name, width) }));
}
