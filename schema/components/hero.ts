import { asset, blocks, nestable } from "@jimdrury/storyblok-component-schema";
import badge from "./badge";
import rich_text from "./rich_text";
import typography from "./typography";

export default nestable({
  name: "hero",
  display_name: "Hero",
  folder: "components",
  schema: [
    blocks({
      name: "badge",
      description: "Optional badge shown above the title",
      allowed_components: [badge],
      maximum: 1,
    }),
    blocks({
      name: "title",
      required: true,
      description: "Main heading rendered as a Typography block.",
      allowed_components: [typography],
      maximum: 1,
    }),
    blocks({
      name: "blurb",
      required: true,
      description: "Supporting rich text below the title.",
      allowed_components: [rich_text],
      maximum: 1,
    }),
    asset({
      name: "portrait",
      filetypes: ["images"],
      required: true,
    }),
  ],
});
