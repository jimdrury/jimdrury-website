import {
  blocks,
  contentType,
  option,
} from "@jimdrury/storyblok-component-schema";

export default contentType({
  name: "page",
  display_name: "Page",
  folder: "pages",
  schema: [
    option({
      name: "header",
      options: [],
      source: "internal",
      required: false,
    }),
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
    }),
  ],
});
