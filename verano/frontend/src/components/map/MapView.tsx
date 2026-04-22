import { MapContainer, TileLayer } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { Report } from "../../types/report";
import ClusterLayer from "./ClusterLayer";
import HeatmapLayer from "./HeatmapLayer";
import { computeHeatPoints } from "../../utils/heatmap";

const CENTER: LatLngExpression = [-38.9516, -68.0591];

type Props = {
  reports: Report[];
  mode: "markers" | "heatmap";
};

export default function MapView({ reports, mode }: Props) {
  const heatPoints = mode === "heatmap" ? computeHeatPoints(reports) : [];

  return (
    <div style={{ height: "85vh", width: "100%" }}>
      <MapContainer
        center={CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {mode === "markers" && <ClusterLayer reports={reports} />}
        {mode === "heatmap"  && <HeatmapLayer points={heatPoints} />}
      </MapContainer>
    </div>
  );
}
