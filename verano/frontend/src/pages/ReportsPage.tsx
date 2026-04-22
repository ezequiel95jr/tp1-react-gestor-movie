import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useReports } from "../hooks/useReports";
import ReportCard from "../components/reports/ReportCard";
import ReportListMap from "../components/map/ReportListMap";
import Container from "../components/ui/Container";
import Spinner from "../components/ui/Spinner";
import { useAuth } from "../context/AuthContext";
import type { Report } from "../types/report";

export default function ReportsPage() {
  const { reports, loading, hasMore, loadMore } = useReports();
  const navigate = useNavigate();
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  function handleSelect(report: Report) {
    setSelectedReport((prev) => (prev?.id === report.id ? null : report));
  }

  return (
    <Container>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: "1px solid #27272a",
        }}
      >
        <div>
          <h1 style={{ margin: 0, color: "#f4f4f5", fontSize: "1.6rem" }}>Reportes</h1>
          {reports.length > 0 && (
            <p style={{ margin: "4px 0 0", color: "#71717a", fontSize: 13 }}>
              {reports.length} reporte{reports.length !== 1 ? "s" : ""} cargado{reports.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
        {user && (
          <button
            className="reports-header-btn"
            onClick={() => navigate("/create")}
            style={{
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            + Nuevo reporte
          </button>
        )}
      </div>

      {/* Layout 2 columnas */}
      <div className="reports-layout">
        {/* Lista */}
        <div>
          {reports.length === 0 && !loading && (
            <p style={{ color: "#71717a", textAlign: "center", marginTop: 40 }}>
              No hay reportes todavía.
            </p>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {reports.map((r) => (
              <ReportCard
                key={r.id}
                report={r}
                selected={selectedReport?.id === r.id}
                onSelect={handleSelect}
              />
            ))}
          </div>

          <div ref={observerRef} style={{ height: 1 }} />
          {loading && <div style={{ padding: "20px 0", display: "flex", justifyContent: "center" }}><Spinner /></div>}
        </div>

        {/* Mini-mapa sticky */}
        {selectedReport ? (
          <div className="reports-map-sticky">
            <ReportListMap report={selectedReport} />
          </div>
        ) : (
          <div className="reports-map-placeholder">
            <span style={{ fontSize: 32 }}>🗺</span>
            <span>Seleccioná un reporte<br />para ver su ubicación</span>
          </div>
        )}
      </div>

      {/* FAB móvil */}
      {user && (
        <button
          onClick={() => navigate("/create")}
          style={{
            position: "fixed",
            bottom: 32,
            right: 32,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#3b82f6",
            color: "#fff",
            fontSize: 28,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          className="fab-mobile"
        >
          +
        </button>
      )}
    </Container>
  );
}
