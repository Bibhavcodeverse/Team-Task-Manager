"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const { stats, recentTasks } = data;

  return (
    <div className="container" style={{ padding: "0" }}>
      <h1 className="mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-3 mb-6">
        <div className="card">
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Tasks</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.total}</p>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--primary-color)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>In Progress</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.inProgress}</p>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--error-color)" }}>
          <h3 style={{ color: "var(--text-secondary)", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Overdue</h3>
          <p style={{ fontSize: "2rem", fontWeight: 700, color: "var(--error-color)" }}>{stats.overdue}</p>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2>Recent Tasks</h2>
          <Link href="/projects" className="btn btn-secondary" style={{ fontSize: "0.75rem", padding: "0.25rem 0.75rem" }}>View All</Link>
        </div>
        
        {recentTasks.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No recent tasks found. Create a project to get started!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentTasks.map((task: any) => (
              <div key={task.id} className="flex justify-between items-center" style={{ padding: "1rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem" }}>
                <div>
                  <h4 style={{ margin: 0 }}>{task.title}</h4>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>Project: {task.project.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
