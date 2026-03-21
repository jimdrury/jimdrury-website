import { blocks, nestable } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "grid",
  display_name: "Grid",
  folder: "bloks",
  schema: [
    blocks({
      name: "columns",
      allowed_folders: ["bloks"],
    }),
  ],
});
