"use client";

import { cn } from "@/lib/utils";

interface ConsentToggleProps {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}

export function ConsentToggle({ label, value, onChange }: ConsentToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5 border-b last:border-0">
      <span className="text-sm flex-1">{label}</span>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={cn(
            "px-3 py-1 text-xs rounded-md border transition-colors",
            value === true
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
          )}
        >
          동의
        </button>
        <button
          type="button"
          onClick={() => onChange(false)}
          className={cn(
            "px-3 py-1 text-xs rounded-md border transition-colors",
            value === false
              ? "bg-red-500 text-white border-red-500"
              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50"
          )}
        >
          미동의
        </button>
      </div>
    </div>
  );
}
