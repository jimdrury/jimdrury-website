"use client";

import type { FC, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

const TabsContext = createContext<{
  activeIndex: number;
  setActiveIndex: (i: number) => void;
}>({ activeIndex: 0, setActiveIndex: () => {} });

export interface TabsProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  defaultIndex?: number;
}

export const Tabs: FC<TabsProps> = ({
  className,
  defaultIndex = 0,
  children,
  ...props
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <TabsContext.Provider value={{ activeIndex, setActiveIndex }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

export interface TabListProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const TabList: FC<TabListProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("border-b-2 border-black px-2", className)}>
      <div role="tablist" className="-mb-0.5 flex" {...props}>
        {children}
      </div>
    </div>
  );
};

export interface TabTriggerProps
  extends ComponentPropsWithoutChildren<"button"> {
  children?: ReactNode;
  index: number;
}

export const TabTrigger: FC<TabTriggerProps> = ({
  className,
  index,
  children,
  ...props
}) => {
  const { activeIndex, setActiveIndex } = useContext(TabsContext);
  const isActive = activeIndex === index;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveIndex(index)}
      className={cn(
        "cursor-pointer px-6 py-2 font-semibold hover:brightness-95 focus-visible:focus-ring",
        isActive
          ? "border-2 border-black bg-yellow-300 text-black"
          : "border-2 border-transparent hover:bg-black hover:text-white",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface TabContentProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  index: number;
}

export const TabContent: FC<TabContentProps> = ({
  className,
  index,
  children,
  ...props
}) => {
  const { activeIndex } = useContext(TabsContext);
  if (activeIndex !== index) return null;
  return (
    <div role="tabpanel" className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
};
