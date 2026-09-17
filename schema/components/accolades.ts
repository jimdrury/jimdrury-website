import { blocks, nestable, text } from "@jimdrury/storyblok-component-schema";
import award from "./award";

export default nestable({
  name: "accolades",
  display_name: "Accolades",
  folder: "components",
  preview_field: "title",
  schema: [
    text({
      name: "title",
      description: "Section heading (defaults to Accolades)",
      default_value: "Accolades",
    }),
    blocks({
      name: "awards",
      description: "Award cards shown in a two-column grid",
      allowed_components: [award],
      required: true,
      minimum: 1,
    }),
  ],
});
