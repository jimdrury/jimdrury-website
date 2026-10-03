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
  { label: "8xl", size: "8xl", text: "Typed" },
  { label: "7xl", size: "7xl", text: "TypeSafe" },
  { label: "6xl", size: "6xl", text: "TypeSafe" },
  { label: "5xl", size: "5xl", text: "TypeSafe Design" },
  { label: "4xl", size: "4xl", text: "TypeSafe Design System" },
  { label: "3xl", size: "3xl", text: "TypeSafe Design System" },
];

const bodyRows: ScaleRow[] = [
  { label: "2xl", size: "2xl", text: pangram },
  { label: "xl", size: "xl", text: pangram },
  { label: "lg", size: "lg", text: pangram },
  { label: "base", size: "base", text: pangram },
  { label: "sm", size: "sm", text: pangram },
  { label: "xs", size: "xs", text: pangram },
];

const Divider: FC = () => (
  <div aria-hidden className="h-px w-full shrink-0 bg-[var(--color-border)]" />
);

const ScaleRowView: FC<ScaleRow> = ({ label, size, text }) => (
  <div className="flex items-center gap-5">
    <span className="w-12 shrink-0 font-[family-name:var(--font-mono)] text-[11px] text-[var(--fg-secondary)] tracking-[0.08em]">
      {label}
    </span>
    <Typography size={size}>{text}</Typography>
  </div>
);

export const TypographyScaleShowcase: FC = () => {
  return (
    <div className="mx-auto flex w-full max-w-[900px] flex-col gap-7 rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)] p-12">
      <h1 className="font-[family-name:var(--font-geist-sans)] text-[28px] leading-none tracking-[-0.03em] text-[var(--fg-primary)] font-medium">
        Typography scale
      </h1>
      <p className="font-[family-name:var(--font-inter)] text-[13px] font-normal leading-normal text-[var(--fg-secondary)]">
        Single component · theme axis &apos;size&apos; · Geist display, Inter
        body, medium weight on headings
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
