"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            TM
          </div>
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Task Manager</h2>
        </div>
        
        <nav className="sidebar-nav">
          <Link href="/dashboard" className={`nav-link ${pathname === "/dashboard" ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link href="/projects" className={`nav-link ${pathname.startsWith("/projects") ? "active" : ""}`}>
            Projects
          </Link>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ width: "100%", justifyContent: "flex-start", color: "var(--text-secondary)", border: "none" }}>
            Logout
          </button>
        </div>
      </aside>
      
      <main className="content">
        {children}
      </main>
    </div>
  );
}
