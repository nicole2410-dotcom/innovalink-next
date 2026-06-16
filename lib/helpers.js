export function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function storageGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function storageSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function normalizeImagePath(path) {
  if (!path) return null;
  if (path.startsWith("/")) return path;
  if (path.startsWith("Images/")) return `/${path}`;
  if (path.startsWith("http")) return path;
  return `/Images/${path}`;
}

export function getProductImage(product) {
  if (product.image) return normalizeImagePath(product.image) || "/Images/placeholder.webp";
  if (product.images && product.images.length > 0) return normalizeImagePath(product.images[0]) || "/Images/placeholder.webp";
  if (product.variants && product.variants.length > 0 && product.variants[0].image) return normalizeImagePath(product.variants[0].image) || "/Images/placeholder.webp";
  return "/Images/placeholder.webp";
}

export function getProductImageByVariant(product, variantIndex = 0) {
  if (product.variants && product.variants[variantIndex]?.image) {
    return normalizeImagePath(product.variants[variantIndex].image) || getProductImage(product);
  }
  return getProductImage(product);
}

export function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
