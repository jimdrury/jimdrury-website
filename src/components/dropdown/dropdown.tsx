"use client";

import type {
  FC,
  KeyboardEvent,
  MutableRefObject,
  ReactNode,
  Ref,
} from "react";
import {
  createContext,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useBoolean, useOnClickOutside } from "usehooks-ts";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(value);
  else (ref as MutableRefObject<T | null>).current = value;
}

type DropdownContextValue = {
  isOpen: boolean;
  toggle: () => void;
  closeMenu: () => void;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  menuId: string;
  menuItemsRef: MutableRefObject<HTMLButtonElement[]>;
  activeIndex: number;
  setActiveIndex: (index: number | ((prev: number) => number)) => void;
  registerMenuItem: (el: HTMLButtonElement) => number;
  unregisterMenuItem: (el: HTMLButtonElement) => void;
  onMenuKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

function useDropdownContext(component: string): DropdownContextValue {
  const ctx = useContext(DropdownContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Dropdown>`);
  }
  return ctx;
}

export interface DropdownProps extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const Dropdown: FC<DropdownProps> = ({
  className,
  children,
  ...props
}) => {
  const { value: isOpen, setTrue: open, setFalse: close } = useBoolean(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuItemsRef = useRef<HTMLButtonElement[]>([]);
  const menuId = useId();
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  const registerMenuItem = useCallback((el: HTMLButtonElement) => {
    const arr = menuItemsRef.current;
    if (!arr.includes(el)) {
      arr.push(el);
    }
    return arr.indexOf(el);
  }, []);

  const unregisterMenuItem = useCallback((el: HTMLButtonElement) => {
    const arr = menuItemsRef.current;
    const i = arr.indexOf(el);
    if (i >= 0) {
      arr.splice(i, 1);
    }
  }, []);

  const closeMenu = useCallback(() => {
    close();
    setActiveIndex(-1);
    queueMicrotask(() => {
      triggerRef.current?.focus({ preventScroll: true });
    });
  }, [close]);

  const toggle = useCallback(() => {
    if (isOpenRef.current) {
      closeMenu();
    } else {
      open();
    }
  }, [closeMenu, open]);

  useOnClickOutside(containerRef, () => {
    if (isOpenRef.current) {
      closeMenu();
    }
  });

  useLayoutEffect(() => {
    if (!isOpen) {
      setActiveIndex(-1);
      menuItemsRef.current = [];
      return;
    }
    const items = menuItemsRef.current;
    let start = 0;
    while (start < items.length && items[start]?.disabled) {
      start += 1;
    }
    const idx = start < items.length ? start : 0;
    setActiveIndex(idx);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    const el = menuItemsRef.current[activeIndex];
    el?.focus({ preventScroll: true });
  }, [activeIndex, isOpen]);

  const onMenuKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const items = menuItemsRef.current;
      if (items.length === 0) return;

      const move = (delta: number) => {
        setActiveIndex((current) => {
          let idx = current;
          if (idx < 0) idx = 0;
          for (let n = 0; n < items.length; n += 1) {
            idx = (idx + delta + items.length) % items.length;
            if (!items[idx]?.disabled) {
              return idx;
            }
          }
          return current;
        });
      };

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          move(1);
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          move(-1);
          break;
        }
        case "Home": {
          e.preventDefault();
          const first = items.findIndex((el) => el && !el.disabled);
          if (first >= 0) setActiveIndex(first);
          break;
        }
        case "End": {
          e.preventDefault();
          let last = -1;
          for (let i = items.length - 1; i >= 0; i -= 1) {
            if (!items[i]?.disabled) {
              last = i;
              break;
            }
          }
          if (last >= 0) setActiveIndex(last);
          break;
        }
        case "Escape": {
          e.preventDefault();
          closeMenu();
          break;
        }
        case "Tab": {
          e.preventDefault();
          move(e.shiftKey ? -1 : 1);
          break;
        }
        default:
          break;
      }
    },
    [closeMenu],
  );

  const contextValue = useMemo<DropdownContextValue>(
    () => ({
      isOpen,
      toggle,
      closeMenu,
      triggerRef,
      menuId,
      menuItemsRef,
      activeIndex,
      setActiveIndex,
      registerMenuItem,
      unregisterMenuItem,
      onMenuKeyDown,
    }),
    [
      isOpen,
      toggle,
      closeMenu,
      menuId,
      activeIndex,
      registerMenuItem,
      unregisterMenuItem,
      onMenuKeyDown,
    ],
  );

  return (
    <DropdownContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export interface DropdownTriggerProps
  extends ComponentPropsWithoutChildren<"button"> {
  children?: ReactNode;
}

export const DropdownTrigger: FC<DropdownTriggerProps> = ({
  className,
  children,
  ref: refProp,
  onClick,
  ...props
}) => {
  const { toggle, isOpen, triggerRef, menuId } =
    useDropdownContext("DropdownTrigger");
  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        assignRef(refProp, node);
      }}
      type="button"
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-controls={menuId}
      onClick={(e) => {
        onClick?.(e);
        toggle();
      }}
      className={cn(
        "cursor-pointer border-2 border-black bg-white text-black px-4 py-2 font-semibold shadow-[4px_4px_0_0] hover:bg-yellow-100 focus-visible:focus-ring",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export interface DropdownContentProps
  extends ComponentPropsWithoutChildren<"div"> {
  children?: ReactNode;
}

export const DropdownContent: FC<DropdownContentProps> = ({
  className,
  children,
  onKeyDown,
  ...props
}) => {
  const { isOpen, menuId, onMenuKeyDown } =
    useDropdownContext("DropdownContent");
  if (!isOpen) return null;
  return (
    <div
      id={menuId}
      role="menu"
      onKeyDown={(e) => {
        onMenuKeyDown(e);
        onKeyDown?.(e);
      }}
      className={cn(
        "absolute left-0 z-10 mt-1 min-w-48 border-2 border-black bg-white text-black shadow-[4px_4px_0_0]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export interface DropdownItemProps
  extends ComponentPropsWithoutChildren<"button"> {
  children?: ReactNode;
}

export const DropdownItem: FC<DropdownItemProps> = ({
  className,
  children,
  ref: refProp,
  onClick,
  tabIndex: tabIndexProp,
  role: roleProp,
  ...props
}) => {
  const { closeMenu, registerMenuItem, unregisterMenuItem, activeIndex } =
    useDropdownContext("DropdownItem");
  const innerRef = useRef<HTMLButtonElement | null>(null);
  const [itemIndex, setItemIndex] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const idx = registerMenuItem(el);
    setItemIndex(idx);
    return () => {
      unregisterMenuItem(el);
      setItemIndex(null);
    };
  }, [registerMenuItem, unregisterMenuItem]);

  const rovingTabIndex =
    itemIndex !== null && activeIndex >= 0 && itemIndex === activeIndex
      ? 0
      : -1;
  const tabIndex = tabIndexProp ?? rovingTabIndex;

  return (
    <button
      ref={(node) => {
        innerRef.current = node;
        assignRef(refProp, node);
      }}
      type="button"
      role={roleProp ?? "menuitem"}
      tabIndex={tabIndex}
      onClick={(e) => {
        onClick?.(e);
        closeMenu();
      }}
      className={cn(
        "block w-full cursor-pointer px-4 py-2 text-left font-semibold hover:bg-yellow-100 focus-visible:bg-yellow-100 focus-visible:focus-ring",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};
