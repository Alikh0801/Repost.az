import { AppShell } from "../components/layout/AppShell";
import { AppProviders } from "./providers/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
