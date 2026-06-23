import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import DistributorApplication from '@/models/DistributorApplication';
import { verifyUserToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DistributorDashboardClient from './DistributorDashboardClient';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { AlertCircle, FileClock, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DistributorDashboardPage() {
  const decoded = await verifyUserToken();

  // If not logged in, redirect to distributor login
  if (!decoded) {
    redirect('/distributor/login');
  }

  await dbConnect();

  // If user is a customer, block access and show onboarding/pending status
  if (decoded.role === 'customer') {
    // Check if they have a pending application
    const application = await DistributorApplication.findOne({ userId: decoded.userId });
    
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/50 p-8 text-center shadow-xl">
            <div className="rounded-full bg-amber-50 text-amber-700 p-4 w-16 h-16 flex items-center justify-center mx-auto border border-amber-100">
              {application ? <FileClock className="h-8 w-8" /> : <AlertCircle className="h-8 w-8" />}
            </div>
            
            <h2 className="font-serif text-2xl font-bold text-stone-900 mt-6">
              {application ? 'Application Under Review' : 'Access Restricted'}
            </h2>
            
            <p className="text-sm text-stone-600 mt-3 leading-relaxed">
              {application
                ? `Your application for "${application.companyName}" is currently pending review. Our admin team will verify your GSTIN credentials shortly.`
                : 'Your account is registered as a customer. To purchase wholesale stock, you must submit a distributor application first.'}
            </p>
            
            <div className="mt-8 pt-6 border-t border-stone-100">
              {application ? (
                <Link
                  href="/"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-stone-200 bg-white py-3 px-6 text-sm font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Return to Homepage
                </Link>
              ) : (
                <Link
                  href="/distributor/apply"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-brand-green-700 py-3.5 px-6 text-sm font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer"
                >
                  Apply as Distributor
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fetch distributor business profile
  const application = await DistributorApplication.findOne({ userId: decoded.userId, status: 'approved' });
  const userRecord = await User.findById(decoded.userId);

  if (!application || !userRecord) {
    // Edge case: role is distributor but application is missing or not approved
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/50 p-8 text-center shadow-xl">
            <h2 className="font-serif text-2xl font-bold text-red-600">Account Configuration Error</h2>
            <p className="text-sm text-stone-600 mt-3">
              Your profile is registered as distributor but your approved application record is missing. Please contact support.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Fetch past distributor orders
  const orders = await Order.find({ userId: decoded.userId, orderType: 'DISTRIBUTOR' }).sort({ createdAt: -1 });

  // Serialize Mongoose models for Client Component
  const serializedOrders = orders.map((o) => ({
    _id: o._id.toString(),
    orderId: o.orderId,
    quantity: o.quantity,
    price: o.price,
    paymentMethod: o.paymentMethod,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  const serializedUser = {
    name: userRecord.name,
    email: userRecord.email,
    phone: userRecord.phone || '',
    address: userRecord.address || '',
  };

  const serializedApp = {
    companyName: application.companyName,
    gstNumber: application.gstNumber,
  };

  return (
    <DistributorDashboardClient
      user={serializedUser}
      application={serializedApp}
      initialOrders={serializedOrders}
    />
  );
}
