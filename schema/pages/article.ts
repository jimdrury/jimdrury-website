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
      name: "side_bar",
      display_name: "Side Bar",
      fields: [
        blocks({
          name: "pre_content",
          allowed_folders: ["layout", "components"],
        }),
        blocks({
          name: "post_content",
          allowed_folders: ["layout", "components"],
        }),
      ],
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
        textarea({
          name: "meta_description",
          description:
            "SEO meta description for search results. Falls back to the excerpt if left empty.",
          max_length: 160,
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
