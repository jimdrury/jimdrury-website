import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "ticker_word",
  display_name: "Ticker word",
  folder: "subcomponents",
  preview_field: "label",
  schema: [
    text({
      name: "label",
      required: true,
      description: "Single word or short label in the ticker",
    }),
  ],
});
