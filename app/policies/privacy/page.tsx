import React from 'react';
import Navbar from '@/components/Navbar';
import { Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      
      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-xl shadow-stone-100/50">
          
          <div className="flex items-center gap-3 text-brand-green-700">
            <Shield className="h-8 w-8" />
            <span className="font-serif text-3xl font-bold">Privacy Policy</span>
          </div>
          
          <p className="text-xs text-stone-400 font-semibold uppercase tracking-wider mt-4">
            Last Updated: June 22, 2026
          </p>
          
          <hr className="border-stone-100 my-6" />
          
          <div className="space-y-6 text-sm text-stone-600 leading-relaxed">
            <p>
              At <strong>Bagdi Atta</strong>, we prioritize the privacy and security of our customers and partners. This Privacy Policy details how we collect, store, share, and protect your information when you purchase from our store, register an account, apply to become a distributor, or contact us.
            </p>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <Eye className="h-4.5 w-4.5 text-brand-green-700" />
              1. Information We Collect
            </h2>
            <p>
              We collect information that you explicitly share with us when placing an order or registering:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Identifiers</strong>: Name, phone number, and shipping/billing addresses.</li>
              <li><strong>Account Credentials</strong>: Email address and hashed passwords.</li>
              <li><strong>Business Data</strong>: Company name, expected purchase volume, and GST identifiers when you apply to become a distributor.</li>
              <li><strong>Order History</strong>: Items in your cart, variant choices, order method, and transaction records.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2 mt-8">
              <Lock className="h-4.5 w-4.5 text-brand-green-700" />
              2. How We Use Your Information
            </h2>
            <p>
              We process your details based on our business agreement with you, including:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Fulfilling customer D2C and distributor bulk order requests.</li>
              <li>Generating pre-filled checkout communications for WhatsApp transactions.</li>
              <li>Verifying distributor applications and credentials before onboarding.</li>
              <li>Handling account synchronization for shopping cart and wishlist configurations.</li>
            </ul>

            <h2 className="font-serif text-lg font-bold text-stone-900 mt-8">
              3. Data Retention and Safety
            </h2>
            <p>
              Your passwords are encrypted using state-of-the-art cryptographic hashing algorithms (`bcryptjs`) before storage. We utilize secure HTTP-only cookies to verify session payloads, safeguarding your active sessions from malicious client-side scripting.
            </p>
            
            <h2 className="font-serif text-lg font-bold text-stone-900 mt-8">
              4. Contact Us
            </h2>
            <p>
              If you have inquiries regarding how we manage user data or wish to delete your customer log, please message our support channels on WhatsApp or email us at <strong>privacy@bagdiatta.com</strong>.
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
