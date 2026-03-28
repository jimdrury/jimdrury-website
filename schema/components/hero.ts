import {
  asset,
  nestable,
  text,
  textarea,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "hero",
  display_name: "Hero",
  folder: "components",
  schema: [
    text({
      name: "title",
      required: true,
    }),
    textarea({
      name: "blurb",
      required: true,
    }),
    asset({
      name: "portrait",
      filetypes: ["images"],
      required: true,
    }),
  ],
});
