import {
  blocks,
  boolean,
  contentType,
} from "@jimdrury/storyblok-component-schema";

export default contentType({
  name: "page",
  display_name: "Page",
  folder: "pages",
  schema: [
    boolean({
      name: "header",
      default_value: true,
      required: false,
    }),
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
    }),
  ],
});
