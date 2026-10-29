import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Search,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  FileText,
  FileSpreadsheet,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Mail,
  Bell,
  Settings,
  Store,
  CreditCard,
  X,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  qty: number;
  createdBy: string;
  creatorAvatar: string;
  image: string;
}

const INITIAL_PRODUCTS: ProductItem[] = [
  {
    id: 'p-1',
    sku: 'PT001',
    name: 'Lenovo IdeaPad 3',
    category: 'Computers',
    brand: 'Lenovo',
    price: 600,
    unit: 'Pc',
    qty: 100,
    createdBy: 'James Kirwin',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-2',
    sku: 'PT002',
    name: 'Beats Pro',
    category: 'Electronics',
    brand: 'Beats',
    price: 160,
    unit: 'Pc',
    qty: 140,
    createdBy: 'Francis Chang',
    creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-3',
    sku: 'PT003',
    name: 'Nike Jordan',
    category: 'Shoe',
    brand: 'Nike',
    price: 110,
    unit: 'Pc',
    qty: 300,
    createdBy: 'Antonio Engle',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-4',
    sku: 'PT004',
    name: 'Apple Series 5 Watch',
    category: 'Electronics',
    brand: 'Apple',
    price: 120,
    unit: 'Pc',
    qty: 450,
    createdBy: 'Leo Kelly',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-5',
    sku: 'PT005',
    name: 'Amazon Echo Dot',
    category: 'Electronics',
    brand: 'Amazon',
    price: 80,
    unit: 'Pc',
    qty: 320,
    createdBy: 'Annette Walker',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-6',
    sku: 'PT006',
    name: 'Sanford Chair Sofa',
    category: 'Furnitures',
    brand: 'Modern Wave',
    price: 320,
    unit: 'Pc',
    qty: 650,
    createdBy: 'John Weaver',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-7',
    sku: 'PT007',
    name: 'Red Premium Satchel',
    category: 'Bags',
    brand: 'Dior',
    price: 60,
    unit: 'Pc',
    qty: 700,
    createdBy: 'Gary Hennessy',
    creatorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-8',
    sku: 'PT008',
    name: 'Iphone 14 Pro',
    category: 'Phone',
    brand: 'Apple',
    price: 540,
    unit: 'Pc',
    qty: 630,
    createdBy: 'Eleanor Panek',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-9',
    sku: 'PT009',
    name: 'Gaming Chair',
    category: 'Furniture',
    brand: 'Arlime',
    price: 200,
    unit: 'Pc',
    qty: 410,
    createdBy: 'William Levy',
    creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2913a49?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-10',
    sku: 'PT010',
    name: 'Borealis Backpack',
    category: 'Bags',
    brand: 'The North Face',
    price: 45,
    unit: 'Pc',
    qty: 550,
    createdBy: 'Charlotte Klotz',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-11',
    sku: 'PT011',
    name: 'Sony WH-1000XM5',
    category: 'Electronics',
    brand: 'Sony',
    price: 380,
    unit: 'Pc',
    qty: 180,
    createdBy: 'James Kirwin',
    creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'p-12',
    sku: 'PT012',
    name: 'Dell XPS 15 9530',
    category: 'Computers',
    brand: 'Dell',
    price: 1800,
    unit: 'Pc',
    qty: 90,
    createdBy: 'Francis Chang',
    creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80'
  }
];

