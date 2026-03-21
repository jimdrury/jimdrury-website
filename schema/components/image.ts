import { asset, boolean, nestable } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "image",
  display_name: "Image",
  folder: "components",
  schema: [
    asset({
      name: "image",
      filetypes: ["images"],
      required: true,
    }),
    boolean({
      name: "enable_lightbox",
      description: "Allow this image to open in a lightbox on click",
      default_value: false,
      inline_label: true,
    }),
  ],
});
