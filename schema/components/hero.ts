import {
  asset,
  blocks,
  nestable,
  richtext,
  text,
} from "@jimdrury/storyblok-component-schema";
import badge from "./badge";

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
    text({
      name: "title",
      required: true,
    }),
    richtext({
      name: "blurb",
      required: true,
      description: "Supporting rich text below the title",
    }),
    asset({
      name: "portrait",
      filetypes: ["images"],
      required: true,
    }),
  ],
});
