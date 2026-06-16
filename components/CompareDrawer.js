"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";

export default function CompareDrawer() {
  const { compare, products, toggleCompare } = useStore();
  const [open, setOpen] = useState(false);
  const compareProducts = products.filter((p) => compare.includes(p.id));

  if (compare.length === 0) return null;

  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-full bg-gradient-to-r from-vino to-vino-light text-[#fff] font-medium shadow-2xl hover:from-vino-light hover:to-vino transition-all duration-300 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Comparar ({compare.length})
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 z-50 w-[90vw] max-w-4xl glass-card p-6 animate-fade-in-up max-h-[70vh] overflow-y-auto scrollbar-thin">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Comparar productos</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(compareProducts.length, 1)}, 1fr)` }}>
            {compareProducts.map((p) => (
              <div key={p.id} className="text-center space-y-2">
                <button onClick={() => toggleCompare(p.id)} className="text-xs text-red-400 hover:underline mb-1">Quitar</button>
                <img src={p.image ? `/${p.image}` : "/Images/placeholder.webp"} alt={p.name} className="w-full h-32 object-contain rounded-xl bg-white/5" />
                <p className="text-sm font-medium text-white">{p.name}</p>
                <p className="text-dorado font-bold">${p.price}</p>
                {p.oldPrice && <p className="text-xs text-gray-500 line-through">${p.oldPrice}</p>}
                <p className="text-xs text-gray-400">{p.category}</p>
                <a href={`/producto/${p.id}`} className="inline-block mt-2 text-xs text-dorado hover:underline">Ver detalle</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
