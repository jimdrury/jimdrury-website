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
        "flex flex-col gap-4 rounded-xl border-[3px] border-[var(--fg-primary)] p-8 shadow-[6px_6px_0_0_var(--fg-primary)]",
        colourClasses[colour],
        className,
      )}
      {...props}
    >
      <IconComponent className="size-12 text-[var(--fg-primary)]" aria-hidden />
      <figcaption className="font-[family-name:var(--font-anton)] text-[28px] font-normal uppercase leading-tight tracking-[1px] text-[var(--fg-primary)]">
        {title}
      </figcaption>
      {company && (
        <p className="font-[family-name:var(--font-inter)] text-xs font-bold uppercase tracking-[1.5px] text-[var(--fg-primary)]">
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
