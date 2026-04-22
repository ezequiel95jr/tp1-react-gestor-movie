import { useNavigate } from "react-router-dom";
import type { Report } from "../../types/report";

type Props = {
  report: Report;
  selected?: boolean;
  onSelect?: (report: Report) => void;
};

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
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, max = 100) {
  return text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
}

export default function ReportCard({ report, selected = false, onSelect }: Props) {
  const navigate = useNavigate();
  const priorityColor = PRIORITY_COLOR[report.priority] ?? "#6b7280";
  const image = report.images?.[0]?.image_url ?? null;

  function handleClick() {
    onSelect?.(report);
    navigate(`/details/${report.id}`);
  }

  function handleMapClick(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect?.(report);
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: selected ? "#1e293b" : "#18181b",
        border: `1px solid ${selected ? "#3b82f6" : "#27272a"}`,
        borderLeft: `4px solid ${priorityColor}`,
        borderRadius: 20,
        padding: 16,
        cursor: "pointer",
        transition: "all 0.15s ease",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.background = "#1c1c20";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = selected ? "#1e293b" : "#18181b";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Thumbnail */}
      {image && (
        <img
          src={image}
          alt="reporte"
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: 8,
            flexShrink: 0,
          }}
        />
      )}

      {/* Contenido */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Fila superior: título + badge prioridad */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f4f4f5", lineHeight: 1.3 }}>
            {report.summary}
          </h3>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "2px 8px",
                borderRadius: 20,
                background: `${priorityColor}22`,
                color: priorityColor,
                border: `1px solid ${priorityColor}55`,
                whiteSpace: "nowrap",
              }}
            >
              {PRIORITY_LABEL[report.priority] ?? report.priority}
            </span>
            {report.category && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: "#27272a",
                  color: "#a1a1aa",
                  border: "1px solid #3f3f46",
                  whiteSpace: "nowrap",
                }}
              >
                {report.category}
              </span>
            )}
          </div>
        </div>

        {/* Descripción */}
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "#a1a1aa", lineHeight: 1.5 }}>
          {truncate(report.description)}
        </p>

        {/* Dirección */}
        {report.address && (
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#71717a", display: "flex", alignItems: "center", gap: 4 }}>
            <span>📍</span> {report.address}
          </p>
        )}

        {/* Footer: metadata */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 12,
            color: "#71717a",
            flexWrap: "wrap",
            borderTop: "1px solid #27272a",
            paddingTop: 8,
          }}
        >
          <span title="Usuario">👤 {report.user?.name ?? "Anónimo"}</span>
          <span title="Likes">❤️ {report.likes_count ?? 0}</span>
          <span title="Comentarios">💬 {report.comments_count ?? 0}</span>
          <span style={{ marginLeft: "auto" }} title="Fecha">
            {formatDate(report.created_at)}
          </span>
          {report.lat && report.lng && (
            <button
              title="Ver en mapa"
              onClick={handleMapClick}
              style={{
                background: "none",
                border: "1px solid #3f3f46",
                borderRadius: 6,
                padding: "2px 8px",
                color: "#3b82f6",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              🗺 Ver en mapa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
