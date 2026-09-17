import { nestable, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "home_ctas",
  display_name: "Home CTAs",
  folder: "components",
  preview_field: "primary_label",
  schema: [
    text({
      name: "primary_label",
      description: "Primary button label (defaults to Read the blog)",
      default_value: "Read the blog",
    }),
    text({
      name: "primary_url",
      description: "Primary button URL. Same-origin paths or https only.",
      default_value: "/blog",
    }),
    text({
      name: "secondary_label",
      description: "Secondary button label (defaults to About)",
      default_value: "About",
    }),
    text({
      name: "secondary_url",
      description: "Secondary button URL. Same-origin paths or https only.",
      default_value: "/about",
    }),
  ],
});
