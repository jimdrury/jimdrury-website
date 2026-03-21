import { nestable, richtext } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "rich_text",
  display_name: "Rich Text",
  folder: "components",
  preview_field: "content",
  schema: [
    richtext({
      name: "content",
      required: true,
      allow_target_blank: true,
    }),
  ],
});
