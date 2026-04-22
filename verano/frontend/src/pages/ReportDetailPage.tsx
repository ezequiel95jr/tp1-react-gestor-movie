import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "../components/ui/Container";
import Toast from "../components/ui/Toast";
import Spinner from "../components/ui/Spinner";
import ReportListMap from "../components/map/ReportListMap";
import { deleteReport, toggleLike, createComment, getReportById } from "../api/reports.api";
import { useAuth } from "../context/AuthContext";
import type { Report } from "../types/report";

const PRIORITY_COLOR: Record<string, string> = {
  low: "#16a34a",
  medium: "#ca8a04",
  high: "#dc2626",
};

const PRIORITY_LABEL: Record<string, string> = {
  low: "Baja",
  medium: "Media",
  high: "Alta",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function UserAvatar({ name }: { name: string }) {
  const initial = name?.[0]?.toUpperCase() ?? "?";
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background: "#3b82f6",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {initial}
    </div>
  );
}

export default function ReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [showToast, setShowToast] = useState(location.state?.created === true);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getReportById(id!)
      .then(setReport)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function refreshReport() {
    const data = await getReportById(id!);
    setReport(data);
  }

  async function handleLike() {
    if (!user || !report) return;
    const prev = { liked: report.liked_by_user, count: report.likes_count };
    setReport({
      ...report,
      liked_by_user: !prev.liked,
      likes_count: prev.liked ? Math.max(0, prev.count - 1) : prev.count + 1,
    });
    try {
      await toggleLike(report.id);
    } catch {
      setReport({ ...report, liked_by_user: prev.liked, likes_count: prev.count });
    }
  }

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !commentText.trim() || !report) return;
    setSubmitting(true);
    try {
      await createComment(report.id, commentText);
      setCommentText("");
      await refreshReport();
    } catch {
      alert("Error al comentar");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm("¿Eliminar este reporte?")) return;
    try {
      await deleteReport(report!.id);
      navigate("/reports");
    } catch {
      alert("Error eliminando el reporte");
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

  if (!report) {
    return (
      <Container>
        <div style={{ textAlign: "center", padding: "60px 0", color: "#71717a" }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
          <p>Reporte no encontrado</p>
          <button
            onClick={() => navigate("/reports")}
            style={{ marginTop: 16, background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}
          >
            Volver a reportes
          </button>
        </div>
      </Container>
    );
  }

  const comments = (report as any).comments ?? [];
  const canEdit = user && (user.role === "admin" || user.id === report.user_id);
  const priorityColor = PRIORITY_COLOR[report.priority] ?? "#6b7280";

  return (
    <Container>
      {showToast && (
        <Toast message="¡Reporte creado con éxito!" onDone={() => setShowToast(false)} />
      )}

      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          color: "#71717a",
          cursor: "pointer",
          fontSize: 14,
          padding: "8px 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 4,
        }}
      >
        ← Volver
      </button>

      <div className="detail-layout">

        {/* ── Columna principal ── */}
        <div style={{
          background: "#1c1c1e",
          border: "1px solid #27272a",
          borderRadius: 12,
          padding: "24px",
        }}>

          {/* Imagen principal */}
          {report.images && report.images.length > 0 && (
            <img
              src={report.images[0].image_url}
              alt={report.summary}
              style={{
                width: "100%",
                maxHeight: 320,
                objectFit: "cover",
                borderRadius: 8,
                marginBottom: 20,
                border: "1px solid #27272a",
              }}
            />
          )}

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20,
              background: `${priorityColor}22`, color: priorityColor,
              border: `1px solid ${priorityColor}55`,
            }}>
              {PRIORITY_LABEL[report.priority] ?? report.priority}
            </span>
            {report.category && (
              <span style={{
                fontSize: 12, fontWeight: 500, padding: "3px 10px", borderRadius: 20,
                background: "#27272a", color: "#a1a1aa", border: "1px solid #3f3f46",
              }}>
                {report.category}
              </span>
            )}
          </div>

          {/* Título */}
          <h1 style={{ margin: "0 0 12px", color: "#f4f4f5", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1.3 }}>
            {report.summary}
          </h1>

          {/* Mapa mobile (solo visible en pantallas chicas) */}
          {isFinite(Number(report.lat)) && isFinite(Number(report.lng)) && (
            <div className="detail-map-mobile">
              <ReportListMap report={report} />
            </div>
          )}

          {/* Descripción */}
          <p style={{ color: "#a1a1aa", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px" }}>
            {report.description}
          </p>

          {/* Dirección */}
          {report.address && (
            <p style={{ color: "#71717a", fontSize: 13, marginBottom: 20, display: "flex", gap: 6, alignItems: "flex-start" }}>
              <span>📍</span> {report.address}
            </p>
          )}

          {/* Acciones: like + editar/eliminar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
            <button
              onClick={handleLike}
              disabled={!user}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 20,
                border: `1px solid ${report.liked_by_user ? "#ff4d6d" : "#3f3f46"}`,
                background: report.liked_by_user ? "#ff4d6d22" : "transparent",
                color: report.liked_by_user ? "#ff4d6d" : "#a1a1aa",
                cursor: user ? "pointer" : "default",
                fontSize: 14, fontWeight: 600, transition: "all 0.2s ease",
              }}
            >
              ❤️ {report.likes_count ?? 0}
              {user && <span style={{ fontSize: 12, color: "inherit" }}>{report.liked_by_user ? "· Unlike" : "· Like"}</span>}
            </button>

            <span style={{ color: "#52525b", fontSize: 13 }}>
              💬 {comments.length} comentario{comments.length !== 1 ? "s" : ""}
            </span>

            {canEdit && (
              <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                <button
                  onClick={() => navigate(`/reports/${report.id}/edit`)}
                  style={{
                    padding: "7px 14px", borderRadius: 8, border: "1px solid #3f3f46",
                    background: "transparent", color: "#a1a1aa", cursor: "pointer", fontSize: 13,
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    padding: "7px 14px", borderRadius: 8, border: "none",
                    background: "#7f1d1d", color: "#fca5a5", cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}
                >
                  🗑 Eliminar
                </button>
              </div>
            )}
          </div>

          <hr style={{ borderColor: "#27272a", margin: "0 0 24px" }} />

          {/* Comentarios */}
          <h3 style={{ margin: "0 0 16px", color: "#f4f4f5", fontSize: 16, fontWeight: 700 }}>
            Comentarios ({comments.length})
          </h3>

          {comments.length === 0 && (
            <p style={{ color: "#52525b", fontSize: 14, marginBottom: 20 }}>
              Todavía no hay comentarios. ¡Sé el primero!
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {comments.map((c: any) => (
              <div
                key={c.id}
                style={{
                  background: "#18181b",
                  border: "1px solid #27272a",
                  padding: "12px 16px",
                  borderRadius: 10,
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <UserAvatar name={c.user?.name ?? "?"} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <strong style={{ fontSize: 13, color: "#e4e4e7" }}>
                      {c.user?.name ?? "Usuario"}
                    </strong>
                    {c.created_at && (
                      <span style={{ fontSize: 11, color: "#52525b" }}>
                        {formatDate(c.created_at)}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: 0, color: "#a1a1aa", fontSize: 14, lineHeight: 1.5 }}>
                    {c.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input comentario */}
          {user ? (
            <form
              className="comment-form"
              onSubmit={handleComment}
              style={{ display: "flex", gap: 10 }}
            >
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Escribí un comentario..."
                disabled={submitting}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 10,
                  border: "1px solid #3f3f46", background: "#111",
                  color: "#fff", fontSize: 14,
                }}
              />
              <button
                type="submit"
                disabled={submitting || !commentText.trim()}
                style={{
                  padding: "10px 18px", borderRadius: 10, border: "none",
                  background: "#3b82f6", color: "#fff", cursor: "pointer",
                  fontWeight: 600, fontSize: 14, opacity: submitting ? 0.6 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {submitting ? "…" : "Comentar"}
              </button>
            </form>
          ) : (
            <p style={{ color: "#52525b", fontSize: 13 }}>
              <button
                onClick={() => navigate("/login")}
                style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", padding: 0, fontWeight: 600 }}
              >
                Iniciá sesión
              </button>{" "}
              para comentar
            </p>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="detail-sidebar">

          {/* Mapa */}
          {isFinite(Number(report.lat)) && isFinite(Number(report.lng)) && (
            <div className="detail-map">
              <ReportListMap report={report} />
            </div>
          )}

          {/* Metadata */}
          <div className="detail-meta-card">
            <h4 style={{ margin: 0, fontSize: 13, color: "#71717a", textTransform: "uppercase", letterSpacing: 1 }}>
              Información
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <MetaRow label="Autor" value={`👤 ${report.user?.name ?? "Anónimo"}`} />
              <MetaRow label="Fecha" value={`📅 ${formatDate(report.created_at)}`} />
              <MetaRow
                label="Prioridad"
                value={
                  <span style={{ color: priorityColor, fontWeight: 600 }}>
                    {PRIORITY_LABEL[report.priority] ?? report.priority}
                  </span>
                }
              />
              {report.category && (
                <MetaRow label="Categoría" value={`📂 ${report.category}`} />
              )}
            </div>
          </div>
        </div>

      </div>
    </Container>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span style={{ fontSize: 11, color: "#52525b", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
      <div style={{ fontSize: 13, color: "#a1a1aa", marginTop: 2 }}>
        {value}
      </div>
    </div>
  );
}
