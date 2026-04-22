import { useEffect, useState } from "react";

type Props = {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onDone: () => void;
};

export default function Toast({ message, type = "success", duration = 3000, onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onDone]);

  const bg = type === "success" ? "#16a34a" : "#dc2626";

  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: `translateX(-50%) translateY(${visible ? 0 : -20}px)`,
        background: bg,
        color: "#fff",
        padding: "12px 24px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease, transform 0.3s ease",
        whiteSpace: "nowrap",
      }}
    >
      {message}
    </div>
  );
}
