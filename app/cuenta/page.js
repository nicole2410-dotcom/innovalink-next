"use client";

import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthModal from "@/components/AuthModal";
import Toast from "@/components/Toast";

export default function CuentaPage() {
  const { user, logout, setAuthOpen, orders } = useStore();

  if (!user) {
    return (
      <>
        <Header /><Toast />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center glass-card p-8 max-w-md">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h1 className="text-xl font-bold text-white mb-2">Inicia sesión</h1>
            <p className="text-sm text-gray-400 mb-4">Accede a tu cuenta para ver tus pedidos</p>
            <button onClick={() => setAuthOpen(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold">Iniciar sesión</button>
          </div>
        </main>
        <Footer /><AuthModal />
      </>
    );
  }

  const userOrders = orders.filter((o) => o.shipping?.email === user.email);

  return (
    <>
      <Header /><Toast />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Hola, {user.name}</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
          <button onClick={logout} className="px-4 py-2 rounded-xl bg-white/5 text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-colors text-sm">Cerrar sesión</button>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Mis pedidos</h2>
          {userOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No tienes pedidos aún</p>
          ) : (
            <div className="space-y-3">
              {userOrders.map((order) => (
                <div key={order.id} className="p-4 rounded-xl bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{order.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${order.status === "Pendiente" ? "bg-dorado/20 text-dorado" : order.status === "Entregado" ? "bg-vino/20 text-vino-light" : "bg-dorado-dark/20 text-dorado-dark"}`}>{order.status}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{order.date}</p>
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <img src={normalizeImagePath(item.image)} alt="" className="w-8 h-8 object-cover rounded" />
                      <span className="text-xs text-gray-300 flex-1">{item.name} × {item.quantity}</span>
                      <span className="text-xs text-dorado">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <p className="text-right text-sm font-bold text-dorado mt-2">Total: {formatCurrency(order.total)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer /><AuthModal />
    </>
  );
}
