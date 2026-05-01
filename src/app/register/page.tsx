"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Create an Account</h2>
        {error && <div style={{ color: "var(--error-color)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              className="input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              className="input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              className="input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <label>Role</label>
            <select 
              className="input" 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
            Register
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Already have an account? <Link href="/login" style={{ color: "var(--primary-color)", fontWeight: 500 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
