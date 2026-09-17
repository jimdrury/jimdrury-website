import { nestable, number, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "recent_posts",
  display_name: "Recent posts",
  folder: "components",
  preview_field: "title",
  schema: [
    text({
      name: "title",
      description: "Section heading (defaults to Recent Writing)",
      default_value: "Recent Writing",
    }),
    number({
      name: "count",
      description: "How many recent articles to show",
      default_value: 3,
      min_value: 1,
      max_value: 12,
    }),
  ],
});
