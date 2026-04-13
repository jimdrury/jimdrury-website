import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "ticker_word",
  display_name: "Ticker Word",
  folder: "components",
  preview_field: "label",
  schema: [
    text({
      name: "label",
      required: true,
      description: "Text displayed in the ticker.",
    }),
  ],
});
