'use client';

import React from 'react';
import Link from 'next/link';
import { Wheat, Phone, Mail, MapPin, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Multi-column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Column 1: Brand Logo & Mission & Socials */}
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="rounded-full bg-brand-green-800/30 p-2 text-wheat-500 border border-brand-green-700/20">
                <Wheat className="h-6 w-6 text-wheat-400" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Bagdi<span className="text-wheat-500">Atta</span>
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Sourcing native crops directly from sustainable farms. Milled fresh in traditional stone chakkis and cold-pressed in wood kolhus to bring raw purity to your kitchen.
            </p>
            
            {/* Social Media Linkages */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/bagdiatta"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-stone-900 p-2 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 hover:scale-105 transition-all"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://facebook.com/bagdiatta"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-stone-900 p-2 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 hover:scale-105 transition-all"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://twitter.com/bagdiatta"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-stone-900 p-2 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 hover:scale-105 transition-all"
                aria-label="Twitter X"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
              <a
                href="https://youtube.com/bagdiatta"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-stone-900 p-2 border border-stone-800 text-stone-400 hover:text-white hover:border-stone-700 hover:scale-105 transition-all"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Shop Catalog Categories */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-l-2 border-wheat-500 pl-3 mb-5">
              Kitchen Staples
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/products?category=flours" className="text-stone-400 hover:text-white transition-colors duration-200 block">
                  Chakki Fresh Flours
                </Link>
              </li>
              <li>
                <Link href="/products?category=oils" className="text-stone-400 hover:text-white transition-colors duration-200 block">
                  Cold Pressed Oils
                </Link>
              </li>
              <li>
                <Link href="/products?category=pulses" className="text-stone-400 hover:text-white transition-colors duration-200 block">
                  Native Organic Pulses
                </Link>
              </li>
              <li className="pt-2 border-t border-stone-900/50">
                <Link href="/products" className="text-wheat-400 hover:text-wheat-300 font-bold transition-colors duration-200 block">
                  View Full Catalog &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Partner B2B Linkages */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-l-2 border-wheat-500 pl-3 mb-5">
              B2B Partner Portal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/distributor/apply" className="text-stone-400 hover:text-white transition-colors duration-200 block">
                  Become a Distributor
                </Link>
              </li>
              <li>
                <Link href="/distributor/login" className="text-stone-400 hover:text-white transition-colors duration-200 block">
                  Distributor Login
                </Link>
              </li>
              <li>
                <Link href="/distributor/dashboard" className="text-stone-400 hover:text-white transition-colors duration-200 block">
                  Wholesale Console
                </Link>
              </li>
              <li className="text-[11px] text-stone-500 pt-2 font-medium leading-relaxed">
                *Wholesale orders subject to 100 kg Minimum Order Quantity (MOQ).
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Certifications */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white border-l-2 border-wheat-500 pl-3 mb-5">
              Contact Us
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-wheat-500 flex-shrink-0 mt-0.5" />
                <span>Bagdi Atta Mill, Sector 4, Industrial Area, Jaipur, Rajasthan - 302012</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-wheat-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-wheat-500 flex-shrink-0" />
                <span>info@bagdiatta.com</span>
              </li>
              <li className="pt-2 border-t border-stone-900/50">
                <Link href="/contact" className="text-wheat-450 hover:text-wheat-350 font-black tracking-wider uppercase block hover:underline">
                  Contact Support Page &rarr;
                </Link>
              </li>
            </ul>
            <div className="pt-2 border-t border-stone-900/50 flex gap-2">
              <span className="bg-stone-900 border border-stone-850 px-2 py-0.5 rounded text-[8px] font-bold text-stone-400 tracking-wider">
                FSSAI REGISTERED
              </span>
              <span className="bg-stone-900 border border-stone-850 px-2 py-0.5 rounded text-[8px] font-bold text-stone-400 tracking-wider">
                100% ORGANIC
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Metadata & Legal Terms Row */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone-500">
          
          {/* Policy Links */}
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
            <Link href="/policies/privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/policies/terms" className="hover:text-stone-300 transition-colors">Terms of Use</Link>
            <span>•</span>
            <Link href="/policies/shipping" className="hover:text-stone-300 transition-colors">Shipping Policy</Link>
            <span>•</span>
            <Link href="/policies/returns" className="hover:text-stone-300 transition-colors">Refund Policy</Link>
          </div>

          {/* Copyright notice */}
          <div className="text-center md:text-right space-y-1">
            <p>&copy; {currentYear} Bagdi Atta Industries. All rights reserved.</p>
            <p className="flex items-center justify-center md:justify-end gap-1 text-[10px] text-stone-600">
              Made with <Heart className="h-3 w-3 text-red-600 fill-red-600" /> in India for healthy lifestyles.
            </p>
          </div>

        </div>

      </div>
    </footer>
  );
}
