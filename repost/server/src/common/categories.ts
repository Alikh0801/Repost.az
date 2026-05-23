export const CATEGORIES = [
  "politics",
  "economy",
  "society",
  "sports",
  "incidents",
  "world",
] as const;

export type CategoryId = (typeof CATEGORIES)[number];
