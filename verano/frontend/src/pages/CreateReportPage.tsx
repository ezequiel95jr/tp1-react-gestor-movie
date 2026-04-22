import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../components/ui/Container";
import MapPickerModal from "../components/map/MapPickerModal";
import { createReport, getReportById, updateReport, uploadReportImage } from "../api/reports.api";

const inputStyle: React.CSSProperties = {
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #3f3f46",
  background: "#111113",
  color: "#f4f4f5",
  fontSize: 14,
  width: "100%",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 6,
  fontSize: 13,
  fontWeight: 500,
  color: "#a1a1aa",
};

const PRIORITY_COLOR: Record<string, string> = {
  low: "#16a34a",
  medium: "#ca8a04",
  high: "#dc2626",
};

export default function CreateReportPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [openMap, setOpenMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("La imagen no puede superar los 4 MB");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  useEffect(() => {
    if (!id) return;
    getReportById(id).then((report) => {
      setSummary(report.summary ?? "");
      setDescription(report.description ?? "");
      setCategory(report.category ?? "");
      setPriority(report.priority ?? "medium");
      if (report.lat && report.lng) {
        setLocation({ lat: Number(report.lat), lng: Number(report.lng) });
      }
    });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!location) {
      setError("Tenés que marcar la ubicación en el mapa");
      return;
    }

    setLoading(true);
    try {
      const payload = { summary, description, category, priority, lat: location.lat, lng: location.lng };

      if (isEditMode && id) {
        await updateReport(id, payload);
        if (imageFile) await uploadReportImage(id, imageFile);
        navigate(`/details/${id}`);
      } else {
        const newReport = await createReport(payload);
        if (imageFile) await uploadReportImage(newReport.id, imageFile);
        navigate(`/details/${newReport.id}`, { state: { created: true } });
      }
    } catch {
      setError("Error guardando el reporte. Intentá nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none", border: "none", color: "#71717a",
          cursor: "pointer", fontSize: 14, padding: "8px 0",
          display: "flex", alignItems: "center", gap: 6, marginBottom: 4,
        }}
      >
        ← Volver
      </button>

      <div style={{
        maxWidth: 640,
        margin: "0 auto",
        background: "#1c1c1e",
        border: "1px solid #27272a",
        borderRadius: 12,
        padding: 32,
      }}>
        <h2 style={{ margin: "0 0 6px", color: "#f4f4f5", fontSize: "1.4rem", fontWeight: 700 }}>
          {isEditMode ? "Editar reporte" : "Nuevo reporte"}
        </h2>
        <p style={{ margin: "0 0 28px", color: "#71717a", fontSize: 13 }}>
          {isEditMode ? "Modificá los datos del reporte" : "Reportá un problema en tu zona"}
        </p>

        {error && (
          <div style={{
            background: "#7f1d1d", border: "1px solid #991b1b",
            color: "#fca5a5", padding: "10px 14px",
            borderRadius: 8, fontSize: 13, marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Título */}
          <div>
            <label style={labelStyle}>Título *</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
              placeholder="Ej: Bache en la calle"
              style={inputStyle}
            />
          </div>

          {/* Descripción */}
          <div>
            <label style={labelStyle}>Descripción *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              placeholder="Describí el problema con más detalle"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Categoría + Prioridad en fila */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Categoría</label>
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: tránsito, servicios"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                style={{
                  ...inputStyle,
                  color: PRIORITY_COLOR[priority],
                  fontWeight: 600,
                }}
              >
                <option value="low" style={{ color: "#16a34a", background: "#111113" }}>🟢 Baja</option>
                <option value="medium" style={{ color: "#ca8a04", background: "#111113" }}>🟡 Media</option>
                <option value="high" style={{ color: "#dc2626", background: "#111113" }}>🔴 Alta</option>
              </select>
            </div>
          </div>

          {/* Ubicación */}
          <div>
            <label style={labelStyle}>Ubicación *</label>
            <button
              type="button"
              onClick={() => setOpenMap(true)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 8,
                border: location ? "1px solid #16a34a" : "1px solid #3f3f46",
                background: location ? "#16a34a18" : "#111113",
                color: location ? "#16a34a" : "#71717a",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s ease",
              }}
            >
              {location ? `✔ Ubicación marcada — ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "📍 Marcar en el mapa"}
            </button>
          </div>

          {/* Imagen */}
          <div>
            <label style={labelStyle}>Imagen (opcional)</label>
            {imagePreview ? (
              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  src={imagePreview}
                  alt="preview"
                  style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, border: "1px solid #3f3f46" }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: "absolute", top: 8, right: 8,
                    background: "rgba(0,0,0,0.7)", color: "#fff",
                    border: "none", borderRadius: "50%",
                    width: 28, height: 28, cursor: "pointer",
                    fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >✕</button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%", padding: "10px 14px", borderRadius: 8,
                  border: "1px dashed #3f3f46", background: "transparent",
                  color: "#71717a", cursor: "pointer", fontSize: 14,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                📷 Adjuntar imagen
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={handleImageSelect}
            />
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#52525b" }}>
              JPG, PNG o WebP · Máx. 4 MB
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4,
              background: "#3b82f6",
              color: "#fff",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 600,
              fontSize: 14,
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
          >
            {loading ? "Guardando..." : isEditMode ? "Guardar cambios" : "Crear reporte"}
          </button>
        </form>
      </div>

      <MapPickerModal
        open={openMap}
        onClose={() => setOpenMap(false)}
        onSelect={(coords) => { setLocation(coords); setOpenMap(false); }}
        initialPosition={location ?? undefined}
      />
    </Container>
  );
}
