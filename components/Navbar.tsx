'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { Wheat, Menu, X, ShoppingBag, ShoppingCart, User, LogOut, FileText } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, user, logout, setIsCartOpen } = useCart();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-stone-200/50 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-full bg-wheat-100 p-2 text-wheat-700 transition-transform duration-300 group-hover:rotate-12">
              <Wheat className="h-6 w-6 text-wheat-600" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-brand-green-800">
              Bagdi<span className="text-wheat-600">Atta</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-stone-600 hover:text-brand-green-700 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-semibold text-stone-600 hover:text-brand-green-700 transition-colors duration-200"
            >
              Our Products
            </Link>
            <Link
              href="/distributor/apply"
              className="text-sm font-semibold text-stone-600 hover:text-brand-green-700 transition-colors duration-200"
            >
              Distributor Portal
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-5">
            {/* Cart Icon Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2.5 text-stone-600 hover:bg-stone-100 hover:text-brand-green-700 transition-all focus:outline-none cursor-pointer"
              title="Open Cart"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-green-700 text-white rounded-full text-[10px] font-black w-5 h-5 flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Session profile/login toggler */}
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-stone-700 bg-stone-100/80 px-3 py-1.5 rounded-full border border-stone-200/50">
                  <User className="h-4 w-4 text-stone-500" />
                  <span>Hi, {user.name.split(' ')[0]}</span>
                </div>
                <button
                  onClick={logout}
                  className="rounded-full border border-stone-200 hover:bg-stone-50 p-2.5 text-stone-500 hover:text-red-600 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-brand-green-800 transition-all shadow-md shadow-brand-green-700/10"
              >
                <User className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile elements */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2 text-stone-600 hover:bg-stone-100 transition-all cursor-pointer"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-green-700 text-white rounded-full text-[9px] font-bold w-4.5 h-4.5 flex items-center justify-center border border-white">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-cream border-b border-stone-200" id="mobile-menu">
          <div className="space-y-1 px-4 pb-4 pt-2">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-600 hover:bg-stone-100 hover:text-brand-green-700"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-600 hover:bg-stone-100 hover:text-brand-green-700"
            >
              Our Products
            </Link>
            <Link
              href="/distributor/apply"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-600 hover:bg-stone-100 hover:text-brand-green-700"
            >
              Distributor Portal
            </Link>
            
            <div className="pt-4 border-t border-stone-200 space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 text-base font-bold text-stone-800">
                    <User className="h-5 w-5 text-stone-500" />
                    Hi, {user.name}
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-stone-200 py-3 text-base font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-full bg-brand-green-700 px-4 py-3 text-base font-bold text-white hover:bg-brand-green-800"
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

