import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../components/ui/Container";
import Spinner from "../components/ui/Spinner";
import Toast from "../components/ui/Toast";
import { getMe, uploadAvatar, updateProfile, getMyReports } from "../api/reports.api";
import type { Report } from "../types/report";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  created_at: string;
  reports_count: number;
  likes_count: number;
};

const PRIORITY_COLORS = { low: "#16a34a", medium: "#ca8a04", high: "#dc2626" };
const PRIORITY_LABELS = { low: "Baja", medium: "Media", high: "Alta" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function ProfilePage() {
  const [user, setUser]           = useState<UserProfile | null>(null);
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState<{ msg: string; ok?: boolean } | null>(null);

  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate     = useRef(useNavigate()).current;

  useEffect(() => {
    Promise.all([getMe(), getMyReports()])
      .then(([profile, myReports]) => {
        setUser(profile);
        setReports(myReports);
        setForm({ name: profile.name, email: profile.email, password: "", password_confirmation: "" });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setToast({ msg: "La imagen supera los 2 MB" }); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setToast({ msg: "Formato no permitido. Usá JPG, PNG o WebP" }); return;
    }
    setUploading(true);
    try {
      const { avatar_url } = await uploadAvatar(file);
      setUser((p) => p ? { ...p, avatar_url } : p);
      setToast({ msg: "Foto actualizada", ok: true });
    } catch {
      setToast({ msg: "Error al subir la imagen" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (form.password && form.password !== form.password_confirmation) {
      setToast({ msg: "Las contraseñas no coinciden" }); return;
    }
    setSaving(true);
    try {
      const payload: Record<string, string> = {};
      if (form.name  !== user?.name)  payload.name  = form.name;
      if (form.email !== user?.email) payload.email = form.email;
      if (form.password) {
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      if (!Object.keys(payload).length) { setEditing(false); return; }

      const updated = await updateProfile(payload);
      setUser((p) => p ? { ...p, ...updated } : p);
      setForm((f) => ({ ...f, password: "", password_confirmation: "" }));
      setEditing(false);
      setToast({ msg: "Perfil actualizado", ok: true });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Error al guardar";
      setToast({ msg });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Container>
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
          <Spinner />
        </div>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <p style={{ color: "#71717a", textAlign: "center", padding: "60px 0" }}>No autorizado</p>
      </Container>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() ?? "?";

  const cardStyle: React.CSSProperties = {
    background: "#1c1c1e",
    border: "1px solid #27272a",
    borderRadius: 12,
    padding: 24,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    background: "#27272a",
    border: "1px solid #3f3f46",
    borderRadius: 8,
    color: "#f4f4f5",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: "#71717a",
    marginBottom: 4,
    display: "block",
  };

  return (
    <Container>
      {toast && (
        <Toast
          message={toast.msg}
          onDone={() => setToast(null)}
        />
      )}

      <div style={{ maxWidth: 600, margin: "40px auto", display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Avatar + stats ──────────────────────────────────────── */}
        <div style={{ ...cardStyle, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
          <div style={{ position: "relative" }}>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "3px solid #27272a" }}
              />
            ) : (
              <div style={{ width: 96, height: 96, borderRadius: "50%", background: "#3b82f6", border: "3px solid #27272a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, fontWeight: 700, color: "#fff" }}>
                {initial}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Cambiar foto"
              style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: "50%", background: "#3b82f6", border: "2px solid #1c1c1e", color: "#fff", fontSize: 13, cursor: uploading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: uploading ? 0.6 : 1 }}
            >
              {uploading ? "…" : "✎"}
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display: "none" }} onChange={handleAvatarChange} />
          </div>

          <div>
            <h2 style={{ margin: "0 0 4px", color: "#f4f4f5", fontSize: "1.3rem", fontWeight: 700 }}>{user.name}</h2>
            <span style={{ fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 20, background: user.role === "admin" ? "#7c3aed22" : "#27272a", color: user.role === "admin" ? "#a78bfa" : "#71717a", border: `1px solid ${user.role === "admin" ? "#7c3aed55" : "#3f3f46"}` }}>
              {user.role}
            </span>
          </div>

          <div style={{ display: "flex", gap: 32, paddingTop: 16, borderTop: "1px solid #27272a", width: "100%", justifyContent: "center" }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#f4f4f5" }}>{user.reports_count}</div>
              <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>Reportes</div>
            </div>
            <div style={{ width: 1, background: "#27272a" }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#f4f4f5" }}>{user.likes_count}</div>
              <div style={{ fontSize: 12, color: "#71717a", marginTop: 2 }}>Likes dados</div>
            </div>
          </div>
        </div>

        {/* ── Editar perfil ───────────────────────────────────────── */}
        <div style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: editing ? 20 : 0 }}>
            <h3 style={{ margin: 0, fontSize: 13, color: "#71717a", textTransform: "uppercase", letterSpacing: 1 }}>
              Información de la cuenta
            </h3>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                style={{ fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8, border: "1px solid #3f3f46", background: "transparent", color: "#a1a1aa", cursor: "pointer" }}
              >
                Editar
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  style={inputStyle}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Nueva contraseña <span style={{ color: "#52525b" }}>(dejar vacío para no cambiar)</span></label>
                <input
                  type="password"
                  style={inputStyle}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              {form.password && (
                <div>
                  <label style={labelStyle}>Confirmar contraseña</label>
                  <input
                    type="password"
                    style={inputStyle}
                    value={form.password_confirmation}
                    onChange={(e) => setForm((f) => ({ ...f, password_confirmation: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email, password: "", password_confirmation: "" }); }}
                  style={{ padding: "7px 16px", borderRadius: 8, border: "1px solid #3f3f46", background: "transparent", color: "#a1a1aa", fontSize: 13, cursor: "pointer" }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ padding: "7px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Guardando…" : "Guardar"}
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 16 }}>
              {[
                { label: "Nombre", value: user.name },
                { label: "Email", value: user.email },
                { label: "Miembro desde", value: formatDate(user.created_at) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "#71717a" }}>{label}</span>
                  <span style={{ fontSize: 13, color: "#a1a1aa", fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Mis reportes ────────────────────────────────────────── */}
        <div style={cardStyle}>
          <h3 style={{ margin: "0 0 16px", fontSize: 13, color: "#71717a", textTransform: "uppercase", letterSpacing: 1 }}>
            Mis reportes ({reports.length})
          </h3>

          {reports.length === 0 ? (
            <p style={{ color: "#52525b", fontSize: 13, textAlign: "center", padding: "24px 0", margin: 0 }}>
              Todavía no creaste ningún reporte.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {reports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => navigate(`/details/${r.id}`)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 14px",
                    background: "#27272a",
                    borderRadius: 8,
                    cursor: "pointer",
                    border: "1px solid #3f3f46",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#52525b")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#3f3f46")}
                >
                  {/* Barra de prioridad */}
                  <div style={{
                    width: 3,
                    alignSelf: "stretch",
                    borderRadius: 2,
                    background: r.priority ? PRIORITY_COLORS[r.priority] : "#52525b",
                    flexShrink: 0,
                  }} />

                  {/* Contenido */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f4f4f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {r.summary}
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center", flexWrap: "wrap" }}>
                      {r.priority && (
                        <span style={{ fontSize: 11, color: PRIORITY_COLORS[r.priority], fontWeight: 600 }}>
                          {PRIORITY_LABELS[r.priority]}
                        </span>
                      )}
                      {r.category && (
                        <span style={{ fontSize: 11, color: "#71717a", background: "#1c1c1e", padding: "1px 6px", borderRadius: 4 }}>
                          {r.category}
                        </span>
                      )}
                      <span style={{ fontSize: 11, color: "#52525b" }}>{formatDateShort(r.created_at)}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 10, fontSize: 12, color: "#71717a", flexShrink: 0 }}>
                    <span>❤️ {r.likes_count ?? 0}</span>
                    <span>💬 {r.comments_count ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <p style={{ fontSize: 12, color: "#52525b", textAlign: "center", margin: 0 }}>
          Foto de perfil: JPG, PNG o WebP · Máx. 2 MB
        </p>
      </div>
    </Container>
  );
}
