import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 py-12 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-500 [&>svg]:h-6 [&>svg]:w-6">
        {icon}
      </div>
      <div className="space-y-1">
        <h2 className="text-base font-bold text-stone-900">{title}</h2>
        {description && <p className="max-w-md text-sm leading-7 text-stone-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}
