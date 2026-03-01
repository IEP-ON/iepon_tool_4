"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: number;
}

export function CheckboxGroup({
  options,
  selected,
  onChange,
  columns = 2,
}: CheckboxGroupProps) {
  const toggle = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter((s) => s !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div
      className={`grid gap-3 ${
        columns === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : columns === 4
            ? "grid-cols-2 sm:grid-cols-4"
            : "grid-cols-1 sm:grid-cols-2"
      }`}
    >
      {options.map((option) => {
        const isSelected = selected.includes(option);
        return (
          <label
            key={option}
            htmlFor={`cb-${option}`}
            className={`
              relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${isSelected 
                ? "border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600/30" 
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
              }
            `}
          >
            <Checkbox
              id={`cb-${option}`}
              checked={isSelected}
              onCheckedChange={() => toggle(option)}
              className={isSelected ? "border-blue-600 data-[state=checked]:bg-blue-600" : "border-gray-300"}
            />
            <span className={`text-base font-medium flex-1 ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}
