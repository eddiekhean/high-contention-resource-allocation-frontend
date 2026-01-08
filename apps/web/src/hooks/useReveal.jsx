import { useEffect, useRef } from "react";

export default function useReveal(isActive = false) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (isActive) {
      // Small delay to ensure render cycle complete or just purely declarative
      // Adding a tiny timeout can help animations play smoothly on mount
      const timer = setTimeout(() => {
        el.classList.add("is-visible");
      }, 50);
      return () => clearTimeout(timer);
    } else {
      el.classList.remove("is-visible");
    }
  }, [isActive]);

  return ref;
}
