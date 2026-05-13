import type { AppMessagePath } from "./paths";

export type AppLocale = "az" | "ru";

export type I18nContextValue = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
  t: (path: AppMessagePath) => string;
};
