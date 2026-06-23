import React from 'react';
import Navbar from '@/components/Navbar';
import { FileText, Award, Scale } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-xl shadow-stone-100/50">
          
          <div className="flex items-center gap-3 text-brand-green-700">
            <FileText className="h-8 w-8" />
            <span className="font-serif text-3xl font-bold">Terms of Service</span>
          </div>
          
          <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-4">
            Last Updated: June 22, 2026
          </p>
          
          <hr className="border-stone-100 my-6" />
          
          <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
            <p>
              Welcome to the digital store of <strong>Bagdi Atta</strong>. By using our website, registering a customer account, placing orders via Cash on Delivery or WhatsApp, or applying as a distributor, you agree to comply with and be bound by the following terms.
            </p>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <Scale className="h-4.5 w-4.5 text-brand-green-700" />
              1. Account Usage & Integrity
            </h2>
            <p>
              You represent that the registration details (such as phone numbers and shipping addresses) you share are accurate. You are responsible for keeping your credentials confidential. Suspicious activities or attempts to place mock/fraudulent orders may result in immediate account termination.
            </p>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <Award className="h-4.5 w-4.5 text-brand-green-700" />
              2. Distributor Wholesale Policies
            </h2>
            <p>
              Approved wholesale distributors are bound by specific commercial guidelines:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Minimum Order Quantity (MOQ)</strong>: Distributors must order a minimum of <strong>100 kg</strong> of total weight per order to qualify for wholesale pricing.</li>
              <li><strong>GST Compliance</strong>: Distributors must provide a valid GST number which will be logged against wholesale invoices.</li>
              <li><strong>Account Promotion</strong>: Access to the Distributor Dashboard is conditional upon manual admin verification and approval.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 mt-8">
              3. Order Acceptance and Cancellation
            </h2>
            <p>
              We reserve the right to reject or cancel any order (whether D2C or wholesale) due to inventory issues, validation failures, or incorrect delivery coordinates. We will contact you on your registered phone number to confirm details prior to final packaging and dispatch.
            </p>

            <h2 className="font-serif text-lg font-bold text-stone-900 mt-8">
              4. Governing Law
            </h2>
            <p>
              These Terms of Service and all related e-commerce transactions are governed by the local laws of our business location. Any disputes will be subject to local jurisdiction.
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
