import type { FC, ReactNode } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface TableProps extends ComponentPropsWithoutChildren<"table"> {
  children?: ReactNode;
}

export const Table: FC<TableProps> = ({ className, children, ...props }) => {
  return (
    <div className="overflow-x-auto rounded-md border-2 border-black shadow-[4px_4px_0_0]">
      <table className={cn("w-full text-left text-sm", className)} {...props}>
        {children}
      </table>
    </div>
  );
};

export interface TableHeadProps extends ComponentPropsWithoutChildren<"thead"> {
  children?: ReactNode;
}

export const TableHead: FC<TableHeadProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <thead
      className={cn(
        "border-b-2 border-black bg-yellow-100 font-semibold",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

export interface TableBodyProps extends ComponentPropsWithoutChildren<"tbody"> {
  children?: ReactNode;
}

export const TableBody: FC<TableBodyProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tbody
      className={cn("divide-y-2 divide-black bg-white text-black", className)}
      {...props}
    >
      {children}
    </tbody>
  );
};

export interface TableRowProps extends ComponentPropsWithoutChildren<"tr"> {
  children?: ReactNode;
}

export const TableRow: FC<TableRowProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <tr className={cn("", className)} {...props}>
      {children}
    </tr>
  );
};

export interface TableCellProps extends ComponentPropsWithoutChildren<"td"> {
  children?: ReactNode;
  header?: boolean;
}

export const TableCell: FC<TableCellProps> = ({
  className,
  header,
  children,
  ...props
}) => {
  const Comp = header ? "th" : "td";
  return (
    <Comp className={cn("px-4 py-3 font-semibold", className)} {...props}>
      {children}
    </Comp>
  );
};
