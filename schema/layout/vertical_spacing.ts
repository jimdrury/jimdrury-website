import { blocks, nestable, option } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "vertical_spacing",
  display_name: "Vertical Spacing",
  folder: "layout",
  preview_field: "size",
  schema: [
    option({
      name: "size",
      required: true,
      default_value: "md",
      options: [
        { name: "XS", value: "xs" },
        { name: "SM", value: "sm" },
        { name: "MD", value: "md" },
        { name: "LG", value: "lg" },
        { name: "XL", value: "xl" },
      ],
    }),
    blocks({
      name: "body",
      allowed_folders: ["layout", "components"],
    }),
  ],
});
