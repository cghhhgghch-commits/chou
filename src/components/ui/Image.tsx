import { useState, type ImgHTMLAttributes } from "react";
import { Building2 } from "lucide-react";
import { cn } from "../../lib/utils";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "onError" | "width" | "height"> {
  src?: string | null;
  width?: number;
  height?: number;
  containerClassName?: string;
}

export default function Image({
  src,
  alt = "",
  className,
  containerClassName,
  width = 800,
  height = 600,
  loading = "lazy",
  ...props
}: ImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={cn("relative block aspect-[4/3] overflow-hidden bg-stone-100", containerClassName)}>
      {src && !failed ? (
        <img
          {...props}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onError={() => setFailed(true)}
          className={cn("h-full w-full object-cover", className)}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400" aria-hidden="true">
          <Building2 className="h-8 w-8" strokeWidth={1.5} />
        </span>
      )}
    </span>
  );
}
