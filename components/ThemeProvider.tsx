"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  // Load persisted preference
  useEffect(() => {
    const stored = localStorage.getItem("kasi-theme") as Theme | null;
    const preferred: Theme = stored ?? "dark";
    setTheme(preferred);
    document.documentElement.setAttribute("data-theme", preferred);
  }, []);

  const toggleTheme = () => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      localStorage.setItem("kasi-theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Standalone toggle button component
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-ghost btn-sm"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "Ubuntu Pulse" : "dark"} mode`}
      style={{
        padding: "var(--space-2)",
        fontSize: "1.1rem",
        lineHeight: 1,
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
