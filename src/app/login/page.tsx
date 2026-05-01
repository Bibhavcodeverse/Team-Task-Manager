"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login to Task Manager</h2>
        {error && <div style={{ color: "var(--error-color)", marginBottom: "1rem", textAlign: "center" }}>{error}</div>}
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
            Login
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
          Don't have an account? <Link href="/register" style={{ color: "var(--primary-color)", fontWeight: 500 }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
