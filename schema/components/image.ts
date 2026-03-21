import { asset, nestable } from "@jimdrury/storyblok-component-schema";

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
  ],
});
