import {
  blocks,
  nestable,
  option,
  tab,
} from "@jimdrury/storyblok-component-schema";
import richText from "../components/rich_text";
import typography from "../components/typography";

export default nestable({
  name: "content_band",
  display_name: "Content band",
  folder: "layout",
  schema: [
    tab({
      name: "config",
      display_name: "Config",
      fields: [
        option({
          name: "background",
          description: "Band background colour (none = transparent)",
          default_value: "none",
          options: [
            { name: "None", value: "none" },
            { name: "Primary", value: "primary" },
            { name: "Secondary", value: "secondary" },
            { name: "Yellow", value: "accent_yellow" },
            { name: "Orange", value: "accent_orange" },
            { name: "Pink", value: "accent_pink" },
            { name: "Purple", value: "accent_purple" },
            { name: "Blue", value: "accent_blue" },
            { name: "Green", value: "accent_green" },
          ],
        }),
      ],
    }),
    tab({
      name: "heading",
      display_name: "Heading",
      fields: [
        blocks({
          name: "heading",
          description: "Primary title (typography)",
          allowed_components: [typography],
          maximum: 1,
        }),
      ],
    }),
    tab({
      name: "aside",
      display_name: "Aside",
      fields: [
        blocks({
          name: "aside",
          description:
            "Secondary text or link (rich text; extend with link blok later)",
          allowed_components: [richText],
          maximum: 1,
        }),
      ],
    }),
    tab({
      name: "body",
      display_name: "Body",
      fields: [
        option({
          name: "content_layout",
          description: "How direct body blocks are laid out",
          default_value: "stack",
          options: [
            { name: "Stack", value: "stack" },
            { name: "Grid", value: "grid" },
          ],
        }),
        blocks({
          name: "body",
          allowed_folders: ["layout", "components"],
        }),
      ],
    }),
  ],
});
