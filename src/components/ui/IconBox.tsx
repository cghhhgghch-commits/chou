import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

export type IconBoxTone = "neutral" | "brand" | "success" | "warning" | "info";
export type IconBoxSize = "sm" | "md" | "lg";

interface IconBoxProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: IconBoxTone;
  size?: IconBoxSize;
}

const toneClasses: Record<IconBoxTone, string> = {
  neutral: "bg-stone-100 text-stone-600",
  brand: "bg-brand-50 text-brand-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-800",
  info: "bg-blue-50 text-blue-700",
};

const sizeClasses: Record<IconBoxSize, string> = {
  sm: "h-9 w-9 rounded-lg [&>svg]:h-4 [&>svg]:w-4",
  md: "h-11 w-11 rounded-xl [&>svg]:h-5 [&>svg]:w-5",
  lg: "h-14 w-14 rounded-xl [&>svg]:h-6 [&>svg]:w-6",
};

export default function IconBox({
  children,
  className,
  tone = "neutral",
  size = "md",
  ...props
}: IconBoxProps) {
  return (
    <span
      {...props}
      className={cn("inline-flex shrink-0 items-center justify-center", toneClasses[tone], sizeClasses[size], className)}
    >
      {children}
    </span>
  );
}
