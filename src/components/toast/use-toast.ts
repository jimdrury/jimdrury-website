"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastProps } from "./toast";

export interface ToastItem {
  id: string;
  message: ReactNode;
  variant?: ToastProps["variant"];
  duration?: number;
}

export interface CreateToastOptions {
  message: ReactNode;
  variant?: ToastProps["variant"];
  duration?: number;
}

const DEFAULT_DURATION = 4000;

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timeouts = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  const dismiss = useCallback((id: string) => {
    const timeout = timeouts.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeouts.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    ({
      message,
      variant = "info",
      duration = DEFAULT_DURATION,
    }: CreateToastOptions) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [{ id, message, variant, duration }, ...prev]);

      const timeout = setTimeout(() => dismiss(id), duration);
      timeouts.current.set(id, timeout);
      return id;
    },
    [dismiss],
  );

  const clear = useCallback(() => {
    for (const timeout of timeouts.current.values()) {
      clearTimeout(timeout);
    }
    timeouts.current.clear();
    setToasts([]);
  }, []);

  useEffect(() => clear, [clear]);

  return { toasts, toast, dismiss, clear };
};
