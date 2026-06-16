"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { formatCurrency, normalizeImagePath, storageGet, storageSet } from "@/lib/helpers";

const ADMIN_PASS = "innovalink2026";
const orderStatuses = ["Pendiente", "Procesando", "Enviado", "Entregado", "Cancelado"];

function StatCard({ label, value, color }) {
  return (
    <div className={`glass-card p-5 bg-gradient-to-br ${color}`}>
      <p className="text-xs text-[#ffffffb3] uppercase tracking-wider">{label}</p>
      <p className="text-[#fff] font-bold mt-1 text-2xl">{value}</p>
    </div>
  );
}

function MiniBar({ data, color = "bg-dorado" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-1.5">
      {data.map((d, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 w-20 text-right truncate">{d.label}</span>
          <div className="flex-1 h-4 rounded-full bg-white/5 overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="text-[10px] text-gray-400 w-10 text-left">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const { products, orders, updateOrderStatus, updateProducts, coupons, addCoupon, removeCoupon, reviews, deleteReview, getProductReviews, showToast, toast } = useStore();
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", category: "", price: "", oldPrice: "", description: "", image: "", flashSaleEnd: "", badge: "", features: "", variants: [] });
  const [orderFilter, setOrderFilter] = useState("Todos");
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, pendingOrders: 0, revenue: 0, totalReviews: 0 });
  const [selectedIds, setSelectedIds] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: "", discount: "", type: "%", minPurchase: "", expires: "" });
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const a = storageGet("innovalink_admin", false);
    if (a) setAuthed(true);
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === "Pendiente").length,
        revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
        totalReviews: Object.values(reviews).reduce((sum, arr) => sum + arr.length, 0),
      });
      setAllUsers(storageGet("innovalink_users", []));
    }
  }, [products, orders, reviews]);

  const handleLogin = () => { if (pass === ADMIN_PASS) { setAuthed(true); storageSet("innovalink_admin", true); } };
  const handleLogout = () => { setAuthed(false); setPass(""); storageSet("innovalink_admin", false); };

  // ─── Product CRUD ───
  const handleNew = () => { setEditing({ id: null }); setForm({ name: "", category: "", price: "", oldPrice: "", description: "", image: "", flashSaleEnd: "", badge: "", features: "", variants: [] }); setTab("edit"); };
  const handleEdit = (product) => { setEditing({ id: product.id }); setForm({ name: product.name || "", category: product.category || "", price: product.price || "", oldPrice: product.oldPrice || "", description: product.description || "", image: product.image || "", flashSaleEnd: product.flashSaleEnd || "", badge: product.badge || "", features: (product.features || []).join("\n"), variants: (product.variants || []).map((v) => ({ ...v })) }); setTab("edit"); };
  const handleDelete = (productId) => { if (!confirm("¿Eliminar este producto?")) return; const updated = products.filter((p) => p.id !== productId); updateProducts(updated); storageSet("innovalink_products", updated); };
  const handleFormField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const handleVariantChange = (index, field) => (e) => setForm((f) => { const variants = [...f.variants]; variants[index] = { ...variants[index], [field]: ["precio", "oldPrice", "stock"].includes(field) ? Number(e.target.value) : e.target.value }; return { ...f, variants }; });
  const addVariant = () => setForm((f) => ({ ...f, variants: [...f.variants, { color: "", hex: "#000000", capacidad: "", price: "", oldPrice: "", stock: "", image: "" }] }));
  const removeVariant = (index) => setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));

  const handleSave = () => {
    const features = form.features ? form.features.split("\n").filter(Boolean) : [];
    const productData = { id: editing.id || Date.now(), name: form.name, category: form.category, price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : null, description: form.description, image: form.image, flashSaleEnd: form.flashSaleEnd || null, badge: form.badge || null, features, variants: form.variants.filter((v) => v.color || v.capacidad) };
    let updated = editing.id ? products.map((p) => (p.id === editing.id ? productData : p)) : [...products, productData];
    updateProducts(updated);
    storageSet("innovalink_products", updated);
    setTab("products"); setEditing(null);
  };

  // ─── Bulk edit ───
  const handleBulkDelete = () => {
    if (!selectedIds.length || !confirm(`¿Eliminar ${selectedIds.length} productos?`)) return;
    const updated = products.filter((p) => !selectedIds.includes(p.id));
    updateProducts(updated);
    setSelectedIds([]);
  };
  const toggleSelect = (id) => setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedIds(selectedIds.length === products.length ? [] : products.map((p) => p.id));

  // ─── Coupons ───
  const handleAddCoupon = () => {
    if (!couponForm.code || !couponForm.discount) return;
    addCoupon({ code: couponForm.code.toUpperCase(), discount: Number(couponForm.discount), type: couponForm.type, minPurchase: couponForm.minPurchase ? Number(couponForm.minPurchase) : 0, expires: couponForm.expires || "2099-12-31" });
    setCouponForm({ code: "", discount: "", type: "%", minPurchase: "", expires: "" });
    showToast("Cupón creado");
  };

  // ─── Export ───
  const exportOrders = () => {
    const headers = ["ID", "Fecha", "Cliente", "Email", "Total", "Estado", "Items"];
    const rows = orders.map((o) => [o.id, o.date, o.shipping?.name || "", o.shipping?.email || "", o.total, o.status, o.items?.length || 0].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "pedidos_innovalink.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Category stats for chart ───
  const catStats = Object.entries(products.reduce((acc, p) => { acc[p.category] = (acc[p.category] || 0) + 1; return acc; }, {})).map(([label, value]) => ({ label, value }));

  // ─── Login screen ───
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="glass-card p-8 max-w-sm w-full text-center space-y-6">
          <img src="/Images/innovalink - Editado.png" alt="InnovaLink" className="h-16 mx-auto" />
          <h1 className="text-xl font-bold text-white">Admin InnovaLink</h1>
          <input type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 text-center" />
          <button onClick={handleLogin} className="w-full py-3 rounded-xl bg-gradient-to-r from-vino to-vino-light text-white font-semibold hover:from-vino-light hover:to-vino">Ingresar</button>
        </div>
      </div>
    );
  }

  const nav = [
    { key: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { key: "products", label: "Productos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { key: "orders", label: "Pedidos", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { key: "reviews", label: "Reseñas", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
    { key: "coupons", label: "Cupones", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
    { key: "users", label: "Usuarios", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <aside className="w-64 bg-dark-800 border-r border-white/10 p-6 flex flex-col hidden md:flex">
        <img src="/Images/innovalink - Editado.png" alt="InnovaLink" className="h-12 w-auto mb-8" />
        <nav className="space-y-1 flex-1">
          {nav.map(({ key, label, icon }) => (
            <button key={key} onClick={() => setTab(key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${tab === key ? "bg-vino text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} /></svg>
              {label}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-red-400 mt-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Cerrar sesión
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden glass border-b border-white/10 p-4 flex items-center justify-between">
          <img src="/Images/innovalink - Editado.png" alt="" className="h-10" />
          <div className="flex gap-2">
            {nav.map(({ key, label }) => <button key={key} onClick={() => setTab(key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${tab === key ? "bg-vino text-white" : "bg-white/5 text-gray-400"}`}>{label}</button>)}
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:bg-white/5">Salir</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          {/* ─── Dashboard ─── */}
          {tab === "dashboard" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Productos" value={stats.totalProducts} color="from-vino to-vino-light" />
                <StatCard label="Pedidos" value={stats.totalOrders} color="from-vino-light to-vino" />
                <StatCard label="Pendientes" value={stats.pendingOrders} color="from-dorado to-dorado-dark" />
                <StatCard label="Ingresos" value={formatCurrency(stats.revenue)} color="from-dorado-dark to-dorado" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-6">
                  <h2 className="text-sm font-semibold text-white mb-4">Productos por categoría</h2>
                  <MiniBar data={catStats} />
                </div>
                <div className="glass-card p-6">
                  <h2 className="text-sm font-semibold text-white mb-4">Pedidos recientes</h2>
                  {orders.length === 0 ? <p className="text-gray-500 text-sm">Sin pedidos</p> : (
                    <div className="space-y-2">
                      {orders.slice(0, 5).map((o) => (
                        <div key={o.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-white/5">
                          <span className="text-white truncate max-w-[120px]">{o.id}</span>
                          <span className="text-dorado">{formatCurrency(o.total)}</span>
                          <span className={`px-1.5 py-0.5 rounded ${o.status === "Pendiente" ? "bg-dorado/20 text-dorado" : "bg-vino/20 text-vino-light"}`}>{o.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─── Products ─── */}
          {tab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-white">Productos ({products.length})</h1>
                <div className="flex gap-2">
                  {selectedIds.length > 0 && <button onClick={handleBulkDelete} className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30">Eliminar ({selectedIds.length})</button>}
                  <button onClick={handleNew} className="px-4 py-2 rounded-xl bg-dorado text-black font-semibold hover:bg-dorado-dark text-sm">+ Nuevo producto</button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="border-b border-white/10 text-gray-400"><th className="py-3 px-2 w-8"><input type="checkbox" checked={selectedIds.length === products.length} onChange={toggleSelectAll} className="accent-dorado" /></th><th className="text-left py-3 px-2">Producto</th><th className="text-left py-3 px-2">Categoría</th><th className="text-left py-3 px-2">Precio</th><th className="text-left py-3 px-2">Variantes</th><th className="text-right py-3 px-2">Acciones</th></tr></thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/5"><td className="py-3 px-2"><input type="checkbox" checked={selectedIds.includes(p.id)} onChange={() => toggleSelect(p.id)} className="accent-dorado" /></td>
                        <td className="py-3 px-2"><div className="flex items-center gap-3"><img src={normalizeImagePath(p.image)} alt="" className="w-10 h-10 object-cover rounded-lg" /><span className="text-white font-medium truncate max-w-[200px]">{p.name}</span></div></td>
                        <td className="py-3 px-2 text-gray-400">{p.category}</td>
                        <td className="py-3 px-2 text-dorado font-medium">{formatCurrency(p.price)}</td>
                        <td className="py-3 px-2 text-gray-400">{p.variants?.length || 0}</td>
                        <td className="py-3 px-2 text-right"><button onClick={() => handleEdit(p)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-dorado/20 hover:text-dorado text-xs mr-2">Editar</button><button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300 hover:bg-red-500/20 hover:text-red-400 text-xs">Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ─── Edit Product ─── */}
          {tab === "edit" && (
            <div className="max-w-3xl">
              <h1 className="text-2xl font-bold text-white mb-6">{editing?.id ? "Editar producto" : "Nuevo producto"}</h1>
              <div className="space-y-4">
                {[{ label: "Nombre", field: "name", type: "text" }, { label: "Categoría", field: "category", type: "text" }, { label: "Precio", field: "price", type: "number" }, { label: "Precio anterior", field: "oldPrice", type: "number" }, { label: "Imagen (nombre archivo)", field: "image", type: "text" }, { label: "Badge (ej: NUEVO, OFERTA)", field: "badge", type: "text" }, { label: "Fin oferta flash (ISO)", field: "flashSaleEnd", type: "datetime-local" }].map(({ label, field, type }) => (
                  <div key={field}><label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">{label}</label><input type={type} value={form[field] || ""} onChange={handleFormField(field)} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50" /></div>
                ))}
                <div><label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Descripción</label><textarea value={form.description} onChange={handleFormField("description")} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 resize-none h-24" /></div>
                <div><label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Características (una por línea)</label><textarea value={form.features} onChange={handleFormField("features")} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 resize-none h-20" /></div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between mb-3"><h3 className="text-sm font-semibold text-white">Variantes</h3><button onClick={addVariant} className="text-xs px-3 py-1.5 rounded-lg bg-dorado/20 text-dorado hover:bg-dorado/30">+ Agregar</button></div>
                  <div className="space-y-2">
                    {form.variants.map((v, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-white/5">
                        <input type="text" placeholder="Color" value={v.color} onChange={handleVariantChange(i, "color")} className="flex-1 min-w-[70px] px-3 py-2 rounded-lg bg-dark-600 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
                        <input type="color" value={v.hex || "#000000"} onChange={handleVariantChange(i, "hex")} className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0" />
                        <input type="text" placeholder="Capacidad" value={v.capacidad} onChange={handleVariantChange(i, "capacidad")} className="flex-1 min-w-[70px] px-3 py-2 rounded-lg bg-dark-600 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
                        <input type="number" placeholder="Precio" value={v.price} onChange={handleVariantChange(i, "precio")} className="w-20 px-3 py-2 rounded-lg bg-dark-600 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
                        <input type="text" placeholder="Imagen" value={v.image} onChange={handleVariantChange(i, "image")} className="flex-1 min-w-[100px] px-3 py-2 rounded-lg bg-dark-600 border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-dorado/50" />
                        <button onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-300 p-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-semibold">{editing?.id ? "Guardar cambios" : "Crear producto"}</button>
                  <button onClick={() => { setTab("products"); setEditing(null); }} className="px-6 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10">Cancelar</button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Orders ─── */}
          {tab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-white">Pedidos ({orders.length})</h1>
                <button onClick={exportOrders} className="px-4 py-2 rounded-xl bg-dorado/20 text-dorado text-sm hover:bg-dorado/30 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Exportar CSV
                </button>
              </div>
              <div className="flex gap-2 flex-wrap mb-6">
                {["Todos", ...orderStatuses].map((s) => (
                  <button key={s} onClick={() => setOrderFilter(s)} className={`px-4 py-2 rounded-xl text-xs font-medium ${orderFilter === s ? "bg-dorado text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>{s}</button>
                ))}
              </div>
              {orders.filter((o) => orderFilter === "Todos" || o.status === orderFilter).map((order) => (
                <div key={order.id} className="glass-card p-5 mb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div><p className="text-white font-semibold">{order.id}</p><p className="text-xs text-gray-400">{order.date}</p></div>
                    <span className="text-lg font-bold text-dorado">{formatCurrency(order.total)}</span>
                  </div>
                  {order.shipping && <div className="text-xs text-gray-400 mb-4 p-3 rounded-xl bg-white/5"><p><span className="text-white">Cliente:</span> {order.shipping.name}</p><p><span className="text-white">Email:</span> {order.shipping.email}</p><p><span className="text-white">Dirección:</span> {order.shipping.address}</p></div>}
                  {order.coupon && <p className="text-xs text-dorado mb-2">Cupón: {order.coupon}</p>}
                  <div className="mb-4">
                    {order.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <img src={normalizeImagePath(item.image)} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        <div className="flex-1"><p className="text-sm text-white">{item.name}</p><p className="text-xs text-gray-400">{item.color && `${item.color} `}{item.capacidad && `- ${item.capacidad}`} × {item.quantity}</p></div>
                        <p className="text-sm text-dorado">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {orderStatuses.map((s) => (
                      <button key={s} onClick={() => updateOrderStatus(order.id, s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${order.status === s ? "bg-dorado text-black" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>{s}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ─── Reviews ─── */}
          {tab === "reviews" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Reseñas ({stats.totalReviews})</h1>
              {Object.keys(reviews).length === 0 ? <p className="text-gray-500">Sin reseñas</p> : (
                <div className="space-y-4">
                  {Object.entries(reviews).map(([productId, productReviews]) => {
                    const prod = products.find((p) => String(p.id) === productId);
                    return productReviews.map((r) => (
                      <div key={r.id} className="glass-card p-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <img src={prod ? normalizeImagePath(prod.image) : ""} alt="" className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <p className="text-sm text-white font-medium">{prod?.name || `Producto #${productId}`}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs font-medium text-dorado">{r.userName}</span>
                              <span className="text-yellow-400 text-xs">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">{r.text}</p>
                            <p className="text-[10px] text-gray-600 mt-1">{new Date(r.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteReview(productId, r.id)} className="text-xs text-red-400 hover:underline flex-shrink-0">Eliminar</button>
                      </div>
                    ));
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─── Coupons ─── */}
          {tab === "coupons" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Cupones de descuento</h1>
              <div className="glass-card p-6 mb-6 max-w-md">
                <h3 className="text-sm font-semibold text-white mb-4">Nuevo cupón</h3>
                <div className="space-y-3">
                  <input type="text" placeholder="Código (ej: VERANO30)" value={couponForm.code} onChange={(e) => setCouponForm((f) => ({ ...f, code: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 text-sm uppercase" />
                  <div className="flex gap-2">
                    <input type="number" placeholder="Descuento" value={couponForm.discount} onChange={(e) => setCouponForm((f) => ({ ...f, discount: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 text-sm" />
                    <select value={couponForm.type} onChange={(e) => setCouponForm((f) => ({ ...f, type: e.target.value }))} className="w-20 px-3 py-3 rounded-xl bg-dark-600 border border-white/10 text-white focus:outline-none focus:border-dorado/50 text-sm">
                      <option value="%">%</option>
                      <option value="$">$</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Compra mín." value={couponForm.minPurchase} onChange={(e) => setCouponForm((f) => ({ ...f, minPurchase: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-dorado/50 text-sm" />
                    <input type="date" value={couponForm.expires} onChange={(e) => setCouponForm((f) => ({ ...f, expires: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-dark-600 border border-white/10 text-white focus:outline-none focus:border-dorado/50 text-sm" />
                  </div>
                  <button onClick={handleAddCoupon} className="w-full py-3 rounded-xl bg-gradient-to-r from-dorado to-dorado-dark text-black font-bold">Crear cupón</button>
                </div>
              </div>
              <div className="space-y-2">
                {coupons.length === 0 ? <p className="text-gray-500 text-sm">No hay cupones creados</p> : coupons.map((c) => (
                  <div key={c.code} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{c.code}</p>
                      <p className="text-xs text-gray-400">{c.discount}{c.type === "%" ? "%" : "$"} de descuento{c.minPurchase > 0 ? ` | Mín: $${c.minPurchase}` : ""} | Expira: {new Date(c.expires).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => removeCoupon(c.code)} className="text-xs text-red-400 hover:underline">Eliminar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Users ─── */}
          {tab === "users" && (
            <div>
              <h1 className="text-2xl font-bold text-white mb-6">Usuarios registrados ({allUsers.length})</h1>
              {allUsers.length === 0 ? <p className="text-gray-500">No hay usuarios registrados</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="border-b border-white/10 text-gray-400"><th className="text-left py-3 px-2">ID</th><th className="text-left py-3 px-2">Nombre</th><th className="text-left py-3 px-2">Email</th><th className="text-left py-3 px-2">Rol</th><th className="text-left py-3 px-2">Registro</th></tr></thead>
                    <tbody>
                      {allUsers.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="py-3 px-2 text-gray-400">{u.id}</td>
                          <td className="py-3 px-2 text-white">{u.name}</td>
                          <td className="py-3 px-2 text-gray-300">{u.email}</td>
                          <td className="py-3 px-2"><span className={`text-xs px-2 py-0.5 rounded-full ${u.role === "admin" ? "bg-dorado/20 text-dorado" : "bg-white/10 text-gray-400"}`}>{u.role}</span></td>
                          <td className="py-3 px-2 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
