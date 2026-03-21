import {
  nestable,
  option,
  richtext,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "typography",
  display_name: "Typography",
  folder: "typography",
  preview_field: "text",
  schema: [
    richtext({
      name: "text",
      required: true,
      description: "The text content to display.",
      allow_target_blank: true,
    }),
    option({
      name: "as",
      description: "HTML element to render.",
      options: [
        { name: "Paragraph", value: "p" },
        { name: "Heading 1", value: "h1" },
        { name: "Heading 2", value: "h2" },
        { name: "Heading 3", value: "h3" },
        { name: "Heading 4", value: "h4" },
        { name: "Heading 5", value: "h5" },
        { name: "Heading 6", value: "h6" },
        { name: "Span", value: "span" },
        { name: "List Item", value: "li" },
      ],
      default_value: "p",
    }),
    option({
      name: "size",
      description: "Text size from the type scale.",
      options: [
        { name: "Extra Small", value: "xs" },
        { name: "Small", value: "sm" },
        { name: "Medium", value: "md" },
        { name: "Large", value: "lg" },
        { name: "Extra Large", value: "xl" },
        { name: "2XL", value: "2xl" },
        { name: "3XL", value: "3xl" },
      ],
      default_value: "md",
    }),
    option({
      name: "weight",
      description: "Font weight.",
      options: [
        { name: "Normal", value: "normal" },
        { name: "Medium", value: "medium" },
        { name: "Bold", value: "bold" },
        { name: "Black", value: "black" },
      ],
      default_value: "medium",
    }),
  ],
});
