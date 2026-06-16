"use client";

import { useRef, useEffect, useState, useCallback } from "react";
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

function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function RevealSection({ children, className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add("visible");
        observer.unobserve(el);
      }
    }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HomePage() {
  const { filteredProducts, flashSales, categories, brands, loading, appReady, activeCategory, setActiveCategory, priceRange, setPriceRange, activeBrand, setActiveBrand, searchTerm, recentlyViewed, products, setSearchTerm, sortBy, setSortBy } = useStore();
  const recentProducts = products.filter((p) => recentlyViewed.includes(p.id)).slice(0, 6);
  const brandList = brands.filter((b) => b !== "Todas");
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });

  useScrollReveal();

  const handleContact = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <>
      <LoadingScreen />
      <Header /><CartSidebar /><QuickViewModal /><AuthModal /><ChatWidget /><CompareDrawer /><Toast />
      <main className={`flex-1 transition-all duration-700 ${appReady ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        {/* Hero */}
        <section className="relative overflow-hidden py-20 md:py-28 hero-gradient">
          <div className="hero-grid-bg absolute inset-0 opacity-50" />
          <FloatingOrbs />
          <div className="relative max-w-7xl mx-auto px-4 flex items-center gap-8 flex-wrap md:flex-nowrap">
            <div className="flex-1 text-left animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-vino/20 border border-vino/30 text-vino-light text-xs font-medium mb-6 shadow-lg shadow-vino/10">
                <i className="fas fa-bolt text-dorado" /> Dropshipping profesional
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-[1.1]">
                <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">Tu aliado en</span>{" "}
                <span className="bg-gradient-to-r from-vino via-vino-light to-dorado bg-clip-text text-transparent">tecnología</span>
                <br />y seguridad
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed mb-8">Equipos de alta gama con garantía, asesoría especializada y envío directo a Venezuela.</p>
              <div className="flex items-center gap-4 flex-wrap">
                <a href="#productos" className="px-8 py-3 rounded-full bg-gradient-to-r from-vino to-vino-light text-[#fff] font-bold hover:from-vino-light hover:to-vino transition-all duration-300 shadow-lg shadow-vino/20 hover:shadow-vino/40 hover:-translate-y-1 inline-flex items-center gap-2">
                  <i className="fas fa-store" /> Explorar
                </a>
                <a href="#contacto" className="px-8 py-3 rounded-full border-2 border-vino text-vino font-bold hover:bg-vino hover:text-[#fff] transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2">
                  <i className="fas fa-tag" /> Ofertas
                </a>
              </div>
            </div>
            <div className="flex-1 flex justify-center md:justify-end">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&auto=format"
                alt="Tecnología"
                className="w-full max-w-sm rounded-3xl shadow-2xl shadow-vino/10 animate-float"
              />
            </div>
          </div>
        </section>

        {/* Promo Banner */}
        <RevealSection>
          <div className="max-w-7xl mx-auto px-4 pb-8">
            <div className="promo-banner rounded-2xl px-6 py-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-[#fff] font-semibold relative z-10">
                <i className="fas fa-fire text-dorado animate-pulse" />
                Dropshipping directo — Envío gratis a toda Venezuela
              </div>
              <a href="#productos" className="relative z-10 px-5 py-2 rounded-full bg-dorado text-vino-dark font-bold text-sm hover:bg-white hover:scale-105 transition-all duration-300">
                Ver promociones <i className="fas fa-arrow-right ml-1" />
              </a>
            </div>
          </div>
        </RevealSection>

        {/* Trust Bar */}
        <RevealSection>
          <section className="max-w-7xl mx-auto px-4 pb-8">
            <div className="trust-bar gap-3">
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
        </RevealSection>

        {/* Flash Sales */}
        {flashSales.length > 0 && (
          <RevealSection>
            <section className="max-w-7xl mx-auto px-4 pb-12">
              <div className="glass-card p-6 bg-gradient-to-r from-vino/10 via-dorado/5 to-vino-light/10 border-vino/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2"><i className="fas fa-bolt text-dorado" /> Ofertas flash</h2>
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
          </RevealSection>
        )}

        {/* Recently Viewed */}
        {recentProducts.length > 0 && (
          <RevealSection>
            <section className="max-w-7xl mx-auto px-4 pb-12">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><i className="fas fa-clock-rotate text-dorado" /> Vistos recientemente</h2>
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
          </RevealSection>
        )}

        {/* Products */}
        <section id="productos" className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Nuevas Llegadas</h2>
            <button onClick={() => { setActiveCategory("Todos"); setActiveBrand("Todas"); setPriceRange([0, 100000]); setSearchTerm(""); setSortBy("default"); }} className="text-sm text-dorado hover:text-white transition-colors flex items-center gap-1">
              Ver todas <i className="fas fa-arrow-right text-xs" />
            </button>
          </div>
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
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1"><i className="fas fa-filter text-dorado" /> Precio</h4>
                <div className="flex items-center gap-2">
                  <input type="number" value={priceRange[0]} onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])} className="w-full px-2 py-1.5 rounded-lg bg-dark-600 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-dorado/50" />
                  <span className="text-gray-500 text-xs">—</span>
                  <input type="number" value={priceRange[1] === 100000 ? "" : priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 100000])} placeholder="Max" className="w-full px-2 py-1.5 rounded-lg bg-dark-600 border border-white/10 text-white text-xs text-center focus:outline-none focus:border-dorado/50 placeholder-gray-600" />
                </div>
              </div>
              {brands.length > 1 && (
                <div className="glass-card p-4">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3 flex items-center gap-1"><i className="fas fa-tag text-dorado" /> Marca</h4>
                  <div className="space-y-1">
                    {brands.map((b) => (
                      <button key={b} onClick={() => setActiveBrand(b)} className={`block w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all ${activeBrand === b ? "bg-dorado/20 text-dorado" : "text-gray-400 hover:bg-white/5"}`}>{b}</button>
                    ))}
                  </div>
                </div>
              )}
              <button onClick={() => { setActiveCategory("Todos"); setActiveBrand("Todas"); setPriceRange([0, 100000]); setSearchTerm(""); setSortBy("default"); }} className="w-full text-xs text-gray-500 hover:text-dorado transition-colors py-2 flex items-center justify-center gap-1"><i className="fas fa-rotate-left" /> Limpiar filtros</button>
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
          <RevealSection>
            <section className="brands-section max-w-7xl mx-auto px-4">
              <h3 className="brands-title">Marcas que distribuimos</h3>
              <div className="brands-grid">
                {brandList.map((b) => (
                  <span key={b} className="brand-item">{b}</span>
                ))}
              </div>
            </section>
          </RevealSection>
        )}

        {/* Stats */}
        <RevealSection>
          <section className="stats-section max-w-7xl mx-auto px-4">
            <div className="stats-grid">
              <div className="stat-box"><h3><AnimatedCounter end={1500} suffix="+" /></h3><p>Clientes</p></div>
              <div className="stat-box"><h3><AnimatedCounter end={3000} suffix="+" /></h3><p>Envíos</p></div>
              <div className="stat-box"><h3>100%</h3><p>Garantía</p></div>
            </div>
          </section>
        </RevealSection>

        {/* Contact */}
        <RevealSection>
          <section id="contacto" className="contact-card glass-card p-8 max-w-xl mx-4 md:mx-auto mb-12">
            <h3><i className="fas fa-headset text-dorado mr-2" />¿Necesitas asesoría?</h3>
            <p>Déjanos tus datos y te contactaremos</p>
            <form className="contact-form space-y-4" onSubmit={handleContact}>
              <div className="flex gap-4 flex-wrap">
                <input type="text" placeholder="Nombre" value={contactForm.name} onChange={(e) => setContactForm((f) => ({ ...f, name: e.target.value }))} className="flex-1" />
                <input type="email" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm((f) => ({ ...f, email: e.target.value }))} className="flex-1" />
              </div>
              <textarea rows={3} placeholder="Cuéntanos qué necesitas..." value={contactForm.message} onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))} />
              <button type="submit">Enviar mensaje <i className="fas fa-paper-plane ml-2" /></button>
            </form>
          </section>
        </RevealSection>
      </main>
      <Footer />
    </>
  );
}
