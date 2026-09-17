import { nestable, number, option } from "@jimdrury/storyblok-component-schema";

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
    option({
      name: "density",
      description:
        "Compact renders trimmed teaser cards (short cover, no dek) with a 'View all' link and no pagination. Use for the home page recent-posts strip.",
      default_value: "default",
      options: [
        { name: "Default", value: "default" },
        { name: "Compact", value: "compact" },
      ],
    }),
    number({
      name: "limit",
      description:
        "Cap the number of cards shown (teaser contexts like the home page). Leave empty to use the full page.",
      min_value: 1,
      max_value: 12,
    }),
  ],
});
