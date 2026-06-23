'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Wheat,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  ShoppingBag,
  MessageSquare,
  Truck,
  Copy,
  Check,
  Building2,
  Users,
  FileCheck,
  Plus,
  Trash2,
  Edit,
  Tag,
  FolderTree,
  Eye,
  EyeOff,
  Settings,
  Bot
} from 'lucide-react';

interface OrderType {
  _id: string;
  orderId: string;
  name: string;
  phone: string;
  address: string;
  product: string;
  quantity: string;
  price: number;
  paymentMethod: 'COD' | 'WHATSAPP';
  status: 'pending' | 'confirmed' | 'rejected';
  orderType: 'D2C' | 'DISTRIBUTOR';
  companyName?: string;
  gstNumber?: string;
  createdAt: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'customer' | 'distributor' | 'admin';
  createdAt: string;
}

interface ApplicationType {
  _id: string;
  companyName: string;
  gstNumber: string;
  expectedMonthlyVolume: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

interface CategoryType {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

interface SubcategoryType {
  _id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

interface ProductType {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: { _id: string; name: string; slug: string } | null;
  subcategory: { _id: string; name: string; slug: string } | null;
  variants: { size: string; price: number; wholesalePrice: number; stock: number }[];
  nutritionalFacts: { label: string; value: string }[];
  specifications: { label: string; value: string }[];
  isActive: boolean;
  createdAt: string;
}

interface DashboardClientProps {
  initialOrders: OrderType[];
  initialUsers: UserType[];
  initialApplications: ApplicationType[];
  initialCategories: CategoryType[];
  initialSubcategories: SubcategoryType[];
  initialProducts: ProductType[];
}

export default function DashboardClient({
  initialOrders,
  initialUsers,
  initialApplications,
  initialCategories,
  initialSubcategories,
  initialProducts,
}: DashboardClientProps) {
  const router = useRouter();
  
  // States
  const [orders, setOrders] = useState<OrderType[]>(initialOrders);
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [applications, setApplications] = useState<ApplicationType[]>(initialApplications);
  const [categories, setCategories] = useState<CategoryType[]>(initialCategories);
  const [subcategories, setSubcategories] = useState<SubcategoryType[]>(initialSubcategories);
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  
  const [activeTab, setActiveTab] = useState<'orders' | 'applications' | 'users' | 'products' | 'categories' | 'chatbot'>('orders');
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all'); // all, D2C, DISTRIBUTOR

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category and Subcategory Form States
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubDesc, setNewSubDesc] = useState('');
  const [newSubParent, setNewSubParent] = useState('');

  // Product Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCat, setProdCat] = useState('');
  const [prodSub, setProdSub] = useState('');
  const [prodActive, setProdActive] = useState(true);
  const [prodVariants, setProdVariants] = useState<{ size: string; price: number; wholesalePrice: number; stock: number }[]>([
    { size: '5kg', price: 0, wholesalePrice: 0, stock: 100 }
  ]);
  const [prodNutritional, setProdNutritional] = useState<{ label: string; value: string }[]>([]);
  const [prodSpecs, setProdSpecs] = useState<{ label: string; value: string }[]>([]);

  // Chatbot settings states
  const [botWelcome, setBotWelcome] = useState('');
  const [botMoq, setBotMoq] = useState('');
  const [botDistributor, setBotDistributor] = useState('');
  const [botShipping, setBotShipping] = useState('');
  const [botReturns, setBotReturns] = useState('');
  const [botProducts, setBotProducts] = useState('');
  const [botWhatsapp, setBotWhatsapp] = useState('');
  const [isUpdatingBot, setIsUpdatingBot] = useState(false);

  // Statistics
  const totalOrders = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const d2cOrdersCount = orders.filter((o) => o.orderType === 'D2C').length;
  const pendingAppsCount = applications.filter((app) => app.status === 'pending').length;

  const totalD2cRevenue = orders
    .filter((o) => o.status === 'confirmed' && o.orderType === 'D2C')
    .reduce((sum, o) => sum + o.price, 0);

  const totalB2bRevenue = orders
    .filter((o) => o.status === 'confirmed' && o.orderType === 'DISTRIBUTOR')
    .reduce((sum, o) => sum + o.price, 0);

  const totalRevenue = totalD2cRevenue + totalB2bRevenue;

