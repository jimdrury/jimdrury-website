import type { FC } from "react";
import type { TypographyProps } from "@/components/typography";
import { Typography } from "@/components/typography";

type TypographySize = NonNullable<TypographyProps["size"]>;

type ScaleRow = {
  label: string;
  size: TypographySize;
  text: string;
};

const pangram = "The quick brown fox jumps over the lazy dog";

const headlineRows: ScaleRow[] = [
  { label: "8xl", size: "8xl", text: "Brutal" },
  { label: "7xl", size: "7xl", text: "Brutalist" },
  { label: "6xl", size: "6xl", text: "Brutalist" },
  { label: "5xl", size: "5xl", text: "Brutalist Design" },
  { label: "4xl", size: "4xl", text: "Brutalist Design System" },
  { label: "3xl", size: "3xl", text: "Brutalist Design System" },
];

const bodyRows: ScaleRow[] = [
  { label: "2xl", size: "2xl", text: pangram },
  { label: "xl", size: "xl", text: pangram },
  { label: "lg", size: "lg", text: pangram },
  { label: "base", size: "md", text: pangram },
  { label: "sm", size: "sm", text: pangram },
  { label: "xs", size: "xs", text: pangram },
];

const Divider: FC = () => (
  <div aria-hidden className="h-[3px] w-full shrink-0 bg-[#1a1a1a]" />
);

const ScaleRowView: FC<ScaleRow> = ({ label, size, text }) => (
  <div className="flex items-center gap-5">
    <span className="w-12 shrink-0 font-bold font-[family-name:var(--font-inter)] text-[11px] text-[#3d3d3d] tracking-[2px]">
      {label}
    </span>
    <Typography size={size}>{text}</Typography>
  </div>
);

export const TypographyScaleShowcase: FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-7 rounded-xl border-[3px] border-[#1a1a1a] bg-[#F5F0E1] p-12">
      <h1 className="font-[family-name:var(--font-anton)] text-[28px] leading-none tracking-[2px] text-[#1a1a1a] uppercase">
        Typography scale
      </h1>
      <p className="font-[family-name:var(--font-inter)] text-[13px] font-medium leading-normal text-[#3d3d3d]">
        Single component · theme axis &apos;size&apos; · auto font, tracking,
        and leading (weight follows size)
      </p>
      <Divider />
      {headlineRows.map((row) => (
        <ScaleRowView key={row.label} {...row} />
      ))}
      <Divider />
      {bodyRows.map((row) => (
        <ScaleRowView key={row.label} {...row} />
      ))}
    </div>
  );
};
