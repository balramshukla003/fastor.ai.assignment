import { useState } from "react";

export default function ImageWithFallback({ src, alt, className = "", fallback = "/assets/food-fallback.svg" }) {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);
  return <img src={currentSrc} alt={alt || ""} className={className} loading="lazy" onError={() => {
    if (currentSrc !== fallback) setCurrentSrc(fallback);
  }} />;
}