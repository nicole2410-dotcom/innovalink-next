"use client";

import { useEffect, useState } from "react";

export default function FloatingButtons() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <a
        href="https://wa.me/584129580968"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white text-2xl shadow-lg shadow-black/30 hover:scale-105 hover:bg-[#20b859] transition-all duration-300"
        aria-label="WhatsApp"
      >
        <i className="fab fa-whatsapp" />
      </a>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-dark-700 border border-white/10 flex items-center justify-center text-white text-lg cursor-pointer transition-all duration-300 hover:bg-vino hover:border-vino hover:-translate-y-1 hover:shadow-lg hover:shadow-vino/20 ${
          visible ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-5"
        }`}
        aria-label="Volver arriba"
      >
        <i className="fas fa-chevron-up" />
      </button>
    </>
  );
}
