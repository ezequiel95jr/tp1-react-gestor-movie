import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Report } from "../../types/report";
import { getMarkerIcon } from "./markerIcons";

const CENTER: LatLngExpression = [-38.9516, -68.0591];

function isValidCoord(lat: unknown, lng: unknown): boolean {
  const la = Number(lat);
  const lo = Number(lng);
  return isFinite(la) && isFinite(lo) && la !== 0 && lo !== 0;
}

function MapController({ report }: { report: Report | null }) {
  const map = useMap();

  useEffect(() => {
    if (!report || !isValidCoord(report.lat, report.lng)) return;
    try {
      map.setView([Number(report.lat), Number(report.lng)], 15);
    } catch {
      // mapa aún no inicializado
    }
  }, [report]);

  return null;
}

type Props = {
  report: Report | null;
};

export default function ReportListMap({ report }: Props) {
  return (
    <MapContainer
      center={CENTER}
      zoom={13}
      style={{ height: "100%", width: "100%", borderRadius: 12 }}
      zoomControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <MapController report={report} />
      {report && isValidCoord(report.lat, report.lng) && (
        <Marker
          position={[Number(report.lat), Number(report.lng)]}
          icon={getMarkerIcon(report.priority)}
        >
          <Popup>
            <strong>{report.summary}</strong>
            {report.address && (
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "#555" }}>
                📍 {report.address}
              </p>
            )}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
