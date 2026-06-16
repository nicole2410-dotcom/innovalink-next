"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath } from "@/lib/helpers";

export default function CartSidebar() {
  const { cart, cartOpen, setCartOpen, cartTotal, cartCount, removeFromCart, updateCartQuantity, placeOrder, showToast, applyCoupon } = useStore();
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [shipping, setShipping] = useState({ name: "", email: "", phone: "", address: "", city: "", notes: "" });

  const discount = coupon ? coupon.type === "%" ? cartTotal * (coupon.discount / 100) : coupon.discount : 0;
  const finalTotal = Math.max(0, cartTotal - discount);

  const handleApplyCoupon = () => {
    const c = applyCoupon(couponCode);
    if (c) { setCoupon(c); showToast(`Cupón aplicado: ${c.discount}${c.type === "%" ? "%" : ""} de descuento`); }
    else showToast("Cupón inválido o expirado", "error");
  };

  const handleField = (field) => (e) => setShipping((s) => ({ ...s, [field]: e.target.value }));
  const handlePlaceOrder = () => {
    if (!shipping.name || !shipping.email || !shipping.address) { showToast("Completa los campos obligatorios", "error"); return; }
    placeOrder(cart, finalTotal, shipping, coupon?.code);
    setCheckoutStep("confirmed");
    setCoupon(null);
    showToast("¡Pedido realizado con éxito!");
  };

  return (
    <>
      {cartOpen && <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm" onClick={() => { setCartOpen(false); setCheckoutStep("cart"); }} />}
      <div className={`fixed top-0 right-0 z-[80] h-full w-full sm:w-[420px] bg-dark-800 border-l border-white/10 transform transition-transform duration-300 flex flex-col ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-dorado" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
            Carrito ({cartCount})
          </h2>
          <button onClick={() => { setCartOpen(false); setCheckoutStep("cart"); }} className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
          {checkoutStep === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  <p className="text-lg">Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.key} className="glass rounded-xl p-3 flex gap-3">
                      <img src={normalizeImagePath(item.image)} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-white truncate">{item.name}</h4>
                        {item.color && <p className="text-xs text-gray-400">{item.color}{item.capacidad ? ` - ${item.capacidad}` : ""}</p>}
                        <p className="text-dorado font-bold mt-1">{formatCurrency(item.price)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateCartQuantity(item.key, -1)} className="w-7 h-7 rounded-full bg-dark-500 text-white flex items-center justify-center hover:bg-vino transition-colors text-sm">−</button>
                          <span className="text-sm font-medium text-white w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateCartQuantity(item.key, 1)} className="w-7 h-7 rounded-full bg-dark-500 text-white flex items-center justify-center hover:bg-vino transition-colors text-sm">+</button>
                          <button onClick={() => removeFromCart(item.key)} className="ml-auto text-gray-500 hover:text-red-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Cupón de descuento" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 px-3 py-2 rounded-xl bg-dark-600 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
                    <button onClick={handleApplyCoupon} className="px-4 py-2 rounded-xl bg-dorado/20 text-dorado text-sm font-medium hover:bg-dorado hover:text-black transition-all">Aplicar</button>
                  </div>
                  {coupon && <p className="text-xs text-dorado">Cupón aplicado: {coupon.discount}{coupon.type === "%" ? "%" : "$"} de descuento</p>}
                </div>
              )}
            </>
          )}
          {checkoutStep === "shipping" && (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Información de envío</h3>
              {[{ label: "Nombre completo *", field: "name", type: "text" }, { label: "Email *", field: "email", type: "email" }, { label: "Teléfono", field: "phone", type: "tel" }, { label: "Dirección *", field: "address", type: "text" }, { label: "Ciudad", field: "city", type: "text" }].map(({ label, field, type }) => (
                <input key={field} type={type} placeholder={label} value={shipping[field]} onChange={handleField(field)} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
              ))}
              <textarea placeholder="Notas del pedido" value={shipping.notes} onChange={handleField("notes")} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 resize-none h-20" />
            </div>
          )}
          {checkoutStep === "confirmed" && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-4"><svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
              <h3 className="text-xl font-bold text-white mb-2">¡Pedido confirmado!</h3>
              <p className="text-gray-400">Gracias por tu compra. Te contactaremos pronto.</p>
            </div>
          )}
        </div>
        <div className="border-t border-white/10 p-4 space-y-3">
          {checkoutStep === "cart" && cart.length > 0 && (
            <>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="text-white font-bold">{formatCurrency(cartTotal)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm"><span className="text-dorado">Descuento</span><span className="text-dorado">-{formatCurrency(discount)}</span></div>}
              <button onClick={() => setCheckoutStep("shipping")} className="w-full py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold hover:from-dorado-dark hover:to-dorado transition-all duration-300">Proceder al pago</button>
            </>
          )}
          {checkoutStep === "shipping" && (
            <>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Total</span><span className="text-dorado font-bold text-lg">{formatCurrency(finalTotal)}</span></div>
              {discount > 0 && <p className="text-xs text-dorado">Cupón aplicado</p>}
              <button onClick={handlePlaceOrder} className="w-full py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold hover:from-dorado-dark hover:to-dorado transition-all duration-300">Confirmar pedido</button>
              <button onClick={() => setCheckoutStep("cart")} className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">← Volver al carrito</button>
            </>
          )}
          {checkoutStep === "confirmed" && (
            <button onClick={() => { setCartOpen(false); setCheckoutStep("cart"); }} className="w-full py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all duration-300">Seguir comprando</button>
          )}
        </div>
      </div>
    </>
  );
}
