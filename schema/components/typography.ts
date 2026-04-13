import { nestable, option, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "typography",
  display_name: "Typography",
  folder: "components",
  preview_field: "content",
  schema: [
    text({
      name: "content",
      required: true,
      description:
        "Main text. Press Enter for a new line, or type \\n for a line break—each break is rendered as a new line on the site.",
    }),
    option({
      name: "as",
      default_value: "p",
      description:
        "Semantic HTML element (accessibility and outline order). Visual scale comes from the Size field; when Size is Match element, scale follows the default pairing for each tag.",
      options: [
        { name: "Paragraph", value: "p" },
        { name: "Heading 1", value: "h1" },
        { name: "Heading 2", value: "h2" },
        { name: "Heading 3", value: "h3" },
        { name: "Heading 4", value: "h4" },
      ],
    }),
    option({
      name: "size",
      default_value: "auto",
      description:
        "Visual type scale (Pencil theme `size`). Match element keeps the default pairing: p→base, h4→lg, h3→xl, h2→2xl, h1→3xl.",
      options: [
        { name: "Match element", value: "auto" },
        { name: "Extra small (xs)", value: "xs" },
        { name: "Small (sm)", value: "sm" },
        { name: "Base", value: "base" },
        { name: "Large (lg)", value: "lg" },
        { name: "Extra large (xl)", value: "xl" },
        { name: "2XL", value: "2xl" },
        { name: "3XL", value: "3xl" },
        { name: "4XL", value: "4xl" },
        { name: "5XL", value: "5xl" },
        { name: "6XL", value: "6xl" },
        { name: "7XL", value: "7xl" },
        { name: "8XL", value: "8xl" },
      ],
    }),
    option({
      name: "text_transform",
      default_value: "none",
      description: "CSS text-transform applied to the text.",
      options: [
        { name: "None", value: "none" },
        { name: "Uppercase", value: "uppercase" },
        { name: "Lowercase", value: "lowercase" },
        { name: "Capitalize", value: "capitalize" },
      ],
    }),
  ],
});
