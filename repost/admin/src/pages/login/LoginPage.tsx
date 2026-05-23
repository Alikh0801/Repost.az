import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { ApiError } from "../../api/client";
import { useAuth } from "../../auth/auth-context";
import "./login-page.css";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState("admin@repost.az");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/articles" replace />;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Giriş alınmadı. Yenidən cəhd edin.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1 className="login-card__title">RePost.az Admin</h1>
        <p className="login-card__hint">Redaktor hesabı ilə daxil olun</p>

        {error ? <p className="login-card__error">{error}</p> : null}

        <label className="login-field">
          <span>E-poçt</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="login-field">
          <span>Parol</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="login-card__submit" disabled={loading}>
          {loading ? "Giriş..." : "Daxil ol"}
        </button>
      </form>
    </div>
  );
}
