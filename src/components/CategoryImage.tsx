import { useState } from "react";
import defaultImage from "../assets/category-default.jpg";
import { imageUrl } from "../lib/format";

/**
 * Category picture uploaded in the dashboard. Categories without one show the shop's
 * default cricket photo (free photo from unsplash.com, id 1785906359814-d4c467499076).
 */
export function CategoryImage({ src, alt, className = "" }: { src: string | null | undefined; alt: string; className?: string }) {
  // Remember which address failed, so a new image is tried again instead of staying on the default.
  const [failedUrl, setFailedUrl] = useState<string>();
  const url = imageUrl(src);
  const shown = url && url !== failedUrl ? url : defaultImage;
  return <img src={shown} alt={alt} className={className} loading="lazy" onError={() => url && setFailedUrl(url)} />;
}
