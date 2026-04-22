import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../components/ui/Container";
import Toast from "../components/ui/Toast";

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #3f3f46",
  background: "#111113",
  color: "#f4f4f5",
  fontSize: 14,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 500,
  color: "#a1a1aa",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(location.state?.registered === true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Credenciales incorrectas");
      } else if (err.response?.status === 422) {
        setError("Datos inválidos");
      } else {
        setError("Error inesperado. Intentá nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      {showToast && (
        <Toast message="¡Cuenta creada! Iniciá sesión" onDone={() => setShowToast(false)} />
      )}
      <div style={{
        maxWidth: 440,
        margin: "48px auto",
        background: "#1c1c1e",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: 32,
      }}>
        <h2 style={{ margin: "0 0 6px", color: "#f4f4f5", fontSize: "1.4rem", fontWeight: 700 }}>
          Iniciar sesión
        </h2>
        <p style={{ margin: "0 0 28px", color: "#71717a", fontSize: 13 }}>
          Accedé a tu cuenta para reportar problemas
        </p>

        {error && (
          <div style={{
            background: "#7f1d1d",
            border: "1px solid #991b1b",
            color: "#fca5a5",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 13,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              background: "#3b82f6",
              color: "#fff",
              padding: "11px",
              borderRadius: 8,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14,
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid #27272a",
          textAlign: "center",
        }}>
          <span style={{ color: "#71717a", fontSize: 13 }}>¿No tenés cuenta? </span>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
              padding: 0,
            }}
          >
            Registrate aquí
          </button>
        </div>
      </div>
    </Container>
  );
}
