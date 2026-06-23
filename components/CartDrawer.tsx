'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, Wheat, Droplet, Layers } from 'lucide-react';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart } = useCart();

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push('/checkout');
  };

  const renderMiniGraphic = (categorySlug: string, quantityKey: string) => {
    if (categorySlug === 'flours') {
      return (
        <div className="w-12 h-16 bg-amber-50 rounded-t-lg rounded-b-sm border border-amber-200 flex flex-col justify-between p-1.5 shadow-sm">
          <div className="flex justify-between px-0.5 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <span key={i} className="w-0.5 h-0.5 rounded-full bg-amber-800/20" />
            ))}
          </div>
          <div className="text-[7px] text-center font-serif text-brand-green-800 font-extrabold leading-none uppercase">
            {quantityKey.replace('kg', '')}kg
          </div>
        </div>
      );
    } else if (categorySlug === 'oils') {
      return (
        <div className="w-12 h-16 flex flex-col items-center justify-end pb-1 relative">
          <div className="w-3 h-1 bg-brand-green-800 rounded-t-sm z-10" />
          <div className="w-9 h-11 bg-gradient-to-b from-amber-400/90 to-amber-500 border border-amber-300 rounded-t-xl rounded-b-md shadow-sm flex items-center justify-center">
            <span className="text-[6px] font-black text-brand-green-950/80 leading-none">
              {quantityKey}
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-12 h-16 bg-white border border-stone-200 rounded shadow-sm flex flex-col justify-between p-1">
          <div className="h-1 bg-brand-green-800 rounded-t-sm" />
          <div className="h-6 bg-wheat-100/90 rounded flex items-center justify-center p-0.5 border border-wheat-200/50">
            <span className="text-[5px] font-black text-stone-500">{quantityKey}</span>
          </div>
          <div className="text-[5px] font-bold text-stone-400 text-center">PULSE</div>
        </div>
      );
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-2xl transition-transform duration-300 ease-out border-l border-stone-200/50 flex flex-col justify-between animate-slide-in">
          
          {/* Header */}
          <div className="flex h-20 items-center justify-between border-b border-stone-100 px-6 bg-stone-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-brand-green-700" />
              <h2 className="font-serif text-lg font-bold text-stone-900">Your Shopping Cart</h2>
              <span className="rounded-full bg-brand-green-100 px-2 py-0.5 text-xs font-bold text-brand-green-800">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-full p-2 text-stone-400 hover:bg-stone-200 hover:text-stone-600 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="rounded-full bg-stone-50 p-4 w-16 h-16 flex items-center justify-center mx-auto text-stone-300">
                  <Wheat className="h-8 w-8" />
                </div>
                <h3 className="text-base font-bold text-stone-700">Your cart is empty</h3>
                <p className="text-xs text-stone-400 max-w-[200px] mx-auto leading-relaxed">
                  Add fresh stone-ground staples to start shopping.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center justify-center rounded-full bg-brand-green-700 px-6 py-2.5 text-xs font-bold text-white hover:bg-brand-green-800 transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.productId}-${item.quantityKey}`}
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-stone-100 bg-stone-50/30 hover:border-stone-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    {/* Small Mini Packet Icon based on category */}
                    {renderMiniGraphic(item.categorySlug, item.quantityKey)}

                    <div>
                      <h4 className="font-serif font-bold text-stone-900 text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs font-semibold text-stone-400 mt-0.5">Pack: {item.quantityKey}</p>
                      <p className="text-sm font-bold text-stone-950 mt-1">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Control Panel */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-white shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantityKey, item.quantity - 1)}
                        className="p-1 px-2 text-stone-500 hover:bg-stone-50 hover:text-stone-700 cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantityKey, item.quantity + 1)}
                        className="p-1 px-2 text-stone-500 hover:bg-stone-50 hover:text-stone-700 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.productId, item.quantityKey)}
                      className="text-stone-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="border-t border-stone-100 bg-stone-50 p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-stone-900">₹{getSubtotal()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="text-brand-green-700 font-bold">FREE</span>
                </div>
                <div className="border-t border-stone-200 my-2 pt-2 flex justify-between items-baseline font-bold text-stone-900">
                  <span className="text-sm font-serif">Estimated Total</span>
                  <span className="text-2xl">₹{getSubtotal()}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all duration-300 shadow-md shadow-brand-green-700/20 active:scale-[0.99] cursor-pointer"
              >
                Proceed to Checkout
              </button>

              <p className="text-center text-[10px] text-stone-400 font-medium leading-relaxed">
                Milled fresh and shipped within 24–48 hours of verification.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
