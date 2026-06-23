'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Check, ShoppingBag, MessageSquare, PhoneCall, Wheat } from 'lucide-react';

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'BAGRI-UNKNOWN';
  const method = searchParams.get('method') || 'COD';

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      <main className="flex-1 mx-auto max-w-2xl w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-12 shadow-xl shadow-stone-100/50 text-center relative overflow-hidden">
          
          {/* Subtle wheat background emblem */}
          <div className="absolute -right-10 -bottom-10 text-stone-50 opacity-10 pointer-events-none">
            <Wheat className="h-48 w-48" />
          </div>

          {/* Success Animated Badge */}
          <div className="mx-auto w-20 h-20 bg-brand-green-100 text-brand-green-800 rounded-full flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-brand-green-50 animate-bounce">
            <Check className="h-10 w-10 stroke-[3]" />
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-8">
            Order Placed Successfully!
          </h1>

          <p className="text-stone-600 mt-4 text-base max-w-md mx-auto">
            Thank you for ordering with Bagdi Atta! We are preparing your order of stone-ground whole wheat goodness.
          </p>

          {/* Order Details box */}
          <div className="bg-stone-50 rounded-2xl border border-stone-100 p-5 mt-8 max-w-md mx-auto text-left space-y-3.5">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-stone-500">Order ID:</span>
              <span className="text-stone-900 bg-white border border-stone-200 px-3 py-1 rounded-lg shadow-sm font-mono uppercase tracking-wider text-xs">
                {orderId}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-stone-500">Payment Option:</span>
              <span className="text-stone-900">
                {method === 'WHATSAPP' ? 'WhatsApp Order' : 'Cash on Delivery (COD)'}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-stone-500">Order Status:</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-100">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                Pending Confirmation
              </span>
            </div>
          </div>

          {/* Flow specific helper notice */}
          <div className="mt-8 max-w-md mx-auto">
            {method === 'WHATSAPP' ? (
              <div className="rounded-2xl bg-brand-green-50/50 border border-brand-green-100 p-5 text-left text-sm text-brand-green-950">
                <div className="flex gap-2.5">
                  <MessageSquare className="h-5 w-5 text-brand-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-brand-green-900">WhatsApp Confirmation Action</h4>
                    <p className="mt-1.5 leading-relaxed text-brand-green-800">
                      We have opened WhatsApp in a separate tab with your order message. <strong>Please send that message to confirm your order details.</strong> If the message wasn't sent, our team might check in with you manually on WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-wheat-50/50 border border-wheat-100 p-5 text-left text-sm text-wheat-950">
                <div className="flex gap-2.5">
                  <PhoneCall className="h-5 w-5 text-wheat-800 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-wheat-900">COD Verification Check</h4>
                    <p className="mt-1.5 leading-relaxed text-wheat-800">
                      Our support team will call or message your phone number shortly to verify your delivery address and name. Once verified, your order status will be updated, and the package will be dispatched.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action links */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50 transition-all cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </Link>
            
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210'}?text=Hello,%20I%20need%20help%20with%20my%20order%20${orderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-800 transition-all cursor-pointer"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Support
            </a>
          </div>

        </div>
      </main>

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <Wheat className="h-10 w-10 animate-spin text-brand-green-700 mx-auto" />
          <p className="mt-4 text-stone-600 font-semibold">Loading success page...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
