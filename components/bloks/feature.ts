import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "feature",
  display_name: "Feature",
  folder: "bloks",
  preview_field: "name",
  schema: [
    text({
      name: "name",
      required: true,
    }),
  ],
});
