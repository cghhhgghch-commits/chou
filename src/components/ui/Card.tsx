import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("rounded-xl border border-stone-200 bg-white shadow-xs", className)}
    />
  );
}
