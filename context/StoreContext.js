"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from "react";
import { storageGet, storageSet } from "@/lib/helpers";

const StoreContext = createContext();

const LS = {
  cart: "innovalink_cart",
  wishlist: "innovalink_wishlist",
  orders: "innovalink_orders",
  user: "innovalink_user",
  reviews: "innovalink_reviews",
  compare: "innovalink_compare",
  recent: "innovalink_recent",
  coupons: "innovalink_coupons",
  theme: "innovalink_theme",
};

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState({});
  const [compare, setCompare] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [activeBrand, setActiveBrand] = useState("Todas");
  const [sortBy, setSortBy] = useState("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const loaded = useRef(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    setCart(storageGet(LS.cart, []));
    setWishlist(storageGet(LS.wishlist, []));
    setOrders(storageGet(LS.orders, []));
    setUser(storageGet(LS.user, null));
    setReviews(storageGet(LS.reviews, {}));
    setCompare(storageGet(LS.compare, []));
    setRecentlyViewed(storageGet(LS.recent, []));
    setCoupons(storageGet(LS.coupons, []));
    setTheme(storageGet(LS.theme, "dark"));

    fetch("/productos.json")
      .then((r) => r.json())
      .then((data) => {
        const prods = data.products || data;
        setProducts(prods);
        const cats = [...new Set(prods.map((p) => p.category).filter(Boolean))];
        setCategories(["Todos", ...cats]);
        const brs = [...new Set(prods.map((p) => p.brand).filter(Boolean))];
        setBrands(["Todas", ...brs]);
        setLoading(false);
        setTimeout(() => setAppReady(true), 600);
      })
      .catch(() => { setLoading(false); setTimeout(() => setAppReady(true), 600); });
  }, []);

  useEffect(() => { if (loaded.current) storageSet(LS.cart, cart); }, [cart]);
  useEffect(() => { if (loaded.current) storageSet(LS.wishlist, wishlist); }, [wishlist]);
  useEffect(() => { if (loaded.current) storageSet(LS.orders, orders); }, [orders]);
  useEffect(() => { if (loaded.current) storageSet(LS.user, user); }, [user]);
  useEffect(() => { if (loaded.current) storageSet(LS.reviews, reviews); }, [reviews]);
  useEffect(() => { if (loaded.current) storageSet(LS.compare, compare); }, [compare]);
  useEffect(() => { if (loaded.current) storageSet(LS.recent, recentlyViewed); }, [recentlyViewed]);
  useEffect(() => { if (loaded.current) storageSet(LS.coupons, coupons); }, [coupons]);
  useEffect(() => { if (loaded.current) storageSet(LS.theme, theme); }, [theme]);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ─── Auth ───
  const register = useCallback((name, email, password) => {
    const users = storageGet("innovalink_users", []);
    if (users.find((u) => u.email === email)) return "correo ya registrado";
    const newUser = { id: Date.now(), name, email, password, role: "user", createdAt: new Date().toISOString() };
    users.push(newUser);
    storageSet("innovalink_users", users);
    const { password: _, ...safe } = newUser;
    setUser(safe);
    return "ok";
  }, []);

  const login = useCallback((email, password) => {
    const users = storageGet("innovalink_users", []);
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return "credenciales inválidas";
    const { password: _, ...safe } = found;
    setUser(safe);
    return "ok";
  }, []);

  const logout = useCallback(() => setUser(null), []);

  // ─── Reviews ───
  const addReview = useCallback((productId, review) => {
    setReviews((prev) => {
      const productReviews = prev[productId] || [];
      return { ...prev, [productId]: [{ ...review, id: Date.now(), date: new Date().toISOString() }, ...productReviews] };
    });
  }, []);

  const deleteReview = useCallback((productId, reviewId) => {
    setReviews((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        updated[productId] = updated[productId].filter((r) => r.id !== reviewId);
        if (updated[productId].length === 0) delete updated[productId];
      }
      return updated;
    });
  }, []);

  const getProductReviews = useCallback((productId) => reviews[productId] || [], [reviews]);
  const getProductRating = useCallback((productId) => {
    const rs = reviews[productId];
    if (!rs || rs.length === 0) return null;
    return rs.reduce((s, r) => s + r.rating, 0) / rs.length;
  }, [reviews]);

  // ─── Compare ───
  const toggleCompare = useCallback((productId) => {
    setCompare((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= 4) { showToast("Máximo 4 productos para comparar", "error"); return prev; }
      return [...prev, productId];
    });
  }, [showToast]);

  const isInCompare = useCallback((productId) => compare.includes(productId), [compare]);

  // ─── Recently Viewed ───
  const addRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 10);
    });
  }, []);

  // ─── Cart ───
  const addToCart = useCallback((product, variantIndex = 0, quantity = 1) => {
    setCart((prev) => {
      const variant = product.variants?.[variantIndex];
      const key = variant ? `${product.id}-${variant.color || ""}-${variant.capacidad || ""}` : `${product.id}`;
      const existing = prev.find((item) => item.key === key);
      if (existing) return prev.map((item) => item.key === key ? { ...item, quantity: item.quantity + quantity } : item);
      return [...prev, { key, id: product.id, name: product.name, image: variant?.image || product.image, price: variant?.price || product.price, oldPrice: variant?.oldPrice || product.oldPrice, color: variant?.color, capacidad: variant?.capacidad, quantity }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((key) => setCart((prev) => prev.filter((item) => item.key !== key)), []);
  const updateCartQuantity = useCallback((key, delta) => {
    setCart((prev) => prev.map((item) => item.key === key ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item).filter((item) => item.quantity > 0));
  }, []);
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const applyCoupon = useCallback((code) => {
    const c = coupons.find((cp) => cp.code === code && new Date(cp.expires) > new Date());
    if (!c) return null;
    if (c.minPurchase && cartTotal < c.minPurchase) return null;
    return c;
  }, [coupons, cartTotal]);

  // ─── Wishlist ───
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  }, []);
  const isInWishlist = useCallback((productId) => wishlist.includes(productId), [wishlist]);

  // ─── Filters ───
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      if (activeCategory !== "Todos" && p.category !== activeCategory) return false;
      if (activeBrand !== "Todas" && p.brand !== activeBrand) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      const term = searchTerm.toLowerCase();
      if (term && !p.name.toLowerCase().includes(term) && !(p.description || "").toLowerCase().includes(term) && !(p.category || "").toLowerCase().includes(term)) return false;
      return true;
    });
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    else if (sortBy === "name-asc") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "name-desc") result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    return result;
  }, [products, activeCategory, activeBrand, priceRange, searchTerm, sortBy]);

  // ─── Orders ───
  const placeOrder = useCallback((items, total, shippingInfo, couponCode) => {
    const order = { id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`, date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }), items: [...items], total, shipping: shippingInfo, coupon: couponCode || null, status: "Pendiente" };
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    return order;
  }, []);

  const updateOrderStatus = useCallback((orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  }, []);

  // ─── Coupons (admin) ───
  const addCoupon = useCallback((coupon) => setCoupons((prev) => [...prev, coupon]), []);
  const removeCoupon = useCallback((code) => setCoupons((prev) => prev.filter((c) => c.code !== code)), []);

  // ─── Products (admin) ───
  const updateProducts = useCallback((newProducts) => {
    setProducts(newProducts);
    storageSet("innovalink_products", newProducts);
  }, []);

  // ─── Flash sales ───
  const flashSales = useMemo(() => {
    const now = new Date();
    return products.filter((p) => {
      if (!p.flashSaleEnd) return false;
      return new Date(p.flashSaleEnd) > now;
    }).slice(0, 4);
  }, [products]);

  const value = useMemo(() => ({
    products, filteredProducts, flashSales, categories, brands, loading, appReady,
    activeCategory, setActiveCategory, priceRange, setPriceRange, activeBrand, setActiveBrand,
    searchTerm, setSearchTerm, sortBy, setSortBy,
    cart, cartOpen, setCartOpen, cartTotal, cartCount,
    addToCart, removeFromCart, updateCartQuantity,
    wishlist, toggleWishlist, isInWishlist,
    orders, placeOrder, updateOrderStatus,
    user, login, register, logout, authOpen, setAuthOpen,
    reviews, addReview, deleteReview, getProductReviews, getProductRating,
    compare, toggleCompare, isInCompare,
    recentlyViewed, addRecentlyViewed,
    coupons, addCoupon, removeCoupon, applyCoupon,
    quickView, setQuickView,
    toast, showToast,
    theme, setTheme,
    updateProducts,
    chatOpen, setChatOpen,
  }), [products, filteredProducts, flashSales, categories, brands, loading, appReady, activeCategory, priceRange, activeBrand, searchTerm, sortBy, cart, cartOpen, cartTotal, cartCount, addToCart, removeFromCart, updateCartQuantity, wishlist, toggleWishlist, isInWishlist, orders, placeOrder, updateOrderStatus, user, login, register, logout, authOpen, reviews, addReview, deleteReview, getProductReviews, getProductRating, compare, toggleCompare, isInCompare, recentlyViewed, addRecentlyViewed, coupons, addCoupon, removeCoupon, applyCoupon, quickView, toast, showToast, theme, setTheme, updateProducts, chatOpen]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
