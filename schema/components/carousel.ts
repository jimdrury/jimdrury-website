import { blocks, nestable, text } from "@jimdrury/storyblok-component-schema";
import image from "./image";

export default nestable({
  name: "carousel",
  display_name: "Carousel",
  folder: "components",
  preview_field: "title",
  schema: [
    text({
      name: "title",
      required: true,
    }),
    blocks({
      name: "images",
      allowed_components: [image],
      required: true,
      minimum: 1,
    }),
  ],
});
