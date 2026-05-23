import { AuthProvider } from "./auth/auth-context";
import { AppRouter } from "./router";

export function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
