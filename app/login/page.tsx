'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Wheat, Lock, Mail, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function CustomerLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Check role to route properly
      if (data.user.role === 'distributor') {
        router.push('/distributor/dashboard');
      } else {
        router.push('/');
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        
        {/* Background shapes */}
        <div className="absolute top-1/4 left-10 w-48 h-48 bg-wheat-100/30 rounded-full blur-3xl -translate-x-12" />
        <div className="absolute bottom-1/4 right-10 w-64 h-64 bg-brand-green-100/20 rounded-full blur-3xl translate-x-16" />

        <div className="w-full max-w-md space-y-8 z-10 bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-2xl shadow-stone-100/60">
          
          <div className="text-center">
            <h2 className="text-3xl font-bold font-serif text-stone-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-stone-500 font-medium">
              Log in to sync your cart, wishlist, and place orders.
            </p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-200 px-10 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                  />
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-stone-200 px-10 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                  />
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center rounded-full bg-brand-green-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-800 transition-all duration-300 shadow-md shadow-brand-green-700/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="text-center space-y-4 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500 font-medium">
              Don't have an account?{' '}
              <Link href="/signup" className="font-bold text-brand-green-700 hover:underline">
                Register here
              </Link>
            </p>
            
            {/* Distributor Portal Redirection */}
            <div className="rounded-2xl bg-wheat-50/50 border border-wheat-100 p-3 text-xs text-left flex items-center justify-between">
              <div>
                <p className="font-bold text-wheat-900">Are you a Business Partner?</p>
                <p className="text-stone-500 mt-0.5 font-medium">Access your wholesale dashboard.</p>
              </div>
              <Link
                href="/distributor/login"
                className="inline-flex items-center gap-1 bg-wheat-500 hover:bg-wheat-600 text-stone-900 font-bold px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
              >
                B2B Portal
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
