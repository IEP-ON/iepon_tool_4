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
      className={`grid gap-2 ${columns === 3 ? "grid-cols-2 sm:grid-cols-3" : columns === 4 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2"}`}
    >
      {options.map((option) => (
        <div key={option} className="flex items-center gap-2">
          <Checkbox
            id={`cb-${option}`}
            checked={selected.includes(option)}
            onCheckedChange={() => toggle(option)}
          />
          <Label htmlFor={`cb-${option}`} className="text-sm cursor-pointer">
            {option}
          </Label>
        </div>
      ))}
    </div>
  );
}
