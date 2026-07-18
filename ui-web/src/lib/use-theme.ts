import { useLayoutEffect, useState } from "react";

export type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const bootTheme = document.documentElement.dataset.theme;
  if (bootTheme === "light" || bootTheme === "dark") return bootTheme;
  try {
    const saved = localStorage.getItem("ui-field-guide-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // Storage can be unavailable in privacy-restricted contexts.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.theme = theme;
    try {
      localStorage.setItem("ui-field-guide-theme", theme);
    } catch {
      // The visual theme still works when persistence is unavailable.
    }
  }, [theme]);

  return {
    theme,
    toggleTheme: () => setTheme((value) => (value === "dark" ? "light" : "dark")),
  };
}
