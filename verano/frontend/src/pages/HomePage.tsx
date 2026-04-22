import { useEffect, useState, useMemo } from "react";
import MapView from "../components/map/MapView";
import { getAllReports } from "../api/reports.api";
import type { Report } from "../types/report";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";

type Priority = "low" | "medium" | "high";
type ViewMode  = "markers" | "heatmap";
type TimeRange = "7d" | "30d" | "3m" | "all";

const PRIORITY_LABELS: Record<Priority, string> = {
  low: "Baja", medium: "Media", high: "Alta",
};
const PRIORITY_COLORS: Record<Priority, string> = {
  low: "#16a34a", medium: "#ca8a04", high: "#dc2626",
};
const TIME_LABELS: Record<TimeRange, string> = {
  "7d": "7 días", "30d": "30 días", "3m": "3 meses", "all": "Todo",
};

function cutoffDate(range: TimeRange): Date | null {
  if (range === "all") return null;
  const d = new Date();
  if (range === "7d")  d.setDate(d.getDate() - 7);
  if (range === "30d") d.setDate(d.getDate() - 30);
  if (range === "3m")  d.setMonth(d.getMonth() - 3);
  return d;
}

export default function HomePage() {
  const [reports, setReports]           = useState<Report[]>([]);
  const [loading, setLoading]           = useState(true);
  const [activeFilters, setActiveFilters] = useState<Set<Priority>>(
    new Set(["low", "medium", "high"])
  );
  const [viewMode, setViewMode]   = useState<ViewMode>("markers");
  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const { user }   = useAuth();
  const navigate   = useNavigate();

  useEffect(() => {
    getAllReports()
      .then(setReports)
      .finally(() => setLoading(false));
  }, []);

  function toggleFilter(p: Priority) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(p)) {
        if (next.size === 1) return prev;
        next.delete(p);
      } else {
        next.add(p);
      }
      return next;
    });
  }

  const timeFiltered = useMemo(() => {
    const cutoff = cutoffDate(timeRange);
    if (!cutoff) return reports;
    return reports.filter((r) => new Date(r.created_at) >= cutoff);
  }, [reports, timeRange]);

  const filtered = useMemo(
    () => timeFiltered.filter((r) => r.priority && activeFilters.has(r.priority as Priority)),
    [timeFiltered, activeFilters]
  );

  const countByPriority = (p: Priority) =>
    timeFiltered.filter((r) => r.priority === p).length;

  const visibleCount = viewMode === "markers" ? filtered.length : timeFiltered.length;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>

      {/* ── Toolbar ────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* Conteo */}
        <span style={{ color: "#aaa", fontSize: 13 }}>
          <strong style={{ color: "#fff" }}>{visibleCount}</strong>
          {viewMode === "markers" && filtered.length !== reports.length && (
            <span> de {reports.length}</span>
          )}{" "}
          reportes
        </span>

        {/* Filtros de prioridad — solo en modo marcadores */}
        {viewMode === "markers" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {(["high", "medium", "low"] as Priority[]).map((p) => {
              const active = activeFilters.has(p);
              return (
                <button
                  key={p}
                  onClick={() => toggleFilter(p)}
                  style={{
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: `2px solid ${PRIORITY_COLORS[p]}`,
                    background: active ? PRIORITY_COLORS[p] : "transparent",
                    color: active ? "#fff" : PRIORITY_COLORS[p],
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {PRIORITY_LABELS[p]} ({countByPriority(p)})
                </button>
              );
            })}
          </div>
        )}

        {/* Filtro temporal */}
        <div style={{ display: "flex", background: "#2a2a2a", borderRadius: 20, padding: 3, gap: 2 }}>
          {(["7d", "30d", "3m", "all"] as TimeRange[]).map((r) => {
            const active = timeRange === r;
            return (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 16,
                  border: "none",
                  background: active ? "#6366f1" : "transparent",
                  color: active ? "#fff" : "#888",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {TIME_LABELS[r]}
              </button>
            );
          })}
        </div>

        {/* Toggle de vista */}
        <div style={{ display: "flex", background: "#2a2a2a", borderRadius: 20, padding: 3, gap: 2 }}>
          {(["markers", "heatmap"] as ViewMode[]).map((m) => {
            const active = viewMode === m;
            return (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                style={{
                  padding: "4px 14px",
                  borderRadius: 16,
                  border: "none",
                  background: active ? "#3b82f6" : "transparent",
                  color: active ? "#fff" : "#888",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {m === "markers" ? "Marcadores" : "Mapa de calor"}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mapa ───────────────────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <MapView
          reports={viewMode === "markers" ? filtered : timeFiltered}
          mode={viewMode}
        />

        {/* Leyenda dinámica */}
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: 16,
            background: "rgba(15,15,15,0.85)",
            backdropFilter: "blur(4px)",
            borderRadius: 8,
            padding: "10px 14px",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 12,
            color: "#eee",
            border: "1px solid #333",
          }}
        >
          {viewMode === "markers" ? (
            (["high", "medium", "low"] as Priority[]).map((p) => (
              <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: PRIORITY_COLORS[p], display: "inline-block", flexShrink: 0 }} />
                Prioridad {PRIORITY_LABELS[p]}
              </div>
            ))
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#dc2626", display: "inline-block", flexShrink: 0 }} />
                Zona crítica (&gt;5 reportes)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#facc15", display: "inline-block", flexShrink: 0 }} />
                Zona moderada (3–4 reportes)
              </div>
            </>
          )}
        </div>

        {/* FAB */}
        {user && (
          <button
            onClick={() => navigate("/create")}
            style={{
              position: "absolute",
              bottom: 32,
              right: 16,
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#3b82f6",
              color: "#fff",
              fontSize: 28,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Crear reporte"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
