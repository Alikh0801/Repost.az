import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { az } from "./locales/az";
import { ru } from "./locales/ru";
import { createTranslator } from "./translate";
import { STORAGE_KEYS } from "../shared/config/storage-keys";
import { readStorage, writeStorage } from "../shared/lib/storage";
import { I18nContext } from "./i18n-context";
import type { AppLocale } from "./types";

const CATALOG = { az, ru } as const;

const DEFAULT_LOCALE: AppLocale = "az";

function parseStoredLocale(raw: string | null): AppLocale | null {
  if (raw === "az" || raw === "ru") return raw;
  return null;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>(() => {
    return parseStoredLocale(readStorage(STORAGE_KEYS.locale)) ?? DEFAULT_LOCALE;
  });

  useEffect(() => {
    document.documentElement.lang = locale === "az" ? "az" : "ru";
    writeStorage(STORAGE_KEYS.locale, locale);
  }, [locale]);

  const setLocale = useCallback((next: AppLocale) => {
    setLocaleState(next);
  }, []);

  const t = useMemo(() => createTranslator(CATALOG[locale]), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
