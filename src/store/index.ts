import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Page =
  | 'home' | 'products' | 'services' | 'sell' | 'sell-service'
  | 'product-detail' | 'service-detail'
  | 'cart' | 'orders' | 'wishlist' | 'messages' | 'notifications'
  | 'admin' | 'admin-messages' | 'profile' | 'support';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  shopImage?: string;
  shopName?: string;
  bio?: string;
  currency: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUSD?: number | null;
  image?: string | null;
  images: string;
  categoryId?: string | null;
  condition: string;
  sellerId: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  seller?: { id: string; name: string; avatar?: string | null };
  category?: { id: string; name: string } | null;
  _count?: { orders: number; reviews: number; wishlist: number };
  isWishlisted?: boolean;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  priceUSD?: number | null;
  image?: string | null;
  categoryId?: string | null;
  serviceType: string;
  speed?: string | null;
  connectionType?: string | null;
  provider?: string | null;
  contact?: string | null;
  sellerId: string;
  status: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  seller?: { id: string; name: string; avatar?: string | null };
  category?: { id: string; name: string } | null;
  _count?: { orders: number };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  buyerId: string;
  productId: string;
  quantity: number;
  total: number;
  totalUSD?: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  product?: { id: string; title: string; price: number; image?: string | null };
}

export interface MessageItem {
  id: string;
  senderId: string;
  receiverId?: string | null;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  isRead: boolean;
  parentId?: string | null;
  createdAt: string;
  replies?: MessageItem[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}

export interface StoreState {
  currentPage: Page;
  selectedProductId: string | null;
  selectedServiceId: string | null;
  navigate: (page: Page, id?: string) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  currency: 'PKR' | 'USD';
  setCurrency: (c: 'PKR' | 'USD') => void;

  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  setWishlist: (ids: string[]) => void;

  authModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchType: 'products' | 'services';
  setSearchType: (type: 'products' | 'services') => void;

  notificationCount: number;
  setNotificationCount: (count: number) => void;
  messagesCount: number;
  setMessagesCount: (count: number) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      currentPage: 'home',
      selectedProductId: null,
      selectedServiceId: null,
      navigate: (page, id) => {
        set({
          currentPage: page,
          selectedProductId: id || null,
          selectedServiceId: page === 'service-detail' ? id || null : null,
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      user: null,
      setUser: (user) => set({ user }),

      currency: 'PKR',
      setCurrency: (c) => set({ currency: c }),

      cart: [],
      addToCart: (product, quantity = 1) => {
        const cart = get().cart;
        const existing = cart.find((item) => item.product.id === product.id);
        if (existing) {
          set({ cart: cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) });
        } else {
          set({ cart: [...cart, { product, quantity }] });
        }
      },
      removeFromCart: (productId) => set({ cart: get().cart.filter((item) => item.product.id !== productId) }),
      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeFromCart(productId); return; }
        set({ cart: get().cart.map((item) => item.product.id === productId ? { ...item, quantity } : item) });
      },
      clearCart: () => set({ cart: [] }),
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),

      wishlist: [],
      toggleWishlist: (productId) => {
        const w = get().wishlist;
        set({ wishlist: w.includes(productId) ? w.filter((id) => id !== productId) : [...w, productId] });
      },
      setWishlist: (ids) => set({ wishlist: ids }),

      authModalOpen: false,
      authModalMode: 'login',
      openAuthModal: (mode) => set({ authModalOpen: true, authModalMode: mode }),
      closeAuthModal: () => set({ authModalOpen: false }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      selectedCategory: null,
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      searchType: 'products',
      setSearchType: (type) => set({ searchType: type }),

      notificationCount: 0,
      setNotificationCount: (count) => set({ notificationCount: count }),
      messagesCount: 0,
      setMessagesCount: (count) => set({ messagesCount: count }),
    }),
    {
      name: 'zj-store-v2',
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        wishlist: state.wishlist,
        currency: state.currency,
      }),
    }
  )
);

// PKR to USD conversion rate (approximate)
export const PKR_TO_USD = 0.0036;

export function formatPrice(price: number, currency: 'PKR' | 'USD' = 'PKR'): string {
  if (currency === 'USD') {
    return `$${price.toFixed(2)}`;
  }
  return `Rs. ${price.toLocaleString('en-PK')}`;
}
