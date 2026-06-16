"use client";

import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export default function WishlistPage() {
  const { products, wishlist, toggleWishlist, addToCart } = useStore();
  const wishProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <>
      <Header /><Toast />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">Lista de deseos</h1>
        <p className="text-sm text-gray-400 mb-8">{wishProducts.length} productos guardados</p>
        {wishProducts.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-xl text-gray-500">Tu lista está vacía</p>
            <a href="/" className="inline-block mt-4 text-dorado hover:underline">Explorar productos</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishProducts.map((p) => (
              <div key={p.id} className="glass-card overflow-hidden group">
                <div className="aspect-square overflow-hidden relative">
                  <img src={normalizeImagePath(p.image)} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button onClick={() => toggleWishlist(p.id)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dorado text-black flex items-center justify-center">
                    <svg className="w-4 h-4" fill="currentColor" stroke="none" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">{p.category}</p>
                  <h3 className="text-sm font-medium text-white truncate">{p.name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-dorado font-bold">{formatCurrency(p.price)}</span>
                    <button onClick={() => addToCart(p, 0, 1)} className="text-xs px-3 py-1.5 rounded-lg bg-dorado/20 text-dorado hover:bg-dorado hover:text-black transition-all">Carrito</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
