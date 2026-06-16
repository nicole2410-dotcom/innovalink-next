"use client";

import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ComparadorPage() {
  const { products, compare, toggleCompare } = useStore();
  const compareProducts = products.filter((p) => compare.includes(p.id));

  return (
    <>
      <Header />
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Comparar productos</h1>
        {compareProducts.length < 2 ? (
          <div className="text-center py-20">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-gray-500">Selecciona al menos 2 productos para comparar</p>
            <a href="/" className="inline-block mt-4 text-dorado hover:underline">Ir a la tienda</a>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-thin">
            <div className="grid gap-4 min-w-[600px]" style={{ gridTemplateColumns: `200px repeat(${compareProducts.length}, 1fr)` }}>
              <div />
              {compareProducts.map((p) => (
                <div key={p.id} className="text-center">
                  <button onClick={() => toggleCompare(p.id)} className="text-xs text-red-400 hover:underline mb-2">Quitar</button>
                  <img src={normalizeImagePath(p.image)} alt={p.name} className="w-full h-40 object-contain rounded-xl bg-white/5 mb-2" />
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <a href={`/producto/${p.id}`} className="text-xs text-dorado hover:underline">Ver detalle</a>
                </div>
              ))}
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium py-2">Precio</div>
              {compareProducts.map((p) => (
                <div key={p.id} className="text-center py-2">
                  <span className="text-lg font-bold text-dorado">{formatCurrency(p.price)}</span>
                  {p.oldPrice && <span className="text-xs text-gray-500 line-through ml-2">{formatCurrency(p.oldPrice)}</span>}
                </div>
              ))}
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium py-2">Categoría</div>
              {compareProducts.map((p) => <div key={p.id} className="text-center text-sm text-gray-300 py-2">{p.category}</div>)}
              <div className="text-xs text-gray-400 uppercase tracking-wider font-medium py-2">Descripción</div>
              {compareProducts.map((p) => <div key={p.id} className="text-center text-xs text-gray-400 py-2 px-2">{p.description || "-"}</div>)}
              {compareProducts[0]?.variants?.length > 0 && (
                <>
                  <div className="text-xs text-gray-400 uppercase tracking-wider font-medium py-2">Variantes</div>
                  {compareProducts.map((p) => (
                    <div key={p.id} className="text-center py-2">
                      {p.variants?.map((v, i) => (
                        <span key={i} className="inline-block text-xs bg-white/5 rounded px-2 py-0.5 m-0.5 text-gray-300">{v.color || v.capacidad}</span>
                      )) || <span className="text-xs text-gray-500">-</span>}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
