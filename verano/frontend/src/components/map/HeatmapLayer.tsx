import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { HeatPoint } from "../../utils/heatmap";

interface Props {
  points: HeatPoint[];
}

export default function HeatmapLayer({ points }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heat = (L as any).heatLayer(points, {
      radius: 40,
      blur: 25,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.6,
      gradient: { 0.5: "#facc15", 1.0: "#dc2626" },
    });

    heat.addTo(map);
    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
}
