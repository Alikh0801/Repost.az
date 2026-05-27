import { Navigate } from "react-router-dom";

/** Köhnə `/news/:numericId` — yeni sistemdə slug əsaslıdır */
export function LegacyNewsRedirect() {
  return <Navigate to="/" replace />;
}
