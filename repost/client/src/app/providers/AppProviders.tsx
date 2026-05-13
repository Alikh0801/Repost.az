import type { ReactNode } from "react";
import { I18nProvider } from "../../i18n";
import { ThemeProvider } from "../../theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </I18nProvider>
  );
}
