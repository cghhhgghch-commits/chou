import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function SectionHeader({
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="space-y-1">
        <h2 className="text-xl font-bold leading-8 text-stone-900">{title}</h2>
        {description && <p className="text-sm leading-7 text-stone-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