  // Load chatbot settings on dashboard load
  useEffect(() => {
    async function loadBotSettings() {
      try {
        const res = await fetch('/api/chatbot/settings');
        const data = await res.json();
        if (res.ok && data.success && data.settings) {
          setBotWelcome(data.settings.welcomeMessage || '');
          setBotMoq(data.settings.moq || '');
          setBotDistributor(data.settings.distributor || '');
          setBotShipping(data.settings.shipping || '');
          setBotReturns(data.settings.returns || '');
          setBotProducts(data.settings.products || '');
          setBotWhatsapp(data.settings.whatsapp || '');
        }
      } catch (err) {
        console.error('Failed to load bot settings in admin:', err);
      }
    }
    loadBotSettings();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/auth', { method: 'DELETE' });
      if (response.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: 'confirmed' | 'rejected') => {
    setUpdatingId(orderId);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order.orderId === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Failed to update order:', error);
      alert('Error updating order');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(applicationId);
    try {
      const response = await fetch('/api/admin/distributors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        if (newStatus === 'approved' && data.application.userId) {
          const appUserId = data.application.userId._id;
          setUsers((prev) =>
            prev.map((u) => (u._id === appUserId ? { ...u, role: 'distributor' } : u))
          );
        }
      } else {
        alert(data.error || 'Failed to update application');
      }
    } catch (error) {
      console.error('Failed to update application:', error);
      alert('Error updating application');
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // API Call: Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName) return;

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName, description: newCatDesc }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCategories((prev) => [...prev, data.category].sort((a, b) => a.name.localeCompare(b.name)));
        setNewCatName('');
        setNewCatDesc('');
        alert('Category created successfully!');
      } else {
        alert(data.error || 'Failed to create category');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating category');
    }
  };

  // API Call: Create Subcategory
  const handleCreateSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubParent) return;

