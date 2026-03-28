import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "accolade",
  display_name: "Accolade",
  folder: "components",
  preview_field: "title",
  schema: [
    text({
      name: "title",
      required: true,
      description: "Award or accolade title.",
    }),
    text({
      name: "year",
      required: true,
      description: "Year label shown on the right.",
    }),
    text({
      name: "href",
      description: "Optional URL to more detail about this accolade.",
    }),
  ],
});
