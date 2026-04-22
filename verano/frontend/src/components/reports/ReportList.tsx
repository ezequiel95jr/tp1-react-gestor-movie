import ReportCard from "./ReportCard";
import type { Report } from "../../types/report";

type Props = {
  reports: Report[];
};

export default function ReportList({ reports }: Props) {
  return (
    <div style={{ padding: 16 }}>
      <h1>Reportes</h1>
      {reports.map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </div>
  );
}