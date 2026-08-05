import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "@/lib/api/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const user = await login(form.email, form.password);
    if (user && (user.role === "admin" || user.role === "ADMIN")) {
      navigate("/");
    } else {
      setError("Identifiants incorrects ou accès refusé.");
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="w-full max-w-[360px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "var(--primary)" }}
          >
            <span className="font-serif text-white text-xl" style={{ letterSpacing: "-0.02em" }}>L</span>
          </div>
          <h1 className="font-serif text-2xl" style={{ letterSpacing: "0.1em", color: "var(--foreground)" }}>
            LUMA
          </h1>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Espace Administration
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-card rounded-lg p-8"
          style={{ border: "1px solid var(--border)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <h2 className="text-base font-medium mb-6" style={{ color: "var(--foreground)" }}>
            Connexion
          </h2>

          {error && (
            <div
              className="rounded p-3 mb-4 text-sm"
              style={{ backgroundColor: "var(--status-rejected-bg)", color: "var(--status-rejected-fg)", border: "1px solid #FECACA" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                Adresse e-mail
              </label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@luma.dz"
                required
                className="w-full rounded px-3 py-2 text-sm outline-none transition-colors"
                style={{
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--background)",
                  color: "var(--foreground)",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full rounded px-3 py-2 text-sm outline-none transition-colors pr-10"
                  style={{
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--background)",
                    color: "var(--foreground)",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--primary)")}
                  onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--muted-foreground)" }}
                  onClick={() => setShowPw((v) => !v)}
                >
                  {showPw ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded py-2.5 text-sm font-medium transition-opacity mt-1"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <a
              href="#"
              className="text-xs hover:underline"
              style={{ color: "var(--muted-foreground)" }}
            >
              Mot de passe oublié ?
            </a>
          </div>
        </div>

        <p className="text-center text-xs mt-6" style={{ color: "var(--muted-foreground)" }}>
          Démo — admin@luma.dz / luma2026
        </p>
      </div>
    </div>
  );
}
