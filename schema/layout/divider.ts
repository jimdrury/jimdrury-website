import { nestable, option, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "divider",
  display_name: "Divider",
  folder: "layout",
  schema: [
    text({
      name: "label",
      description: "Optional text displayed in the middle of the divider.",
    }),
    option({
      name: "spacing",
      description: "Vertical spacing around the divider.",
      default_value: "md",
      options: [
        { name: "None", value: "none" },
        { name: "Small", value: "sm" },
        { name: "Medium", value: "md" },
        { name: "Large", value: "lg" },
      ],
    }),
  ],
});
