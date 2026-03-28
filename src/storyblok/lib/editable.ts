import type { SbBlokData } from "./types";

type EditableAttributes = {
  "data-blok-c"?: string;
  "data-blok-uid"?: string;
};

export const storyblokEditable = (blok: SbBlokData): EditableAttributes => {
  if (typeof blok !== "object" || typeof blok._editable === "undefined") {
    return {};
  }

  try {
    const editable = JSON.parse(
      blok._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, ""),
    );

    return editable
      ? {
          "data-blok-c": JSON.stringify(editable),
          "data-blok-uid": `${editable.id}-${editable.uid}`,
        }
      : {};
  } catch {
    return {};
  }
};
