"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Option = string | {
  value: string;
  label: string;
};

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3;
}

export function RadioOption({ options, value, onChange, columns = 1 }: Props) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className={`grid gap-3 ${
        columns === 3
          ? "grid-cols-1 sm:grid-cols-3"
          : columns === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : "grid-cols-1"
      }`}
    >
      {options.map((opt) => {
        const optValue = typeof opt === "string" ? opt : opt.value;
        const optLabel = typeof opt === "string" ? opt : opt.label;
        const isSelected = value === optValue;
        
        return (
          <label
            key={optValue}
            className={`
              relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${isSelected 
                ? "border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600/30" 
                : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
              }
            `}
          >
            <RadioGroupItem 
              value={optValue} 
              id={`radio-${optValue}`} 
              className={isSelected ? "border-blue-600 text-blue-600" : "border-gray-300"}
            />
            <span className={`text-base font-medium flex-1 ${isSelected ? "text-blue-900" : "text-gray-900"}`}>
              {optLabel}
            </span>
          </label>
        );
      })}
    </RadioGroup>
  );
}
