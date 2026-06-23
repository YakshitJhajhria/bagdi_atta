'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  quantityKey: string; // e.g. "5kg", "1L"
  quantity: number;
  name: string;
  slug: string;
  categorySlug: string;
  price: number; // Price per unit at addition (taking user's active role: wholesale/retail)
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[]; // List of quantityKeys or product Slugs
  user: any;
  loading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: any, quantityKey: string, count?: number) => void;
  removeFromCart: (productId: string, quantityKey: string) => void;
  updateQuantity: (productId: string, quantityKey: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (itemKey: string) => void; // itemKey could be "slug-size" or "size"
  isInWishlist: (itemKey: string) => boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Fetch current user session details on load
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        // Load user cart/wishlist from DB
        setCart(data.user.cart || []);
        setWishlist(data.user.wishlist || []);
      } else {
        setUser(null);
        // Load guest cart/wishlist from local storage
        const savedCart = localStorage.getItem('bagdi_cart');
        const savedWishlist = localStorage.getItem('bagdi_wishlist');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading session:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // 2. Sync cart to DB (if logged in) or localStorage (if guest)
  const syncCart = async (updatedCart: CartItem[]) => {
    if (user) {
      try {
        await fetch('/api/user/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: updatedCart }),
        });
      } catch (error) {
        console.error('Error syncing cart with DB:', error);
      }
    } else {
      localStorage.setItem('bagdi_cart', JSON.stringify(updatedCart));
    }
  };

  // 3. Sync wishlist to DB or localStorage
  const syncWishlist = async (updatedWishlist: string[]) => {
    if (user) {
      try {
        await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishlist: updatedWishlist }),
        });
      } catch (error) {
        console.error('Error syncing wishlist with DB:', error);
      }
    } else {
      localStorage.setItem('bagdi_wishlist', JSON.stringify(updatedWishlist));
    }
  };

  const addToCart = (product: any, quantityKey: string, count = 1) => {
    const isDistributor = user?.role === 'distributor';
    const variant = product.variants.find((v: any) => v.size === quantityKey);
    if (!variant) return;

    const price = isDistributor ? variant.wholesalePrice : variant.price;

    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product._id && item.quantityKey === quantityKey
      );
      let newCart: CartItem[];
      if (existing) {
        newCart = prev.map((item) =>
          item.productId === product._id && item.quantityKey === quantityKey
            ? { ...item, quantity: item.quantity + count, price } // update price just in case
            : item
        );
      } else {
        newCart = [
          ...prev,
          {
            productId: product._id,
            quantityKey,
            quantity: count,
            name: product.name,
            slug: product.slug,
            categorySlug: product.category?.slug || 'flours',
            price,
          },
        ];
      }
      syncCart(newCart);
      return newCart;
    });
  };

  const removeFromCart = (productId: string, quantityKey: string) => {
    setCart((prev) => {
      const newCart = prev.filter(
        (item) => !(item.productId === productId && item.quantityKey === quantityKey)
      );
      syncCart(newCart);
      return newCart;
    });
  };

  const updateQuantity = (productId: string, quantityKey: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, quantityKey);
      return;
    }
    setCart((prev) => {
      const newCart = prev.map((item) =>
        item.productId === productId && item.quantityKey === quantityKey
          ? { ...item, quantity }
          : item
      );
      syncCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    syncCart([]);
  };

  const toggleWishlist = (itemKey: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(itemKey);
      let newWishlist: string[];
      if (exists) {
        newWishlist = prev.filter((k) => k !== itemKey);
      } else {
        newWishlist = [...prev, itemKey];
      }
      syncWishlist(newWishlist);
      return newWishlist;
    });
  };

  const isInWishlist = (itemKey: string) => {
    return wishlist.includes(itemKey);
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setCart([]);
      setWishlist([]);
      localStorage.removeItem('bagdi_cart');
      localStorage.removeItem('bagdi_wishlist');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        user,
        loading,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
