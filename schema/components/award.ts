import {
  nestable,
  option,
  richtext,
  text,
} from "@jimdrury/storyblok-component-schema";

export default nestable({
  name: "award",
  display_name: "Award",
  folder: "components",
  preview_field: "title",
  schema: [
    option({
      name: "icon",
      required: true,
      description: "Symbol displayed above the title.",
      options: [
        { name: "★ Star", value: "star" },
        { name: "◆ Diamond", value: "diamond" },
        { name: "▲ Triangle", value: "triangle" },
        { name: "● Circle", value: "circle" },
        { name: "■ Square", value: "square" },
        { name: "✦ Four-pointed star", value: "four_pointed_star" },
        { name: "⬡ Hexagon", value: "hexagon" },
        { name: "✿ Flower", value: "flower" },
      ],
      default_value: "star",
    }),
    text({
      name: "title",
      required: true,
      description: "Award name shown as the heading.",
    }),
    text({
      name: "company",
      description: "Awarding organisation.",
    }),
    option({
      name: "colour",
      description: "Background colour for the award card.",
      options: [
        { name: "Yellow", value: "yellow" },
        { name: "Pink", value: "pink" },
        { name: "Blue", value: "blue" },
        { name: "Green", value: "green" },
      ],
      default_value: "yellow",
    }),
    richtext({
      name: "description",
      description: "Rich text content displayed below the title.",
      allow_target_blank: true,
    }),
  ],
});
