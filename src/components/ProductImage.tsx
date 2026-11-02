import { ImageOff } from "lucide-react";
import { imageUrl } from "../lib/format";

export function ProductImage({ src, alt, className = "" }: { src: string | null; alt: string; className?: string }) {
  const url = imageUrl(src);
  return url ? (
    <img src={url} alt={alt} className={className} loading="lazy" />
  ) : (
    <div className={`image-placeholder ${className}`}>
      <ImageOff size={32} />
    </div>
  );
}
