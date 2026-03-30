import {
  asset,
  boolean,
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
        datetime({
          name: "end_date",
          description:
            "Optional end date/time. Leave blank for single-day events.",
        }),
        text({
          name: "organizer",
          description: "Event organizer name.",
        }),
        text({
          name: "address",
          description: "Event location address.",
        }),
        text({
          name: "performer",
          description:
            "Optional performer or speaker. Falls back to organizer when blank.",
        }),
        text({
          name: "event_status",
          description:
            "Optional schema.org event status URL (for example: https://schema.org/EventCancelled).",
        }),
        boolean({
          name: "is_expanded",
          default_value: false,
          description:
            "When enabled, this speaking engagement is expanded by default.",
        }),
      ],
    }),
    tab({
      name: "link",
      display_name: "Link",
      fields: [
        asset({
          name: "image",
          filetypes: ["images"],
          description: "Optional event image for SEO structured data.",
        }),
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
