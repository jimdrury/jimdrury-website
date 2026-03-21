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
        "m-auto max-h-[90dvh] w-full max-w-lg overflow-y-auto border-2 border-black bg-white p-0 text-black shadow-[8px_8px_0_0] backdrop:bg-black/50",
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
        "flex items-center justify-between border-b-2 border-black bg-yellow-300 px-4 py-3",
        className,
      )}
      {...props}
    >
      <h2 className="text-lg font-bold">{children}</h2>
      {onClose && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          icon={FaTimes}
          iconOnly
        >
          {closeLabel}
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
        "flex justify-end gap-3 border-t-2 border-black p-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
