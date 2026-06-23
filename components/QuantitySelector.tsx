'use client';

import React from 'react';
import { ShieldCheck, Flame, Award } from 'lucide-react';

interface QuantitySelectorProps {
  selected: '5kg' | '10kg' | '25kg';
  onChange: (quantity: '5kg' | '10kg' | '25kg') => void;
}

export default function QuantitySelector({ selected, onChange }: QuantitySelectorProps) {
  const options = [
    {
      id: '5kg' as const,
      label: 'Trial Pack',
      weight: '5 kg',
      price: 249,
      unitPrice: '₹49.8/kg',
      badge: 'Perfect for Trial',
      icon: ShieldCheck,
    },
    {
      id: '10kg' as const,
      label: 'Family Pack',
      weight: '10 kg',
      price: 469,
      unitPrice: '₹46.9/kg',
      badge: 'Popular Choice',
      icon: Flame,
    },
    {
      id: '25kg' as const,
      label: 'Mega Savings Pack',
      weight: '25 kg',
      price: 1099,
      unitPrice: '₹43.9/kg',
      badge: 'Best Value (Save 12%)',
      icon: Award,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500">Select Weight Variant</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              type="button"
              className={`relative flex flex-col justify-between rounded-2xl border-2 p-5 text-left transition-all duration-300 focus:outline-none cursor-pointer hover:shadow-md ${
                isSelected
                  ? opt.id === '25kg'
                    ? 'border-brand-green-700 bg-brand-green-50/40 ring-1 ring-brand-green-700/50 shadow-brand-green-700/5'
                    : opt.id === '10kg'
                    ? 'border-wheat-600 bg-wheat-50/50 ring-1 ring-wheat-600/50 shadow-wheat-600/5'
                    : 'border-stone-800 bg-stone-50 ring-1 ring-stone-800/50'
                  : 'border-stone-200 bg-white hover:bg-stone-50/30'
              }`}
            >
              {opt.badge && (
                <span
                  className={`absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-sm ${
                    isSelected
                      ? opt.id === '25kg'
                        ? 'bg-brand-green-600 text-white'
                        : opt.id === '10kg'
                        ? 'bg-wheat-600 text-white'
                        : 'bg-stone-800 text-white'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  {opt.badge}
                </span>
              )}

              <div className="mt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">{opt.label}</p>
                <p className="font-serif text-2xl font-bold text-stone-900 mt-1">{opt.weight}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 w-full flex items-baseline justify-between">
                <span className="text-xl font-bold text-stone-900">₹{opt.price}</span>
                <span className="text-xs text-stone-500 font-medium">{opt.unitPrice}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
