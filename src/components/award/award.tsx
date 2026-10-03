import type { FC, ReactNode } from "react";
import type { IconType } from "react-icons";
import {
  LuCircle,
  LuDiamond,
  LuFlower2,
  LuHexagon,
  LuSparkle,
  LuSquare,
  LuStar,
  LuTriangle,
} from "react-icons/lu";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export type AwardIcon =
  | "star"
  | "diamond"
  | "triangle"
  | "circle"
  | "square"
  | "four_pointed_star"
  | "hexagon"
  | "flower";

export type AwardColour = "yellow" | "pink" | "blue" | "green";

const iconComponents: Record<AwardIcon, IconType> = {
  star: LuStar,
  diamond: LuDiamond,
  triangle: LuTriangle,
  circle: LuCircle,
  square: LuSquare,
  four_pointed_star: LuSparkle,
  hexagon: LuHexagon,
  flower: LuFlower2,
};

export interface AwardProps extends ComponentPropsWithoutChildren<"figure"> {
  icon: AwardIcon;
  title: string;
  company?: string;
  colour?: AwardColour;
  children?: ReactNode;
}

const colourClasses: Record<AwardColour, string> = {
  yellow: "border-l-[var(--bg-accent-yellow)]",
  pink: "border-l-[var(--bg-accent-pink)]",
  blue: "border-l-[var(--bg-accent-blue)]",
  green: "border-l-[var(--bg-accent-green)]",
};

export const Award: FC<AwardProps> = ({
  icon,
  title,
  company,
  colour = "yellow",
  children,
  className,
  ...props
}) => {
  const IconComponent = iconComponents[icon];

  return (
    <figure
      className={cn(
        "flex flex-col gap-4 rounded-none border border-[var(--color-border)] border-l-2 bg-[var(--bg-primary)] p-8",
        colourClasses[colour],
        className,
      )}
      {...props}
    >
      <IconComponent className="size-12 text-[var(--fg-primary)]" aria-hidden />
      <figcaption className="font-[family-name:var(--font-geist-sans)] text-[28px] font-medium leading-[0.95] tracking-[-0.03em] text-[var(--fg-primary)]">
        {title}
      </figcaption>
      {company && (
        <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
          {company}
        </p>
      )}
      {children && (
        <div className="max-w-[70ch] text-pretty font-[family-name:var(--font-inter)] text-sm font-medium leading-relaxed text-[var(--fg-secondary)]">
          {children}
        </div>
      )}
    </figure>
  );
};
