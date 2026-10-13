// Fuente única de los chips del film (Peso y Giro comparten texto y posiciones).
// x/y: % del stage (centro del chip). d: cuándo entra en Peso (0..1).
// dy: deriva en px. r: rotación final en grados.
export interface FilmChip {
  t: string;
  x: number;
  y: number;
  d: number;
  dy: number;
  r: number;
}

export const filmChips: FilmChip[] = [
  { t: "12 mensajes sin responder", x: 32, y: 20, d: 0.04, dy: 46, r: -5 },
  { t: "Sin sitio web", x: 69, y: 28, d: 0.11, dy: 38, r: 4 },
  { t: "Clientes que no vuelven", x: 50, y: 38, d: 0.18, dy: 52, r: -2 },
  { t: "Google muestra a la competencia", x: 33, y: 52, d: 0.25, dy: 40, r: 6 },
  { t: "¿Tenés página?", x: 68, y: 60, d: 0.32, dy: 34, r: -6 },
  { t: "Todo por WhatsApp", x: 46, y: 70, d: 0.39, dy: 44, r: 3 },
  { t: "Presupuestos perdidos", x: 70, y: 80, d: 0.46, dy: 30, r: -4 },
  { t: "“Pasame el link”", x: 31, y: 84, d: 0.53, dy: 36, r: 5 },
];
