import { blocks, nestable, option } from "@jimdrury/storyblok-component-schema";
import gridItem from "./grid_item";

export default nestable({
  name: "grid",
  display_name: "Grid",
  folder: "layout",
  schema: [
    blocks({
      name: "items",
      allowed_components: [gridItem],
      required: true,
      minimum: 1,
    }),
    option({
      name: "gap",
      description: "Gap between grid items.",
      default_value: "md",
      options: [
        { name: "None", value: "none" },
        { name: "Small", value: "sm" },
        { name: "Medium", value: "md" },
        { name: "Large", value: "lg" },
        { name: "Extra Large", value: "xl" },
      ],
    }),
  ],
});
