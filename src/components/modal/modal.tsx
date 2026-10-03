"use client";

import type { FC, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "@/components/button";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

export interface ModalProps extends ComponentPropsWithoutChildren<"dialog"> {
  children?: ReactNode;
  open?: boolean;
  onClose?: () => void;
}

export const Modal: FC<ModalProps> = ({
  className,
  open,
  onClose,
  children,
  ...props
}) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
    } else {
      if (typeof dialog.close === "function") dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={cn(
        /* Preflight sets margin:0 on * — native <dialog> centers via margin:auto in the top layer */
        "m-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)] p-0 text-[var(--fg-primary)] backdrop:bg-black/50",
        className,
      )}
      {...props}
    >
      {children}
    </dialog>
  );
};

export interface ModalHeaderProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

export const ModalHeader: FC<ModalHeaderProps> = ({
  className,
  onClose,
  closeLabel = "Close",
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--bg-secondary)] px-4 py-3",
        className,
      )}
      {...props}
    >
      <h2 className="font-[family-name:var(--font-geist-sans)] text-lg font-medium tracking-[-0.02em]">
        {children}
      </h2>
      {onClose && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="p-4"
        >
          <FaTimes aria-hidden className="size-[1em] shrink-0" />
          <span className="sr-only">{closeLabel}</span>
        </Button>
      )}
    </div>
  );
};

export interface ModalBodyProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const ModalBody: FC<ModalBodyProps> = ({
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

export interface ModalFooterProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const ModalFooter: FC<ModalFooterProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex justify-end gap-3 border-t border-[var(--color-border)] p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
