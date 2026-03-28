import { nestable, text, textarea } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "media_video_link",
  display_name: "Media Video Link",
  folder: "components",
  preview_field: "title",
  schema: [
    text({
      name: "title",
      required: true,
      description: "Video title shown in the list.",
    }),
    text({
      name: "meta",
      description: "Meta line (for example: YouTube • Interview).",
    }),
    textarea({
      name: "description",
      description: "Optional short summary under the title.",
    }),
    text({
      name: "youtube_url",
      required: true,
      description: "Full YouTube URL (https://...).",
    }),
    text({
      name: "cta_text",
      description: "Optional CTA text (for example: Watch on YouTube ▶).",
    }),
    text({
      name: "channel",
      description: "Legacy fallback metadata. Prefer using `meta`.",
    }),
  ],
});
