import { nestable, option } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "table_of_contents",
  display_name: "Table of Contents",
  folder: "components",
  schema: [
    option({
      name: "max_heading_level",
      description: "Only include headings up to this level",
      default_value: "h3",
      options: [
        { name: "Heading 2", value: "h2" },
        { name: "Heading 3", value: "h3" },
        { name: "Heading 4", value: "h4" },
      ],
    }),
  ],
});
