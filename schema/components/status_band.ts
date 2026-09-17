import { blocks, nestable } from "@jimdrury/storyblok-component-schema";
import badge from "./badge";
import rich_text from "./rich_text";
import typography from "./typography";

export default nestable({
  name: "status_band",
  display_name: "Status band",
  folder: "components",
  schema: [
    blocks({
      name: "badge",
      description:
        "Optional pill label shown before the status line (e.g. Now).",
      allowed_components: [badge],
      maximum: 1,
    }),
    blocks({
      name: "body",
      required: true,
      description:
        "One clear status line (Typography or rich text), contained in a bordered panel.",
      allowed_components: [typography, rich_text],
      maximum: 1,
    }),
  ],
});
