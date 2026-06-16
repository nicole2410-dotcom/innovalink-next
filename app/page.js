"use client";

import { useRef, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import QuickViewModal from "@/components/QuickViewModal";
import AuthModal from "@/components/AuthModal";
import ChatWidget from "@/components/ChatWidget";
import CompareDrawer from "@/components/CompareDrawer";
import CountdownTimer from "@/components/CountdownTimer";
import Toast from "@/components/Toast";

function FloatingOrbs() {
  const ref = useRef(null);
  useEffect(() => {
    const orbs = ref.current?.children;
    if (!orbs) return;
    let frame;
    const animate = () => { for (let i = 0; i < orbs.length; i++) { const t = Date.now() / 3000 + i * 2; orbs[i].style.transform = `translate(${Math.sin(t) * 20}px, ${Math.cos(t * 0.7) * 15}px)`; } frame = requestAnimationFrame(animate); };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-vino/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-dorado/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vino/10 rounded-full blur-[150px]" />
    </div>
  );
}

export default function HomePage() {
  const { filteredProducts, flashSales, categories, brands, loading, appReady, activeCategory, setActiveCategory, priceRange, setPriceRange, activeBrand, setActiveBrand, searchTerm, recentlyViewed, products, setSearchTerm, sortBy, setSortBy } = useStore();
  const recentProducts = products.filter((p) => recentlyViewed.includes(p.id)).slice(0, 6);
  const brandList = brands.filter((b) => b !== "Todas");

  return (
    <>
      <LoadingScreen />
      <Header /><CartSidebar /><QuickViewModal /><AuthModal /><ChatWidget /><CompareDrawer /><Toast />
      <main className={`flex-1 transition-all duration-700 ${appReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <FloatingOrbs />
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dorado/10 border border-dorado/20 text-dorado text-xs font-medium mb-6 animate-fade-in-up"><span className="w-2 h-2 bg-dorado rounded-full animate-pulse" />Nueva colección 2026</div>
            <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 leading-[1.1]">Tecnología que <span className="bg-gradient-to-r from-dorado via-dorado to-dorado-dark bg-clip-text text-transparent">transforma</span></h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">Descubre los mejores productos de tecnología con los precios más competitivos del mercado.</p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <a href="#productos" className="px-8 py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold hover:from-dorado-dark hover:to-dorado transition-all duration-300 shadow-lg shadow-dorado/20">Explorar productos</a>
              <a href="/contacto" className="px-8 py-3 rounded-xl glass text-white font-medium hover:bg-white/10 transition-all duration-300">Contacto</a>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <div className="glass-card trust-bar py-4">
            {[
              { icon: "fa-truck-fast", title: "Envío Rápido", desc: "Venezuela" },
              { icon: "fa-shield-halved", title: "Pago Seguro", desc: "100% seguro" },
              { icon: "fa-percent", title: "Descuentos", desc: "Online" },
              { icon: "fa-headset", title: "Soporte 24/7", desc: "Asesoría" },
              { icon: "fa-star", title: "Seleccionados", desc: "Garantía" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="trust-item">
                <i className={`fas ${icon}`} />
                <h4>{title}</h4>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Flash Sales */}
        {flashSales.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-12">
            <div className="glass-card p-6 bg-gradient-to-r from-vino/10 via-dorado/5 to-vino-light/10 border-vino/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">🔥 Ofertas flash</h2>
                {flashSales[0]?.flashSaleEnd && <CountdownTimer endDate={flashSales[0].flashSaleEnd} />}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {flashSales.map((p) => (
                  <a key={p.id} href={`/producto/${p.id}`} className="glass overflow-hidden rounded-xl group">
                    <img src={normalizeImagePath(p.image)} alt={p.name} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="p-3">
                      <p className="text-xs text-white truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-dorado">{formatCurrency(p.price)}</span>
                        {p.oldPrice && <span className="text-[10px] text-gray-500 line-through">{formatCurrency(p.oldPrice)}</span>}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 pb-12">
            <h2 className="text-lg font-bold text-white mb-4">👁️ Vistos recientemente</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {recentProducts.map((p) => (
                <a key={p.id} href={`/producto/${p.id}`} className="glass rounded-xl overflow-hidden group">
                  <img src={normalizeImagePath(p.image)} alt={p.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-2">
                    <p className="text-[10px] text-white truncate">{p.name}</p>
                    <p className="text-xs text-dorado font-bold">{formatCurrency(p.price)}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Products */}
        <section id="productos" className="max-w-7xl mx-auto px-4 pb-16">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin mb-6 flex-wrap">
              {categories.map((cat) => (
                <button key={cat} onClick={() => { setActiveCategory(cat); setPriceRange([0, 100000]); }} className={`relative px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategory === cat ? "text-black" : "bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"}`}>
                  {activeCategory === cat && <span className="absolute inset-0 rounded-full bg-gradient-to-r from-dorado to-dorado-dark animate-fade-in-up" />}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-6">
            {/* Filters sidebar */}
            <div className="hidden md:block w-56 flex-shrink-0 space-y-5">
              <div className="glass-card p-4">
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Precio</h4>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])} className="w-full px-2 py-1.5 rounded-lg bg-dark-600 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-dorado/50" />
                  <span className="text-gray-500 text-xs">—</span>
                  <input type="number" value={priceRange[1] === 100000 ? "" : priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])} placeholder="Max" className="w-full px-2 py-1.5 rounded-lg bg-dark-600 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-dorado/50 placeholder-gray-600" />
                </div>
              </div>
              {brands.length > 1 && (
                <div className="glass-card p-4">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Marca</h4>
                  <div className="space-y-1">
                    {brands.map((b) => (
                      <button key={b} onClick={() => setActiveBrand(b)} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${activeBrand === b ? "bg-dorado/20 text-dorado" : "text-gray-400 hover:bg-white/5"}`}>{b}</button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => { setActiveCategory("Todos"); setActiveBrand("Todas"); setPriceRange([0, 100000]); setSearchTerm(""); setSortBy("default"); }} className="w-full text-xs text-gray-500 hover:text-dorado transition-colors py-2">Limpiar filtros</button>
            </div>
            {/* Product grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p className="text-sm text-gray-400">{searchTerm ? `${filteredProducts.length} resultados para "${searchTerm}"` : `${filteredProducts.length} productos`}</p>
                <select
                  className="px-4 py-2 rounded-full bg-dark-700 border border-white/10 text-white text-sm focus:outline-none focus:border-dorado/50 cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Ordenar por</option>
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name-asc">Nombre: A-Z</option>
                  <option value="name-desc">Nombre: Z-A</option>
                </select>
              </div>
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="glass-card overflow-hidden animate-pulse"><div className="aspect-square bg-dark-500" /><div className="p-4 space-y-2"><div className="h-3 bg-dark-500 rounded w-1/3" /><div className="h-4 bg-dark-500 rounded w-3/4" /><div className="h-5 bg-dark-500 rounded w-1/2" /></div></div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <p className="text-xl text-gray-500">No encontramos productos</p>
                  <p className="text-sm text-gray-600 mt-1">Intenta con otra búsqueda o categoría</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 stagger-animate">
                  {filteredProducts.map((product, i) => <ProductCard key={product.id} product={product} index={i} />)}
                </div>
              )}
            </div>
          </div>
        </section>
        {/* Brands */}
        {brandList.length > 0 && (
          <section className="brands-section">
            <h3 className="brands-title">Marcas que distribuimos</h3>
            <div className="brands-grid">
              {brandList.map((b) => (
                <span key={b} className="brand-item">{b}</span>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
