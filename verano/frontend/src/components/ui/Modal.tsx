import { useEffect } from "react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, onClose, children }: Props) {
  // ESC para cerrar
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

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
        transition: "opacity 0.2s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          color: "#000",
          padding: 20,
          borderRadius: 8,
          width: "90%",
          maxWidth: 500,
          transform: "scale(1)",
          transition: "transform 0.2s ease, opacity 0.2s ease",

        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* DEBUG visual */}
        {children}
      </div>
    </div>
  );
}
