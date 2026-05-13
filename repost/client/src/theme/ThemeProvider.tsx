import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { STORAGE_KEYS } from "../shared/config/storage-keys";
import { readStorage, writeStorage } from "../shared/lib/storage";
import { ThemeContext } from "./theme-context";
import type { ThemeMode } from "./types";

const DEFAULT_THEME: ThemeMode = "dark";

function parseStoredTheme(raw: string | null): ThemeMode | null {
  if (raw === "light" || raw === "dark") return raw;
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return parseStoredTheme(readStorage(STORAGE_KEYS.theme)) ?? DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
