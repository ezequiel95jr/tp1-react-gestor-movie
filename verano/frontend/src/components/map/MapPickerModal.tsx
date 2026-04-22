import MapPicker from "./MapPicker";

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (coords: { lat: number; lng: number }) => void;
  initialPosition?: { lat: number; lng: number };
};

export default function MapPickerModal({
  open,
  onClose,
  initialPosition,
  onSelect,
}: Props) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "#fff",
          width: "90%",
          maxWidth: 800,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <MapPicker 
        onSelect={onSelect}
        initialPosition={initialPosition}
        />

        <div style={{ padding: 16, textAlign: "right" }}>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
