import type { CSSProperties } from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  shape?: "rectangle" | "circle";
}

export default function Skeleton({
  className,
  width,
  height,
  shape = "rectangle",
}: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      style={{ width, height }}
      className={cn(
        "block animate-pulse bg-stone-200",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className,
      )}
    />
  );
}
