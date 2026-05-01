"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("TODO");
  const [dueDate, setDueDate] = useState("");

  const fetchData = async () => {
    const pRes = await fetch(`/api/projects/${id}`);
    if (pRes.ok) {
      setProject(await pRes.json());
    } else {
      router.push("/projects");
      return;
    }

    const tRes = await fetch(`/api/projects/${id}/tasks`);
    if (tRes.ok) setTasks(await tRes.json());
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status, dueDate: dueDate || null }),
    });

    if (res.ok) {
      setIsTaskModalOpen(false);
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setDueDate("");
      fetchData();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  if (loading) return <div>Loading project details...</div>;

  return (
    <div className="container" style={{ padding: "0" }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => router.push("/projects")} className="btn btn-secondary mb-4" style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>&larr; Back</button>
          <h1>{project?.name}</h1>
          <p style={{ color: "var(--text-secondary)" }}>{project?.description}</p>
        </div>
        <button onClick={() => setIsTaskModalOpen(true)} className="btn btn-primary">
          + Add Task
        </button>
      </div>

      <div className="grid grid-cols-3">
        {["TODO", "IN_PROGRESS", "DONE"].map((colStatus) => (
          <div key={colStatus} className="card" style={{ backgroundColor: "#f3f4f6", border: "none", boxShadow: "none" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1rem", color: "var(--text-secondary)" }}>{colStatus.replace("_", " ")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {tasks.filter(t => t.status === colStatus).map((task) => (
                <div key={task.id} className="card" style={{ padding: "1rem" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>{task.title}</h4>
                  {task.description && <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>{task.description}</p>}
                  
                  <div className="flex justify-between items-center mt-4">
                    <select 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      style={{ fontSize: "0.75rem", padding: "0.25rem", borderRadius: "0.25rem", border: "1px solid var(--border-color)" }}
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === colStatus).length === 0 && (
                <div style={{ padding: "1rem", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.875rem", border: "2px dashed var(--border-color)", borderRadius: "0.5rem" }}>
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isTaskModalOpen && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="card" style={{ width: "100%", maxWidth: "500px" }}>
            <h2 className="mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input type="text" className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className="grid grid-cols-3" style={{ gap: "1rem" }}>
                <div className="input-group" style={{ gridColumn: "span 2" }}>
                  <label>Due Date</label>
                  <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="input-group">
                  <label>Status</label>
                  <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
