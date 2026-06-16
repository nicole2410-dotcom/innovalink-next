"use client";

import { useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, getProductImage } from "@/lib/helpers";

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickView, compare, toggleCompare, isInCompare } = useStore();
  const cardRef = useRef(null);
  const inWish = isInWishlist(product.id);
  const inCmp = isInCompare(product.id);
  const imgSrc = getProductImage(product);
  const isFlash = product.flashSaleEnd && new Date(product.flashSaleEnd) > new Date();

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.transform = `perspective(800px) rotateX(${(y - 0.5) * -12}deg) rotateY(${(x - 0.5) * 12}deg) translateY(-6px)`;
  };
  const handleMouseLeave = () => { if (cardRef.current) cardRef.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)"; };

  const handleAdd = (e) => { e.stopPropagation(); e.preventDefault(); addToCart(product, 0, 1); };

  return (
    <div ref={cardRef} className="glass-card group cursor-pointer overflow-hidden flex flex-col transition-all duration-200 ease-out" style={{ animationDelay: `${index * 0.05}s`, animationFillMode: "both" }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={() => window.location.href = `/producto/${product.id}`}>
      <div className="relative overflow-hidden aspect-square">
        <img src={imgSrc} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isFlash && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-dorado to-vino text-[#fff] animate-pulse">🔥 FLASH</span>}
          {product.oldPrice && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-vino text-[#fff]">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span>}
          {product.badge && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-dorado text-black">{product.badge}</span>}
        </div>
        <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${inWish ? "bg-dorado text-black scale-110" : "bg-black/50 text-white hover:bg-dorado hover:text-black hover:scale-110"}`}>
          <svg className="w-3.5 h-3.5" fill={inWish ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); setQuickView(product); }} className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-dorado/90 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-dorado z-10 hover:scale-110">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        </button>
        <button onClick={(e) => { e.stopPropagation(); toggleCompare(product.id); }} className={`absolute bottom-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all z-10 ${inCmp ? "bg-dorado text-black" : "bg-black/50 text-white hover:bg-dorado/80 hover:text-black opacity-0 group-hover:opacity-100"}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
        </button>
      </div>
      <div className="p-3 flex flex-col flex-1">
        {product.category && <span className="text-[10px] uppercase tracking-widest text-dorado/70 mb-0.5">{product.category}</span>}
        <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="text-base font-bold text-dorado">{formatCurrency(product.price)}</span>
            {product.oldPrice && <span className="text-[10px] text-gray-500 line-through ml-1.5">{formatCurrency(product.oldPrice)}</span>}
          </div>
          <button onClick={handleAdd} className="w-8 h-8 rounded-full bg-dorado text-black flex items-center justify-center hover:bg-dorado-dark transition-all duration-300 hover:scale-110 active:scale-95 flex-shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
