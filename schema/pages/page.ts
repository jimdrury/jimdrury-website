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
      description:
        "Show the page title banner. Turn off when the body already includes a hero or page header.",
    }),
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
    }),
  ],
});
