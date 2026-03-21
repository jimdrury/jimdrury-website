import {
  blocks,
  contentType,
  tab,
  textarea,
} from "@jimdrury/storyblok-component-schema";
import image from "../components/image";

export default contentType({
  name: "article",
  display_name: "Article",
  folder: "pages",
  schema: [
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
      required: true,
    }),
    tab({
      name: "metadata",
      display_name: "Metadata",
      fields: [
        textarea({
          name: "excerpt",
          required: true,
          max_length: 200,
        }),
        blocks({
          name: "featured_image",
          allowed_components: [image],
          required: true,
          minimum: 1,
          maximum: 1,
        }),
      ],
    }),
  ],
});
