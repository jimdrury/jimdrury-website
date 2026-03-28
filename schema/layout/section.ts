import {
  blocks,
  nestable,
  option,
  tab,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "section",
  display_name: "Section",
  folder: "layout",
  schema: [
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
    }),
    tab({
      name: "config",
      display_name: "Config",
      fields: [
        option({
          name: "max_width",
          description: "Maximum width of the section content",
          default_value: "3xl",
          options: [
            { name: "Small (sm)", value: "sm" },
            { name: "Medium (md)", value: "md" },
            { name: "Large (lg)", value: "lg" },
            { name: "XL", value: "xl" },
            { name: "2XL", value: "2xl" },
            { name: "3XL", value: "3xl" },
            { name: "5XL", value: "5xl" },
            { name: "7XL", value: "7xl" },
            { name: "Full", value: "full" },
          ],
        }),
        option({
          name: "background",
          description: "Section background colour",
          default_value: "none",
          options: [
            { name: "None", value: "none" },
            { name: "White", value: "white" },
            { name: "Light grey", value: "light_grey" },
            { name: "Dark", value: "dark" },
            { name: "Black", value: "black" },
            { name: "Yellow", value: "yellow" },
          ],
        }),
        option({
          name: "padding_top",
          description: "Top padding for the section",
          default_value: "none",
          options: [
            { name: "None", value: "none" },
            { name: "Small", value: "sm" },
            { name: "Medium", value: "md" },
            { name: "Large", value: "lg" },
            { name: "Extra Large", value: "xl" },
          ],
        }),
        option({
          name: "padding_bottom",
          description: "Bottom padding for the section",
          default_value: "none",
          options: [
            { name: "None", value: "none" },
            { name: "Small", value: "sm" },
            { name: "Medium", value: "md" },
            { name: "Large", value: "lg" },
            { name: "Extra Large", value: "xl" },
          ],
        }),
      ],
    }),
  ],
});
