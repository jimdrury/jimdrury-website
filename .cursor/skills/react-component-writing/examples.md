# React Component Writing Examples

## FC + explicit React imports

```ts
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";

export interface CardProps extends ComponentPropsWithoutChildren<"article"> {
  children?: ReactNode;
}

export const Card: FC<CardProps> = ({ children, ...props }) => {
  return <article {...props}>{children}</article>;
};
```

## className + cn + host props extension

```ts
import type { FC } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface SurfaceProps extends ComponentPropsWithoutChildren<"div"> {}

export const Surface: FC<SurfaceProps> = ({ className, ...props }) => {
  return <div className={cn("border-2 border-black", className)} {...props} />;
};
```

## use-client: add only when required

Client component (valid):

```ts
"use client";

import type { FC } from "react";
import { useState } from "react";

export interface ToggleProps {}

export const Toggle: FC<ToggleProps> = () => {
  const [on, setOn] = useState(false);
  return <button onClick={() => setOn((v) => !v)}>{on ? "On" : "Off"}</button>;
};
```

Server-safe component (no directive):

```ts
import type { FC, ReactNode } from "react";

export interface ShellProps {
  children?: ReactNode;
}

export const Shell: FC<ShellProps> = ({ children }) => {
  return <main className="mx-auto max-w-7xl">{children}</main>;
};
```

## Blok bridge pattern

```ts
import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react/rsc";
import { Card, CardBody, CardHeader } from "@/components/card";

type FeatureBlok = SbBlokData & {
  title?: string;
  body?: string;
};

interface FeatureBlokProps {
  blok: FeatureBlok;
}

export const FeatureBlokView: FC<FeatureBlokProps> = ({ blok }) => {
  return (
    <section {...storyblokEditable(blok)}>
      <Card>
        <CardHeader>{blok.title}</CardHeader>
        <CardBody>{blok.body}</CardBody>
      </Card>
    </section>
  );
};
```

## Anti-patterns to reject

- Using `React.ReactNode` instead of importing `ReactNode` type.
- Using default-exported component declarations.
- Adding `"use client"` without client trigger conditions.
- Rebuilding button/card/typography markup in `src/bloks` when `src/components` already provides it.
