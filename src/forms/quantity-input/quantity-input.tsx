"use client";

import type { FC } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { cn } from "@/lib/utils";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export const QuantityInput: FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 0,
  max = 99,
  className,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center border-2 border-black shadow-[4px_4px_0_0]",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid size-10 cursor-pointer place-content-center border-r-2 border-black bg-white text-black font-bold hover:bg-yellow-100 focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaMinus className="size-3" />
      </button>
      <span className="grid w-12 place-content-center bg-white text-black text-center font-semibold">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid size-10 cursor-pointer place-content-center border-l-2 border-black bg-white text-black font-bold hover:bg-yellow-100 focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaPlus className="size-3" />
      </button>
    </div>
  );
};
