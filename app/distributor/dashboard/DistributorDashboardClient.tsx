'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wheat,
  Building2,
  FileCheck,
  ShoppingBag,
  Truck,
  IndianRupee,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  History,
  Copy,
  Check,
  LogOut,
  MapPin,
  Phone
} from 'lucide-react';

interface OrderType {
  _id: string;
  orderId: string;
  quantity: string;
  price: number;
  paymentMethod: 'COD' | 'WHATSAPP';
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
}

interface DistributorDashboardClientProps {
  user: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  application: {
    companyName: string;
    gstNumber: string;
  };
  initialOrders: OrderType[];
}

export default function DistributorDashboardClient({
  user,
  application,
  initialOrders,
}: DistributorDashboardClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  
  // Order Form State
  const [quantities, setQuantities] = useState({
    qty5kg: 0,
    qty10kg: 0,
    qty25kg: 0,
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    name: application.companyName || user.name,
    phone: user.phone || '',
    address: user.address || '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // WhatsApp Redirect Modal
  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [placedMethod, setPlacedMethod] = useState<'COD' | 'WHATSAPP'>('COD');

  const pricing = {
    '5kg': 199,
    '10kg': 369,
    '25kg': 849,
  };

  // Calculations
  const weight5 = quantities.qty5kg * 5;
  const weight10 = quantities.qty10kg * 10;
  const weight25 = quantities.qty25kg * 25;
  const totalWeight = weight5 + weight10 + weight25;

  const cost5 = quantities.qty5kg * pricing['5kg'];
  const cost10 = quantities.qty10kg * pricing['10kg'];
  const cost25 = quantities.qty25kg * pricing['25kg'];
  const totalCost = cost5 + cost10 + cost25;

  const isMoqMet = totalWeight >= 100;

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const val = Math.max(0, parseInt(value) || 0);
    setQuantities((prev) => ({ ...prev, [name]: val }));
    if (formError) setFormError('');
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDeliveryDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showModal && countdown > 0 && placedMethod === 'WHATSAPP') {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showModal && countdown === 0 && whatsappLink && placedMethod === 'WHATSAPP') {
      window.open(whatsappLink, '_blank');
    }
    return () => clearTimeout(timer);
  }, [showModal, countdown, whatsappLink, placedMethod]);

  const handleSubmitOrder = async (method: 'COD' | 'WHATSAPP') => {
    if (!isMoqMet) {
      setFormError('Order weight does not meet the 100 kg Minimum Order Quantity (MOQ).');
      return;
    }

    if (!deliveryDetails.name.trim() || !deliveryDetails.phone.trim() || !deliveryDetails.address.trim()) {
      setFormError('All delivery detail fields are required.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setPlacedMethod(method);

    // Compile items array
    const items = [];
    const summaryParts = [];
    if (quantities.qty5kg > 0) {
      items.push({ quantityKey: '5kg', quantity: quantities.qty5kg, priceAtPurchase: pricing['5kg'] });
      summaryParts.push(`5kg x ${quantities.qty5kg}`);
    }
    if (quantities.qty10kg > 0) {
      items.push({ quantityKey: '10kg', quantity: quantities.qty10kg, priceAtPurchase: pricing['10kg'] });
      summaryParts.push(`10kg x ${quantities.qty10kg}`);
    }
    if (quantities.qty25kg > 0) {
      items.push({ quantityKey: '25kg', quantity: quantities.qty25kg, priceAtPurchase: pricing['25kg'] });
      summaryParts.push(`25kg x ${quantities.qty25kg}`);
    }

    const quantitySummary = summaryParts.join(', ');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          quantity: quantitySummary, // summary string
          price: totalCost,
          paymentMethod: method,
          orderType: 'DISTRIBUTOR',
          gstNumber: application.gstNumber,
          companyName: application.companyName,
          items,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place bulk order');
      }

      const order = data.order;
      setPlacedOrderId(order.orderId);

      // Append new order to log
      const newOrderLog: OrderType = {
        _id: order._id,
        orderId: order.orderId,
        quantity: order.quantity,
        price: order.price,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: new Date().toISOString(),
      };
      setOrders((prev) => [newOrderLog, ...prev]);

      // Reset quantities
      setQuantities({ qty5kg: 0, qty10kg: 0, qty25kg: 0 });

      if (method === 'COD') {
        setShowModal(true);
      } else {
        // WhatsApp redirection payload
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
        const messageText = `Hello, I want to confirm my distributor order:
Company Name: ${application.companyName}
GST Number: ${application.gstNumber}
Items:
${quantities.qty5kg > 0 ? `- 5kg Pack: ${quantities.qty5kg} units (${weight5} kg)\n` : ''}${quantities.qty10kg > 0 ? `- 10kg Pack: ${quantities.qty10kg} units (${weight10} kg)\n` : ''}${quantities.qty25kg > 0 ? `- 25kg Pack: ${quantities.qty25kg} units (${weight25} kg)\n` : ''}Total Weight: ${totalWeight} kg
Total Value: ₹${totalCost}
Order ID: ${order.orderId}

Please dispatch.`;

        const encodedMessage = encodeURIComponent(messageText);
        setWhatsappLink(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`);
        setShowModal(true);
        setCountdown(5);
      }
    } catch (err: any) {
      setFormError(err.message || 'Error processing order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brand-green-800 p-1.5 text-white">
              <Wheat className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-brand-green-800">
              Bagdi<span className="text-wheat-600">Atta</span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-stone-400 bg-stone-100 px-2.5 py-1 rounded-md">
                B2B Distributor Console
              </span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Info Card */}
        <div className="bg-white rounded-3xl border border-stone-200/50 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-brand-green-50 text-brand-green-700 p-3">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-stone-900">{application.companyName}</h2>
              <div className="flex items-center gap-3 text-xs text-stone-500 font-semibold mt-1">
                <span>GSTIN: {application.gstNumber}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                <span>Account Email: {user.email}</span>
              </div>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-100 px-3.5 py-1.5 text-xs font-semibold text-brand-green-800 border border-brand-green-200">
            <FileCheck className="h-4 w-4" />
            Approved Distributor
          </span>
        </div>

        {/* Ordering Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Order Form: 8 cols */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8 shadow-sm space-y-8">
            <div>
              <h3 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
                Bulk Purchase Form
              </h3>
              <p className="text-xs text-stone-400 mt-2 font-medium">
                Distributors get discounted rates on flour bags. Select bags below (MOQ 100 kg total).
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* 5kg Variant */}
              <div className="rounded-2xl border border-stone-200/60 p-5 bg-stone-50/20 text-center relative">
                <span className="text-[10px] font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded absolute top-3 left-3 uppercase">
                  Trial
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900 mt-4">5 KG Bag</h4>
                <div className="flex items-baseline justify-center gap-1 mt-2 text-brand-green-700">
                  <span className="text-lg font-bold">₹199</span>
                  <span className="text-[10px] text-stone-400 font-semibold line-through">₹249</span>
                </div>
                
                <div className="mt-5 max-w-[120px] mx-auto">
                  <label htmlFor="qty5kg" className="sr-only">5kg Quantity</label>
                  <input
                    type="number"
                    id="qty5kg"
                    name="qty5kg"
                    min="0"
                    placeholder="0"
                    value={quantities.qty5kg || ''}
                    onChange={handleQtyChange}
                    className="w-full text-center rounded-xl border border-stone-200 py-2.5 font-bold text-stone-800 bg-white"
                  />
                </div>
                <span className="block text-[10px] text-stone-400 font-semibold mt-2">
                  Subtotal: ₹{cost5} ({weight5} kg)
                </span>
              </div>

              {/* 10kg Variant */}
              <div className="rounded-2xl border border-stone-200/60 p-5 bg-stone-50/20 text-center relative">
                <span className="text-[10px] font-bold text-wheat-800 bg-wheat-100 px-2 py-0.5 rounded absolute top-3 left-3 uppercase">
                  Popular
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900 mt-4">10 KG Bag</h4>
                <div className="flex items-baseline justify-center gap-1 mt-2 text-brand-green-700">
                  <span className="text-lg font-bold">₹369</span>
                  <span className="text-[10px] text-stone-400 font-semibold line-through">₹469</span>
                </div>
                
                <div className="mt-5 max-w-[120px] mx-auto">
                  <label htmlFor="qty10kg" className="sr-only">10kg Quantity</label>
                  <input
                    type="number"
                    id="qty10kg"
                    name="qty10kg"
                    min="0"
                    placeholder="0"
                    value={quantities.qty10kg || ''}
                    onChange={handleQtyChange}
                    className="w-full text-center rounded-xl border border-stone-200 py-2.5 font-bold text-stone-800 bg-white"
                  />
                </div>
                <span className="block text-[10px] text-stone-400 font-semibold mt-2">
                  Subtotal: ₹{cost10} ({weight10} kg)
                </span>
              </div>

              {/* 25kg Variant */}
              <div className="rounded-2xl border border-stone-200/60 p-5 bg-stone-50/20 text-center relative">
                <span className="text-[10px] font-bold text-white bg-brand-green-700 px-2 py-0.5 rounded absolute top-3 left-3 uppercase">
                  Bulk Value
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900 mt-4">25 KG Bag</h4>
                <div className="flex items-baseline justify-center gap-1 mt-2 text-brand-green-700">
                  <span className="text-lg font-bold">₹849</span>
                  <span className="text-[10px] text-stone-400 font-semibold line-through">₹1099</span>
                </div>
                
                <div className="mt-5 max-w-[120px] mx-auto">
                  <label htmlFor="qty25kg" className="sr-only">25kg Quantity</label>
                  <input
                    type="number"
                    id="qty25kg"
                    name="qty25kg"
                    min="0"
                    placeholder="0"
                    value={quantities.qty25kg || ''}
                    onChange={handleQtyChange}
                    className="w-full text-center rounded-xl border border-stone-200 py-2.5 font-bold text-stone-800 bg-white"
                  />
                </div>
                <span className="block text-[10px] text-stone-400 font-semibold mt-2">
                  Subtotal: ₹{cost25} ({weight25} kg)
                </span>
              </div>
            </div>

            {/* Delivery address details */}
            <div className="border-t border-stone-100 pt-6 space-y-4">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
                Wholesale Delivery Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Contact Name */}
                <div>
                  <label htmlFor="deliveryName" className="block text-xs font-semibold text-stone-500 mb-1">Receiver Name / Company</label>
                  <input
                    type="text"
                    id="deliveryName"
                    name="name"
                    value={deliveryDetails.name}
                    onChange={handleDetailsChange}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm font-medium bg-stone-50/50"
                  />
                </div>
                {/* Contact Phone */}
                <div>
                  <label htmlFor="deliveryPhone" className="block text-xs font-semibold text-stone-500 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    id="deliveryPhone"
                    name="phone"
                    value={deliveryDetails.phone}
                    onChange={handleDetailsChange}
                    className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm font-medium bg-stone-50/50"
                  />
                </div>
              </div>
              {/* Contact Address */}
              <div>
                <label htmlFor="deliveryAddress" className="block text-xs font-semibold text-stone-500 mb-1">Warehouse Address</label>
                <textarea
                  id="deliveryAddress"
                  name="address"
                  rows={3}
                  value={deliveryDetails.address}
                  onChange={handleDetailsChange}
                  className="w-full rounded-xl border border-stone-200 px-3.5 py-2 text-sm font-medium bg-stone-50/50 resize-none"
                />
              </div>
            </div>

          </div>

          {/* Right Summary: 4 cols */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* MOQ Checker & Total summary card */}
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm space-y-5">
              <h3 className="text-md font-bold text-stone-900 border-b border-stone-100 pb-2">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-baseline text-sm font-semibold text-stone-500">
                  <span>Total Weight:</span>
                  <span className={`text-base font-bold ${isMoqMet ? 'text-brand-green-700' : 'text-red-600'}`}>
                    {totalWeight} kg
                  </span>
                </div>

                {/* MOQ Progress indicator */}
                <div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isMoqMet ? 'bg-brand-green-700' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, (totalWeight / 100) * 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold mt-1 text-stone-400">
                    <span>MOQ Target: 100 kg</span>
                    <span>{isMoqMet ? 'Met! ✓' : `${100 - totalWeight} kg left`}</span>
                  </div>
                </div>

                {/* Info alert warnings */}
                {!isMoqMet && (
                  <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-[11px] font-semibold text-red-800 flex items-start gap-2">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      Bulk orders must meet the Minimum Order Quantity of <strong>100 kg</strong> before checkout. Add more bags.
                    </p>
                  </div>
                )}

                {isMoqMet && (
                  <div className="rounded-xl bg-brand-green-50 border border-brand-green-100 p-3 text-[11px] font-semibold text-brand-green-800 flex items-start gap-2">
                    <ShieldCheck className="h-4.5 w-4.5 text-brand-green-700 flex-shrink-0 mt-0.5" />
                    <p className="leading-normal">
                      MOQ target achieved. You qualify for wholesale pricing.
                    </p>
                  </div>
                )}

                <div className="border-t border-stone-100 pt-4 flex justify-between items-baseline font-bold text-stone-900">
                  <span className="text-sm font-serif">Bulk Pricing Total</span>
                  <span className="text-2xl">₹{totalCost}</span>
                </div>
              </div>
            </div>

            {/* Submit buttons */}
            <div className="space-y-3">
              {formError && (
                <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs font-semibold text-red-800 flex items-start gap-2">
                  <AlertTriangle className="h-4.5 w-4.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Order via WhatsApp */}
              <button
                onClick={() => handleSubmitOrder('WHATSAPP')}
                disabled={isSubmitting || !isMoqMet}
                className="w-full flex items-center justify-center gap-2.5 rounded-full bg-brand-green-700 py-4 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all shadow-md shadow-brand-green-700/20 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <MessageSquare className="h-4 w-4" />
                Place Wholesale Order via WhatsApp
              </button>

              {/* Cash on Delivery */}
              <button
                onClick={() => handleSubmitOrder('COD')}
                disabled={isSubmitting || !isMoqMet}
                className="w-full flex items-center justify-center gap-2.5 rounded-full bg-wheat-500 py-4 px-6 text-sm font-bold text-stone-900 hover:bg-wheat-400 transition-all shadow-md shadow-wheat-500/10 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-amber-900" />
                Place Order via Cash on Delivery
              </button>
            </div>

          </div>

        </div>

        {/* B2B Order History */}
        <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-stone-100 flex items-center gap-2">
            <History className="h-5 w-5 text-brand-green-800" />
            <h2 className="text-lg font-bold text-stone-900 font-serif">Past B2B Purchases</h2>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-sm">
              No past purchases found. Place your first wholesale order above.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Order Details</th>
                    <th className="px-6 py-4">Total Price</th>
                    <th className="px-6 py-4">Payment Option</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700">
                  {orders.map((o) => {
                    const isCopied = copiedId === o.orderId;
                    return (
                      <tr key={o._id} className="hover:bg-stone-50/50">
                        {/* ID */}
                        <td className="px-6 py-4 font-mono font-bold text-xs uppercase tracking-wider text-stone-900">
                          <button
                            onClick={() => copyToClipboard(o.orderId, o.orderId)}
                            className="inline-flex items-center gap-1.5 hover:text-brand-green-700 focus:outline-none cursor-pointer"
                          >
                            {o.orderId}
                            {isCopied ? <Check className="h-3.5 w-3.5 text-brand-green-600" /> : <Copy className="h-3.5 w-3.5 text-stone-400" />}
                          </button>
                        </td>

                        {/* Details */}
                        <td className="px-6 py-4 text-xs font-bold text-stone-600">
                          {o.quantity}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-bold text-stone-900">
                          ₹{o.price}
                        </td>

                        {/* Method */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            o.paymentMethod === 'WHATSAPP' ? 'bg-brand-green-50 text-brand-green-800' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {o.paymentMethod === 'WHATSAPP' ? 'WhatsApp' : 'COD'}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {o.status === 'confirmed' && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-100 px-3 py-1 text-xs font-semibold text-brand-green-800">
                              Confirmed
                            </span>
                          )}
                          {o.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                              Rejected
                            </span>
                          )}
                          {o.status === 'pending' && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                              Pending
                            </span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-xs text-stone-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-stone-200 text-center shadow-2xl animate-scale-up">
            
            {placedMethod === 'WHATSAPP' && countdown > 0 ? (
              <>
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center bg-wheat-50 rounded-full border border-wheat-100 text-wheat-600">
                  <Wheat className="h-10 w-10 animate-rotate-slow" />
                  <span className="absolute text-sm font-black text-stone-900 bg-white border border-stone-200 w-7 h-7 rounded-full flex items-center justify-center shadow-md">
                    {countdown}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-6">
                  Redirecting to WhatsApp
                </h3>
                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  We are opening WhatsApp in a new tab with your pre-filled wholesale message. Please send it to confirm...
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 mx-auto bg-brand-green-50 text-brand-green-700 rounded-full flex items-center justify-center border border-brand-green-100">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-6">
                  Wholesale Order Placed!
                </h3>
                <p className="text-sm text-stone-600 mt-3 leading-relaxed">
                  {placedMethod === 'WHATSAPP'
                    ? 'Your wholesale order details are submitted. Once you send the pre-filled WhatsApp message, our logistics manager will coordinate the bulk dispatch.'
                    : 'Your bulk order is logged! Our B2B accounts team will call you shortly to verify your GST and shipping warehouse coordinates before shipping.'}
                </p>
                <div className="mt-8 pt-6 border-t border-stone-100">
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* Footer spacer */}
      <div className="h-16" />
    </div>
  );
}
