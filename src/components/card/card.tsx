import { Slot } from "@radix-ui/react-slot";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface CardProps extends ComponentPropsWithoutChildren<"article"> {
  children?: ReactNode;
  asChild?: boolean;
}

export const Card: FC<CardProps> = ({
  asChild,
  className,
  children,
  ...props
}) => {
  const Comp = asChild ? Slot : "article";
  return (
    <Comp
      className={cn(
        "border-2 border-black bg-white text-black shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};

export interface CardHeaderProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const CardHeader: FC<CardHeaderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("border-b-2 border-black bg-yellow-300 p-3", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface CardBodyProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const CardBody: FC<CardBodyProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("p-4 sm:p-6", className)} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const CardFooter: FC<CardFooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn("border-t-2 border-black p-4", className)} {...props}>
      {children}
    </div>
  );
};
