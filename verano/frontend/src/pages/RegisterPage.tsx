import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Container from "../components/ui/Container";

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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      await api.post("/register", { name, email, password });
      navigate("/login", { state: { registered: true } });
    } catch (err: any) {
      const msg = err.response?.data?.message;
      setError(msg ?? "Error al registrar. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <div style={{
        maxWidth: 440,
        margin: "48px auto",
        background: "#1c1c1e",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: 32,
      }}>
        <h2 style={{ margin: "0 0 6px", color: "#f4f4f5", fontSize: "1.4rem", fontWeight: 700 }}>
          Crear cuenta
        </h2>
        <p style={{ margin: "0 0 28px", color: "#71717a", fontSize: 13 }}>
          Registrate para reportar problemas en Neuquén
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
            <label style={labelStyle}>Nombre</label>
            <input
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
          </div>

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
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          paddingTop: 20,
          borderTop: "1px solid #27272a",
          textAlign: "center",
        }}>
          <span style={{ color: "#71717a", fontSize: 13 }}>¿Ya tenés cuenta? </span>
          <button
            onClick={() => navigate("/login")}
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
            Iniciá sesión
          </button>
        </div>
      </div>
    </Container>
  );
}
