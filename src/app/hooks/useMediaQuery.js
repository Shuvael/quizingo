"use client";
import { useState, useEffect } from "react";

export function useMediaQuery(query) {
  const [passt, setPasst] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setPasst(media.matches);
    const listener = (e) => setPasst(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return passt;
}