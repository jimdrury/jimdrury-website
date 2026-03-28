import { nestable, number } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "similar_articles",
  display_name: "Similar Articles",
  folder: "components",
  schema: [
    number({
      name: "count",
      description: "How many related articles to display",
      default_value: 3,
      min_value: 1,
      max_value: 3,
    }),
  ],
});
