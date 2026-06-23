'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sprout, Award, Heart, ShieldCheck, ArrowRight, Wheat, Droplet, Layers, Sparkles, Loader2 } from 'lucide-react';

interface Variant {
  size: string;
  price: number;
  wholesalePrice: number;
  stock: number;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  subcategory?: {
    _id: string;
    name: string;
    slug: string;
  };
  variants: Variant[];
  isActive: boolean;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (res.ok && data.success) {
          // Take the first 3 products as featured products
          setFeaturedProducts(data.products ? data.products.slice(0, 3) : []);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const benefits = [
    {
      icon: Sprout,
      title: '100% Organic Sourcing',
      desc: 'Sourced from farms that practice sustainable agriculture, without chemical fertilizers or pesticide residues.',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: Award,
      title: 'Traditional Chakki Ground',
      desc: 'Ground slowly in heavy stone mills. The slow milling process prevents overheating, preserving natural proteins and nutrients.',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      icon: Heart,
      title: 'Rich in Dietary Fiber',
      desc: 'We retain the bran and germ of the grain, ensuring you get maximum dietary fiber for a healthy digestion.',
      color: 'bg-red-50 text-red-700',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Preservatives & Bleach',
      desc: 'Our flour and oils are pure and chemical-free. No bleaching agents, mineral oils, or enhancers are ever added.',
      color: 'bg-blue-50 text-blue-700',
    },
  ];

  // Render miniature custom CSS graphic per category
  const renderProductGraphic = (categorySlug: string) => {
    if (categorySlug === 'flours') {
      return (
        <div className="relative w-28 h-36 bg-amber-50 rounded-t-2xl rounded-b border border-amber-200 shadow-md flex flex-col justify-between p-2.5 overflow-hidden">
          <div className="absolute top-1 left-0 right-0 h-1 bg-amber-250/65 flex justify-between px-1">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="w-0.5 h-0.5 rounded-full bg-amber-800/20" />
            ))}
          </div>
          <div className="flex flex-col items-center mt-1 scale-90">
            <Wheat className="h-3.5 w-3.5 text-brand-green-700" />
            <span className="font-serif text-[7px] font-black text-brand-green-800 tracking-wider mt-0.5">BAGDI</span>
          </div>
          <div className="text-center font-serif text-[10px] font-extrabold text-brand-green-800 mt-1">ATTA</div>
          <div className="text-[6px] tracking-widest text-amber-800 font-bold bg-amber-100 px-1 py-0.2 rounded-full self-center">CHAKKI</div>
        </div>
      );
    } else if (categorySlug === 'oils') {
      return (
        <div className="relative w-24 h-36 flex flex-col items-center justify-end pb-2">
          <div className="w-6 h-2 bg-brand-green-800 rounded-t-sm" />
          <div className="w-4 h-4 bg-amber-450" />
          <div className="relative w-20 h-28 bg-gradient-to-b from-amber-400 to-amber-500 border border-amber-300 rounded-t-2xl rounded-b-lg shadow-md flex flex-col justify-between p-2 overflow-hidden">
            <span className="text-[6px] text-white font-extrabold text-center bg-brand-green-850 py-0.5 rounded leading-none mt-2">MUSTARD</span>
            <Droplet className="h-3.5 w-3.5 text-wheat-200 self-center" />
            <span className="text-[6px] text-amber-950 font-bold text-center leading-none">COLD PRESSED</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative w-28 h-36 bg-white border border-stone-200 shadow-md rounded-lg flex flex-col justify-between p-2 overflow-hidden">
          <div className="h-1 bg-brand-green-800 rounded-t-sm" />
          <span className="text-[7px] font-bold text-brand-green-800 text-center leading-none mt-1">BAGDI PULSES</span>
          <div className="w-full h-8 bg-wheat-100/80 border border-wheat-200 rounded flex flex-wrap gap-0.5 p-0.5 justify-center items-center overflow-hidden">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-amber-500/70" />
            ))}
          </div>
          <span className="text-[6px] text-stone-400 font-bold text-center">UNPOLISHED MOONG</span>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-[radial-gradient(circle_at_top_right,rgba(254,243,199,0.5)_0%,transparent_60%)]">
        <div className="absolute top-1/4 right-10 text-wheat-100 opacity-20 pointer-events-none hidden lg:block animate-rotate-slow">
          <Wheat className="h-96 w-96" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            
            {/* Hero Left */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left">
              <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-brand-green-100 px-3.5 py-1.5 text-xs font-semibold text-brand-green-800">
                <span className="h-2 w-2 rounded-full bg-brand-green-600 animate-pulse" />
                Purest Kitchen Staples In India
              </span>
              
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-900 mt-6 leading-[1.1]">
                Bringing the authentic <span className="text-gradient-gold">flavour of nature</span> to your kitchen.
              </h1>
              
              <p className="text-stone-600 mt-6 text-lg leading-relaxed max-w-2xl">
                Experience natural, nutrient-rich, and stone-ground organic staples. Hand-selected grains, cleaned thoroughly, and ground fresh to retain authentic goodness. No chemicals, no maida, no fillers.
              </p>
              
              {/* Features list */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-brand-green-100 p-1 text-brand-green-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-stone-700">COD Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-brand-green-100 p-1 text-brand-green-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-stone-700">WhatsApp Ordering</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-brand-green-100 p-1 text-brand-green-700">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-semibold text-stone-700">Milled Fresh for Orders</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 px-8 py-4 text-base font-bold text-white hover:bg-brand-green-800 transition-all duration-300 hover:shadow-lg hover:shadow-brand-green-700/20 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  Browse Staples Range
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#categories"
                  className="inline-flex items-center justify-center rounded-full border border-stone-300 bg-white px-8 py-4 text-base font-bold text-stone-700 hover:bg-stone-50 transition-all duration-300 cursor-pointer"
                >
                  Explore Categories
                </Link>
              </div>
            </div>

            {/* Hero Right */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center bg-wheat-100/50 rounded-full border border-wheat-200 shadow-inner">
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-wheat-300 flex flex-col items-center justify-center p-6 text-center bg-white shadow-xl">
                  <Wheat className="h-16 w-16 text-wheat-600 animate-bounce" />
                  <h3 className="font-serif text-xl font-bold text-brand-green-800 mt-4">Bagdi Natural Staples</h3>
                  <p className="text-xs text-stone-500 mt-2 max-w-[200px]">
                    Freshly packeted grains and oils, packed with natural enzymes, vitamins, and minerals.
                  </p>
                  <span className="mt-4 rounded-full bg-brand-green-700 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    100% Native Crops
                  </span>
                </div>
                
                <div className="absolute -top-2 left-6 bg-white border border-stone-200 rounded-2xl px-3.5 py-1.5 shadow-md flex items-center gap-1.5 animate-pulse">
                  <span className="block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-stone-700">Cold Pressed</span>
                </div>

                <div className="absolute -bottom-2 right-4 bg-white border border-stone-200 rounded-2xl px-3.5 py-1.5 shadow-md flex items-center gap-1.5">
                  <span className="block w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-xs font-bold text-stone-700">Unpolished Pulses</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Banner Section */}
      <section id="categories" className="py-20 bg-white border-y border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-semibold text-brand-green-700 text-sm tracking-wider uppercase">Product Range</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2">
              Browse Organic Staple Categories
            </h2>
            <p className="text-stone-600 mt-4 text-base">
              Choose from our curated range of clean kitchen essentials, grown naturally and processed traditionally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            
            {/* Flours Banner */}
            <div className="group relative bg-amber-50/60 rounded-3xl border border-amber-100 p-8 shadow-sm flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:shadow-md hover:bg-amber-50 hover:-translate-y-1">
              <div>
                <div className="rounded-2xl bg-amber-100 text-amber-800 p-4 w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Wheat className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-6">Stone-Ground Flours</h3>
                <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                  Traditional stone milling (chakki fresh) keeps wheat bran and natural fibers intact, producing soft, delicious rotis loaded with vitamins.
                </p>
              </div>
              <Link
                href="/products?category=flours"
                className="mt-8 inline-flex items-center gap-1 text-xs font-black text-brand-green-800 group/link cursor-pointer hover:underline uppercase tracking-widest"
              >
                Browse Flours
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            {/* Oils Banner */}
            <div className="group relative bg-brand-green-50/50 rounded-3xl border border-brand-green-100/60 p-8 shadow-sm flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:shadow-md hover:bg-brand-green-50 hover:-translate-y-1">
              <div>
                <div className="rounded-2xl bg-brand-green-100 text-brand-green-800 p-4 w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Droplet className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-6">Cold-Pressed Oils</h3>
                <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                  Wood-pressed (kolhu) yellow mustard oils extracted without any high-speed heating, keeping aroma, natural flavor, and monounsaturated fats fully intact.
                </p>
              </div>
              <Link
                href="/products?category=oils"
                className="mt-8 inline-flex items-center gap-1 text-xs font-black text-brand-green-800 group/link cursor-pointer hover:underline uppercase tracking-widest"
              >
                Browse Cooking Oils
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

            {/* Pulses Banner */}
            <div className="group relative bg-stone-100/60 rounded-3xl border border-stone-200/50 p-8 shadow-sm flex flex-col justify-between min-h-[320px] transition-all duration-300 hover:shadow-md hover:bg-stone-100 hover:-translate-y-1">
              <div>
                <div className="rounded-2xl bg-stone-200 text-stone-700 p-4 w-14 h-14 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Layers className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-stone-950 mt-6">Organic Native Pulses</h3>
                <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                  Natural, unpolished native pulses sourced directly from organic fields. Zero chemical coating, water polishing, or synthetic color addition.
                </p>
              </div>
              <Link
                href="/products?category=pulses"
                className="mt-8 inline-flex items-center gap-1 text-xs font-black text-brand-green-850 group/link cursor-pointer hover:underline uppercase tracking-widest"
              >
                Browse Pulses
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover/link:translate-x-1" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-[radial-gradient(circle_at_bottom_left,rgba(220,252,231,0.25)_0%,transparent_60%)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="font-semibold text-brand-green-700 text-sm tracking-wider uppercase">Best Sellers</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2">
              Featured Kitchen Staples
            </h2>
            <p className="text-stone-600 mt-3 text-base">
              Try our highly rated, freshly milled and cold-pressed items. Direct home delivery.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-stone-400">
              <Loader2 className="h-8 w-8 animate-spin text-brand-green-700" />
              <p className="mt-3 text-xs font-semibold">Loading staples...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm max-w-md mx-auto">
              <Layers className="h-10 w-10 text-stone-300 mx-auto" />
              <h3 className="font-serif text-base font-bold text-stone-800 mt-3">Products under configuration</h3>
              <p className="text-stone-500 text-xs mt-1.5">
                Staples will display once seeded or added in the admin inventory panel.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.map((prod) => {
                const startPrice = prod.variants && prod.variants.length > 0 
                  ? Math.min(...prod.variants.map((v) => v.price))
                  : 0;
                
                return (
                  <div
                    key={prod._id}
                    className="group relative flex flex-col justify-between rounded-3xl border border-stone-200/60 bg-white p-6 shadow-md hover:shadow-xl hover:border-stone-300 transition-all duration-300"
                  >
                    <div>
                      {/* CSS Packet Showcase */}
                      <div className="relative w-full aspect-[4/3] flex items-center justify-center bg-stone-50 rounded-2xl p-4 overflow-hidden border border-stone-100">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.1)_0%,transparent_70%)]" />
                        {renderProductGraphic(prod.category?.slug)}
                      </div>

                      {/* Header info */}
                      <div className="mt-5">
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-green-50 px-2 py-0.5 text-[9px] font-bold text-brand-green-800 border border-brand-green-100">
                          {prod.category?.name}
                        </span>
                        <h3 className="font-serif text-xl font-bold tracking-tight text-stone-900 mt-2 line-clamp-1">
                          {prod.name}
                        </h3>
                        <p className="text-stone-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                          {prod.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer price & redirect button */}
                    <div className="mt-6 pt-4 border-t border-stone-150 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-stone-400 font-bold block uppercase tracking-wider">Starting from</span>
                        <span className="text-lg font-black text-stone-900">₹{startPrice}</span>
                      </div>
                      <Link
                        href={`/product/${prod.slug}`}
                        className="inline-flex items-center justify-center gap-1 rounded-full bg-brand-green-700 px-4 py-2 text-xs font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer group/btn"
                      >
                        Select Pack
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white border-y border-stone-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="font-semibold text-brand-green-700 text-sm tracking-wider uppercase">Our Quality Secret</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-2">
              Why Choose Bagdi Naturals?
            </h2>
            <p className="text-stone-600 mt-4 text-base">
              Mass-produced commercial staples are processed at high speed, using chemical bleaching agents, mineral oils, and synthetic polishing. We maintain raw integrity for optimal health.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, index) => {
              const Icon = b.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-cream/40 rounded-2xl border border-stone-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-stone-200"
                >
                  <div className={`inline-flex rounded-xl p-3 ${b.color} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-5">{b.title}</h3>
                  <p className="text-sm text-stone-600 mt-3 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="bg-brand-green-800 py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute -bottom-10 -left-10 text-brand-green-700 opacity-20 pointer-events-none">
          <Wheat className="h-64 w-64" />
        </div>
        <div className="absolute -top-10 -right-10 text-brand-green-700 opacity-20 pointer-events-none">
          <Wheat className="h-64 w-64" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Experience kitchen staples that feel alive.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-brand-green-100 text-base sm:text-lg leading-relaxed">
            Order standard packet variants now. We offer hassle-free Cash on Delivery, free shipping, and convenient WhatsApp ordering. Ground and packed fresh for your kitchen.
          </p>
          <div className="mt-10 flex justify-center gap-4 flex-wrap">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full bg-wheat-400 px-8 py-4 text-base font-bold text-stone-900 hover:bg-wheat-300 transition-all duration-300 shadow-lg shadow-black/10 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Order Staples Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/distributor/apply"
              className="inline-flex items-center justify-center rounded-full border border-brand-green-700 bg-brand-green-900/60 px-8 py-4 text-base font-bold text-brand-green-100 hover:bg-brand-green-950 transition-all duration-300 cursor-pointer"
            >
              Become B2B Partner
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
