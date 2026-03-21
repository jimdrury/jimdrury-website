import { blocks, nestable } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "section",
  display_name: "Section",
  folder: "layouts",
  schema: [
    blocks({
      name: "body",
      allowed_folders: ["typography"],
    }),
  ],
});
