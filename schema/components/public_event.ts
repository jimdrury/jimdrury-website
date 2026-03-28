import {
  datetime,
  nestable,
  tab,
  text,
  textarea,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "public_event",
  display_name: "Public Event",
  folder: "components",
  preview_field: "title",
  schema: [
    tab({
      name: "content",
      display_name: "Content",
      fields: [
        text({
          name: "title",
          required: true,
          description: "Event title.",
        }),
        textarea({
          name: "description",
          required: true,
          description: "Short event summary.",
        }),
      ],
    }),
    tab({
      name: "date_context",
      display_name: "Date & Context",
      fields: [
        datetime({
          name: "event_date",
          required: true,
          description: "Primary event date.",
        }),
        text({
          name: "meta",
          description:
            "Optional location or context metadata shown next to the formatted date.",
        }),
      ],
    }),
    tab({
      name: "link",
      display_name: "Link",
      fields: [
        text({
          name: "link_text",
          description:
            "Optional link label (for example: View event details ->).",
        }),
        text({
          name: "link_url",
          description: "Optional event URL (https://...).",
        }),
      ],
    }),
  ],
});
