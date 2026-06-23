import React from 'react';
import Navbar from '@/components/Navbar';
import { RefreshCcw, HelpCircle, ShieldAlert } from 'lucide-react';

export default function ReturnsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-xl shadow-stone-100/50">
          
          <div className="flex items-center gap-3 text-brand-green-700">
            <RefreshCcw className="h-8 w-8" />
            <span className="font-serif text-3xl font-bold">Returns & Refunds</span>
          </div>
          
          <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-4">
            Last Updated: June 22, 2026
          </p>
          
          <hr className="border-stone-100 my-6" />
          
          <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
            <p>
              Because flour is a consumable food product, we maintain strict safety policies regarding returns and exchanges to protect the health of all our customers.
            </p>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <ShieldAlert className="h-4.5 w-4.5 text-brand-green-700" />
              1. Non-Returnable Items
            </h2>
            <p>
              flour (Whole Wheat Atta) packages are generally non-returnable once opened, to prevent contamination risks. However, we do offer exchanges and refunds under the following conditions:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Damaged Packaging</strong>: The package was torn or damaged in transit before reaching your address.</li>
              <li><strong>Milling Defects</strong>: The flour texture, smell, or quality is not fresh at delivery.</li>
              <li><strong>Wrong Shipment</strong>: You received a different package size than the variant you ordered.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <RefreshCcw className="h-4.5 w-4.5 text-brand-green-700" />
              2. Refund Timeline
            </h2>
            <p>
              If your claim meets any of the conditions above:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must report the issue within <strong>3 days</strong> of delivery, along with a photo/video of the packaging.</li>
              <li>Once verified by our customer support, a replacement pack will be dispatched, or a full refund will be processed to your source/original payment account (if online was used) or via bank transfer/UPI for Cash on Delivery orders.</li>
              <li>Refund credits typically reflect in your account within <strong>5–7 business days</strong>.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 mt-8">
              3. Distributor Bulk Orders
            </h2>
            <p>
              Wholesale distributor orders are covered by specific commercial contracts. In case of issues with bulk freight shipments, distributors should immediately document the weight checks and transit logs and contact their assigned account manager.
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
