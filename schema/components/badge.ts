import { nestable, option, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "badge",
  display_name: "Badge",
  folder: "components",
  preview_field: "label",
  schema: [
    text({
      name: "label",
      required: true,
      description: "Badge text",
    }),
    option({
      name: "variant",
      description: "Badge color style",
      default_value: "highlight",
      options: [
        { name: "Primary", value: "primary" },
        { name: "Secondary", value: "secondary" },
        { name: "Tertiary", value: "tertiary" },
        { name: "Highlight", value: "highlight" },
        { name: "Dark", value: "dark" },
      ],
    }),
  ],
});
