import {
  boolean,
  nestable,
  richtext,
  text,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "prompt",
  display_name: "Prompt",
  folder: "components",
  preview_field: "title",
  schema: [
    text({
      name: "title",
      description:
        "Header label displayed above the prompt, e.g. 'System Prompt'",
    }),
    richtext({
      name: "content",
      required: true,
      allow_target_blank: true,
    }),
    boolean({
      name: "enable_copy_to_clipboard",
      description: "Show a button that copies the raw prompt text",
      default_value: false,
      inline_label: true,
    }),
  ],
});
