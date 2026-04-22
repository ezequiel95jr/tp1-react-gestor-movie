import type { Report} from "../../types/report";


type Props = {
  report: Report;
};

export default function ReportDetail({ report }: Props) {
  return (
    <div>
      <h2>{report.summary ?? "Reporte"}</h2>

      <p>{report.description}</p>

      <p>
        <strong>Categoría:</strong> {report.category ?? "—"}
      </p>

      <p>
        <strong>Prioridad:</strong> {report.priority ?? "—"}
      </p>

      <p>
        <strong>Ubicación:</strong> {report.lat}, {report.lng}
      </p>

      {report.created_at && (
        <small>Creado: {new Date(report.created_at).toLocaleString()}</small>
      )}
      {report.comments?.map((c) => (
        <div key={c.id}>
          <strong>{c.user?.name}</strong>
          <p>{c.content}</p>
        </div>
      ))}

    </div>
  );
}
