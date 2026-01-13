import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import gaiaIcon from "../assets/gaia-icon.png";

export default function Layout({ session, onSignOut, signingOut }) {
  const nav = useNavigate();
  const email = session?.user?.email ?? "";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => nav("/app")}
            className="flex items-center gap-3"
          >
            <img src={gaiaIcon} alt="Gaia Plant" className="h-10 w-10" />
            <div className="text-left leading-tight">
              <div className="font-extrabold">Gaia Plant</div>
              <div className="text-xs text-slate-500">Cannabis Medicinal</div>
            </div>
          </button>

          {email ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-xs text-slate-500 sm:inline">{email}</span>

              <Link
                to="/app/pagamentos"
                className="inline-flex h-9 w-10 items-center justify-center rounded-full border bg-white hover:bg-slate-50"
                title="Pagamentos"
                aria-label="Pagamentos"
              >
                🛒
              </Link>

              <button
                type="button"
                onClick={onSignOut}
                disabled={Boolean(signingOut)}
                className="rounded-full border px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
              >
                {signingOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
