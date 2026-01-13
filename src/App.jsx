// src/App.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, Navigate, Link, useNavigate, Outlet } from "react-router-dom";

import { supabase } from "./lib/supabase.js";
import gaiaIcon from "./assets/gaia-icon.png";
import Layout from "./components/Layout.jsx";
 

// -------------------- Admin auth (server-side via Supabase table) --------------------
// Fallback temporário: enquanto a tabela/políticas não existirem, mantém seu e-mail como admin
const ADMIN_EMAIL_FALLBACK = ["pablo.felix.carvalho@gmail.com"];

async function fetchIsAdmin(userId, session) {
  // Sem sessão, nunca é admin
  if (!userId || !session?.user) return false;

  // 1) Preferência: tabela app_admins (server-side)
  try {
    const { data, error } = await supabase
      .from("app_admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    // Se a tabela existir e não deu erro, admin = existe linha
    if (!error) return Boolean(data?.user_id);

    // Se a tabela não existir ainda, cai no fallback
    const msg = String(error?.message || "");
    if (msg.toLowerCase().includes("does not exist") || msg.toLowerCase().includes("relation")) {
      const email = (session?.user?.email || "").toLowerCase();
      return ADMIN_EMAIL_FALLBACK.includes(email);
    }

    // Outros erros (RLS etc.) => não admin
    return false;
  } catch {
    const email = (session?.user?.email || "").toLowerCase();
    return ADMIN_EMAIL_FALLBACK.includes(email);
  }
}

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let unsub = null;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data?.session ?? null);
      } catch {
        setSession(null);
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    unsub = sub?.subscription;

    return () => {
      unsub?.unsubscribe?.();
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    } finally {
      setSession(null);
      setSigningOut(false);
    }
  }

  return (
    <Routes>
      {/* rota raiz */}
      <Route path="/" element={<Navigate to="/app" replace />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute session={session}>
            <Layout
              session={session}
              onSignOut={handleSignOut}
              signingOut={signingOut}
            />
          </ProtectedRoute>
        }
      >
        <Route index element={<AppDashboard session={session} profile={profile} />} />
        <Route path="pagamentos" element={<Pagamentos />} />
        <Route path="outra-rota" element={<OutraPagina />} />
      </Route>
    </Routes>
  );
}

function ProtectedRoute({ session, children }) {
  if (!session?.user) return <Navigate to="/auth" replace />;
  return children;
}

function AppDashboard() {
  return <div style={{ padding: 20 }}>AppDashboard</div>;
}

function Pagamentos() {
  return <div style={{ padding: 20 }}>Pagamentos</div>;
}

function OutraPagina() {
  return <div style={{ padding: 20 }}>Outra pagina</div>;
}

// -------------------- Styles --------------------
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f6f7f8",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
    color: "#111",
  },
  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: "rgba(246,247,248,0.9)",
    backdropFilter: "blur(8px)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  appLogo: {
    width: 36,
    height: 36,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: "20px",
  },
  appSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  logoDot: { width: 18, height: 18, borderRadius: 6, background: "#2e7d32" },
  container: { maxWidth: 920, margin: "0 auto", padding: "22px 16px 40px" },
  card: {
    background: "#fff",
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0,0,0,0.15)",
    outline: "none",
    fontSize: 14,
  },
  btn: {
    background: "#43a047",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },
  btnGhost: {
    background: "transparent",
    color: "#111",
    border: "1px solid rgba(0,0,0,0.2)",
    padding: "12px 18px",
    borderRadius: 999,
    fontWeight: 800,
    cursor: "pointer",
  },
  choiceGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },
  choiceGrid2: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 },
  selectBtn: {
    textAlign: "left",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    border: "2px solid rgba(0,0,0,0.12)",
    background: "#fff",
    cursor: "pointer",
  },
  selectBtnActive: {
    border: "2px solid #43a047",
    boxShadow: "0 10px 24px rgba(67, 160, 71, 0.18)",
  },
  pill: {
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  pillActive: { border: "1px solid #43a047", background: "rgba(67,160,71,0.10)" },
};
