'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Wheat, Droplet, Layers, Sparkles, ArrowRight, ShieldCheck, SlidersHorizontal, Loader2 } from 'lucide-react';

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

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (response.ok && data.success) {
          setProducts(data.products || []);
          setCategories(data.categories || []);
          setSubcategories(data.subcategories || []);
        } else {
          setError(data.error || 'Failed to load products');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Parse URL search parameters on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      const sub = params.get('subcategory');
      if (cat) setSelectedCategory(cat);
      if (sub) setSelectedSubcategory(sub);
    }
  }, []);


  // Filter Logic
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'all' || product.category?.slug === selectedCategory;
    
    // Subcategory filter
    const matchesSubcategory = selectedSubcategory === 'all' || product.subcategory?.slug === selectedSubcategory;

    return matchesSearch && matchesCategory && matchesSubcategory;
  });

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setSelectedSubcategory('all'); // Reset subcategory when category changes
  };

  // Get active subcategories based on selected category
  const activeSubcategories = subcategories.filter((sub) => {
    if (selectedCategory === 'all') return true;
    const cat = categories.find((c) => c.slug === selectedCategory);
    return cat ? sub.category === cat._id : false;
  });

  // Get minimum price of a product for display
  const getStartingPrice = (product: Product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((v) => v.price));
  };

  // Graphic components to render based on category
  const renderProductGraphic = (categorySlug: string, name: string) => {
    const isFlour = categorySlug === 'flours';
    const isOil = categorySlug === 'oils';

    if (isFlour) {
      // Premium Flour Bag
      return (
        <div className="relative w-40 h-52 bg-amber-50 rounded-t-3xl rounded-b-lg border border-amber-200 shadow-lg flex flex-col justify-between p-3.5 overflow-hidden transition-transform duration-500 group-hover:scale-105">
          {/* Top stitch effect */}
          <div className="absolute top-1 left-0 right-0 h-1 bg-amber-200/60 flex justify-between px-1">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="w-0.5 h-0.5 rounded-full bg-amber-800/20" />
            ))}
          </div>
          <div className="absolute inset-1.5 border border-dashed border-amber-300/60 rounded-t-2xl rounded-b-sm pointer-events-none" />
          
          {/* Brand & Mini-wheat icon */}
          <div className="flex flex-col items-center mt-1 z-10">
            <div className="rounded-full bg-brand-green-850 p-1 text-white scale-90">
              <Wheat className="h-4 w-4 text-wheat-100" />
            </div>
            <span className="font-serif text-[10px] font-bold text-brand-green-800 mt-1 uppercase tracking-wider">
              Bagdi Atta
            </span>
          </div>

          {/* Core stamp */}
          <div className="flex flex-col items-center justify-center my-0.5 z-10">
            <div className="border border-brand-green-700/20 rounded-full p-2 flex items-center justify-center bg-white/70">
              <div className="text-[7px] uppercase tracking-widest text-brand-green-800 font-bold text-center leading-none">
                Chakki<br/>Fresh
              </div>
            </div>
          </div>

          {/* Lower section */}
          <div className="z-10 flex flex-col items-center">
            <span className="text-[7px] tracking-widest uppercase font-bold text-amber-800/80 bg-amber-100 px-1.5 py-0.5 rounded-full mb-1">
              Stone Ground
            </span>
            <div className="text-[8px] font-semibold text-stone-500 font-sans tracking-wide">
              NATURAL WHEAT
            </div>
          </div>
        </div>
      );
    } else if (isOil) {
      // Premium Oil Bottle
      return (
        <div className="relative w-36 h-52 flex flex-col items-center justify-end pb-3 transition-transform duration-500 group-hover:scale-105">
          {/* Cap */}
          <div className="w-8 h-3.5 bg-brand-green-800 rounded-t-sm border border-brand-green-950 z-20 shadow-sm" />
          {/* Neck */}
          <div className="w-6 h-6 bg-amber-400/70 border-x border-amber-350/50 -mt-0.5 z-10" />
          {/* Bottle body */}
          <div className="relative w-28 h-40 bg-gradient-to-b from-amber-400/90 to-amber-500 border border-amber-300 rounded-t-3xl rounded-b-xl shadow-lg flex flex-col justify-between p-2.5 overflow-hidden">
            {/* Fluid surface shine */}
            <div className="absolute top-0 right-2 w-4 h-full bg-white/10 blur-[1px] transform -skew-x-12 pointer-events-none" />
            
            {/* Label wrapper */}
            <div className="w-full bg-white/95 rounded border border-amber-250 py-1.5 px-1 flex flex-col items-center z-10 shadow-sm mt-3">
              <div className="rounded-full bg-brand-green-800 p-0.5 text-white scale-75">
                <Droplet className="h-3 w-3 text-wheat-100" />
              </div>
              <span className="text-[9px] font-black text-brand-green-900 tracking-tight uppercase leading-none mt-1">
                Kachi Ghani
              </span>
              <span className="text-[7px] text-stone-500 font-semibold tracking-widest mt-0.5">
                MUSTARD OIL
              </span>
            </div>

            <div className="z-10 flex flex-col items-center">
              <span className="text-[7px] text-amber-950/95 font-bold uppercase tracking-wider bg-amber-300/40 px-1 rounded">
                100% Cold Pressed
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      // Premium Pulse Pouch
      return (
        <div className="relative w-40 h-52 bg-white border border-stone-200 shadow-md rounded-xl flex flex-col justify-between p-3 overflow-hidden transition-transform duration-500 group-hover:scale-105">
          {/* Top seal ribbon */}
          <div className="absolute top-0 left-0 right-0 h-2.5 bg-brand-green-800 flex items-center justify-center">
            <div className="w-full h-[1px] bg-brand-green-900" />
          </div>
          
          <div className="absolute inset-1.5 border border-dashed border-stone-200 rounded-lg pointer-events-none mt-2" />

          {/* Label Stamps */}
          <div className="flex flex-col items-center mt-2.5 z-10">
            <span className="font-serif text-[10px] font-bold text-brand-green-800 uppercase tracking-widest leading-none">
              Bagdi Organics
            </span>
            <span className="text-[8px] text-stone-500 font-bold mt-0.5 tracking-wider">
              UNPOLISHED DAL
            </span>
          </div>

          {/* Simulated transparent window showing lentils */}
          <div className="relative w-full h-16 bg-wheat-100/90 border border-wheat-200/50 rounded-lg overflow-hidden flex flex-wrap gap-0.5 p-1 justify-center items-center">
            {/* Grain pattern dots */}
            {[...Array(30)].map((_, i) => (
              <span key={i} className="w-1.5 h-1.5 rounded-full bg-amber-500/80 animate-pulse" style={{ animationDelay: `${i * 30}ms` }} />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-wheat-200/30 pointer-events-none" />
            <div className="absolute bottom-1 bg-white/90 border border-stone-200 rounded px-1.5 py-0.5 text-[7px] font-black uppercase text-brand-green-800 tracking-wider">
              NATIVE SOURCE
            </div>
          </div>

          {/* Bottom tag */}
          <div className="z-10 flex justify-between items-center text-[7px] font-bold text-stone-500">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1 py-0.5 rounded">
              High Protein
            </span>
            <span>100% PURE</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      {/* Hero Section Banner */}
      <section className="bg-gradient-to-r from-brand-green-900 via-brand-green-800 to-brand-green-950 text-white py-12 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-wheat-200/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-wheat-100/10 px-4 py-1.5 text-xs font-semibold text-wheat-300 mb-4 border border-wheat-100/20 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Freshly Milled & Sourced on Orders
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-cream">
            Our Kitchen Staples Catalog
          </h1>
          <p className="text-brand-green-100 max-w-xl mx-auto mt-4 text-sm sm:text-base leading-relaxed">
            Traditionally ground stone flours, wood-pressed healthy cooking oils, and native unpolished pulses. Zero chemical bleach or artificial additions.
          </p>
        </div>
      </section>

      {/* Main Catalog Section */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {error && (
          <div className="mb-8 rounded-2xl bg-red-50 border border-red-200/60 p-4 text-sm text-red-800 flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <p className="font-medium">
              {error.includes('IP address')
                ? 'Could not connect to database. Please ensure your MongoDB Atlas IP is whitelisted.'
                : error}
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm sticky top-28">
            <h2 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <SlidersHorizontal className="h-4.5 w-4.5 text-brand-green-700" />
              Filter Staples
            </h2>

            {/* Search Input */}
            <div className="mt-5 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-stone-50/50 py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:border-brand-green-600 focus:outline-none transition-all placeholder-stone-400 text-stone-950 font-medium"
              />
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
            </div>

            {/* Categories */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Categories</h3>
              <div className="mt-3 space-y-2">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`w-full text-left px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-between transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-brand-green-50 text-brand-green-800'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>All Staples</span>
                  <span className="text-[10px] bg-stone-150 text-stone-500 rounded-full px-2 py-0.5">
                    {products.length}
                  </span>
                </button>

                {categories.map((cat) => {
                  const count = products.filter((p) => p.category?.slug === cat.slug).length;
                  return (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-between transition-colors ${
                        selectedCategory === cat.slug
                          ? 'bg-brand-green-50 text-brand-green-800'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] bg-stone-150 text-stone-500 rounded-full px-2 py-0.5">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subcategories */}
            {activeSubcategories.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Refine Type</h3>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => setSelectedSubcategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedSubcategory === 'all'
                        ? 'bg-wheat-50 text-wheat-800'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>All Types</span>
                  </button>

                  {activeSubcategories.map((sub) => {
                    const count = products.filter((p) => p.subcategory?.slug === sub.slug).length;
                    return (
                      <button
                        key={sub._id}
                        onClick={() => setSelectedSubcategory(sub.slug)}
                        className={`w-full text-left px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-between transition-colors ${
                          selectedSubcategory === sub.slug
                            ? 'bg-wheat-50 text-wheat-800'
                            : 'text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{sub.name}</span>
                        <span className="text-[10px] bg-stone-150 text-stone-500 rounded-full px-2 py-0.5">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Mobile Filter Button */}
          <div className="w-full lg:hidden flex gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm focus:border-brand-green-600 focus:outline-none placeholder-stone-400 text-stone-900 font-medium"
              />
              <Search className="absolute left-4 top-3.5 h-4.5 w-4.5 text-stone-400" />
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 rounded-full bg-white border border-stone-200 px-5 text-sm font-semibold text-stone-700 hover:bg-stone-50 focus:outline-none cursor-pointer"
            >
              <SlidersHorizontal className="h-4 w-4 text-brand-green-700" />
              Filters
            </button>
          </div>

          {/* Mobile Collapsible Drawer Filter */}
          {showMobileFilters && (
            <div className="w-full lg:hidden bg-white rounded-3xl border border-stone-250 p-6 shadow-md mb-6 animate-in slide-in-from-top-4">
              <div className="flex items-center justify-between border-b border-stone-150 pb-3">
                <h3 className="font-serif text-base font-bold text-stone-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-xs font-semibold text-stone-400 hover:text-stone-700"
                >
                  Done
                </button>
              </div>

              {/* Categories */}
              <div className="mt-4">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Categories</span>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      selectedCategory === 'all'
                        ? 'bg-brand-green-700 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    All Staples
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        selectedCategory === cat.slug
                          ? 'bg-brand-green-700 text-white'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {activeSubcategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-stone-150">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Refine Type</span>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedSubcategory('all')}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                        selectedSubcategory === 'all'
                          ? 'bg-wheat-500 text-stone-950'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      All Types
                    </button>
                    {activeSubcategories.map((sub) => (
                      <button
                        key={sub._id}
                        onClick={() => setSelectedSubcategory(sub.slug)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                          selectedSubcategory === sub.slug
                            ? 'bg-wheat-500 text-stone-950'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-stone-400">
                <Loader2 className="h-10 w-10 animate-spin text-brand-green-700" />
                <p className="mt-4 text-sm font-semibold">Loading healthy staples...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-stone-200/50 rounded-3xl p-8 shadow-sm">
                <Layers className="h-12 w-12 text-stone-300 mx-auto" />
                <h3 className="font-serif text-lg font-bold text-stone-800 mt-4">No staples match your filters</h3>
                <p className="text-stone-500 text-sm mt-2 max-w-sm mx-auto">
                  Try adjusting your search keywords or switching category filters to find the right kitchen staple.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedSubcategory('all');
                  }}
                  className="mt-5 rounded-full bg-brand-green-750 hover:bg-brand-green-800 px-6 py-2 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const startPrice = getStartingPrice(product);
                  const smallestVariant = product.variants && product.variants.length > 0
                    ? product.variants.reduce((prev, curr) => prev.price < curr.price ? prev : curr)
                    : null;
                  
                  return (
                    <div
                      key={product._id}
                      className="group flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-stone-250 bg-white p-5 shadow-md hover:shadow-xl hover:border-stone-300 transition-all duration-300"
                    >
                      {/* Left: Beautiful Dynamic CSS Packet Icon */}
                      <div className="relative w-full max-sm:max-w-[200px] sm:w-44 h-56 flex-shrink-0 flex items-center justify-center bg-stone-50 rounded-2xl border border-stone-100 overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.1)_0%,transparent_70%)]" />
                        {renderProductGraphic(product.category?.slug, product.name)}
                      </div>

                      {/* Right: Info details */}
                      <div className="flex-1 flex flex-col justify-between h-full w-full py-1">
                        <div>
                          {/* Badges */}
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-green-50 px-2 py-0.5 text-[10px] font-bold text-brand-green-800 border border-brand-green-100">
                              {product.category?.name}
                            </span>
                            {product.subcategory && (
                              <span className="inline-flex items-center gap-0.5 rounded-full bg-wheat-50 px-2 py-0.5 text-[10px] font-bold text-wheat-800 border border-wheat-200">
                                {product.subcategory.name}
                              </span>
                            )}
                          </div>

                          <h3 className="font-serif text-xl font-bold tracking-tight text-stone-900 mt-2.5">
                            {product.name}
                          </h3>

                          <p className="text-stone-500 text-xs mt-2 line-clamp-3 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Price & Action Row */}
                        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-stone-400 font-semibold block uppercase tracking-wider">Starting from</span>
                            <div className="flex items-baseline gap-1 mt-0.5">
                              <span className="text-xl font-black text-stone-900">₹{startPrice}</span>
                              {smallestVariant && (
                                <span className="text-[10px] text-stone-500 font-bold bg-stone-100 px-1.5 py-0.5 rounded">
                                  {smallestVariant.size}
                                </span>
                              )}
                            </div>
                          </div>

                          <Link
                            href={`/product/${product.slug}`}
                            className="inline-flex items-center justify-center gap-1 rounded-full bg-brand-green-750 px-4.5 py-2.5 text-xs font-black text-white hover:bg-brand-green-850 transition-all group/btn cursor-pointer shadow-sm hover:shadow"
                          >
                            Select Packet
                            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Trust badges footer */}
      <section className="bg-white border-t border-stone-200 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-brand-green-50 p-2.5 text-brand-green-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-850 mt-2 uppercase tracking-wide">100% Purity Certified</h4>
            <p className="text-stone-500 text-[11px] mt-1 max-w-xs">Cleaned multiple times and packeted fresh with absolute hygiene.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-brand-green-50 p-2.5 text-brand-green-700">
              <Wheat className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-850 mt-2 uppercase tracking-wide">Fresh Chakki Milling</h4>
            <p className="text-stone-500 text-[11px] mt-1 max-w-xs">Milled in traditional stone mills at slow speed to protect heat-sensitive vitamins.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-brand-green-50 p-2.5 text-brand-green-700">
              <Droplet className="h-5 w-5" />
            </div>
            <h4 className="text-xs font-bold text-stone-850 mt-2 uppercase tracking-wide">Native Crop Sourcing</h4>
            <p className="text-stone-500 text-[11px] mt-1 max-w-xs">Grown by local farmers in rich fertile zones under clean water and sunlight.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
