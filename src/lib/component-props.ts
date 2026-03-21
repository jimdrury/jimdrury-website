import type { ComponentProps, JSX } from "react";

/**
 * Host element props with `children` omitted so each component’s props interface
 * can list `children` explicitly (optional or required) instead of inheriting it.
 */
export type ComponentPropsWithoutChildren<
  T extends keyof JSX.IntrinsicElements,
> = Omit<ComponentProps<T>, "children">;
