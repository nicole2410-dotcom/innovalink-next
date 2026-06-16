"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const tickets = [
  { id: "TKT-001", subject: "Problema con mi pedido", status: "Abierto", date: "12 Jun 2026" },
  { id: "TKT-002", subject: "Cambio de producto", status: "Cerrado", date: "8 Jun 2026" },
];

export default function SoportePage() {
  const [view, setView] = useState("tickets");

  return (
    <>
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Soporte</h1>
        <p className="text-gray-400 mb-8">Centro de ayuda y tickets de soporte</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setView("tickets")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "tickets" ? "bg-dorado text-black" : "bg-white/5 text-gray-400"}`}>Mis tickets</button>
              <button onClick={() => setView("new")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${view === "new" ? "bg-dorado text-black" : "bg-white/5 text-gray-400"}`}>Nuevo ticket</button>
            </div>
            {view === "tickets" && (
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div key={t.id} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{t.subject}</p>
                      <p className="text-xs text-gray-400">{t.id} · {t.date}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${t.status === "Abierto" ? "bg-dorado/20 text-dorado" : "bg-gray-500/20 text-gray-400"}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            )}
            {view === "new" && (
              <div className="glass-card p-6 space-y-4">
                <input type="text" placeholder="Asunto" className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
                <select className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white focus:outline-none focus:border-dorado/50">
                  <option>Problema con pedido</option>
                  <option>Devolución</option>
                  <option>Garantía</option>
                  <option>Otro</option>
                </select>
                <textarea placeholder="Describe tu problema..." className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 resize-none h-32" />
                <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold">Enviar ticket</button>
              </div>
            )}
          </div>
          <div className="glass-card p-6 h-fit space-y-4">
            <h3 className="text-sm font-semibold text-white">Recursos</h3>
            {[
              { label: "Centro de ayuda", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
              { label: "FAQ", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
              { label: "WhatsApp", icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" },
              { label: "Email", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            ].map(({ label, icon }) => (
              <a key={label} href={label === "FAQ" ? "/faq" : label === "WhatsApp" ? "https://wa.me/525551234567" : "#"} target={label === "WhatsApp" ? "_blank" : ""} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <svg className="w-4 h-4 text-dorado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
                {label}
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
