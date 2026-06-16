"use client";

import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";

export default function QuickViewModal() {
  const { quickView, setQuickView } = useStore();
  if (!quickView) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={() => setQuickView(null)}
    >
      <div
        className="glass-card max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={normalizeImagePath(quickView.image) || "/Images/placeholder.webp"}
            alt={quickView.name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={() => setQuickView(null)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-[#fff] flex items-center justify-center hover:bg-vino transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          {quickView.category && (
            <span className="text-xs uppercase tracking-widest text-dorado/70">{quickView.category}</span>
          )}
          <h3 className="text-xl font-bold text-white mt-1 mb-2">{quickView.name}</h3>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-dorado">{formatCurrency(quickView.price)}</span>
            {quickView.oldPrice && (
              <span className="text-sm text-gray-500 line-through">{formatCurrency(quickView.oldPrice)}</span>
            )}
          </div>
          {quickView.description && (
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{quickView.description}</p>
          )}
          <button
            onClick={() => { window.location.href = `/producto/${quickView.id}`; }}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-vino to-vino-light text-[#fff] font-semibold hover:from-vino-light hover:to-vino transition-all duration-300"
          >
            Ver detalle completo
          </button>
        </div>
      </div>
    </div>
  );
}
