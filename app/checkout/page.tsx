'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { ShieldCheck, MessageSquare, AlertCircle, Wheat, ArrowLeft, CheckCircle2, ShoppingCart } from 'lucide-react';

function CheckoutForm() {
  const router = useRouter();
  const { cart, clearCart, user, loading } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'WHATSAPP' | null>(null);

  // WhatsApp flow specific state
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');

  // Auto-fill form details if user is logged in
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Calculations
  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const totalCost = getSubtotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s\-+]/g, '').slice(-10))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // WhatsApp Redirect Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showWhatsAppModal && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showWhatsAppModal && countdown === 0 && whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
    return () => clearTimeout(timer);
  }, [showWhatsAppModal, countdown, whatsappLink]);

  const handleSubmit = async (method: 'COD' | 'WHATSAPP') => {
    if (cart.length === 0) return;
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setPaymentMethod(method);

    // Compile items list and text summary description
    const items = cart.map((item) => ({
      productId: item.productId,
      quantityKey: item.quantityKey,
      quantity: item.quantity,
      priceAtPurchase: item.price,
    }));

    const summaryText = cart.map((item) => `${item.quantityKey} x ${item.quantity}`).join(', ');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: summaryText, // flat string summary
          price: totalCost,
          paymentMethod: method,
          orderType: 'D2C',
          items, // detailed array
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      const order = data.order;
      setPlacedOrderId(order.orderId);

      // Clear the local/DB cart on success!
      clearCart();

      if (method === 'COD') {
        router.push(`/order-success?orderId=${order.orderId}&method=COD`);
      } else {
        // WhatsApp flow redirect details
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
        const messageText = `Hello, I want to order:

Product: Bagri Atta
Items: ${order.quantity}
Name: ${order.name}
Address: ${order.address}
Order ID: ${order.orderId}

Please confirm my order.`;

        const encodedMessage = encodeURIComponent(messageText);
        setWhatsappLink(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
        
        setShowWhatsAppModal(true);
        setCountdown(5);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePlacedOnWhatsApp = () => {
    router.push(`/order-success?orderId={placedOrderId}&method=WHATSAPP`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Wheat className="h-10 w-10 animate-spin text-brand-green-700 mx-auto" />
      </div>
    );
  }

  // If cart is empty, show empty state
  if (cart.length === 0 && !showWhatsAppModal) {
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/50 p-8 text-center shadow-xl">
            <div className="rounded-full bg-stone-50 p-4 w-16 h-16 flex items-center justify-center mx-auto text-stone-300">
              <ShoppingCart className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-6">Your Cart is Empty</h2>
            <p className="text-sm text-stone-600 mt-3">
              You must add items to your cart before proceeding to checkout.
            </p>
            <div className="mt-8">
              <Link
                href="/product"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all"
              >
                Go to Shop
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      <main className="flex-1 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green-700 hover:text-brand-green-800 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Products Catalog
        </Link>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mb-8">
          Checkout Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Checkout Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8 shadow-xl shadow-stone-100/50">
            <h2 className="text-lg font-bold text-stone-955 mb-6 border-b border-stone-100 pb-3">
              Delivery Details
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.name ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200 focus:border-brand-green-600'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Phone Number (WhatsApp preferred)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200 focus:border-brand-green-600'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Delivery Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  placeholder="Street name, house number, locality, city, pin code"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full rounded-xl border px-4 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
                    errors.address ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200 focus:border-brand-green-600'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side: Order Summary & Checkout CTAs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-xl shadow-stone-100/50">
              <h2 className="text-md font-bold text-stone-955 mb-4 pb-2 border-b border-stone-100">
                Order Summary
              </h2>

              <div className="space-y-4">
                {/* List all cart items */}
                <div className="divide-y divide-stone-100 space-y-3">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.quantityKey}`} className="flex justify-between items-center text-sm pt-2">
                      <div>
                        <h4 className="font-bold text-stone-850 font-serif line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-stone-400 font-semibold mt-0.5">Pack Size: {item.quantityKey}</p>
                      </div>
                      <span className="font-bold text-stone-900 flex-shrink-0 ml-4">
                        ₹{item.price} x {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-100 pt-4 space-y-2 text-sm font-medium text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-stone-800 font-bold">₹{totalCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charge</span>
                    <span className="text-brand-green-700 font-bold">FREE Delivery</span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline font-bold text-stone-900">
                  <span className="text-sm font-serif">Total Amount</span>
                  <span className="text-2xl">₹{totalCost}</span>
                </div>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div className="space-y-3">
              {/* WhatsApp Checkout */}
              <button
                type="button"
                onClick={() => handleSubmit('WHATSAPP')}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 rounded-full bg-brand-green-700 py-4 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all duration-300 shadow-md shadow-brand-green-700/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                {isSubmitting && paymentMethod === 'WHATSAPP' ? 'Processing...' : 'Order via WhatsApp'}
              </button>

              {/* COD Checkout */}
              <button
                type="button"
                onClick={() => handleSubmit('COD')}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 rounded-full bg-wheat-500 py-4 px-6 text-sm font-bold text-stone-900 hover:bg-wheat-400 transition-all duration-300 shadow-md shadow-wheat-500/10 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-amber-900" />
                {isSubmitting && paymentMethod === 'COD' ? 'Processing...' : 'Cash on Delivery (COD)'}
              </button>
            </div>

            <p className="text-center text-[11px] font-medium text-stone-400">
              🔒 Safe & Secure Checkout. We respect your privacy.
            </p>
          </div>

        </div>
      </main>

      {/* WhatsApp Redirect Modal Overlay */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-2xl animate-scale-up">
            
            {countdown > 0 ? (
              <>
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-wheat-50 rounded-full border border-wheat-100 text-wheat-600">
                  <Wheat className="h-10 w-10 animate-rotate-slow" />
                  <span className="absolute text-sm font-black text-stone-900 bg-white border border-stone-200 w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                    {countdown}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-6">
                  Redirecting to WhatsApp
                </h3>
                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  We are creating your order in the database. Please wait while we prepare your pre-filled message...
                </p>
                <div className="mt-6 flex justify-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        5 - countdown > i ? 'bg-brand-green-700' : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-brand-green-50 text-brand-green-700 rounded-full flex items-center justify-center border border-brand-green-100">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-6">
                  Pre-filled Message Opened
                </h3>
                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  We have opened WhatsApp in a new tab. Please send the message to complete your confirmation.
                </p>
                <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                  <button
                    onClick={handlePlacedOnWhatsApp}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer"
                  >
                    👉 I have placed order on WhatsApp
                  </button>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs font-semibold text-brand-green-700 hover:text-brand-green-800 hover:underline"
                  >
                    Didn't redirect? Click here to retry
                  </a>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <Wheat className="h-10 w-10 animate-spin text-brand-green-700 mx-auto" />
          <p className="mt-4 text-stone-600 font-semibold">Loading checkout details...</p>
        </div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
