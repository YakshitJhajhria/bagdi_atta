import React from 'react';
import Navbar from '@/components/Navbar';
import { Truck, MapPin, Calendar } from 'lucide-react';

export default function ShippingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-xl shadow-stone-100/50">
          
          <div className="flex items-center gap-3 text-brand-green-700">
            <Truck className="h-8 w-8" />
            <span className="font-serif text-3xl font-bold">Shipping Policy</span>
          </div>
          
          <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-4">
            Last Updated: June 22, 2026
          </p>
          
          <hr className="border-stone-100 my-6" />
          
          <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
            <p>
              At <strong>Bagdi Atta</strong>, we strive to deliver our stone-ground, chakki-fresh flour in the best condition. Here are the terms governing our shipping and logistics services:
            </p>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <Calendar className="h-4.5 w-4.5 text-brand-green-700" />
              1. Processing and Dispatch Time
            </h2>
            <p>
              To maintain our quality standards:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Milled-to-Order</strong>: We do not store pre-ground flour. Grains are ground only after your order (D2C or distributor) is confirmed.</li>
              <li><strong>Dispatch Timeframe</strong>: Orders are typically processed and dispatched within <strong>24 to 48 hours</strong> of verification.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <MapPin className="h-4.5 w-4.5 text-brand-green-700" />
              2. Shipping Charges and Coverage
            </h2>
            <p>
              We cover standard delivery parameters:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>D2C Customers</strong>: Standard delivery for package options (5kg, 10kg, 25kg) is <strong>FREE</strong> to selected pincodes.</li>
              <li><strong>Wholesale Distributors</strong>: Bulk orders (minimum 100 kg) are subject to specific freight agreements. Freight charges are calculated based on distance and bulk freight partner charges, discussed during dispatch verification.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 mt-8">
              3. Verification Call
            </h2>
            <p>
              All orders (especially Cash on Delivery) require a verification phone call or WhatsApp message check. Our team will contact you to confirm the shipping address. If we cannot reach you within 3 days, the order will be cancelled.
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
