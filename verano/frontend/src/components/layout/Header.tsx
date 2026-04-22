import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/login");
    setMenuOpen(false);
  }

  const navLinks = (
    <>
      <Link to="/" style={{ color: "#aaa" }} onClick={() => setMenuOpen(false)}>
        Mapa
      </Link>
      <Link to="/reports" style={{ color: "#aaa" }} onClick={() => setMenuOpen(false)}>
        Reportes
      </Link>
      {!user ? (
        <>
          <Link to="/login" style={{ color: "#3b82f6" }} onClick={() => setMenuOpen(false)}>
            Login
          </Link>
          <Link to="/register" style={{ color: "#16a34a" }} onClick={() => setMenuOpen(false)}>
            Registro
          </Link>
        </>
      ) : (
        <>
          {user.role === "admin" && (
            <Link to="/admin" style={{ color: "#3b82f6", fontWeight: 600 }} onClick={() => setMenuOpen(false)}>
              Administrador
            </Link>
          )}
          <button
            style={{ color: "#aaa", background: "none", border: "none", cursor: "pointer", padding: 0, fontWeight: 600 }}
            onClick={() => { navigate("/profile"); setMenuOpen(false); }}
          >
            Tu perfil
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "#2f2f2f",
              color: "#fff",
              border: "none",
              padding: "6px 12px",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <header style={{ background: "#0f0f0f", borderBottom: "1px solid #222", position: "relative" }}>
      <div
        style={{
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to="#" style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>
          Snap It Neuquén
        </Link>

        {/* Desktop nav */}
        <div className="nav-links">{navLinks}</div>

        {/* Hamburger */}
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`nav-mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks}
      </div>
    </header>
  );
}
