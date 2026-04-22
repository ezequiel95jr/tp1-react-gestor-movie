import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { fetchReportsByMonth, fetchReportsByWeek } from "../api/stats.api";
import type { PeriodStat } from "../api/stats.api";
import Spinner from "../components/ui/Spinner";

type View = "monthly" | "weekly";

function formatMonthLabel(period: string) {
  // "2026-03" → "Mar 26"
  const [year, month] = period.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("es-AR", { month: "short", year: "2-digit" });
}

function formatWeekLabel(period: string) {
  // "2026-W12" → "Sem 12"
  const week = period.split("-W")[1];
  return `Sem ${week}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1c1c1e",
      border: "1px solid #27272a",
      borderRadius: 8,
      padding: "0.6rem 0.9rem",
    }}>
      <div style={{ color: "#a1a1aa", fontSize: "0.8rem", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#3b82f6", fontWeight: 700, fontSize: "1rem" }}>
        {payload[0].value} {payload[0].value === 1 ? "reporte" : "reportes"}
      </div>
    </div>
  );
};

export default function StatsPage() {
  const [view, setView] = useState<View>("monthly");
  const [monthly, setMonthly] = useState<PeriodStat[]>([]);
  const [weekly, setWeekly] = useState<PeriodStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchReportsByMonth(), fetchReportsByWeek()])
      .then(([m, w]) => {
        setMonthly(m);
        setWeekly(w);
      })
      .finally(() => setLoading(false));
  }, []);

  const data = view === "monthly"
    ? monthly.map((d) => ({ label: formatMonthLabel(d.period), total: d.total }))
    : weekly.map((d) => ({ label: formatWeekLabel(d.period), total: d.total }));

  const peak = data.length ? Math.max(...data.map((d) => d.total)) : 0;
  const total = data.reduce((acc, d) => acc + d.total, 0);
  const avg = data.length ? (total / data.length).toFixed(1) : "0";

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "2rem", minHeight: "100%", boxSizing: "border-box" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#f4f4f5", margin: 0, fontSize: "1.6rem" }}>Estadísticas</h1>
        <p style={{ color: "#71717a", margin: "0.25rem 0 0" }}>Evolución de reportes en el tiempo</p>
      </div>

      {/* Toggle mensual / semanal */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        {(["monthly", "weekly"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            style={{
              padding: "0.4rem 1rem",
              borderRadius: 8,
              border: "1px solid",
              borderColor: view === v ? "#3b82f6" : "#3f3f46",
              background: view === v ? "#3b82f620" : "transparent",
              color: view === v ? "#3b82f6" : "#a1a1aa",
              cursor: "pointer",
              fontWeight: view === v ? 600 : 400,
              fontSize: "0.9rem",
              fontFamily: "inherit",
            }}
          >
            {v === "monthly" ? "Mensual" : "Semanal"}
          </button>
        ))}
      </div>

      {/* Cards resumen */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <StatCard label="Total en el período" value={total} />
        <StatCard label={view === "monthly" ? "Promedio mensual" : "Promedio semanal"} value={avg} />
        <StatCard label="Pico máximo" value={peak} />
        <StatCard label={view === "monthly" ? "Meses con datos" : "Semanas con datos"} value={data.length} />
      </div>

      {/* Gráfico */}
      <div style={{
        background: "#1c1c1e",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: "1.5rem 1rem 1rem",
      }}>
        {data.length === 0 ? (
          <div style={{ color: "#71717a", textAlign: "center", padding: "2rem" }}>
            Sin datos para mostrar
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="label"
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={{ stroke: "#3f3f46" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={() => "Reportes creados"}
                wrapperStyle={{ color: "#a1a1aa", fontSize: "0.85rem", paddingTop: "0.5rem" }}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ fill: "#3b82f6", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#60a5fa" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{
      background: "#1c1c1e",
      border: "1px solid #27272a",
      borderRadius: 10,
      padding: "0.75rem 1.25rem",
      minWidth: 130,
      flex: 1,
    }}>
      <div style={{ color: "#f4f4f5", fontWeight: 700, fontSize: "1.5rem" }}>{value}</div>
      <div style={{ color: "#a1a1aa", fontSize: "0.78rem", marginTop: 2 }}>{label}</div>
    </div>
  );
}
