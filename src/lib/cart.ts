import Cookies from 'js-cookie';

export interface CartItem {
  productId: string;
  brandName: string;
  slug: string;
  imageUrl: string;
  packingSize: string;
  price: number;
  quantity: number;
}

const CART_KEY = 'lykan_cart';

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = Cookies.get(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  Cookies.set(CART_KEY, JSON.stringify(items), { expires: 30 });
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1): CartItem[] {
  const cart = getCart();
  const existing = cart.find(
    (i) => i.productId === item.productId && i.packingSize === item.packingSize
  );
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...item, quantity });
  }
  saveCart(cart);
  return cart;
}

export function updateCartQuantity(
  productId: string,
  packingSize: string,
  quantity: number
): CartItem[] {
  const cart = getCart();
  const item = cart.find((i) => i.productId === productId && i.packingSize === packingSize);
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId, packingSize);
    }
    item.quantity = quantity;
  }
  saveCart(cart);
  return cart;
}

export function removeFromCart(productId: string, packingSize: string): CartItem[] {
  const cart = getCart().filter(
    (i) => !(i.productId === productId && i.packingSize === packingSize)
  );
  saveCart(cart);
  return cart;
}

export function clearCart() {
  Cookies.remove(CART_KEY);
}

export function getCartCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function getCartTotal(): number {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}
