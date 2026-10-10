import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export type BadgeVariant = "brand" | "sale" | "rent" | "verified" | "neutral" | "success" | "warning" | "info";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  brand: "border border-brand-200 bg-brand-50 text-brand-800",
  sale: "border border-brand-500 bg-brand-500 text-white",
  rent: "border border-stone-800 bg-stone-800 text-white",
  verified: "border border-green-200 bg-green-50 text-green-800",
  neutral: "border border-stone-200 bg-stone-100 text-stone-700",
  success: "border border-green-200 bg-green-50 text-green-800",
  warning: "border border-amber-200 bg-amber-50 text-amber-900",
  info: "border border-blue-200 bg-blue-50 text-blue-800",
};

export default function Badge({ className, variant = "neutral", ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn("inline-flex min-h-6 items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold leading-5", variantClasses[variant], className)}
    />
  );
}
