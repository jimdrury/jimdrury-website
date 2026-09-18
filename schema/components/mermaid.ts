import { nestable, text, textarea } from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "mermaid",
  display_name: "Mermaid diagram",
  folder: "components",
  preview_field: "title",
  schema: [
    textarea({
      name: "source",
      required: true,
      description:
        "Paste raw Mermaid source (flowchart, sequence, class, state, er, gantt, pie, mindmap, timeline, and other Mermaid types). Do not wrap it in ```mermaid fences — paste the diagram body only. Draft it at mermaid.live if you want a live preview first.",
    }),
    text({
      name: "title",
      description: "Optional heading shown above the diagram.",
    }),
    text({
      name: "caption",
      description: "Optional caption shown below the diagram.",
    }),
    text({
      name: "alt",
      description:
        "Accessible name for the diagram. Describe what the chart shows for screen reader users.",
    }),
  ],
});
