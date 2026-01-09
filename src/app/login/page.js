// app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MagmaCard, MagmaButton, InputField } from "@/components/MagmaUI";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginFirebase, loginAuth0 } = useAuth();
  const router = useRouter();

  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await loginFirebase(email, password);
      router.push("/"); // Redirect to landing
    } catch (err) {
      setError("Access denied: Invalid credentials.");
    }
  };

  const handleAuth0Login = async () => {
    try {
      await loginAuth0();
      router.push("/");
    } catch (err) {
      setError("Auth0 Connection failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
      <div className="max-w-md w-full px-6">
        <h1 className="text-4xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600 tracking-widest uppercase">
          World of Tethys
        </h1>
        
        <MagmaCard>
          <h2 className="text-xl font-semibold mb-6 text-slate-300">Identify Yourself</h2>
          
          <form onSubmit={handleFirebaseLogin} className="w-full">
            <InputField 
              type="email" 
              placeholder="Commander Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <InputField 
              type="password" 
              placeholder="Passcode" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
            
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
            
            <MagmaButton>Initialize Link</MagmaButton>
          </form>

          <div className="w-full border-t border-slate-800 my-6 relative">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950 px-2 text-xs text-slate-500">
              EMERGENCY PROTOCOL
            </span>
          </div>

          <MagmaButton secondary onClick={handleAuth0Login}>
             Connect via Auth0 Proxy
          </MagmaButton>
        </MagmaCard>
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
