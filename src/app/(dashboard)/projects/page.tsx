"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    if (res.ok) {
      setProjects(await res.json());
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });

    if (res.ok) {
      setIsModalOpen(false);
      setName("");
      setDescription("");
      fetchProjects();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create project");
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="container" style={{ padding: "0" }}>
      <div className="flex justify-between items-center mb-6">
        <h1>Projects</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <h3 style={{ color: "var(--text-secondary)" }}>No projects found</h3>
          <p>Create a project to start managing tasks.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <div className="card" style={{ cursor: "pointer", height: "100%", display: "flex", flexDirection: "column", transition: "transform 0.2s, box-shadow 0.2s" }}
                   onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1)"; }}
                   onMouseOut={(e) => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)"; }}>
                <h3>{project.name}</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", flexGrow: 1, marginBottom: "1rem" }}>
                  {project.description || "No description"}
                </p>
                <div className="flex justify-between items-center" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "0.5rem", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <span>{project._count?.tasks || 0} Tasks</span>
                  <span>{project._count?.members || 1} Members</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="card" style={{ width: "100%", maxWidth: "400px" }}>
            <h2 className="mb-4">Create Project</h2>
            {error && <div style={{ color: "var(--error-color)", marginBottom: "1rem" }}>{error}</div>}
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