export default function ProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductItem[]>(() => {
    const saved = localStorage.getItem('products_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  useEffect(() => {
    localStorage.setItem('products_list', JSON.stringify(products));
  }, [products]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilterCard, setShowFilterCard] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modal states
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);


  // Form states
  const [formSku, setFormSku] = useState('');
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Computers');
  const [formBrand, setFormBrand] = useState('Lenovo');
  const [formPrice, setFormPrice] = useState<number>(100);
  const [formUnit, setFormUnit] = useState('Pc');
  const [formQty, setFormQty] = useState<number>(100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3000);
  };

  // Categories & Brands list
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.category));
    return ['All', ...Array.from(set)];
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => set.add(p.brand));
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.createdBy.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, selectedBrand, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / rowsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage, rowsPerPage]);

  // Select all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`Delete product "${name}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Product "${name}" deleted`);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Brand', 'Price', 'Unit', 'Qty', 'Created By'];
    const rows = filteredProducts.map((p) => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.brand,
      p.price,
      p.unit,
      p.qty,
      p.createdBy
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Product_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported product list to CSV');
  };

  // Print / PDF
  const handlePrint = () => {
    window.print();
  };

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSearchTerm('');
      setSelectedCategory('All');
      setSelectedBrand('All');
      setIsRefreshing(false);
      showToast('Filters reset & data refreshed');
    }, 450);
  };

  // Open Edit Modal
  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setFormSku(p.sku);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormBrand(p.brand);
    setFormPrice(p.price);
    setFormUnit(p.unit);
    setFormQty(p.qty);
  };

  // Save Edit Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSku.trim()) {
      alert('Please fill in required fields');
      return;
    }

    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                sku: formSku,
                name: formName,
                category: formCategory,
                brand: formBrand,
                price: Number(formPrice),
                unit: formUnit,
                qty: Number(formQty)
              }
            : p
        )
      );
      showToast(`Updated "${formName}"`);
      setEditingProduct(null);
    }
  };


  return (
    <div className="min-h-full flex flex-col font-sans bg-[#F4F5F7] text-slate-800 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 text-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR (as seen in screenshot) */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-medium bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
              ⌘ K
            </span>
          </div>
        </div>

        {/* Right Action Icons & User Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Freshmart Branch Selector */}
          <button
            type="button"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] rounded-md text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Freshmart</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1 text-emerald-700" />
          </button>

          {/* + Add New Button (Orange) */}
          <button
            type="button"
            onClick={() => navigate('/create-product')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>


          {/* POS Button (Dark Navy) */}
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>POS</span>
          </button>

          {/* Language Flag */}
          <button
            type="button"
            title="Language"
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-sm"
          >
            🇺🇸
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            title="Toggle Fullscreen"
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
              } else {
                document.exitFullscreen().catch(() => {});
              }
            }}
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Mail with Badge */}
          <div className="relative">
            <button
              type="button"
              title="Messages"
              className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
            >
              <Mail className="w-4 h-4" />
            </button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              1
            </span>
          </div>

          {/* Notification Bell */}
          <button
            type="button"
            title="Notifications"
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Settings Gear */}
          <button
            type="button"
            title="Settings"
            className="w-8 h-8 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2 pl-1 border-l border-gray-200">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80"
              alt="User profile"
              className="w-8 h-8 rounded-full object-cover border border-gray-300"
            />
          </div>
        </div>
      </header>

      {/* PAGE BODY */}
      <div className="p-6 flex-1 space-y-5">
        {/* Page Title & Action Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Product List</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your products</p>
          </div>

          {/* Right Action Icons Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PDF Button */}
            <button
              type="button"
              onClick={handlePrint}
              title="Print / Save PDF"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-red-500 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <FileText className="w-4 h-4 text-red-500" />
            </button>

            {/* Excel Button */}
            <button
              type="button"
              onClick={handleExportCSV}
              title="Export to Excel / CSV"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-emerald-600 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            </button>

            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh / Reset Filters"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
            </button>

            {/* Collapse/Expand Filters */}
            <button
              type="button"
              onClick={() => setShowFilterCard(!showFilterCard)}
              title={showFilterCard ? 'Collapse filter bar' : 'Expand filter bar'}
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              {showFilterCard ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* + Add Product (Orange) */}
            <button
              type="button"
              onClick={() => navigate('/create-product')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>


            {/* Import Product (Dark Navy) */}
            <button
              type="button"
              onClick={() => alert('Import CSV/Excel dialog: Select your spreadsheet file to import products.')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Import Product</span>
            </button>
          </div>
        </div>

        {/* MAIN DATA CARD */}
        <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
          {/* Filter Bar Row */}
          {showFilterCard && (
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white">
              {/* Filter Search */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Filter Dropdowns */}
              <div className="flex items-center gap-2.5">
                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="All">Category</option>
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Brand Dropdown */}
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="All">Brand</option>
                    {brands.filter((b) => b !== 'All').map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* TABLE CONTAINER */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAFBFD] text-slate-600 font-semibold border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every((p) => selectedIds.includes(p.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">SKU</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Product Name</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Brand</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Price</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Unit</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Qty</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Created By</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No products found</span>
                        <p className="text-xs text-slate-400">Try adjusting your search or filter values</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-[#F9FAFC] transition-colors ${
                          isSelected ? 'bg-orange-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(p.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          />
                        </td>

                        {/* SKU */}
                        <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {p.sku}
                        </td>

                        {/* Product Name with Thumbnail */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-8 h-8 rounded object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                              onError={(e) => {
                                // fallback if image fails
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80';
                              }}
                            />
                            <span className="font-semibold text-slate-800">{p.name}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {p.category}
                        </td>

                        {/* Brand */}
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {p.brand}
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                          ${p.price.toFixed(0)}
                        </td>

                        {/* Unit */}
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {p.unit}
                        </td>

                        {/* Qty */}
                        <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                          {p.qty}
                        </td>

                        {/* Created By with User Avatar */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={p.creatorAvatar}
                              alt={p.createdBy}
                              className="w-7 h-7 rounded-full object-cover border border-gray-200"
                            />
                            <span className="font-medium text-slate-700">{p.createdBy}</span>
                          </div>
                        </td>

                        {/* Action Buttons: View, Edit, Delete */}
                        <td className="py-3 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* View Eye */}
                            <button
                              type="button"
                              onClick={() => setViewingProduct(p)}
                              title="View Details"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEditModal(p)}
                              title="Edit Product"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Trash */}
                            <button
                              type="button"
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Delete Product"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-red-600 hover:border-red-300 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER & PAGINATION */}
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            {/* Rows Per Page Selector */}
            <div className="flex items-center gap-2">
              <span>Row Per Page</span>
              <div className="relative">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-orange-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <span>Entries</span>
              {selectedIds.length > 0 && (
                <span className="ml-3 font-semibold text-orange-600">
                  {selectedIds.length} row(s) selected
                </span>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-[#FF7034] text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT FOOTER */}
        <footer className="pt-4 pb-2 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
          <div>2014 - 2026 © LancersLoom. All Right Reserved</div>
          <div>Designed & Developed by LancersLoom</div>
        </footer>
      </div>

      {/* FLOATING QUICK SETTINGS COG (orange badge on right edge) */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          title="Quick Settings"
          onClick={() => alert('Quick Settings Panel: Color themes, RTL layout, and sidebar presets.')}
          className="w-9 h-9 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
        </button>
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-fade-in">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">Edit Product</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>


            <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product SKU *</label>
                <input
                  type="text"
                  required
                  value={formSku}
                  onChange={(e) => setFormSku(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                  placeholder="e.g. PT011"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Sony WH-1000XM5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                  >
                    <option value="Computers">Computers</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Shoe">Shoe</option>
                    <option value="Furnitures">Furnitures</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Bags">Bags</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                    placeholder="e.g. Sony"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Qty</label>
                  <input
                    type="number"
                    min="0"
                    value={formQty}
                    onChange={(e) => setFormQty(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-3.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#FF7034] hover:bg-[#E85B20] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PRODUCT MODAL */}
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200 animate-fade-in">
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-800">Product Specifications</h3>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={viewingProduct.image}
                  alt={viewingProduct.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-800">{viewingProduct.name}</h4>
                  <p className="text-gray-500 font-mono mt-0.5">{viewingProduct.sku}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-orange-100 text-orange-700 font-semibold text-[10px]">
                    {viewingProduct.category}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-slate-700">
                <div>
                  <span className="text-gray-400 block">Brand:</span>
                  <span className="font-semibold">{viewingProduct.brand}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Unit Price:</span>
                  <span className="font-semibold">${viewingProduct.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Stock Qty:</span>
                  <span className="font-semibold">{viewingProduct.qty} {viewingProduct.unit}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Valuation:</span>
                  <span className="font-semibold text-emerald-600">
                    ${(viewingProduct.price * viewingProduct.qty).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                <img
                  src={viewingProduct.creatorAvatar}
                  alt={viewingProduct.createdBy}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-slate-600">Registered by <strong className="text-slate-800">{viewingProduct.createdBy}</strong></span>
              </div>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-3.5 py-1.5 rounded-md bg-slate-800 text-white font-medium text-xs hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
