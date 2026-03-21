import {
  blocks,
  nestable,
  option,
  tab,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "box",
  display_name: "Box",
  folder: "layout",
  schema: [
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
    }),
    tab({
      name: "style",
      display_name: "Style",
      fields: [
        option({
          name: "padding",
          description: "Inner spacing around the box content",
          default_value: "md",
          options: [
            { name: "None", value: "none" },
            { name: "XS", value: "xs" },
            { name: "SM", value: "sm" },
            { name: "MD", value: "md" },
            { name: "LG", value: "lg" },
            { name: "XL", value: "xl" },
          ],
        }),
        option({
          name: "margin",
          description: "Outer spacing around the box",
          default_value: "none",
          options: [
            { name: "None", value: "none" },
            { name: "XS", value: "xs" },
            { name: "SM", value: "sm" },
            { name: "MD", value: "md" },
            { name: "LG", value: "lg" },
            { name: "XL", value: "xl" },
          ],
        }),
        option({
          name: "background_colour",
          description: "Background colour of the box",
          default_value: "none",
          options: [
            { name: "None", value: "none" },
            { name: "White", value: "white" },
            { name: "Light grey", value: "light_grey" },
            { name: "Dark", value: "dark" },
            { name: "Black", value: "black" },
            { name: "Yellow", value: "yellow" },
            { name: "Blue", value: "blue" },
          ],
        }),
        option({
          name: "text_colour",
          description: "Text colour override for content in the box",
          default_value: "default",
          options: [
            { name: "Default", value: "default" },
            { name: "Black", value: "black" },
            { name: "White", value: "white" },
          ],
        }),
      ],
    }),
  ],
});
