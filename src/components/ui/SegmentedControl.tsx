import type { LucideIcon } from "lucide-react";

export interface SegmentOption {
  id: string;
  label: string;
  icon?: LucideIcon | null;
}

interface SegmentedControlProps {
  label: string;
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps) {
  return (
    <div role="group" aria-label={label} className={`flex w-max items-center gap-1 rounded-lg border border-stone-200 bg-stone-100 p-1 ${className}`}>
      {options.map(({ id, label: optionLabel, icon: Icon }) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`flex min-h-10 shrink-0 items-center gap-1.5 rounded-md px-3 text-xs font-bold transition-colors sm:text-sm ${
            value === id
              ? "bg-white text-brand-700 shadow-xs"
              : "text-stone-600 hover:bg-white/70 hover:text-stone-900"
          }`}
        >
          {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
          <span>{optionLabel}</span>
        </button>
      ))}
    </div>
  );
}