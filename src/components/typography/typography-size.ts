/** Pencil `neo_pencil.pen` theme axis `size` — must match `typographyVariants` keys in `typography.tsx`. */
export const TYPOGRAPHY_SCALE = [
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
] as const;

export type TypographySize = (typeof TYPOGRAPHY_SCALE)[number];

export const isTypographySize = (value: string): value is TypographySize =>
  (TYPOGRAPHY_SCALE as readonly string[]).includes(value);
