"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import AuthModal from "@/components/AuthModal";
import ChatWidget from "@/components/ChatWidget";
import Toast from "@/components/Toast";

function Stars({ rating, size = "sm", interactive = false, onChange }) {
  const [hover, setHover] = useState(0);
  const s = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" disabled={!interactive} onClick={() => interactive && onChange?.(star)} onMouseEnter={() => interactive && setHover(star)} onMouseLeave={() => interactive && setHover(0)} className={`${s} ${interactive ? "cursor-pointer" : "cursor-default"} ${star <= (hover || rating) ? "text-dorado" : "text-gray-600"}`}>
          <svg className="w-full h-full" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
        </button>
      ))}
    </div>
  );
}

export default function ProductoPage() {
  const { id } = useParams();
  const { products, addToCart, toggleWishlist, isInWishlist, addRecentlyViewed, user, setAuthOpen, reviews, addReview, getProductReviews, getProductRating } = useStore();
  const [product, setProduct] = useState(null);
  const [selVariant, setSelVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [selImg, setSelImg] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 0, text: "" });

  useEffect(() => {
    const p = products.find((prod) => String(prod.id) === String(id));
    if (p) { setProduct(p); addRecentlyViewed(p.id); }
  }, [products, id, addRecentlyViewed]);

  if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><p className="text-gray-500">Cargando producto...</p></div>;

  const hasVariants = product.variants?.length > 0;
  const selectedVariant = hasVariants ? product.variants[selVariant] : null;
  const imgSrc = normalizeImagePath(hasVariants ? product.variants[selVariant]?.image : product.image) || "/Images/placeholder.webp";
  const price = selectedVariant?.price || product.price;
  const oldPrice = selectedVariant?.oldPrice || product.oldPrice;
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const inWish = isInWishlist(product.id);
  const avgRating = getProductRating(product.id);
  const productReviews = getProductReviews(product.id);
  const stock = selectedVariant?.stock ?? product.stock;
  const stockStatus = stock === 0 ? "out-of-stock" : stock <= 5 ? "low-stock" : "in-stock";
  const stockLabel = stock === 0 ? "Agotado" : stock <= 5 ? `Solo quedan ${stock}` : "En stock";
  const uniqueColors = hasVariants ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))] : [];
  const uniqueCapacities = hasVariants ? [...new Set(product.variants.map((v) => v.capacidad).filter(Boolean))] : [];

  // Gallery images
  const allImages = [];
  if (product.image) allImages.push(product.image);
  product.variants?.forEach((v) => { if (v.image && !allImages.includes(v.image)) allImages.push(v.image); });
  if (product.images) product.images.forEach((img) => { if (!allImages.includes(img)) allImages.push(img); });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) { setAuthOpen(true); return; }
    if (!reviewForm.rating) return;
    addReview(product.id, { userId: user.id, userName: user.name, rating: reviewForm.rating, text: reviewForm.text });
    setReviewForm({ rating: 0, text: "" });
  };

  return (
    <>
      <Header /><CartSidebar /><AuthModal /><ChatWidget /><Toast />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-3">
            <div className="glass-card overflow-hidden">
              <img src={allImages[selImg] ? normalizeImagePath(allImages[selImg]) : imgSrc} alt={product.name} className="w-full h-80 md:h-96 object-contain p-4" />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-thin">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelImg(i)} className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${selImg === i ? "border-dorado" : "border-transparent opacity-60 hover:opacity-100"}`}>
                    <img src={normalizeImagePath(img)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-5">
            {product.category && <span className="text-xs uppercase tracking-widest text-dorado/70">{product.category}</span>}
            <h1 className="text-2xl md:text-3xl font-bold text-white">{product.name}</h1>
            {/* Rating */}
            {avgRating && (
              <div className="flex items-center gap-2">
                <Stars rating={Math.round(avgRating)} />
                <span className="text-xs text-gray-400">{avgRating.toFixed(1)} ({productReviews.length} reseñas)</span>
              </div>
            )}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-dorado">{formatCurrency(price)}</span>
              {oldPrice && <span className="text-lg text-gray-500 line-through">{formatCurrency(oldPrice)}</span>}
            </div>
            {stock !== undefined && (
              <div className={`stock-badge ${stockStatus}`}>
                <i className={`fas ${stock === 0 ? "fa-times-circle" : stock <= 5 ? "fa-exclamation-circle" : "fa-check-circle"}`} />
                {stockLabel}
              </div>
            )}
            {product.description && <p className="text-gray-400 leading-relaxed">{product.description}</p>}
            {/* Color swatches */}
            {uniqueColors.length > 0 && (
              <div className="selector-group">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-palette text-dorado text-xs" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Color</span>
                </div>
                <div className="swatch-container">
                  {uniqueColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const idx = product.variants.findIndex((v) => v.color === color);
                        if (idx >= 0) setSelVariant(idx);
                      }}
                      className={`swatch ${selectedVariant?.color === color ? "active" : ""}`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}
            {/* Capacity pills */}
            {uniqueCapacities.length > 0 && (
              <div className="selector-group">
                <div className="flex items-center gap-2 mb-2">
                  <i className="fas fa-microchip text-dorado text-xs" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Capacidad</span>
                </div>
                <div className="capacity-pills">
                  {uniqueCapacities.map((cap) => (
                    <button
                      key={cap}
                      onClick={() => {
                        const idx = product.variants.findIndex((v) => v.capacidad === cap);
                        if (idx >= 0) setSelVariant(idx);
                      }}
                      className={`capacity-pill ${selectedVariant?.capacidad === cap ? "active" : ""}`}
                    >
                      {cap}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white/5 rounded-xl border border-white/10">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-l-xl">−</button>
                  <span className="w-10 text-center text-white font-medium">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-r-xl">+</button>
                </div>
                <button onClick={() => { addToCart(product, selVariant, qty); setQty(1); }} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold hover:from-dorado-dark hover:to-dorado transition-all duration-300">Agregar al carrito</button>
                <button onClick={() => toggleWishlist(product.id)} className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${inWish ? "bg-vino/20 border-vino text-vino-light" : "bg-white/5 border-white/10 text-gray-400 hover:border-dorado/50"}`}>
                  <svg className="w-5 h-5" fill={inWish ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </button>
              </div>
              <button onClick={() => { addToCart(product, selVariant, qty); setQty(1); /* TODO: redirect to checkout */ }} className="w-full py-3 rounded-xl bg-gradient-to-r from-vino to-vino-light text-white font-bold hover:from-vino-light hover:to-vino transition-all duration-300">
                <i className="fas fa-bolt mr-2" />Comprar ahora
              </button>
            </div>
            {/* Specifications */}
            {product.specs && (
              <div className="specs-section">
                <h4><i className="fas fa-list-check mr-2 text-dorado" />Especificaciones técnicas</h4>
                {Array.isArray(product.specs) ? (
                  <ul className="specs-list">
                    {product.specs.map((spec, i) => (
                      <li key={i}><strong>{spec.label || spec.name}:</strong> {spec.value}</li>
                    ))}
                  </ul>
                ) : (
                  <ul className="specs-list">
                    {product.specs.split(",").map((s, i) => (
                      <li key={i}>{s.trim()}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            {product.features?.length > 0 && !product.specs && (
              <div className="pt-4 border-t border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Características</h4>
                <ul className="space-y-2">
                  {product.features.map((f, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-400"><svg className="w-4 h-4 mt-0.5 text-dorado flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{f}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Reseñas {avgRating && <span className="text-dorado">({avgRating.toFixed(1)})</span>}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {productReviews.length === 0 ? <p className="text-sm text-gray-500">No hay reseñas aún. Sé el primero en opinar.</p> : productReviews.map((r) => (
                <div key={r.id} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-dorado/20 flex items-center justify-center text-xs font-bold text-dorado">{r.userName?.[0]}</div>
                      <span className="text-sm text-white font-medium">{r.userName}</span>
                    </div>
                    <Stars rating={r.rating} />
                  </div>
                  <p className="text-sm text-gray-400">{r.text}</p>
                  <p className="text-[10px] text-gray-600 mt-2">{new Date(r.date).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
            <div className="glass-card p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Escribe una reseña</h3>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 mb-2">Tu calificación</p>
                  <Stars rating={reviewForm.rating} size="lg" interactive onChange={(val) => setReviewForm((f) => ({ ...f, rating: val }))} />
                </div>
                <textarea placeholder="Comparte tu experiencia con este producto..." value={reviewForm.text} onChange={(e) => setReviewForm((f) => ({ ...f, text: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 resize-none h-28" />
                <button type="submit" className="px-6 py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold hover:from-dorado-dark hover:to-dorado transition-all">{user ? "Enviar reseña" : "Inicia sesión para reseñar"}</button>
              </form>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-white mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rp) => (
                <a key={rp.id} href={`/producto/${rp.id}`} className="glass-card overflow-hidden group">
                  <div className="aspect-square overflow-hidden"><img src={normalizeImagePath(rp.image)} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" /></div>
                  <div className="p-3"><p className="text-sm text-white font-medium truncate">{rp.name}</p><p className="text-dorado font-bold mt-1">{formatCurrency(rp.price)}</p></div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