    try {
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubName, description: newSubDesc, categoryId: newSubParent }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSubcategories((prev) => [...prev, data.subcategory].sort((a, b) => a.name.localeCompare(b.name)));
        setNewSubName('');
        setNewSubDesc('');
        setNewSubParent('');
        alert('Subcategory created successfully!');
      } else {
        alert(data.error || 'Failed to create subcategory');
      }
    } catch (error) {
      console.error(error);
      alert('Error creating subcategory');
    }
  };

  // API Call: Save Chatbot Settings
  const handleSaveBotSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingBot(true);

    try {
      const response = await fetch('/api/chatbot/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          welcomeMessage: botWelcome,
          moq: botMoq,
          distributor: botDistributor,
          shipping: botShipping,
          returns: botReturns,
          products: botProducts,
          whatsapp: botWhatsapp,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        alert('Chatbot auto-replies updated successfully!');
      } else {
        alert(data.error || 'Failed to update chatbot settings');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating chatbot settings');
    } finally {
      setIsUpdatingBot(false);
    }
  };

  // Variant Editor Helper
  const handleAddVariantField = () => {
    setProdVariants((prev) => [...prev, { size: '', price: 0, wholesalePrice: 0, stock: 0 }]);
  };
  const handleRemoveVariantField = (index: number) => {
    setProdVariants((prev) => prev.filter((_, i) => i !== index));
  };
  const handleVariantChange = (index: number, key: string, val: any) => {
    setProdVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: val } : v))
    );
  };

  // Nutritional Specs Editor Helper
  const handleAddFactField = () => {
    setProdNutritional((prev) => [...prev, { label: '', value: '' }]);
  };
  const handleRemoveFactField = (index: number) => {
    setProdNutritional((prev) => prev.filter((_, i) => i !== index));
  };
  const handleFactChange = (index: number, key: string, val: string) => {
    setProdNutritional((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [key]: val } : f))
    );
  };

  // Specifications Editor Helper
  const handleAddSpecField = () => {
    setProdSpecs((prev) => [...prev, { label: '', value: '' }]);
  };
  const handleRemoveSpecField = (index: number) => {
    setProdSpecs((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSpecChange = (index: number, key: string, val: string) => {
    setProdSpecs((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: val } : s))
    );
  };

  // API Call: Create/Update Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodDesc || !prodCat || prodVariants.length === 0) {
      alert('Please fill out all required fields (Name, Description, Category, and Variants).');
      return;
    }

    const payload = {
      id: editingProductId,
      name: prodName,
      description: prodDesc,
      category: prodCat,
      subcategory: prodSub || undefined,
      variants: prodVariants,
      nutritionalFacts: prodNutritional.filter((f) => f.label && f.value),
      specifications: prodSpecs.filter((s) => s.label && s.value),
      isActive: prodActive,
    };

    try {
      const method = isEditingProduct ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        if (isEditingProduct) {
          setProducts((prev) =>
            prev.map((p) => (p._id === data.product._id ? data.product : p))
          );
          alert('Product updated successfully!');
        } else {
          setProducts((prev) => [data.product, ...prev]);
          alert('Product registered successfully!');
        }
        resetProductForm();
      } else {
        alert(data.error || 'Failed to save product');
      }
    } catch (error) {
      console.error(error);
      alert('Error saving product');
    }
  };

  const handleEditProductClick = (prod: ProductType) => {
    setIsEditingProduct(true);
    setEditingProductId(prod._id);
    setProdName(prod.name);
    setProdDesc(prod.description);
    setProdCat(prod.category?._id || '');
    setProdSub(prod.subcategory?._id || '');
    setProdActive(prod.isActive);
    setProdVariants(prod.variants);
    setProdNutritional(prod.nutritionalFacts);
    setProdSpecs(prod.specifications);
    setShowProductForm(true);
  };

  const handleToggleProductActive = async (prod: ProductType) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prod._id, isActive: !prod.isActive }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === prod._id ? { ...p, isActive: !prod.isActive } : p))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const resetProductForm = () => {
    setShowProductForm(false);
    setIsEditingProduct(false);
    setEditingProductId(null);
    setProdName('');
    setProdDesc('');
    setProdCat('');
    setProdSub('');
    setProdActive(true);
    setProdVariants([{ size: '5kg', price: 0, wholesalePrice: 0, stock: 100 }]);
    setProdNutritional([]);
    setProdSpecs([]);
  };

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.companyName && order.companyName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || order.paymentMethod === methodFilter;
    const matchesOrderType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;

    return matchesSearch && matchesStatus && matchesMethod && matchesOrderType;
  });

  // Filtered Applications
  const filteredApplications = applications.filter((app) => {
    return (
      app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.gstNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.userId && app.userId.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    return (
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm)
    );
  });

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (p.category && p.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

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
                Admin Console
              </span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log Out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-stone-200 gap-x-6 gap-y-2">
          <button
            onClick={() => { setActiveTab('orders'); setSearchTerm(''); }}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'border-brand-green-700 text-brand-green-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            Orders ({orders.length})
          </button>

          <button
            onClick={() => { setActiveTab('products'); setSearchTerm(''); }}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'border-brand-green-700 text-brand-green-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Tag className="h-4.5 w-4.5" />
            Products Inventory ({products.length})
          </button>

          <button
            onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'border-brand-green-700 text-brand-green-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <FolderTree className="h-4.5 w-4.5" />
            Categories
          </button>

          <button
            onClick={() => { setActiveTab('chatbot'); setSearchTerm(''); }}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'chatbot'
                ? 'border-brand-green-700 text-brand-green-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5" />
            Chatbot Auto-Replies
          </button>

          <button
            onClick={() => { setActiveTab('applications'); setSearchTerm(''); }}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer relative ${
              activeTab === 'applications'
                ? 'border-brand-green-700 text-brand-green-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Building2 className="h-4.5 w-4.5" />
            Distributor Applications
            {pendingAppsCount > 0 && (
              <span className="bg-red-500 text-white rounded-full text-[9px] font-bold px-1.5 py-0.5 ml-1 animate-pulse">
                {pendingAppsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('users'); setSearchTerm(''); }}
            className={`pb-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'border-brand-green-700 text-brand-green-800'
                : 'border-transparent text-stone-500 hover:text-stone-700'
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            Registered Users ({users.length})
          </button>
        </div>

        {/* Tab 1: Orders View */}
        {activeTab === 'orders' && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-white rounded-2xl border border-stone-200/50 p-6 flex items-center gap-5 shadow-sm">
                <div className="rounded-xl bg-blue-50 text-blue-700 p-3">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Orders</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{totalOrders}</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200/50 p-6 flex items-center gap-5 shadow-sm">
                <div className="rounded-xl bg-amber-50 text-amber-700 p-3">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Pending Orders</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{pendingOrdersCount}</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200/50 p-6 flex items-center gap-5 shadow-sm">
                <div className="rounded-xl bg-brand-green-50 text-brand-green-700 p-3">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">B2C Retail Vol</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">{d2cOrdersCount} orders</h3>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200/50 p-6 flex items-center gap-5 shadow-sm">
                <div className="rounded-xl bg-emerald-50 text-emerald-700 p-3">
                  <IndianRupee className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">Total Confirmed Sales</p>
                  <h3 className="text-2xl font-black text-stone-900 mt-1">₹{totalRevenue}</h3>
                  <p className="text-[10px] text-stone-400 mt-1">
                    B2C: ₹{totalD2cRevenue} | B2B: ₹{totalB2bRevenue}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:max-w-md">
                <input
                  type="text"
                  placeholder="Search by customer, phone, order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>

              <div className="flex flex-wrap gap-4 w-full md:w-auto justify-end">
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-semibold text-stone-600 py-2.5 pl-3 pr-8 focus:outline-none"
                >
                  <option value="all">All Channels</option>
                  <option value="D2C">Retail (D2C)</option>
                  <option value="DISTRIBUTOR">Wholesale (B2B)</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-semibold text-stone-600 py-2.5 pl-3 pr-8 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="rounded-xl border border-stone-200 bg-stone-50/50 text-xs font-semibold text-stone-600 py-2.5 pl-3 pr-8 focus:outline-none"
                >
                  <option value="all">All Payments</option>
                  <option value="COD">Cash on Delivery</option>
                  <option value="WHATSAPP">WhatsApp</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer Details</th>
                      <th className="px-6 py-4">Quantity Summary</th>
                      <th className="px-6 py-4">Total Amount</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-12 text-stone-400">
                           No matching orders found.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => {
                        const isCopied = copiedId === order.orderId;
                        return (
                          <tr key={order._id} className="hover:bg-stone-50/50">
                            <td className="px-6 py-4 font-mono font-bold text-xs uppercase tracking-wider text-stone-905">
                              <button
                                onClick={() => copyToClipboard(order.orderId, order.orderId)}
                                className="inline-flex items-center gap-1.5 hover:text-brand-green-700 focus:outline-none cursor-pointer"
                              >
                                {order.orderId}
                                {isCopied ? <Check className="h-3.5 w-3.5 text-brand-green-600" /> : <Copy className="h-3.5 w-3.5 text-stone-400" />}
                              </button>
                            </td>

                            <td className="px-6 py-4">
                              <div>
                                <p className="font-bold text-stone-900">
                                  {order.orderType === 'DISTRIBUTOR' ? order.companyName : order.name}
                                </p>
                                <p className="text-xs text-stone-500 font-semibold mt-0.5">{order.phone}</p>
                                {order.orderType === 'DISTRIBUTOR' && order.gstNumber && (
                                  <p className="text-[10px] font-bold text-amber-700 mt-1 uppercase">GSTIN: {order.gstNumber}</p>
                                )}
                              </div>
                            </td>

                            <td className="px-6 py-4 text-xs font-bold text-stone-600">
                              {order.quantity}
                            </td>

                            <td className="px-6 py-4 font-bold text-stone-905">
                              ₹{order.price}
                            </td>

                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold ${
                                order.orderType === 'DISTRIBUTOR' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                              }`}>
                                {order.orderType === 'DISTRIBUTOR' ? 'B2B Wholesale' : 'D2C Retail'}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold">{order.paymentMethod}</span>
                            </td>

                            <td className="px-6 py-4">
                              {order.status === 'confirmed' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-100 px-3 py-1 text-xs font-semibold text-brand-green-800">
                                  Confirmed
                                </span>
                              )}
                              {order.status === 'rejected' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
                                  Rejected
                                </span>
                              )}
                              {order.status === 'pending' && (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                                  Pending
                                </span>
                              )}
                            </td>

                            <td className="px-6 py-4 text-right">
                              {order.status === 'pending' ? (
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.orderId, 'confirmed')}
                                    disabled={updatingId === order.orderId}
                                    className="inline-flex items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-700 hover:bg-brand-green-100 p-2 border border-brand-green-200/50 transition-colors disabled:opacity-50 cursor-pointer"
                                    title="Confirm"
                                  >
                                    <CheckCircle className="h-4.5 w-4.5" />
                                  </button>
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.orderId, 'rejected')}
                                    disabled={updatingId === order.orderId}
                                    className="inline-flex items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 p-2 border border-red-200/50 transition-colors disabled:opacity-50 cursor-pointer"
                                    title="Reject"
                                  >
                                    <XCircle className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-stone-400 font-semibold italic">Processed</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Products Inventory Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm flex-wrap gap-4">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search staples inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2.5 text-sm font-medium text-stone-850 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white"
                />
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>

              {!showProductForm && (
                <button
                  onClick={() => setShowProductForm(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-green-700 hover:bg-brand-green-800 text-white px-5 py-3 text-xs font-bold transition-all cursor-pointer shadow-sm shadow-brand-green-700/10"
                >
                  <Plus className="h-4 w-4" />
                  Add New Product
                </button>
              )}
            </div>

            {showProductForm && (
              <form onSubmit={handleSaveProduct} className="bg-white rounded-3xl border border-stone-250 p-6 sm:p-8 shadow-md space-y-6 animate-in slide-in-from-top-4">
                <div className="flex items-center justify-between border-b border-stone-150 pb-4">
                  <h3 className="font-serif text-xl font-bold text-stone-900">
                    {isEditingProduct ? `Edit Staple: ${prodName}` : 'Register New Kitchen Staple'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="text-xs font-bold text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-2">Staple Name *</label>
                      <input
                        type="text"
                        required
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="e.g. Bagdi Cold Pressed Mustard Oil"
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-sm focus:bg-white text-stone-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-2">Category *</label>
                      <select
                        required
                        value={prodCat}
                        onChange={(e) => { setProdCat(e.target.value); setProdSub(''); }}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-sm focus:bg-white text-stone-900 focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-2">Subcategory (Optional)</label>
                      <select
                        value={prodSub}
                        onChange={(e) => setProdSub(e.target.value)}
                        className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-sm focus:bg-white text-stone-900 focus:outline-none"
                      >
                        <option value="">No Subcategory</option>
                        {subcategories
                          .filter((s) => s.category === prodCat)
                          .map((s) => (
                            <option key={s._id} value={s._id}>{s.name}</option>
                          ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3 py-2">
                      <input
                        type="checkbox"
                        id="prodActive"
                        checked={prodActive}
                        onChange={(e) => setProdActive(e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-stone-300 text-brand-green-700 focus:ring-brand-green-600"
                      />
                      <label htmlFor="prodActive" className="text-xs font-bold text-stone-600 uppercase tracking-wider cursor-pointer">
                        Staple is Active & Visible in Public Catalog
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-550 uppercase tracking-wider mb-2">Product Description *</label>
                    <textarea
                      required
                      rows={6}
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      placeholder="Specify the benefits, purity standard, milling details..."
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-sm focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Variants Editor */}
                <div className="border-t border-stone-150 pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Product Variants *</h4>
                    <button
                      type="button"
                      onClick={handleAddVariantField}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 hover:text-brand-green-800"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Variant
                    </button>
                  </div>

                  <div className="space-y-3">
                    {prodVariants.map((v, index) => (
                      <div key={index} className="flex flex-wrap gap-3 items-end bg-stone-50 p-3.5 rounded-2xl border border-stone-200/50">
                        <div className="flex-1 min-w-[120px]">
                          <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-1">Variant Size (e.g. 5kg, 1L)</label>
                          <input
                            type="text"
                            required
                            placeholder="size"
                            value={v.size}
                            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                            className="w-full rounded-lg border border-stone-250 bg-white p-2 text-xs text-stone-900 focus:outline-none"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-1">Retail Price (₹)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="price"
                            value={v.price || ''}
                            onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                            className="w-full rounded-lg border border-stone-250 bg-white p-2 text-xs text-stone-900 focus:outline-none"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-1">Wholesale (₹)</label>
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="wholesale"
                            value={v.wholesalePrice || ''}
                            onChange={(e) => handleVariantChange(index, 'wholesalePrice', Number(e.target.value))}
                            className="w-full rounded-lg border border-stone-250 bg-white p-2 text-xs text-stone-900 focus:outline-none"
                          />
                        </div>
                        <div className="w-24">
                          <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-1">Stock Count</label>
                          <input
                            type="number"
                            required
                            min={0}
                            placeholder="stock"
                            value={v.stock || '0'}
                            onChange={(e) => handleVariantChange(index, 'stock', Number(e.target.value))}
                            className="w-full rounded-lg border border-stone-250 bg-white p-2 text-xs text-stone-900 focus:outline-none"
                          />
                        </div>
                        {prodVariants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariantField(index)}
                            className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specs and Nutritional Editor */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-stone-150 pt-6">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Product Specifications</h4>
                      <button
                        type="button"
                        onClick={handleAddSpecField}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 hover:text-brand-green-800"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Label
                      </button>
                    </div>
                    <div className="space-y-2">
                      {prodSpecs.map((s, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Label (e.g. Shelf Life)"
                            value={s.label}
                            onChange={(e) => handleSpecChange(index, 'label', e.target.value)}
                            className="w-1/2 rounded-lg border border-stone-250 p-2 text-xs focus:bg-white text-stone-900 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 3 Months)"
                            value={s.value}
                            onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                            className="w-1/2 rounded-lg border border-stone-250 p-2 text-xs focus:bg-white text-stone-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecField(index)}
                            className="text-stone-400 hover:text-red-650 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Nutritional Facts</h4>
                      <button
                        type="button"
                        onClick={handleAddFactField}
                        className="inline-flex items-center gap-1 text-xs font-bold text-brand-green-700 hover:text-brand-green-800"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Label
                      </button>
                    </div>
                    <div className="space-y-2">
                      {prodNutritional.map((f, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            placeholder="Label (e.g. Energy)"
                            value={f.label}
                            onChange={(e) => handleFactChange(index, 'label', e.target.value)}
                            className="w-1/2 rounded-lg border border-stone-250 p-2 text-xs focus:bg-white text-stone-900 focus:outline-none"
                          />
                          <input
                            type="text"
                            placeholder="Value (e.g. 340 kcal)"
                            value={f.value}
                            onChange={(e) => handleFactChange(index, 'value', e.target.value)}
                            className="w-1/2 rounded-lg border border-stone-250 p-2 text-xs focus:bg-white text-stone-900 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFactField(index)}
                            className="text-stone-400 hover:text-red-650 p-2"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-150 pt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={resetProductForm}
                    className="rounded-full border border-stone-300 bg-white hover:bg-stone-50 px-6 py-2.5 text-xs font-bold text-stone-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-green-700 hover:bg-brand-green-800 px-6 py-2.5 text-xs font-bold text-white shadow transition-all cursor-pointer"
                  >
                    {isEditingProduct ? 'Save Changes' : 'Publish Staple'}
                  </button>
                </div>
              </form>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4">Staple Name</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Variants / Pricing</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-stone-400">
                          No products found in inventory.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-stone-50/50">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-stone-900">{p.name}</p>
                              <p className="text-xs text-stone-400 font-semibold mt-0.5 font-mono">slug: {p.slug}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <span className="text-xs font-bold bg-stone-100 px-2.5 py-0.5 rounded text-stone-700 border border-stone-200">
                                {p.category?.name || 'Uncategorized'}
                              </span>
                              {p.subcategory && (
                                <span className="text-xs font-bold bg-amber-50 px-2 py-0.5 rounded text-amber-800 border border-amber-200 block mt-1 w-max">
                                  {p.subcategory.name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              {p.variants.map((v) => (
                                <div key={v.size} className="text-xs flex gap-2 font-semibold">
                                  <span className="w-10 text-stone-400">{v.size}:</span>
                                  <span className="text-stone-850">₹{v.price} (B2C)</span>
                                  <span className="text-amber-800">₹{v.wholesalePrice} (B2B)</span>
                                  <span className="text-stone-450 ml-1">(Stock: {v.stock})</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleProductActive(p)}
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                                p.isActive
                                  ? 'bg-brand-green-50 text-brand-green-800 border border-brand-green-150'
                                  : 'bg-stone-100 text-stone-400 border border-stone-200'
                              }`}
                            >
                              {p.isActive ? (
                                <>
                                  <Eye className="h-3.5 w-3.5" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <EyeOff className="h-3.5 w-3.5" />
                                  Hidden
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleEditProductClick(p)}
                              className="rounded-xl border border-stone-250 p-2 text-stone-600 hover:text-brand-green-800 hover:bg-stone-50 cursor-pointer"
                              title="Edit product"
                            >
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Categories & Subcategories Tab */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Create Category</h3>
                <form onSubmit={handleCreateCategory} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-2">Category Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cooking Oils"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Write a short description for this category..."
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-green-700 hover:bg-brand-green-800 text-white text-xs font-bold px-5 py-2.5 cursor-pointer transition-colors"
                  >
                    Add Category
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-150">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">Categories List</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50/30">
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Slug</th>
                        <th className="px-6 py-3">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                      {categories.map((c) => (
                        <tr key={c._id}>
                          <td className="px-6 py-3.5 font-bold text-stone-900">{c.name}</td>
                          <td className="px-6 py-3.5 font-mono text-stone-400">{c.slug}</td>
                          <td className="px-6 py-3.5 text-stone-500 line-clamp-1">{c.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm">
                <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">Create Subcategory</h3>
                <form onSubmit={handleCreateSubcategory} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-2">Parent Category *</label>
                    <select
                      required
                      value={newSubParent}
                      onChange={(e) => setNewSubParent(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-2">Subcategory Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Wood Kolhu Pressed"
                      value={newSubName}
                      onChange={(e) => setNewSubName(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-550 uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      rows={3}
                      placeholder="Write a short description for this subcategory..."
                      value={newSubDesc}
                      onChange={(e) => setNewSubDesc(e.target.value)}
                      className="w-full rounded-xl border border-stone-200 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-full bg-brand-green-700 hover:bg-brand-green-800 text-white text-xs font-bold px-5 py-2.5 cursor-pointer transition-colors"
                  >
                    Add Subcategory
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
                <div className="p-4 bg-stone-50 border-b border-stone-150">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">Subcategories List</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50/30">
                        <th className="px-6 py-3">Subcategory</th>
                        <th className="px-6 py-3">Parent Category</th>
                        <th className="px-6 py-3">Slug</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-700">
                      {subcategories.map((s) => {
                        const parent = categories.find((c) => c._id === s.category);
                        return (
                          <tr key={s._id}>
                            <td className="px-6 py-3.5 font-bold text-stone-900">{s.name}</td>
                            <td className="px-6 py-3.5 font-semibold text-brand-green-800">{parent ? parent.name : 'Unknown'}</td>
                            <td className="px-6 py-3.5 font-mono text-stone-400">{s.slug}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Chatbot Auto-Replies Settings Tab */}
        {activeTab === 'chatbot' && (
          <div className="bg-white rounded-3xl border border-stone-200/50 p-6 sm:p-8 shadow-sm animate-in fade-in duration-300">
            <h2 className="font-serif text-2xl font-bold text-stone-900 border-b border-stone-150 pb-4 flex items-center gap-2">
              <Bot className="h-6 w-6 text-brand-green-700" />
              Chatbot Auto-Replies Manager
            </h2>
            <p className="text-stone-550 text-xs mt-2 leading-relaxed">
              Configure what the support bot responds when clients or B2B partners select preset query chips or type specific questions. Rich formatting is supported (e.g. use double asterisks <code>**text**</code> for bold and <code>[label](path)</code> for links).
            </p>

            <form onSubmit={handleSaveBotSettings} className="mt-8 space-y-6 max-w-4xl">
              {/* Welcome message */}
              <div>
                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Greeting Welcome Message *</label>
                <textarea
                  required
                  rows={3}
                  value={botWelcome}
                  onChange={(e) => setBotWelcome(e.target.value)}
                  placeholder="Welcome message showing up when client opens chat bubble..."
                  className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3.5 text-sm focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* MOQ Answer */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">B2B MOQ Limit Answer *</label>
                  <textarea
                    required
                    rows={4}
                    value={botMoq}
                    onChange={(e) => setBotMoq(e.target.value)}
                    placeholder="MOQ limit answers..."
                    className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Distributor Answer */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Distributor Portal Answer *</label>
                  <textarea
                    required
                    rows={4}
                    value={botDistributor}
                    onChange={(e) => setBotDistributor(e.target.value)}
                    placeholder="Partner apply guidelines..."
                    className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Shipping Answer */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Shipping & Delivery Answer *</label>
                  <textarea
                    required
                    rows={4}
                    value={botShipping}
                    onChange={(e) => setBotShipping(e.target.value)}
                    placeholder="Shipping transit details..."
                    className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Returns Answer */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Refund & Return Policy Answer *</label>
                  <textarea
                    required
                    rows={4}
                    value={botReturns}
                    onChange={(e) => setBotReturns(e.target.value)}
                    placeholder="Return rules details..."
                    className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Products Answer */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Browse Staples Product Range Answer *</label>
                  <textarea
                    required
                    rows={5}
                    value={botProducts}
                    onChange={(e) => setBotProducts(e.target.value)}
                    placeholder="Product catalog brief list..."
                    className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* WhatsApp Chat Details */}
                <div>
                  <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">WhatsApp Direct Link Support Answer *</label>
                  <textarea
                    required
                    rows={5}
                    value={botWhatsapp}
                    onChange={(e) => setBotWhatsapp(e.target.value)}
                    placeholder="WhatsApp helpline detail details..."
                    className="w-full rounded-xl border border-stone-250 bg-stone-50/50 p-3 text-xs focus:bg-white text-stone-900 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="border-t border-stone-150 pt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdatingBot}
                  className="rounded-full bg-brand-green-700 hover:bg-brand-green-800 px-8 py-3 text-xs font-bold text-white shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingBot ? 'Saving Settings...' : 'Save Auto-Replies'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 5: Distributor Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search by company name, GST, user name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4">Company Details</th>
                      <th className="px-6 py-4">Applicant Contact</th>
                      <th className="px-6 py-4">GSTIN</th>
                      <th className="px-6 py-4">Est. Vol / Month</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700">
                    {filteredApplications.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-400">
                          No matching applications found.
                        </td>
                      </tr>
                    ) : (
                      filteredApplications.map((app) => (
                        <tr key={app._id} className="hover:bg-stone-50/50">
                          <td className="px-6 py-4 font-bold text-stone-900">
                            {app.companyName}
                          </td>
                          <td className="px-6 py-4">
                            {app.userId ? (
                              <div>
                                <p className="font-semibold text-stone-800">{app.userId.name}</p>
                                <p className="text-xs text-stone-400 font-semibold mt-0.5">{app.userId.email}</p>
                              </div>
                            ) : (
                              <span className="text-stone-400 italic">User Deleted</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-xs uppercase text-amber-700 tracking-wider">
                            {app.gstNumber}
                          </td>
                          <td className="px-6 py-4 font-bold text-stone-900">
                            {app.expectedMonthlyVolume} kg
                          </td>
                          <td className="px-6 py-4">
                            {app.status === 'approved' && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-green-100 px-3 py-1 text-xs font-semibold text-brand-green-800 border border-brand-green-200">
                                <FileCheck className="h-3.5 w-3.5" />
                                Approved
                              </span>
                            )}
                            {app.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800 border border-red-200">
                                <XCircle className="h-3.5 w-3.5" />
                                Rejected
                              </span>
                            )}
                            {app.status === 'pending' && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                                <Clock className="h-3.5 w-3.5 animate-pulse text-amber-600" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {app.status === 'pending' ? (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app._id, 'approved')}
                                  disabled={updatingId === app._id}
                                  className="inline-flex items-center justify-center rounded-xl bg-brand-green-50 text-brand-green-700 hover:bg-brand-green-100 p-2 border border-brand-green-200/50 transition-colors disabled:opacity-50 cursor-pointer"
                                  title="Approve Business Partner"
                                >
                                  <CheckCircle className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  onClick={() => handleUpdateApplicationStatus(app._id, 'rejected')}
                                  disabled={updatingId === app._id}
                                  className="inline-flex items-center justify-center rounded-xl bg-red-50 text-red-700 hover:bg-red-100 p-2 border border-red-200/50 transition-colors disabled:opacity-50 cursor-pointer"
                                  title="Reject Business Partner"
                                >
                                  <XCircle className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-stone-400 font-semibold italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: Registered Users List */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200/50 p-6 shadow-sm">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search by customer name, email, phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2.5 text-sm font-medium text-stone-800 bg-stone-50/50 focus:outline-none focus:ring-2 focus:ring-brand-green-200 focus:border-brand-green-600 focus:bg-white transition-all"
                />
                <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-stone-400" />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200/50 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-xs font-bold uppercase tracking-wider text-stone-400">
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Phone</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Delivery Address</th>
                      <th className="px-6 py-4">Registered Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-sm font-medium text-stone-700">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-stone-400">
                          No matching users found.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u._id} className="hover:bg-stone-50/50">
                          <td className="px-6 py-4 font-bold text-stone-900">
                            {u.name}
                          </td>
                          <td className="px-6 py-4 text-stone-800">
                            {u.email}
                          </td>
                          <td className="px-6 py-4 text-stone-500 font-semibold">
                            {u.phone || <span className="text-stone-300 font-medium">N/A</span>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold uppercase ${
                              u.role === 'distributor'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-100 text-stone-600'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-stone-400 max-w-[200px] truncate" title={u.address}>
                            {u.address || <span className="text-stone-300">N/A</span>}
                          </td>
                          <td className="px-6 py-4 text-stone-400 text-xs">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
