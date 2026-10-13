// Genera los assets de marca (OG, favicons, manifest icons) desde SVG.
// Re-ejecutar: pnpm exec node docs/brand/build-og.mjs   (o: node docs/brand/build-og.mjs)
// Entradas: docs/brand/og-source.svg, docs/brand/favicon-source.svg
// Salidas en public/: og-default.png (1200x630), favicon.svg, favicon.ico (32x32, PNG embebido),
// apple-touch-icon.png (180), icon-192.png, icon-512.png.
// Tipografia: Arial (fuente del sistema, el SVG cae a Helvetica/sans-serif). resvg no lee woff2,
// por eso no se embebe Bricolage Grotesque; el render usa las fuentes del sistema.
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '..', '..', 'public');
const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { loadSystemFonts: true, defaultFontFamily: 'Arial' } })
    .render()
    .asPng();

const og = readFileSync(join(here, 'og-source.svg'), 'utf8');
const fav = readFileSync(join(here, 'favicon-source.svg'), 'utf8');

writeFileSync(join(pub, 'og-default.png'), render(og, 1200));
copyFileSync(join(here, 'favicon-source.svg'), join(pub, 'favicon.svg'));
writeFileSync(join(pub, 'apple-touch-icon.png'), render(fav, 180));
writeFileSync(join(pub, 'icon-192.png'), render(fav, 192));
writeFileSync(join(pub, 'icon-512.png'), render(fav, 512));

// ICO de una imagen con PNG embebido (valido desde Vista).
const png32 = render(fav, 32);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header[6] = 32; header[7] = 32; header[8] = 0; header[9] = 0;
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12);
header.writeUInt32LE(png32.length, 14); header.writeUInt32LE(22, 18);
writeFileSync(join(pub, 'favicon.ico'), Buffer.concat([header, png32]));
console.log('Assets de marca generados en public/');
