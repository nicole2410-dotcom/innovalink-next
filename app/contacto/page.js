"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import { useStore } from "@/context/StoreContext";

export default function ContactoPage() {
  const { showToast } = useStore();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    showToast("Mensaje enviado. Te contactaremos pronto.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Header /><Toast />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Contacto</h1>
        <p className="text-gray-400 mb-8">Estamos aquí para ayudarte</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nombre *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
              <input type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
              <input type="text" placeholder="Asunto" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
              <textarea placeholder="Mensaje *" value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 resize-none h-32" />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold">Enviar mensaje</button>
            </form>
          </div>
          <div className="space-y-6">
            {[
              { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", label: "Email", value: "contacto@innovalink.mx" },
              { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", label: "Teléfono", value: "+52 (555) 123-4567" },
              { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", label: "Dirección", value: "Av. Tecnología 123, CDMX, México" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="glass-card p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-dorado/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-dorado" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-white">{value}</p>
                </div>
              </div>
            ))}
            <a href="https://wa.me/525551234567" target="_blank" className="flex items-center gap-3 p-4 rounded-xl bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 transition-colors">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white">WhatsApp</p>
                <p className="text-xs text-green-400">Chatea con nosotros</p>
              </div>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
