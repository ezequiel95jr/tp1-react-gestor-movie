import { api } from "./api";

export type PeriodStat = {
  period: string;
  total: number;
};

export async function fetchReportsByMonth(): Promise<PeriodStat[]> {
  const res = await api.get("/stats/reports-by-month");
  return res.data;
}

export async function fetchReportsByWeek(): Promise<PeriodStat[]> {
  const res = await api.get("/stats/reports-by-week");
  return res.data;
}
