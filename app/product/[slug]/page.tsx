'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { Leaf, Wheat, ShieldCheck, Heart, Sparkles, Check, ShoppingCart, Loader2, ArrowLeft, Droplet } from 'lucide-react';

interface Variant {
  size: string;
  price: number;
  wholesalePrice: number;
  stock: number;
}

interface ProductFact {
  label: string;
  value: string;
}

interface ProductSpec {
  label: string;
  value: string;
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
  nutritionalFacts: ProductFact[];
  specifications: ProductSpec[];
  isActive: boolean;
}

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart, toggleWishlist, isInWishlist, setIsCartOpen, user } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${slug}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setProduct(data.product);
          if (data.product.variants && data.product.variants.length > 0) {
            // Find variant based on default or pick the first one
            setSelectedVariant(data.product.variants[0]);
          }
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-32 text-stone-400">
          <Loader2 className="h-12 w-12 animate-spin text-brand-green-700" />
          <p className="mt-4 text-sm font-semibold">Loading product details...</p>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="font-serif text-3xl font-bold text-stone-900">Staple Not Found</h2>
          <p className="text-stone-500 mt-4 max-w-md mx-auto">
            {error || 'The requested kitchen staple is unavailable or does not exist.'}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-green-700 px-6 py-3 text-sm font-bold text-white hover:bg-brand-green-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </main>
      </div>
    );
  }

  const isDistributor = user?.role === 'distributor';
  const priceToDisplay = selectedVariant 
    ? (isDistributor ? selectedVariant.wholesalePrice : selectedVariant.price)
    : 0;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant.size, 1);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant.size, 1);
    router.push('/checkout');
  };

  const isFavorited = isInWishlist(`${product.slug}-${selectedVariant?.size || 'default'}`);

  // Dynamic Graphic sizes based on selected variant weight/volume
  const getScaleClass = (size: string) => {
    const isLitreOrKg = size.toLowerCase();
    if (isLitreOrKg.includes('25kg') || isLitreOrKg.includes('5l')) {
      return 'scale-110 md:translate-y-2';
    }
    if (isLitreOrKg.includes('5kg') || isLitreOrKg.includes('1l') || isLitreOrKg.includes('1kg')) {
      return 'scale-90';
    }
    return 'scale-100'; // Default scale for 10kg, 2kg, etc.
  };

  const dynamicScaleClass = selectedVariant ? getScaleClass(selectedVariant.size) : 'scale-100';

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 uppercase tracking-wider mb-8">
          <Link href="/" className="hover:text-brand-green-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-green-700 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-stone-800 font-bold">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-10 shadow-xl shadow-stone-100/50">
          
          {/* Left Column: Visual Showcase based on Category */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-stone-50 rounded-2xl p-8 sm:p-12 border border-stone-100 relative overflow-hidden min-h-[380px] sm:min-h-[460px]">
            {/* Soft rays background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,230,138,0.15)_0%,transparent_70%)]" />
            
            {/* Dynamic CSS Visual Representation */}
            <div className={`relative transition-all duration-500 ease-out ${dynamicScaleClass}`}>
              
              {product.category?.slug === 'flours' && (
                /* Flour Bag */
                <div className="w-56 h-72 bg-amber-50 rounded-t-3xl rounded-b-lg border-2 border-amber-200 shadow-2xl flex flex-col justify-between p-5 overflow-hidden">
                  <div className="absolute top-2 left-0 right-0 h-1.5 bg-amber-200/80 flex justify-between px-1.5">
                    {[...Array(14)].map((_, i) => (
                      <span key={i} className="w-1 h-1 rounded-full bg-amber-800/20" />
                    ))}
                  </div>
                  <div className="absolute inset-2 border border-dashed border-amber-300/80 rounded-t-2xl rounded-b-sm pointer-events-none" />

                  <div className="flex flex-col items-center mt-2 z-10">
                    <div className="rounded-full bg-brand-green-800 p-2 shadow-md">
                      <Wheat className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-serif text-base font-black text-brand-green-800 mt-1 tracking-wider uppercase">
                      Bagdi Atta
                    </span>
                    <div className="w-12 h-0.5 bg-wheat-500 mt-0.5" />
                  </div>

                  <div className="flex flex-col items-center justify-center z-10">
                    <div className="border-2 border-brand-green-700/20 rounded-full p-4 flex items-center justify-center relative bg-white/70 backdrop-blur-[2px]">
                      <div className="text-[10px] uppercase tracking-widest text-brand-green-800 font-extrabold text-center leading-none">
                        Chakki<br/>Fresh
                      </div>
                      <div className="absolute -bottom-1 -right-2 rounded-full bg-brand-green-700 p-1 text-white scale-75">
                        <Leaf className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="z-10 flex flex-col items-center">
                    <span className="text-[9px] tracking-widest uppercase font-bold text-amber-800/80 bg-amber-100/80 px-2.5 py-0.5 rounded-full mb-1">
                      Stone Ground
                    </span>
                    <div className="flex items-baseline gap-0.5 text-stone-800 font-serif">
                      <span className="text-2xl font-black">{selectedVariant?.size.replace('kg', '') || '10'}</span>
                      <span className="text-sm font-bold">KG</span>
                    </div>
                  </div>
                </div>
              )}

              {product.category?.slug === 'oils' && (
                /* Oil Bottle */
                <div className="w-48 h-72 flex flex-col items-center justify-end pb-4 relative">
                  <div className="w-12 h-5 bg-brand-green-850 rounded-t-sm border border-brand-green-950 z-20 shadow-sm" />
                  <div className="w-8 h-10 bg-amber-400/85 border-x border-amber-300/40 -mt-0.5 z-10" />
                  <div className="relative w-40 h-56 bg-gradient-to-b from-amber-400 to-amber-550 border-2 border-amber-300 rounded-t-[40px] rounded-b-2xl shadow-2xl flex flex-col justify-between p-4 overflow-hidden">
                    <div className="absolute top-0 right-3 w-6 h-full bg-white/15 blur-[2px] transform -skew-x-12 pointer-events-none" />

                    <div className="w-full bg-white/95 rounded border border-amber-250/50 py-2.5 px-1.5 flex flex-col items-center z-10 shadow-md mt-6">
                      <div className="rounded-full bg-brand-green-850 p-1 text-white scale-90">
                        <Droplet className="h-4 w-4 text-wheat-100" />
                      </div>
                      <span className="text-xs font-black text-brand-green-900 tracking-tight uppercase leading-none mt-1.5">
                        Kachi Ghani
                      </span>
                      <span className="text-[9px] text-stone-500 font-extrabold tracking-widest mt-0.5">
                        MUSTARD OIL
                      </span>
                    </div>

                    <div className="z-10 flex flex-col items-center">
                      <span className="text-[10px] text-amber-950 font-bold uppercase tracking-wider bg-amber-300/50 px-2 py-0.5 rounded-full mb-1">
                        100% Cold Pressed
                      </span>
                      <div className="flex items-baseline gap-0.5 text-stone-850 font-serif">
                        <span className="text-xl font-black">{selectedVariant?.size || '1L'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {product.category?.slug !== 'flours' && product.category?.slug !== 'oils' && (
                /* Pulse Pouch */
                <div className="w-52 h-72 bg-white border-2 border-stone-200 shadow-2xl rounded-2xl flex flex-col justify-between p-4.5 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-3 bg-brand-green-800 flex items-center justify-center">
                    <div className="w-full h-[1px] bg-brand-green-950" />
                  </div>
                  <div className="absolute inset-2 border border-dashed border-stone-200 rounded-xl pointer-events-none mt-3.5" />

                  <div className="flex flex-col items-center mt-3 z-10">
                    <span className="font-serif text-xs font-black text-brand-green-800 uppercase tracking-widest">
                      Bagdi Organics
                    </span>
                    <span className="text-[9px] text-stone-400 font-black mt-0.5 tracking-widest">
                      NATIVE UNPOLISHED STAPLE
                    </span>
                  </div>

                  {/* Lens lens simulation */}
                  <div className="relative w-full h-24 bg-wheat-100/90 border border-wheat-250/60 rounded-xl overflow-hidden flex flex-wrap gap-0.5 p-1.5 justify-center items-center">
                    {[...Array(40)].map((_, i) => (
                      <span key={i} className="w-2 h-2 rounded-full bg-amber-500/80 animate-pulse" style={{ animationDelay: `${i * 20}ms` }} />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent to-wheat-200/30 pointer-events-none" />
                    <div className="absolute bottom-1 bg-white/95 border border-stone-200 rounded-md px-2.5 py-0.5 text-[8px] font-black uppercase text-brand-green-850 tracking-widest shadow-sm">
                      ORGANIC MOONG
                    </div>
                  </div>

                  <div className="z-10 flex justify-between items-end text-[9px] font-bold text-stone-500">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-full">
                      High Protein
                    </span>
                    <div className="flex items-baseline gap-0.5 font-serif text-stone-800">
                      <span className="text-xl font-black">{selectedVariant?.size || '1kg'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Floor Shadow */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-48 h-3 bg-stone-900/10 rounded-full blur-md" />
            </div>
            
            <p className="text-xs text-stone-400 mt-12 text-center font-medium">
              *Milled fresh for your orders. Breathing, hygienic food-grade pack.
            </p>
          </div>

          {/* Right Column: Information & Options */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              {/* Product header */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-green-50 px-3 py-1 text-xs font-semibold text-brand-green-850 border border-brand-green-100">
                  <Sparkles className="h-3.5 w-3.5" />
                  {product.category?.name}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                  In Stock
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 mt-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-3xl font-black text-stone-900">₹{priceToDisplay}</span>
                {isDistributor && (
                  <span className="text-xs font-bold text-brand-green-800 bg-brand-green-100/70 px-2.5 py-1 rounded-full border border-brand-green-200">
                    Wholesale Distributor Price Active
                  </span>
                )}
                <span className="text-sm text-stone-500 font-semibold border-l border-stone-250 pl-3">
                  Inclusive of all taxes
                </span>
              </div>

              <p className="text-stone-600 mt-6 leading-relaxed">
                {product.description}
              </p>

              {/* Dynamic Variant Selector */}
              <div className="mt-8 border-t border-stone-100 pt-6">
                <span className="text-xs font-black uppercase tracking-wider text-stone-400 block mb-3.5">Select Packet Size</span>
                <div className="flex flex-wrap gap-2.5">
                  {product.variants.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedVariant?.size === v.size
                          ? 'border-brand-green-800 bg-brand-green-50 text-brand-green-800 shadow-sm scale-102'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <div className="text-left">
                        <span className="block text-sm font-black">{v.size}</span>
                        <span className="block text-[10px] text-stone-400 font-semibold mt-0.5">
                          ₹{isDistributor ? v.wholesalePrice : v.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Core Features list */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-stone-100 pt-6">
                <div className="flex items-start gap-2.5">
                  <div className="rounded-full bg-brand-green-100 p-0.5 text-brand-green-800 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-stone-700 font-medium">100% Organic & Native Grown</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="rounded-full bg-brand-green-100 p-0.5 text-brand-green-800 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-stone-700 font-medium">Zero Bleach or Maida additives</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="rounded-full bg-brand-green-100 p-0.5 text-brand-green-800 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-stone-700 font-medium">No Preservatives / Bleaching agents</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="rounded-full bg-brand-green-100 p-0.5 text-brand-green-800 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-stone-700 font-medium">Packed in breathing, eco-pouches</p>
                </div>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-4 items-center w-full">
              
              {/* Wishlist toggle Heart */}
              <button
                onClick={() => toggleWishlist(`${product.slug}-${selectedVariant?.size || 'default'}`)}
                className={`rounded-full border-2 p-3.5 transition-all focus:outline-none cursor-pointer flex-shrink-0 ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-white border-stone-200 text-stone-400 hover:text-stone-600 hover:bg-stone-50'
                }`}
                title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`h-5 w-5 ${isFavorited ? 'fill-rose-600' : ''}`} />
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-green-700 bg-white py-3.5 px-6 text-base font-bold text-brand-green-800 hover:bg-brand-green-50 transition-all duration-300 cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-4 px-8 text-base font-bold text-white hover:bg-brand-green-800 transition-all duration-300 hover:shadow-lg hover:shadow-brand-green-700/20 cursor-pointer"
              >
                Buy Now
              </button>
            </div>
            
            <div className="mt-4 flex items-center justify-center sm:justify-start gap-6 text-xs text-stone-500 font-semibold pl-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-brand-green-700" />
                Cash on Delivery Available
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-rose-500" />
                100% Purity Assured
              </span>
            </div>
          </div>
        </div>

        {/* Nutritional Facts & Specifications Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-12">
          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <div className="md:col-span-7 bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                Product Specifications
              </h2>
              <div className="mt-6 space-y-4 text-sm">
                {product.specifications.map((spec, i) => (
                  <div key={i} className={`grid grid-cols-3 py-1 ${i < product.specifications.length - 1 ? 'border-b border-stone-50' : ''}`}>
                    <span className="text-stone-500 font-medium">{spec.label}</span>
                    <span className="col-span-2 text-stone-800 font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nutritional Table */}
          {product.nutritionalFacts && product.nutritionalFacts.length > 0 && (
            <div className="md:col-span-5 bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8">
              <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-100 pb-4">
                Nutritional Facts
              </h2>
              <p className="text-xs text-stone-500 mt-2">Approximate values per 100g of staple</p>
              
              <div className="mt-6 space-y-3.5 text-sm">
                {product.nutritionalFacts.map((fact, i) => (
                  <div key={i} className={`flex justify-between items-center py-1 ${i < product.nutritionalFacts.length - 1 ? 'border-b border-stone-50' : ''} text-stone-700`}>
                    <span className={i === 0 ? 'font-bold text-stone-800' : ''}>{fact.label}</span>
                    <span className={i === 0 ? 'font-bold text-stone-800' : 'font-semibold text-brand-green-700'}>{fact.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
