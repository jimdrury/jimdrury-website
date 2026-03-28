import { blocks, nestable } from "@jimdrury/storyblok-component-schema";
import publicEvent from "./public_event";

export default nestable({
  name: "public_events",
  display_name: "Public Events",
  folder: "components",
  schema: [
    blocks({
      name: "events",
      allowed_components: [publicEvent],
      required: true,
      minimum: 1,
    }),
  ],
});
