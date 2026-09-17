import type { FC } from "react";
import type { BlokComponentMap, BlokRendererProps } from "./types";

export const createBlokRenderer = (
  components: BlokComponentMap,
): FC<BlokRendererProps> => {
  const BlokRenderer: FC<BlokRendererProps> = ({ blok, pathname, story }) => {
    const component = components[blok.component];

    if (!component) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Component ${blok.component} doesn't exist.`);
      }

      return null;
    }

    const Component = component;

    return <Component blok={blok} pathname={pathname} story={story} />;
  };

  BlokRenderer.displayName = "BlokRenderer";

  return BlokRenderer;
};
