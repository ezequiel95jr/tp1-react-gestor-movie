import { useReports } from "../hooks/useReports";
import Map from "../components/map/MapView";
import ReportCard from "../components/reports/ReportCard";

export default function MapReportsPage() {
  const { reports, loading } = useReports();

  if (loading) return <p>Cargando...</p>;

  return (
    <div
      style={{
        display: "flex",
        gap: 20,
        height: "calc(100vh - 80px)",
        padding: 20,
      }}
    >
      {/* COLUMNA REPORTES */}
      <div
        style={{
          width: "60%",
          overflowY: "auto",
          paddingRight: 20,
        }}
      >
        <h1>Reportes</h1>

        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {/* COLUMNA MAPA */}
      <div
        style={{
          flex: 1,
          height: "100%",
        }}
      >
        <Map reports={reports} />
      </div>
    </div>
  );
}