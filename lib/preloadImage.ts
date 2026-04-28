export function preloadImage(src?: string | null) {
  if (!src) return;
  if (typeof window === "undefined") return;

  const img = new Image();
  img.decoding = "async";
  img.src = src;
}

export function preloadNeighborImages(images: string[], index: number) {
  if (!images.length) return;

  const next = images[index + 1];
  const prev = images[index - 1];

  preloadImage(next);
  preloadImage(prev);
}