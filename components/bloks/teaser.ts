import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "teaser",
  display_name: "Teaser",
  folder: "bloks",
  preview_field: "headline",
  schema: [
    text({
      name: "headline",
      required: true,
    }),
  ],
});
