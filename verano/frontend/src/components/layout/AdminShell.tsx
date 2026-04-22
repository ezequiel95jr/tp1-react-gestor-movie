import Header from "./Header";
import AdminLayout from "./AdminLayout";

export default function AdminShell() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#111113" }}>
      <Header />
      <div style={{ flex: 1, display: "flex", overflow: "hidden", height: "100%" }}>
        <AdminLayout />
      </div>
    </div>
  );
}
