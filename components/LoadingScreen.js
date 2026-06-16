"use client";

import { useStore } from "@/context/StoreContext";

export default function LoadingScreen() {
  const { appReady } = useStore();

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] transition-all duration-700 ${
        appReady ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <img
        src="/Images/innovalink - Editado.png"
        alt="InnovaLink"
        className="w-[120px] h-auto mb-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
        onError={(e) => { e.target.style.display = "none"; }}
      />
      <div className="flex gap-1.5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full bg-dorado animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
