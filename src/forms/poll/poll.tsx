"use client";

import type { ChangeEvent, FC, ReactNode } from "react";
import { createContext, useCallback, useContext, useId, useState } from "react";
import type { ComponentPropsWithoutChildren } from "@/lib/component-props";
import { cn } from "@/lib/utils";

type PollContextValue = {
  name: string;
  groupId: string;
  selected: string;
  setSelected: (value: string) => void;
};

const PollContext = createContext<PollContextValue | null>(null);

function usePollContext(component: string): PollContextValue {
  const ctx = useContext(PollContext);
  if (!ctx) {
    throw new Error(`${component} must be used within <Poll>`);
  }
  return ctx;
}

export interface PollProps extends ComponentPropsWithoutChildren<"fieldset"> {
  children?: ReactNode;
  /** Shown as an accessible `<legend>` for the radio group. */
  question: string;
  /** `name` on each radio (form submission / grouping). */
  name?: string;
  /** Controlled selected option `value`. */
  value?: string;
  /** Uncontrolled initial selection. */
  defaultValue?: string;
  /** Called when the selected option changes. */
  onValueChange?: (value: string) => void;
}

export const Poll: FC<PollProps> = ({
  className,
  question,
  name = "poll",
  value: valueProp,
  defaultValue = "",
  onValueChange,
  children,
  ...props
}) => {
  const groupId = useId();
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const isControlled = valueProp !== undefined;
  const selected = isControlled ? valueProp : uncontrolled;

  const setSelected = useCallback(
    (next: string) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const contextValue: PollContextValue = {
    name,
    groupId,
    selected,
    setSelected,
  };

  return (
    <PollContext.Provider value={contextValue}>
      <fieldset
        className={cn(
          "min-w-0 border-2 border-black bg-white p-6 text-black shadow-[4px_4px_0_0]",
          className,
        )}
        {...props}
      >
        <legend className="w-full text-lg font-bold">{question}</legend>
        <div className="mt-4 space-y-2">{children}</div>
      </fieldset>
    </PollContext.Provider>
  );
};

export interface PollOptionProps
  extends Omit<ComponentPropsWithoutChildren<"input">, "type" | "name"> {
  children?: ReactNode;
  /** Submitted with the form and used to identify this option. */
  value: string;
  votes?: number;
  formatVotes?: (votes: number) => string;
}

export const PollOption: FC<PollOptionProps> = ({
  className,
  children,
  value,
  votes,
  formatVotes = (count) => `${count} ${count === 1 ? "vote" : "votes"}`,
  id: idProp,
  onChange,
  disabled,
  ...props
}) => {
  const { name, groupId, selected, setSelected } = usePollContext("PollOption");
  const inputId =
    idProp ?? `${groupId}-option-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    if (!e.defaultPrevented) {
      setSelected(value);
    }
  };

  return (
    <label
      htmlFor={inputId}
      className={cn(
        "flex w-full cursor-pointer items-center justify-between border-2 border-black px-4 py-3 font-semibold shadow-[2px_2px_0_0] hover:bg-yellow-100 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50",
        selected === value && "bg-yellow-50",
      )}
    >
      <span className="flex items-center gap-3">
        <input
          {...props}
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={selected === value}
          disabled={disabled}
          onChange={handleChange}
          className={cn(
            "size-6 shrink-0 cursor-pointer border-2 border-black shadow-[2px_2px_0_0] shadow-black checked:bg-black focus-visible:focus-ring-sm",
            className,
          )}
        />
        <span className="font-semibold text-black">{children}</span>
      </span>
      {votes !== undefined && (
        <span className="text-sm text-gray-500">{formatVotes(votes)}</span>
      )}
    </label>
  );
};
