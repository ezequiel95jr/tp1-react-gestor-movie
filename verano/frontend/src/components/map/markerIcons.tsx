import L from "leaflet";

export function getMarkerIcon(priority: string) {
  let color = "blue";

  if (priority === "high") color = "red";
  if (priority === "medium") color = "yellow";
  if (priority === "low") color = "green";

  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
