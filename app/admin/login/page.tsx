'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wheat, Lock, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
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
      setError('Both email and password are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-wheat-100/40 rounded-full blur-3xl -translate-x-12 -translate-y-12" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-green-100/30 rounded-full blur-3xl translate-x-16 translate-y-16" />

      <div className="w-full max-w-md space-y-8 z-10 bg-white rounded-3xl border border-stone-200/50 p-8 sm:p-10 shadow-2xl shadow-stone-100/60">
        
        {/* Brand Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="rounded-full bg-brand-green-800 p-2 text-white transition-transform duration-300 group-hover:rotate-12">
              <Wheat className="h-6 w-6" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-green-800">
              Bagdi<span className="text-wheat-600">Atta</span>
            </span>
          </Link>
          <h2 className="mt-6 text-2xl font-bold font-serif text-stone-900">
            Admin Panel Login
          </h2>
          <p className="mt-2 text-xs text-stone-500 font-semibold uppercase tracking-wider">
            Enter credentials to manage orders
          </p>
        </div>

        {/* Form Container */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          {/* Error Notification */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertCircle className="h-4.5 w-4.5 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="relative">
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@bagdiatta.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 px-10 py-3 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Secret Password
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
              className="group relative flex w-full justify-center rounded-full bg-brand-green-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-800 transition-all duration-300 focus:outline-none shadow-md shadow-brand-green-700/20 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs font-bold text-brand-green-700 hover:underline">
            ← Return to Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}
