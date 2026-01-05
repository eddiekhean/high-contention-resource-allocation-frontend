import { useEffect, useRef } from "react";

export function useRevealOnMount(delay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const t = setTimeout(() => {
      el.classList.add("is-visible");
    }, delay);

    return () => clearTimeout(t);
  }, [delay]);

  return ref;
}
