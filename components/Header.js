"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { normalizeImagePath, formatCurrency } from "@/lib/helpers";

export default function Header() {
  const {
    searchTerm, setSearchTerm, cartCount, cartOpen, setCartOpen,
    wishlist, products, user, setAuthOpen, theme, setTheme,
  } = useStore();
  const [focused, setFocused] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const ref = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setFocused(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoSrc = theme === "light" ? "/Images/innovalink_claro.png" : "/Images/innovalink - Editado.png";
  const suggestions = searchTerm.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category?.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-3 flex-shrink-0 group">
          <img src={logoSrc} alt="InnovaLink" className="h-[52px] w-auto transition-transform duration-300 group-hover:scale-105" />
        </a>

        <div className="flex-1 max-w-md relative" ref={ref}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Buscar productos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onFocus={() => setFocused(true)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 transition-colors text-sm" />
          {focused && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-dark-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up z-50">
              {suggestions.map((p) => (
                <a key={p.id} href={`/producto/${p.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors" onClick={() => setFocused(false)}>
                  <img src={normalizeImagePath(p.image)} alt="" className="w-10 h-10 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <span className="text-sm text-dorado font-medium">{formatCurrency(p.price)}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group" title={theme === "dark" ? "Modo claro" : "Modo oscuro"}>
            {theme === "dark" ? (
              <svg className="w-5 h-5 text-gray-300 group-hover:text-dorado transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-300 group-hover:text-dorado transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <div className="relative" ref={userRef}>
            <button onClick={() => user ? setUserMenu(!userMenu) : setAuthOpen(true)} className="p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
              <svg className="w-5 h-5 text-gray-300 group-hover:text-dorado transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </button>
            {userMenu && user && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-fade-in-up z-50">
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-sm text-white font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <a href="/cuenta" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">Mi cuenta</a>
                <a href="/wishlist" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">Lista de deseos</a>
                <a href="/comparador" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors">Comparar</a>
              </div>
            )}
          </div>
          <a href="/wishlist" className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
            <svg className="w-5 h-5 text-gray-300 group-hover:text-dorado transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-vino text-[#fff] text-[10px] flex items-center justify-center font-bold">{wishlist.length}</span>}
          </a>
          <button onClick={() => setCartOpen(!cartOpen)} className="relative p-2.5 rounded-xl hover:bg-white/5 transition-colors group">
            <svg className="w-5 h-5 text-gray-300 group-hover:text-dorado transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-dorado text-black text-[10px] flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
