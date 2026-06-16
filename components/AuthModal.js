"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";

export default function AuthModal() {
  const { authOpen, setAuthOpen, login, register, showToast } = useStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  if (!authOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Completa todos los campos"); return; }
    if (mode === "register" && !form.name) { setError("Nombre requerido"); return; }
    const fn = mode === "login" ? login : register;
    const args = mode === "login" ? [form.email, form.password] : [form.name, form.email, form.password];
    const result = fn(...args);
    if (result === "ok") {
      setAuthOpen(false);
      showToast(mode === "login" ? "Inicio de sesión exitoso" : "Cuenta creada exitosamente");
    } else {
      setError(result);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setAuthOpen(false)}>
      <div className="glass-card p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</h2>
          <button onClick={() => setAuthOpen(false)} className="text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input type="text" placeholder="Nombre completo" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
          <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold hover:from-dorado-dark hover:to-dorado transition-all duration-300">
            {mode === "login" ? "Entrar" : "Registrarse"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="text-dorado hover:underline">{mode === "login" ? "Regístrate" : "Inicia sesión"}</button>
        </p>
      </div>
    </div>
  );
}
