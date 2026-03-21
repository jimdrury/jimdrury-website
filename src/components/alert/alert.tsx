import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export const alertVariants = cva(
  "border-2 border-black p-4 text-neutral-950 shadow-[4px_4px_0_0]",
  {
    variants: {
      variant: {
        info: "bg-blue-100",
        success: "bg-green-100",
        error: "bg-red-100",
        warning: "bg-yellow-100",
      },
    },
    defaultVariants: { variant: "info" },
  },
);

export interface AlertProps
  extends ComponentPropsWithoutChildren<"div">,
    VariantProps<typeof alertVariants> {
  children?: ReactNode;
}

export const Alert: FC<AlertProps> = ({
  className,
  variant,
  children,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-start gap-3">{children}</div>
    </div>
  );
};

export interface AlertIconProps extends ComponentPropsWithoutChildren<"span"> {
  children?: ReactNode;
}

export const AlertIcon: FC<AlertIconProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <span
      className={cn("mt-0.5 shrink-0 text-neutral-950", className)}
      {...props}
    >
      {children}
    </span>
  );
};

/** Wraps title and/or description so the text column grows and stacks with correct spacing. */
export interface AlertBodyProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const AlertBody: FC<AlertBodyProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export interface AlertTitleProps extends ComponentPropsWithoutChildren<"p"> {
  children?: ReactNode;
}

export const AlertTitle: FC<AlertTitleProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn("font-semibold leading-tight text-neutral-950", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export interface AlertDescriptionProps
  extends ComponentPropsWithoutChildren<"p"> {
  children?: ReactNode;
}

export const AlertDescription: FC<AlertDescriptionProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <p
      className={cn(
        "font-normal leading-snug text-pretty text-neutral-950",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};
