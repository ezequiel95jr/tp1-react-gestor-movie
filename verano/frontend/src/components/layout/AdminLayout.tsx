import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

type NavItem = {
  label: string;
  to: string;
  icon: string;
  disabled?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Gestión de Usuarios", to: "/admin/users", icon: "👥" },
  { label: "Estadísticas",        to: "/admin/stats", icon: "📊" },
  { label: "Próximamente…",       to: "#",            icon: "🔧", disabled: true },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 10 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: "#141416",
        borderRight: "1px solid #27272a",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        // Mobile: overlay
        position: window.innerWidth < 768 ? "fixed" : "relative",
        top: window.innerWidth < 768 ? 57 : "auto",
        left: window.innerWidth < 768 ? (sidebarOpen ? 0 : -260) : "auto",
        height: window.innerWidth < 768 ? "calc(100vh - 57px)" : "auto",
        transition: "left 0.25s ease",
        zIndex: 11,
      }}>
        {/* Título sidebar */}
        <div style={{ padding: "1.25rem 1.25rem 0.75rem", borderBottom: "1px solid #27272a" }}>
          <div
            onClick={() => navigate("/admin")}
            style={{ color: "#f4f4f5", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}
          >
            Panel de Administración
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ padding: "0.75rem 0", flex: 1 }}>
          {NAV_ITEMS.map((item) =>
            item.disabled ? (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.65rem 1.25rem",
                  color: "#3f3f46",
                  fontSize: "0.9rem",
                  cursor: "not-allowed",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  padding: "0.65rem 1.25rem",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                  color: isActive ? "#f4f4f5" : "#a1a1aa",
                  background: isActive ? "#3b82f615" : "transparent",
                  borderLeft: isActive ? "3px solid #3b82f6" : "3px solid transparent",
                  transition: "background 0.15s, color 0.15s",
                })}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )
          )}
        </nav>
      </aside>

      {/* Botón hamburguesa mobile */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        style={{
          display: window.innerWidth < 768 ? "flex" : "none",
          position: "fixed",
          bottom: "1.5rem",
          left: "1rem",
          zIndex: 20,
          background: "#3b82f6",
          border: "none",
          borderRadius: "50%",
          width: 44,
          height: 44,
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "1.1rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px #0006",
        }}
      >
        ☰
      </button>

      {/* Contenido principal */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" }}>
        <Outlet />
      </main>
    </div>
  );
}
