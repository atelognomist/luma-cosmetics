import { NavLink, useLocation } from "react-router";
import { DEMO_ORDERS } from "../../lib/data";

const navItems = [
  { to: "/", label: "Tableau de bord", icon: Grid },
  { to: "/orders", label: "Commandes", icon: Package, badge: true },
  { to: "/products", label: "Produits", icon: Tag },
  { to: "/inventory", label: "Inventaire", icon: Layers },
  { to: "/campaigns", label: "Campagnes", icon: Megaphone },
  { to: "/analytics", label: "Analytiques", icon: BarChart2 },
  { to: "/delivery", label: "Livraison", icon: Truck },
];

const bottomItems = [
  { to: "/settings", label: "Paramètres", icon: Settings },
];

function attentionCount() {
  return DEMO_ORDERS.filter(
    (o) => o.status === "new" || o.status === "no_answer" || o.status === "calling"
  ).length;
}

export default function Sidebar() {
  const loc = useLocation();
  const count = attentionCount();

  return (
    <aside
      style={{ backgroundColor: "var(--sidebar-bg)", borderRight: "1px solid var(--sidebar-border)" }}
      className="w-[220px] shrink-0 flex flex-col h-screen sticky top-0 overflow-y-auto sidebar-scroll"
    >
      {/* Logo */}
      <div
        className="px-5 py-5 flex items-center gap-2.5"
        style={{ borderBottom: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="w-7 h-7 rounded flex items-center justify-center"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <span
            className="text-white font-serif"
            style={{ fontSize: 14, lineHeight: 1, fontWeight: 400, letterSpacing: "-0.02em" }}
          >
            L
          </span>
        </div>
        <div>
          <div
            className="font-serif tracking-wide"
            style={{ color: "var(--sidebar-active-fg)", fontSize: 15, letterSpacing: "0.08em" }}
          >
            LUMA
          </div>
          <div
            className="font-mono"
            style={{ color: "var(--sidebar-muted)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Admin
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 flex flex-col gap-0.5">
        {navItems.map(({ to, label, icon: Icon, badge }) => {
          const active = to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors duration-100 group relative"
              style={{
                color: active ? "var(--sidebar-active-fg)" : "var(--sidebar-fg)",
                backgroundColor: active ? "var(--sidebar-active-bg)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon size={15} strokeWidth={1.7} />
              <span className="flex-1" style={{ fontWeight: active ? 500 : 400 }}>
                {label}
              </span>
              {badge && count > 0 && (
                <span
                  className="font-mono text-white rounded-full px-1.5 py-0.5 leading-none"
                  style={{
                    backgroundColor: "#C14A4A",
                    fontSize: 10,
                    minWidth: 18,
                    textAlign: "center",
                  }}
                >
                  {count}
                </span>
              )}
            </NavLink>
          );
        })}

        <div
          className="mx-3 my-2"
          style={{ borderTop: "1px solid var(--sidebar-border)" }}
        />

        {bottomItems.map(({ to, label, icon: Icon }) => {
          const active = loc.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className="flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors duration-100"
              style={{
                color: active ? "var(--sidebar-active-fg)" : "var(--sidebar-fg)",
                backgroundColor: active ? "var(--sidebar-active-bg)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "var(--sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon size={15} strokeWidth={1.7} />
              <span style={{ fontWeight: active ? 500 : 400 }}>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
          style={{ backgroundColor: "var(--primary)", color: "#fff" }}
        >
          A
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium truncate" style={{ color: "var(--sidebar-active-fg)" }}>
            Admin
          </div>
          <div className="text-xs truncate" style={{ color: "var(--sidebar-muted)" }}>
            luma@store.dz
          </div>
        </div>
      </div>
    </aside>
  );
}

// ── Inline micro-icons ────────────────────────────────────────────────────────
function Grid({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function Package({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" /><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}
function Tag({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}
function Layers({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
    </svg>
  );
}
function Megaphone({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11l19-9v18L3 11z" /><path d="M11 6L3 11l8 5" /><line x1="11" y1="11" x2="11" y2="19" /><line x1="7" y1="18" x2="11" y2="19" />
    </svg>
  );
}
function BarChart2({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function Truck({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}
function Settings({ size = 16, strokeWidth = 1.7 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}
