import { nestable, richtext, text } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "cited_quote",
  display_name: "Cited Quote",
  folder: "components",
  preview_field: "quote",
  schema: [
    richtext({
      name: "quote",
      required: true,
      description: "The quote text to display.",
      allow_target_blank: true,
    }),
    text({
      name: "citation",
      required: true,
      description: "Who said the quote.",
    }),
    text({
      name: "citation_context",
      description: "Optional source, role, or publication.",
    }),
  ],
});
