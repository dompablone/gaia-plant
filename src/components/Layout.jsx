import { Outlet, Link } from "react-router-dom";
import gaiaLogo from "../assets/gaia-icon.png";

export default function Layout({ onSignOut }) {
  return (
    <div>
      <nav
        style={{
          padding: 16,
          borderBottom: "1px solid #ddd",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div />

        <Link
          to="/app"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            justifySelf: "center",
          }}
        >
          <img src={gaiaLogo} alt="Gaia Plant" style={{ width: 108, height: 108 }} />
          <span style={{ fontWeight: 700, color: "#2e7d32", fontSize: 48 }}>Gaia Plant</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, justifySelf: "end" }}>
          <Link
            to="/app/carrinho"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid #7fb069",
              color: "#2f5d36",
              fontWeight: 700,
              background: "#fff",
              boxShadow: "0 6px 16px rgba(127, 176, 105, 0.18)",
            }}
          >
            🛒 Carrinho
          </Link>
          <Link
            to="/perfil-clinico"
            style={{
              textDecoration: "none",
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid #7fb069",
              color: "#2f5d36",
              fontWeight: 700,
              background: "#fff",
              boxShadow: "0 6px 16px rgba(127, 176, 105, 0.18)",
            }}
          >
            Meu perfil
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: "1px solid #7fb069",
              color: "#2f5d36",
              fontWeight: 700,
              background: "#fff",
              boxShadow: "0 6px 16px rgba(127, 176, 105, 0.18)",
              cursor: "pointer",
            }}
          >
            Sair
          </button>
        </div>
      </nav>

      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  );
}
