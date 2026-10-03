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
import { RuleMarks } from "@/components/rule-box";
import { OsTitleBar, toChromeFilename } from "@/components/window-frame";
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
  yellow: "bg-[var(--bg-accent-yellow)]",
  pink: "bg-[var(--bg-accent-pink)]",
  blue: "bg-[var(--bg-accent-blue)]",
  green: "bg-[var(--bg-accent-green)]",
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
        "rule-box relative overflow-visible bg-[var(--bg-primary)]",
        className,
      )}
      data-grow="true"
      {...props}
    >
      <RuleMarks />
      <OsTitleBar
        title={
          <span className="flex min-w-0 items-center gap-2">
            <IconComponent className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {toChromeFilename(company, "award")}
            </span>
          </span>
        }
      />
      <div className={cn("h-2", colourClasses[colour])} aria-hidden />
      <div className="flex flex-col gap-3 p-6">
        <figcaption className="font-[family-name:var(--font-geist-sans)] text-[length:var(--text-4xl)] font-medium leading-[0.95] tracking-[-0.03em] text-[var(--fg-primary)] [overflow-wrap:anywhere]">
          {title}
        </figcaption>
        {company ? (
          <p className="font-[family-name:var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--fg-secondary)]">
            {company}
          </p>
        ) : null}
        {children ? (
          <div className="max-w-[70ch] text-pretty font-[family-name:var(--font-inter)] text-sm font-medium leading-relaxed text-[var(--fg-secondary)]">
            {children}
          </div>
        ) : null}
      </div>
    </figure>
  );
};
