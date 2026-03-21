import { asset, blocks, nestable } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "hero_image",
  display_name: "Hero Image",
  folder: "components",
  schema: [
    asset({
      name: "image",
      filetypes: ["images"],
      required: true,
    }),
    blocks({
      name: "overlay",
      description: "Content overlayed on the image, aligned to the bottom",
      allowed_folders: ["layout", "components"],
    }),
  ],
});
