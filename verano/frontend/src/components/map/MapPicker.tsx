  import {MapContainer,TileLayer,Marker,useMapEvents} from "react-leaflet";
  import type { LatLngExpression } from "leaflet";
  import { useState } from "react";

  const CENTER: LatLngExpression = [-38.9516, -68.0591];

  type Props = {
    onSelect: (coords: { lat: number; lng: number }) => void;
    initialPosition?: { lat: number; lng: number };
  };

  function ClickHandler({
    setMarker,
    onSelect,
  }: {
    setMarker: (pos: LatLngExpression) => void;
    onSelect: (coords: { lat: number; lng: number }) => void;
  }) {
    useMapEvents({
      click(e) {
        const coords = {
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        };

        setMarker([coords.lat, coords.lng]);
        onSelect(coords);
      },
    });

    return null;
  }

  export default function MapPicker({
    onSelect,
    initialPosition,
  }: Props) {
    const [marker, setMarker] = useState<LatLngExpression | null>(
      initialPosition
        ? [initialPosition.lat, initialPosition.lng]
        : null
    );

    return (
      <div style={{ height: "60vh" }}>
        <MapContainer
          center={
            marker ?? CENTER
          }
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {marker && (
            <Marker
              position={marker}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const latlng = e.target.getLatLng();
                  const coords = {
                    lat: latlng.lat,
                    lng: latlng.lng,
                  };

                  setMarker([coords.lat, coords.lng]);
                  onSelect(coords);
                },
              }}
            />
          )}

          <ClickHandler
            setMarker={setMarker}
            onSelect={onSelect}
          />
        </MapContainer>
      </div>
    );
  }
