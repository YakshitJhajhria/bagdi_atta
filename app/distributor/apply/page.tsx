'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import { Building2, FileCheck, HelpCircle, AlertCircle, Sparkles, LogIn, ArrowRight } from 'lucide-react';

export default function DistributorApplyPage() {
  const router = useRouter();
  const { user, loading } = useCart();
  const [formData, setFormData] = useState({
    companyName: '',
    gstNumber: '',
    expectedMonthlyVolume: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.companyName || !formData.gstNumber || !formData.expectedMonthlyVolume) {
      setError('All fields are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/distributor/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-brand-green-700 border-t-transparent"></div>
      </div>
    );
  }

  // If not logged in, display signup / login wall
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/50 p-8 text-center shadow-xl">
            <div className="rounded-full bg-brand-green-50 text-brand-green-700 p-4 w-16 h-16 flex items-center justify-center mx-auto">
              <Building2 className="h-8 w-8" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-6">
              Distributor Onboarding
            </h2>
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              To apply as an authorized wholesale distributor, you must first register and log in to a customer account.
            </p>
            <div className="mt-8 space-y-3">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer"
              >
                <LogIn className="h-4.5 w-4.5" />
                Sign In to Apply
              </Link>
              <Link
                href="/signup"
                className="block text-xs font-semibold text-brand-green-700 hover:text-brand-green-800 hover:underline"
              >
                Don't have an account? Create one here
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

      <main className="flex-1 mx-auto max-w-3xl w-full px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-xl shadow-stone-100/50">
          
          {success ? (
            <div className="text-center py-8 space-y-6">
              <div className="mx-auto w-16 h-16 bg-brand-green-50 text-brand-green-700 rounded-full flex items-center justify-center border border-brand-green-100 shadow-inner">
                <FileCheck className="h-8 w-8" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                Application Submitted!
              </h2>
              <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you for applying to partner with Bagdi Atta. Our administration team is reviewing your GST credentials and details. We will notify you once approved.
              </p>
              <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-flex justify-center items-center rounded-full border border-stone-200 bg-white px-6 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Return to Homepage
                </Link>
                <Link
                  href="/distributor/login"
                  className="inline-flex justify-center items-center gap-1 rounded-full bg-brand-green-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-green-800"
                >
                  Go to B2B Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 text-brand-green-700">
                <Building2 className="h-8 w-8" />
                <span className="font-serif text-3xl font-bold">Apply as a Distributor</span>
              </div>
              
              <p className="text-stone-500 mt-2 text-sm">
                Register your business credentials to unlock wholesale pricing and bulk ordering options.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-800 flex items-center gap-2">
                    <AlertCircle className="h-4.5 w-4.5 text-red-600 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {/* Company Name */}
                  <div>
                    <label htmlFor="companyName" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Registered Company Name
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      placeholder="e.g. Bagdi Foods & Logistics Ltd"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* GST Number */}
                  <div>
                    <label htmlFor="gstNumber" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      GSTIN / Business Registration Number
                    </label>
                    <input
                      id="gstNumber"
                      name="gstNumber"
                      type="text"
                      required
                      placeholder="e.g. 06AAAAA1111A1Z1"
                      value={formData.gstNumber}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                    />
                  </div>

                  {/* Expected Volume */}
                  <div>
                    <label htmlFor="expectedMonthlyVolume" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                      Expected Monthly Purchase Volume (in kg)
                    </label>
                    <input
                      id="expectedMonthlyVolume"
                      name="expectedMonthlyVolume"
                      type="number"
                      required
                      placeholder="e.g. 500"
                      value={formData.expectedMonthlyVolume}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="rounded-2xl bg-brand-green-50/50 border border-brand-green-100 p-4 text-xs text-brand-green-950 flex items-start gap-2.5 mt-6">
                  <Sparkles className="h-4.5 w-4.5 text-brand-green-700 flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    By submitting this application, you verify that the information is correct and you own a registered retail or logistics outlet. Admin approval processes typically take <strong>1–2 business days</strong>.
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 px-8 py-3.5 text-sm font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer shadow-md shadow-brand-green-700/10"
                  >
                    {isSubmitting ? 'Submitting Application...' : 'Submit B2B Application'}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
