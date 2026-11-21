// Real screenshots of the demo projects that exist as sibling repos (portfolio/0X-*).
// File name = project id. Captured from each project's own build at 1440x900.
const files = import.meta.glob<{ default: ImageMetadata }>("/src/assets/capturas/*.jpg", { eager: true });

export function capturaDe(id: string): ImageMetadata | undefined {
  return files[`/src/assets/capturas/${id}.jpg`]?.default;
}
