import type { Report } from "../types/report";

export type HeatPoint = [number, number, number]; // [lat, lng, intensity]

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function computeHeatPoints(reports: Report[]): HeatPoint[] {
  const RADIUS_METERS = 100;
  const result: HeatPoint[] = [];

  for (const report of reports) {
    const lat = Number(report.lat);
    const lng = Number(report.lng);

    const count = reports.filter(
      (r) => haversineDistance(lat, lng, Number(r.lat), Number(r.lng)) <= RADIUS_METERS
    ).length;

    if (count < 3) continue;

    // 3-4 reportes → amarillo (0.5), ≥5 → rojo (1.0)
    result.push([lat, lng, count >= 5 ? 1.0 : 0.5]);
  }

  return result;
}
