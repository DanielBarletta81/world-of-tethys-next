"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { MagmaCard, MagmaButton, InputField } from "@/components/MagmaUI";

export default function FirebaseLogin() {
  const { loginEmail, registerEmail, user, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await loginEmail(email, password);
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await registerEmail(email, password);
    } catch (err) {
      setError(err?.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <MagmaCard className="max-w-md mx-auto">
        <h2 className="text-lg text-slate-200 font-semibold mb-4">Signal Linked</h2>
        <p className="text-sm text-slate-400 mb-4">Welcome, {user.email || "Watcher"}.</p>
        <MagmaButton onClick={logout}>Sever Link</MagmaButton>
      </MagmaCard>
    );
  }

  return (
    <MagmaCard className="max-w-md mx-auto">
      <h2 className="text-lg text-slate-200 font-semibold mb-4">Connect Your Signal</h2>
      <form onSubmit={handleLogin} className="w-full">
        <InputField
          type="email"
          placeholder="Commander Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          autoComplete="email"
          required
        />
        <InputField
          type="password"
          placeholder="Passcode"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          autoComplete="current-password"
          required
        />
        {error && <p className="text-red-500 text-xs mb-3 text-center">{error}</p>}
        <MagmaButton type="submit" disabled={busy} className={busy ? "opacity-70" : ""}>
          {busy ? "Linking..." : "Initialize Link"}
        </MagmaButton>
      </form>
      <MagmaButton secondary type="button" onClick={handleRegister} className={busy ? "opacity-70" : ""}>
        Create New Signal
      </MagmaButton>
    </MagmaCard>
  );
}
