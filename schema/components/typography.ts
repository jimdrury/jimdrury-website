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
    }),
    option({
      name: "as",
      default_value: "p",
      description:
        "Heading levels use predefined size (weight follows the scale for that size).",
      options: [
        { name: "Paragraph", value: "p" },
        { name: "Heading 1", value: "h1" },
        { name: "Heading 2", value: "h2" },
        { name: "Heading 3", value: "h3" },
        { name: "Heading 4", value: "h4" },
      ],
    }),
  ],
});
