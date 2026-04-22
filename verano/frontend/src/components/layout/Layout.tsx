import { type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children?: ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111113",
      }}
    >
      <Header />

      <main
        style={{
          flex: 1,
          padding: "24px 16px",
          overflow: "visible",
        }}
      >
        {children ?? <Outlet />}
      </main>

      <Footer />
    </div>
  );
}

