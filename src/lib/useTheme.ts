import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";

function getInitial(): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.getAttribute("data-theme");
    if (attr === "dark" || attr === "light") return attr;
  }
  try {
    const saved = localStorage.getItem("kb_theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch { /* ignore */ }
  if (typeof matchMedia !== "undefined" && matchMedia("(prefers-color-scheme: dark)").matches)
    return "dark";
  return "light";
}

/** Тема світла/темна з localStorage, синхронізована з <html data-theme>. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitial);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("kb_theme", theme); } catch { /* ignore */ }
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return { theme, setTheme, toggle };
}
