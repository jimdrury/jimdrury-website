import {
  blocks,
  nestable,
  richtext,
  text,
} from "@jimdrury/storyblok-component-schema";
import badge from "./badge";

export default nestable({
  name: "page_header",
  display_name: "Page Header",
  folder: "components",
  preview_field: "title",
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
      description: "Primary page heading",
    }),
    richtext({
      name: "subtitle",
      description: "Optional supporting text below the title",
    }),
  ],
});
