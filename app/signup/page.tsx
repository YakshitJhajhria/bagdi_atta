'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Lock, Mail, User, Phone, MapPin, AlertCircle, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function CustomerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Name, email, and password are required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      router.push('/');
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
              Create Account
            </h2>
            <p className="mt-2 text-sm text-stone-500 font-medium">
              Join Bagdi Atta to track orders and save favorites.
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-xs font-semibold text-red-800 flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Rahul Kumar"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 px-10 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <User className="absolute left-3.5 top-3 h-4.5 w-4.5 text-stone-400" />
              </div>
            </div>

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
                  placeholder="rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 px-10 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <Mail className="absolute left-3.5 top-3 h-4.5 w-4.5 text-stone-400" />
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
                  className="w-full rounded-xl border border-stone-200 px-10 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 px-10 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <Phone className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                Delivery Address
              </label>
              <div className="relative">
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  placeholder="Street name, locality, city..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-stone-200 px-10 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all resize-none"
                />
                <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex w-full justify-center rounded-full bg-brand-green-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-800 transition-all duration-300 shadow-md shadow-brand-green-700/20 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="text-center space-y-4 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-500 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-brand-green-700 hover:underline">
                Login here
              </Link>
            </p>
            
            {/* Distributor Portal Onboarding */}
            <div className="rounded-2xl bg-brand-green-50/50 border border-brand-green-100 p-3 text-xs text-left flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-green-900">Want to sell Bagdi Atta?</p>
                <p className="text-stone-500 mt-0.5 font-medium">Register and apply as a distributor.</p>
              </div>
              <Link
                href="/distributor/apply"
                className="inline-flex items-center gap-1 bg-brand-green-700 hover:bg-brand-green-800 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm transition-all"
              >
                Apply B2B
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
