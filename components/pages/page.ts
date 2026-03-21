import { blocks, contentType } from "@jimdrury/storyblok-component-schema";

export default contentType({
  name: "page",
  display_name: "Page",
  folder: "pages",
  schema: [
    blocks({
      name: "body",
      allowed_folders: ["bloks"],
    }),
  ],
});
