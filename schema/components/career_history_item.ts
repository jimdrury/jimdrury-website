import {
  datetime,
  nestable,
  richtext,
  text,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "career_history_item",
  display_name: "Career History Item",
  folder: "components",
  preview_field: "role",
  schema: [
    datetime({
      name: "from",
      required: true,
      disable_time: true,
      description: "Start date for this role.",
    }),
    datetime({
      name: "to",
      disable_time: true,
      description: "End date for this role. Leave empty for Present.",
    }),
    text({
      name: "role",
      required: true,
      description: "Role title.",
    }),
    text({
      name: "company",
      required: true,
      description: "Company or organization name.",
    }),
    text({
      name: "website_url",
      description: "Optional company website URL (https://...).",
    }),
    richtext({
      name: "description",
      required: true,
      description: "Role summary and impact details.",
    }),
  ],
});
