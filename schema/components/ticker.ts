import { blocks, nestable } from "@jimdrury/storyblok-component-schema";
import tickerWord from "./ticker_word";

export default nestable({
  name: "ticker",
  display_name: "Ticker",
  folder: "components",
  schema: [
    blocks({
      name: "items",
      description: "Words shown in the ticker, in order",
      allowed_components: [tickerWord],
      minimum: 1,
    }),
  ],
});
