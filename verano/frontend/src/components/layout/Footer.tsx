export default function Footer() {
  return (
    <footer
      style={{
        padding: 12,
        borderTop: "1px solid #ddd",
        marginTop: "auto",
        textAlign: "center",
        fontSize: 12,
        backgroundColor: "#292929",
        color: "#fff",
      }}
    >
      © {new Date().getFullYear()} Snapit
    </footer>
  );
}
