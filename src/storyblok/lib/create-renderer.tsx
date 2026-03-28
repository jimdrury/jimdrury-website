import type { FC } from "react";
import type { BlokComponentMap, SbBlokData } from "./types";

type BlokRendererProps = {
  blok: SbBlokData;
};

export const createBlokRenderer = (
  components: BlokComponentMap,
): FC<BlokRendererProps> => {
  const BlokRenderer: FC<BlokRendererProps> = ({ blok }) => {
    const component = components[blok.component];

    if (!component) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Component ${blok.component} doesn't exist.`);
      }

      return null;
    }

    const Component = component;

    return <Component blok={blok} />;
  };

  BlokRenderer.displayName = "BlokRenderer";

  return BlokRenderer;
};
