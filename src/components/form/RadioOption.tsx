"use client";

import { cn } from "@/lib/utils";

interface RadioOptionProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  columns?: number;
}

export function RadioOption({
  options,
  value,
  onChange,
  columns = 2,
}: RadioOptionProps) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 1
          ? "grid-cols-1"
          : columns === 3
            ? "grid-cols-2 sm:grid-cols-3"
            : "grid-cols-2"
      )}
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "px-3 py-2 text-sm rounded-lg border text-left transition-colors",
            value === option
              ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
