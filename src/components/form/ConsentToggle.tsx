"use client";

import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface ConsentToggleProps {
  label: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
}

export function ConsentToggle({ label, value, onChange }: ConsentToggleProps) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-800">{label}</div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`
            relative flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
            ${value === true
              ? "border-blue-600 bg-blue-50/50 text-blue-700 shadow-sm ring-1 ring-blue-600/20"
              : "border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:bg-gray-50"
            }
          `}
        >
          <Check className={`w-5 h-5 ${value === true ? "text-blue-600" : "text-gray-400"}`} />
          <span className="font-semibold text-base">동의함</span>
        </button>
        
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`
            relative flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200
            ${value === false
              ? "border-red-600 bg-red-50/50 text-red-700 shadow-sm ring-1 ring-red-600/20"
              : "border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-gray-50"
            }
          `}
        >
          <X className={`w-5 h-5 ${value === false ? "text-red-600" : "text-gray-400"}`} />
          <span className="font-semibold text-base">동의 안 함</span>
        </button>
      </div>
    </div>
  );
}
