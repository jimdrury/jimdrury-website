import {
  boolean,
  nestable,
  pluginCodeBlock,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "snippet",
  display_name: "Snippet",
  folder: "components",
  schema: [
    pluginCodeBlock({
      name: "contents",
      required: true,
      enable_title: true,
      languages: ["tsx", "jsx", "json", "md", "js", "html", "css"],
    }),
    boolean({
      name: "wrap_lines",
      description: "Wrap long lines instead of scrolling horizontally",
      default_value: false,
      inline_label: true,
    }),
    boolean({
      name: "enable_copy_to_clipboard",
      description:
        "Show a copy button that copies this snippet to the clipboard",
      default_value: false,
      inline_label: true,
    }),
  ],
});
