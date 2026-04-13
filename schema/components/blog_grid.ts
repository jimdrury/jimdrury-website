import { nestable, number } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "blog_grid",
  display_name: "Blog Grid",
  folder: "components",
  preview_field: "per_page",
  schema: [
    number({
      name: "per_page",
      description: "Articles per page (defaults to 9)",
      default_value: 9,
      min_value: 3,
      max_value: 24,
    }),
  ],
});
