import { useEffect, useState } from "react";
import { adminGetUsers, adminUpdateUser, adminDeleteUser } from "../api/admin.api";
import type { AdminUser } from "../api/admin.api";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/ui/Toast";
import Spinner from "../components/ui/Spinner";

const ROLE_LABELS: Record<AdminUser["role"], string> = {
  user: "Usuario",
  admin: "Admin",
};

const ROLE_COLORS: Record<AdminUser["role"], string> = {
  user: "#71717a",
  admin: "#3b82f6",
};

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; email: string; role: AdminUser["role"] }>({
    name: "",
    email: "",
    role: "user",
  });
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminGetUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  function startEdit(u: AdminUser) {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email, role: u.role });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    setSaving(true);
    try {
      const updated = await adminUpdateUser(id, editForm);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
      setEditingId(null);
      setToast("Usuario actualizado");
    } catch {
      setToast("Error al actualizar usuario");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setSaving(true);
    try {
      await adminDeleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setConfirmDelete(null);
      setToast("Usuario eliminado");
    } catch (err: any) {
      setToast(err?.response?.data?.message ?? "Error al eliminar usuario");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}><Spinner /></div>;

  return (
    <div style={{ flex: 1, padding: "2rem", minHeight: "100%", boxSizing: "border-box" }}>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#f4f4f5", margin: 0, fontSize: "1.6rem" }}>Panel de Administración</h1>
        <p style={{ color: "#71717a", margin: "0.25rem 0 0" }}>Gestión de usuarios del sistema</p>
      </div>

      {/* Stats rápidas */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {(["user", "admin"] as AdminUser["role"][]).map((role) => (
          <div
            key={role}
            style={{
              background: "#1c1c1e",
              border: "1px solid #27272a",
              borderRadius: 10,
              padding: "0.75rem 1.25rem",
              minWidth: 110,
            }}
          >
            <div style={{ color: ROLE_COLORS[role], fontWeight: 700, fontSize: "1.4rem" }}>
              {users.filter((u) => u.role === role).length}
            </div>
            <div style={{ color: "#a1a1aa", fontSize: "0.8rem" }}>{ROLE_LABELS[role]}</div>
          </div>
        ))}
        <div style={{ background: "#1c1c1e", border: "1px solid #27272a", borderRadius: 10, padding: "0.75rem 1.25rem", minWidth: 110 }}>
          <div style={{ color: "#f4f4f5", fontWeight: 700, fontSize: "1.4rem" }}>{users.length}</div>
          <div style={{ color: "#a1a1aa", fontSize: "0.8rem" }}>Total</div>
        </div>
      </div>

      {/* Tabla */}
      <div style={{ background: "#1c1c1e", border: "1px solid #27272a", borderRadius: 12, overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 2fr 100px 120px 200px",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #27272a",
          color: "#71717a",
          fontSize: "0.78rem",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          <span>Usuario</span>
          <span>Email</span>
          <span style={{ textAlign: "center" }}>Reportes</span>
          <span style={{ textAlign: "center" }}>Rol</span>
          <span style={{ textAlign: "center" }}>Acciones</span>
        </div>

        {users.map((u, idx) => (
          <div
            key={u.id}
            style={{
              borderBottom: idx < users.length - 1 ? "1px solid #27272a" : "none",
              background: editingId === u.id ? "#1f1f23" : "transparent",
            }}
          >
            {editingId === u.id ? (
              /* Fila de edición */
              <div style={{ padding: "0.75rem 1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Nombre"
                    style={inputStyle}
                  />
                  <input
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="Email"
                    style={inputStyle}
                  />
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as AdminUser["role"] }))}
                    style={inputStyle}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => saveEdit(u.id)} disabled={saving} style={btnPrimary}>
                    {saving ? "Guardando…" : "Guardar"}
                  </button>
                  <button onClick={cancelEdit} disabled={saving} style={btnSecondary}>
                    Cancelar
                  </button>
                </div>
              </div>
            ) : confirmDelete === u.id ? (
              /* Confirmación borrado */
              <div style={{ padding: "0.75rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ color: "#f4f4f5", fontSize: "0.9rem" }}>
                  ¿Eliminar a <strong>{u.name}</strong>?
                </span>
                <button onClick={() => handleDelete(u.id)} disabled={saving} style={{ ...btnPrimary, background: "#dc2626", borderColor: "#dc2626" }}>
                  {saving ? "Eliminando…" : "Confirmar"}
                </button>
                <button onClick={() => setConfirmDelete(null)} disabled={saving} style={btnSecondary}>
                  Cancelar
                </button>
              </div>
            ) : (
              /* Fila normal */
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 2fr 100px 120px 200px",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                alignItems: "center",
              }}>
                {/* Usuario */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", overflow: "hidden" }}>
                  {u.avatar_url ? (
                    <img src={u.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div style={{ overflow: "hidden" }}>
                    <div style={{ color: "#f4f4f5", fontSize: "0.9rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {u.name}
                      {u.id === currentUser?.id && <span style={{ color: "#3b82f6", fontSize: "0.72rem", marginLeft: "0.4rem" }}>(vos)</span>}
                    </div>
                    <div style={{ color: "#71717a", fontSize: "0.75rem" }}>
                      {new Date(u.created_at).toLocaleDateString("es-AR", { year: "numeric", month: "short", day: "numeric" })}
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div style={{ color: "#a1a1aa", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {u.email}
                </div>

                {/* Reportes */}
                <div style={{ color: "#a1a1aa", fontSize: "0.85rem", textAlign: "center" }}>
                  {u.reports_count}
                </div>

                {/* Rol badge */}
                <div style={{ textAlign: "center" }}>
                  <span style={{
                    background: ROLE_COLORS[u.role] + "22",
                    color: ROLE_COLORS[u.role],
                    border: `1px solid ${ROLE_COLORS[u.role]}55`,
                    borderRadius: 6,
                    padding: "0.2rem 0.55rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}>
                    {ROLE_LABELS[u.role]}
                  </span>
                </div>

                {/* Acciones */}
                <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                  <button
                    onClick={() => startEdit(u)}
                    title="Editar"
                    style={{ background: "transparent", border: "1px solid #3f3f46", borderRadius: 6, color: "#a1a1aa", cursor: "pointer", padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setConfirmDelete(u.id)}
                    title="Eliminar"
                    disabled={u.id === currentUser?.id}
                    style={{ background: "transparent", border: "1px solid #991b1b", borderRadius: 6, color: "#f87171", cursor: u.id === currentUser?.id ? "not-allowed" : "pointer", padding: "0.3rem 0.6rem", fontSize: "0.8rem", opacity: u.id === currentUser?.id ? 0.4 : 1 }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {users.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "#71717a" }}>No hay usuarios</div>
        )}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: "#111113",
  border: "1px solid #3f3f46",
  borderRadius: 8,
  color: "#f4f4f5",
  padding: "0.45rem 0.75rem",
  fontSize: "0.9rem",
  outline: "none",
  flex: 1,
  minWidth: 140,
  fontFamily: "inherit",
};

const btnPrimary: React.CSSProperties = {
  background: "#3b82f6",
  border: "1px solid #3b82f6",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
  padding: "0.4rem 0.9rem",
  fontSize: "0.85rem",
  fontWeight: 600,
};

const btnSecondary: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #3f3f46",
  borderRadius: 8,
  color: "#a1a1aa",
  cursor: "pointer",
  padding: "0.4rem 0.9rem",
  fontSize: "0.85rem",
};
