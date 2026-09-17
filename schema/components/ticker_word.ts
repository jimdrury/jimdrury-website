import { nestable, option, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "ticker_word",
  display_name: "Ticker word",
  folder: "components",
  preview_field: "label",
  schema: [
    text({
      name: "label",
      required: true,
      description: "Single word or short label in the ticker",
    }),
    option({
      name: "weight",
      description:
        "Regular keeps the default ticker size used on other pages. Bold matches the home page (18px / 24px Anton).",
      default_value: "regular",
      options: [
        { name: "Regular", value: "regular" },
        { name: "Bold", value: "bold" },
      ],
    }),
  ],
});
