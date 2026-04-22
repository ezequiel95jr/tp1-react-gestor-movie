import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import type { Report } from "../../types/report";
import { getMarkerIcon } from "./markerIcons";

const PRIORITY_LABELS: Record<string, string> = {
  low: "🟢 Baja",
  medium: "🟡 Media",
  high: "🔴 Alta",
};

interface Props {
  reports: Report[];
}

export default function ClusterLayer({ reports }: Props) {
  const map = useMap();

  useEffect(() => {
    const group = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
    });

    for (const r of reports) {
      if (!r.priority) continue;

      const marker = L.marker([Number(r.lat), Number(r.lng)], {
        icon: getMarkerIcon(r.priority),
      });

      marker.bindPopup(`
        <div style="min-width:180px;font-family:sans-serif">
          <strong style="font-size:14px">${r.summary}</strong>
          ${r.address ? `<p style="margin:6px 0 4px;font-size:12px;color:#555">📍 ${r.address}</p>` : ""}
          <p style="margin:4px 0;font-size:12px">${PRIORITY_LABELS[r.priority] ?? r.priority}</p>
          <div style="display:flex;gap:10px;font-size:12px;margin:4px 0 8px">
            <span>❤️ ${r.likes_count ?? 0}</span>
            <span>💬 ${r.comments_count ?? 0}</span>
            ${r.user?.name ? `<span>👤 ${r.user.name}</span>` : ""}
          </div>
          <a
            href="/details/${r.id}"
            style="display:block;padding:6px 0;background:#3b82f6;color:#fff;border-radius:6px;font-size:12px;font-weight:600;text-align:center;text-decoration:none"
          >Ver detalle →</a>
        </div>
      `);

      group.addLayer(marker);
    }

    map.addLayer(group);
    return () => { map.removeLayer(group); };
  }, [map, reports]);

  return null;
}
