'use client';

import React from 'react';
import Link from 'next/link';
import { Leaf, Award, ShieldAlert, ArrowRight, Wheat } from 'lucide-react';

export default function ProductCard() {
  return (
    <div className="group relative flex flex-col md:flex-row items-center gap-8 rounded-3xl border border-stone-200/60 bg-white p-6 sm:p-8 shadow-xl shadow-stone-100 transition-all duration-300 hover:shadow-2xl hover:shadow-stone-200/50">
      
      {/* Visual Bag Showcase (Pure SVG/Tailwind Mock-up) */}
      <div className="relative w-full max-w-[280px] aspect-[3/4] flex-shrink-0 flex items-center justify-center bg-stone-50 rounded-2xl p-6 overflow-hidden">
        {/* Decorative rays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.2)_0%,transparent_70%)]" />
        
        {/* Premium Paper Bag Mock-up */}
        <div className="relative w-48 h-64 bg-amber-50 rounded-t-3xl rounded-b-lg border-2 border-amber-200 shadow-xl flex flex-col justify-between p-4 overflow-hidden group-hover:scale-105 transition-transform duration-500">
          
          {/* Top bag fold stitch effect */}
          <div className="absolute top-2 left-0 right-0 h-1.5 bg-amber-200/60 flex justify-between px-1">
            {[...Array(12)].map((_, i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-amber-800/20" />
            ))}
          </div>

          {/* Premium Border outline inside */}
          <div className="absolute inset-2 border border-dashed border-amber-300/60 rounded-t-2xl rounded-b-sm pointer-events-none" />

          {/* Logo Badge */}
          <div className="flex flex-col items-center mt-2 z-10">
            <div className="rounded-full bg-brand-green-800 p-1.5 shadow-md">
              <Wheat className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-sm font-bold text-brand-green-800 mt-1 tracking-wider uppercase">
              Bagdi Atta
            </span>
            <div className="w-8 h-0.5 bg-wheat-500 mt-0.5" />
          </div>

          {/* Center Stamp illustration */}
          <div className="flex flex-col items-center justify-center my-1 z-10">
            <div className="border border-brand-green-700/30 rounded-full p-3 flex items-center justify-center relative bg-white/60 backdrop-blur-[2px]">
              {/* Inner details */}
              <div className="text-[9px] uppercase tracking-widest text-brand-green-800 font-bold text-center leading-none">
                Chakki<br/>Fresh
              </div>
              
              {/* Organic seal */}
              <div className="absolute -bottom-1 -right-2 rounded-full bg-brand-green-700 p-1 text-white scale-75">
                <Leaf className="h-3 w-3" />
              </div>
            </div>
            <p className="text-[10px] font-semibold text-stone-500 mt-2 uppercase tracking-wide">
              100% Whole Wheat
            </p>
          </div>

          {/* Weight label and premium description */}
          <div className="z-10 flex flex-col items-center">
            <span className="text-[8px] tracking-widest uppercase font-bold text-amber-800/80 bg-amber-100 px-2 py-0.5 rounded-full mb-1">
              Stone Ground
            </span>
            <div className="flex items-baseline gap-0.5 text-stone-800 font-serif">
              <span className="text-lg font-bold">10</span>
              <span className="text-xs font-semibold">KG</span>
            </div>
          </div>
        </div>

        {/* Dynamic Shadow */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-3 bg-stone-900/10 rounded-full blur-md" />
      </div>

      {/* Product Details Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Badge & Certification */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-100 px-3 py-1 text-xs font-semibold text-brand-green-800">
              <Leaf className="h-3.5 w-3.5" />
              100% Natural & Organic
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-wheat-100 px-3 py-1 text-xs font-semibold text-wheat-800">
              <Award className="h-3.5 w-3.5" />
              Traditional Chakki ground
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-4">
            Whole Wheat Sharbati Atta
          </h2>

          <p className="text-stone-600 mt-4 leading-relaxed max-w-xl">
            Our premium whole wheat flour is made from the finest quality wheat grains sourced directly from sustainable fields. Ground traditionally in stone mills (chakki) to preserve natural fiber, vitamins, and the authentic aroma that makes soft, delicious rotis.
          </p>

          {/* Highlights grid */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-stone-100 p-1 text-stone-600">
                <span className="block w-1.5 h-1.5 rounded-full bg-brand-green-600" />
              </div>
              <span className="text-sm font-semibold text-stone-700">Zero Maida (No Maida added)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-stone-100 p-1 text-stone-600">
                <span className="block w-1.5 h-1.5 rounded-full bg-brand-green-600" />
              </div>
              <span className="text-sm font-semibold text-stone-700">Rich in Dietary Fiber</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-stone-100 p-1 text-stone-600">
                <span className="block w-1.5 h-1.5 rounded-full bg-brand-green-600" />
              </div>
              <span className="text-sm font-semibold text-stone-700">No Preservatives or Bleach</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-stone-100 p-1 text-stone-600">
                <span className="block w-1.5 h-1.5 rounded-full bg-brand-green-600" />
              </div>
              <span className="text-sm font-semibold text-stone-700">100% Purity Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Action / CTA */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-stone-500 font-medium">Starting from</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-extrabold text-stone-900">₹249</span>
              <span className="text-sm text-stone-500 font-semibold">for 5kg pack</span>
            </div>
          </div>

          <Link
            href="/product"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 px-8 py-3.5 text-base font-bold text-white hover:bg-brand-green-800 transition-all duration-300 hover:shadow-lg hover:shadow-brand-green-700/20 group/btn"
          >
            Select Variant
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </div>
      </div>

    </div>
  );
}
