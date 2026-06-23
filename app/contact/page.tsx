'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s\-+]/g, '').slice(-10))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message details are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API query call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-50 px-3 py-1.5 text-xs font-bold text-brand-green-800 border border-brand-green-100">
            Get In Touch
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-stone-900 mt-4 tracking-tight">
            We'd Love to Hear From You
          </h1>
          <p className="text-stone-650 mt-4 text-sm sm:text-base leading-relaxed">
            Have questions about our stone-ground flours, bulk B2B ordering, or distributor applications? Fill out the form or reach out directly to our customer success team.
          </p>
        </div>

        {/* Contact info grid & form block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-stone-900 pl-1">
              Direct Contact Details
            </h2>

            {/* Address Card */}
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 flex gap-4 shadow-sm hover:shadow transition-shadow">
              <div className="rounded-2xl bg-brand-green-50 text-brand-green-750 p-3.5 h-12 w-12 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-stone-900 text-sm">Our Registered Mill Address</h3>
                <p className="text-stone-500 text-xs leading-relaxed mt-2">
                  Bagdi Atta Mill, Sector 4, Industrial Area, Jaipur, Rajasthan - 302012
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 flex gap-4 shadow-sm hover:shadow transition-shadow">
              <div className="rounded-2xl bg-brand-green-50 text-brand-green-750 p-3.5 h-12 w-12 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-stone-900 text-sm">Customer Helpline / B2B Queries</h3>
                <p className="text-stone-500 text-xs leading-relaxed mt-2">
                  +91 98765 43210 (Direct calls & WhatsApp support)
                </p>
              </div>
            </div>

            {/* Mail Card */}
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 flex gap-4 shadow-sm hover:shadow transition-shadow">
              <div className="rounded-2xl bg-brand-green-50 text-brand-green-750 p-3.5 h-12 w-12 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-stone-900 text-sm">Email Support Channels</h3>
                <p className="text-stone-500 text-xs leading-relaxed mt-2 font-medium">
                  info@bagdiatta.com &bull; sales@bagdiatta.com
                </p>
              </div>
            </div>

            {/* Timings Card */}
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 flex gap-4 shadow-sm hover:shadow transition-shadow">
              <div className="rounded-2xl bg-brand-green-50 text-brand-green-750 p-3.5 h-12 w-12 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5.5 w-5.5" />
              </div>
              <div>
                <h3 className="font-serif font-black text-stone-900 text-sm">Working Business Hours</h3>
                <p className="text-stone-500 text-xs leading-relaxed mt-2">
                  Monday to Sunday: 9:00 AM &ndash; 8:00 PM (IST)<br/>
                  *B2B processing runs 24/7 depending on milling logs.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Support Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8 shadow-xl shadow-stone-100/50 relative overflow-hidden">
              
              {submitSuccess ? (
                <div className="py-16 text-center space-y-5 animate-in scale-in duration-300">
                  <div className="rounded-full bg-brand-green-50 text-brand-green-700 p-4 w-16 h-16 flex items-center justify-center mx-auto border border-brand-green-100 shadow-sm">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900">Message Received!</h3>
                  <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you for reaching out. We have logged your query and our team will get in touch with you shortly (usually within 12-24 hours).
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="inline-flex items-center justify-center rounded-full bg-brand-green-750 hover:bg-brand-green-800 px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-3">
                    Send Us a Message
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          errors.name ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                          errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="e.g. customer@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.email ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Subject / Topic *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder="e.g. Bulk Wheat Flour Order / Delivery Issue"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.subject ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200'
                      }`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Message Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Write your detailed questions or query here..."
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-stone-800 bg-stone-50/50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:bg-white transition-all resize-none ${
                        errors.message ? 'border-red-500 focus:ring-red-200' : 'border-stone-200 focus:ring-brand-green-200'
                      }`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all duration-300 shadow-md shadow-brand-green-700/20 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4.5 w-4.5 animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Query
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
