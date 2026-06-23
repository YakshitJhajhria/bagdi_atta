import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import DistributorApplication from '@/models/DistributorApplication';
import Category from '@/models/Category';
import Subcategory from '@/models/Subcategory';
import Product from '@/models/Product';
import { verifyAdminToken } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const isAdmin = await verifyAdminToken();

  if (!isAdmin) {
    redirect('/admin/login');
  }

  try {
    await dbConnect();
    
    // Fetch all orders
    const orders = await Order.find({}).sort({ createdAt: -1 });

    // Fetch all users (customers and distributors, excluding admin)
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password').sort({ createdAt: -1 });

    // Fetch all distributor applications
    const applications = await DistributorApplication.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    // Fetch categories and products
    const categories = await Category.find({}).sort({ name: 1 });
    const subcategories = await Subcategory.find({}).sort({ name: 1 });
    const products = await Product.find({})
      .populate('category')
      .populate('subcategory')
      .sort({ createdAt: -1 });

    // Serialize Mongoose documents into plain objects for the Client Component
    const plainOrders = orders.map((order) => ({
      _id: order._id.toString(),
      orderId: order.orderId,
      name: order.name,
      phone: order.phone,
      address: order.address,
      product: order.product,
      quantity: order.quantity,
      price: order.price,
      paymentMethod: order.paymentMethod,
      status: order.status,
      orderType: order.orderType || 'D2C',
      companyName: order.companyName || '',
      gstNumber: order.gstNumber || '',
      createdAt: order.createdAt.toISOString(),
    }));

    const plainUsers = users.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      address: u.address || '',
      role: u.role,
      createdAt: u.createdAt.toISOString(),
    }));

    const plainApplications = applications.map((app) => ({
      _id: app._id.toString(),
      companyName: app.companyName,
      gstNumber: app.gstNumber,
      expectedMonthlyVolume: app.expectedMonthlyVolume,
      status: app.status,
      createdAt: app.createdAt.toISOString(),
      userId: app.userId ? {
        _id: (app.userId as any)._id.toString(),
        name: (app.userId as any).name,
        email: (app.userId as any).email,
        role: (app.userId as any).role,
      } : null,
    }));

    const plainCategories = categories.map((cat) => ({
      _id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
    }));

    const plainSubcategories = subcategories.map((sub) => ({
      _id: sub._id.toString(),
      name: sub.name,
      slug: sub.slug,
      category: sub.category.toString(),
      description: sub.description || '',
    }));

    const plainProducts = products.map((prod) => ({
      _id: prod._id.toString(),
      name: prod.name,
      slug: prod.slug,
      description: prod.description,
      category: prod.category ? {
        _id: (prod.category as any)._id.toString(),
        name: (prod.category as any).name,
        slug: (prod.category as any).slug,
      } : null,
      subcategory: prod.subcategory ? {
        _id: (prod.subcategory as any)._id.toString(),
        name: (prod.subcategory as any).name,
        slug: (prod.subcategory as any).slug,
      } : null,
      variants: prod.variants.map((v) => ({
        size: v.size,
        price: v.price,
        wholesalePrice: v.wholesalePrice,
        stock: v.stock,
      })),
      nutritionalFacts: prod.nutritionalFacts.map((f) => ({
        label: f.label,
        value: f.value,
      })),
      specifications: prod.specifications.map((s) => ({
        label: s.label,
        value: s.value,
      })),
      isActive: prod.isActive,
      createdAt: prod.createdAt.toISOString(),
    }));

    return (
      <DashboardClient
        initialOrders={plainOrders}
        initialUsers={plainUsers}
        initialApplications={plainApplications}
        initialCategories={plainCategories}
        initialSubcategories={plainSubcategories}
        initialProducts={plainProducts}
      />
    );
  } catch (error: any) {
    console.error('Database connection failed in admin dashboard:', error);
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-4 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl border border-stone-200/50 p-8 shadow-2xl">
          <div className="rounded-full bg-red-50 text-red-700 p-4 w-16 h-16 flex items-center justify-center mx-auto border border-red-100">
            <AlertTriangle className="h-8 w-8" />
          </div>
          
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-6">
            Database Connection Failed
          </h2>
          
          <p className="text-sm text-stone-600 mt-3 leading-relaxed">
            Your server is failing to connect to MongoDB Atlas. This happens because your network IP address is not whitelisted.
          </p>
          
          <div className="bg-stone-50 rounded-2xl border border-stone-100 p-4 mt-6 text-left space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Your Public IP Address</p>
            <p className="font-mono text-sm font-bold text-stone-955 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
              223.184.238.27
            </p>
            <p className="text-xs text-stone-400 mt-2 font-medium leading-relaxed">
              Please log in to your MongoDB Atlas dashboard, go to <strong>Network Access</strong>, and add this IP (or <code>0.0.0.0/0</code>) to the whitelist.
            </p>
          </div>
          
          <a
            href="/admin/dashboard"
            className="mt-8 w-full inline-flex justify-center rounded-full bg-brand-green-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-green-800 transition-all cursor-pointer shadow-md shadow-brand-green-700/10"
          >
            Retry Connection
          </a>
        </div>
      </div>
    );
  }
}

