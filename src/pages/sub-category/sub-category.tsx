import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  RotateCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Mail,
  Bell,
  Settings,
  Store,
  CreditCard,
  FileText,
  FileSpreadsheet,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  UploadCloud
} from 'lucide-react';

interface SubCategoryItem {
  id: string;
  image: string;
  name: string;
  category: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_SUB_CATEGORIES: SubCategoryItem[] = [
  {
    id: 'sc-1',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Laptop',
    category: 'Computers',
    code: 'CT001',
    description: 'Efficient Productivity',
    status: 'Active'
  },
  {
    id: 'sc-2',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Desktop',
    category: 'Computers',
    code: 'CT002',
    description: 'Compact Design',
    status: 'Active'
  },
  {
    id: 'sc-3',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Sneakers',
    category: 'Shoe',
    code: 'CT003',
    description: 'Dynamic Grip',
    status: 'Active'
  },
  {
    id: 'sc-4',
    image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Formals',
    category: 'Shoe',
    code: 'CT004',
    description: 'Stylish Comfort',
    status: 'Active'
  },
  {
    id: 'sc-5',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Wearables',
    category: 'Electronics',
    code: 'CT005',
    description: 'Seamless Connectivity',
    status: 'Active'
  },
  {
    id: 'sc-6',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Speakers',
    category: 'Electronics',
    code: 'CT006',
    description: 'Reliable Sound',
    status: 'Active'
  },
  {
    id: 'sc-7',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Handbags',
    category: 'Bags',
    code: 'CT007',
    description: 'Compact Carry',
    status: 'Active'
  },
  {
    id: 'sc-8',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Travel',
    category: 'Bags',
    code: 'CT008',
    description: 'Travel Ready',
    status: 'Active'
  },
  {
    id: 'sc-9',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Sofa',
    category: 'Furniture',
    code: 'CT009',
    description: 'Cozy Comfort',
    status: 'Active'
  },
  {
    id: 'sc-10',
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2913a49?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Chair',
    category: 'Furniture',
    code: 'CT0010',
    description: 'Stylish Comfort',
    status: 'Active'
  },
  {
    id: 'sc-11',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Smartphones',
    category: 'Phone',
    code: 'CT0011',
    description: 'Next-Gen Mobility',
    status: 'Active'
  },
  {
    id: 'sc-12',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80',
    name: 'Smartwatches',
    category: 'Electronics',
    code: 'CT0012',
    description: 'Health Tracking',
    status: 'Active'
  }
];

export default function SubCategoryPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage or fallback
  const [subCategories, setSubCategories] = useState<SubCategoryItem[]>(() => {
    const saved = localStorage.getItem('sub_categories_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_SUB_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('sub_categories_list', JSON.stringify(subCategories));
  }, [subCategories]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [showFilterCard, setShowFilterCard] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Checkbox Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubCategoryItem | null>(null);

  // Modal form states
  const [formImage, setFormImage] = useState<string>('');
  const [formCategory, setFormCategory] = useState('Computers');
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Distinct category list
  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    subCategories.forEach((sc) => set.add(sc.category));
    return ['All', ...Array.from(set)];
  }, [subCategories]);

  // Filtered sub-categories
  const filteredItems = useMemo(() => {
    return subCategories.filter((item) => {
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      if (selectedStatus !== 'All' && item.status !== selectedStatus) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [subCategories, selectedCategory, selectedStatus, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [filteredItems, currentPage, rowsPerPage]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedItems.map((item) => item.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete sub-category
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete sub-category "${name}"?`)) {
      setSubCategories((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Sub-category "${name}" deleted`);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormImage('');
    setFormCategory('Computers');
    setFormName('');
    const nextCode = `CT00${subCategories.length + 1}`;
    setFormCode(nextCode);
    setFormDescription('');
    setFormStatus(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: SubCategoryItem) => {
    setEditingItem(item);
    setFormImage(item.image);
    setFormCategory(item.category);
    setFormName(item.name);
    setFormCode(item.code);
    setFormDescription(item.description);
    setFormStatus(item.status === 'Active');
    setIsModalOpen(true);
  };

  // Handle local image upload in modal
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setFormImage(url);
      showToast('Image uploaded successfully');
    }
  };

  // Save Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) {
      alert('Please fill in required fields');
      return;
    }

    const resolvedImage =
      formImage ||
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80';

    if (editingItem) {
      // Edit
      setSubCategories((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                image: resolvedImage,
                category: formCategory,
                name: formName.trim(),
                code: formCode.trim(),
                description: formDescription.trim(),
                status: formStatus ? 'Active' : 'Inactive'
              }
            : i
        )
      );
      showToast(`Updated "${formName}"`);
    } else {
      // Add
      const newItem: SubCategoryItem = {
        id: `sc-${Date.now()}`,
        image: resolvedImage,
        category: formCategory,
        name: formName.trim(),
        code: formCode.trim(),
        description: formDescription.trim(),
        status: formStatus ? 'Active' : 'Inactive'
      };
      setSubCategories([newItem, ...subCategories]);
      showToast(`Added sub-category "${formName}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Sub Category', 'Category', 'Category Code', 'Description', 'Status'];
    const rows = filteredItems.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.code,
      `"${item.description.replace(/"/g, '""')}"`,
      item.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sub_Categories_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV file');
  };

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSearchTerm('');
      setSelectedCategory('All');
      setSelectedStatus('All');
      setIsRefreshing(false);
      showToast('Filters reset & reloaded');
    }, 450);
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

      {/* TOP NAVBAR (Exact match across application) */}
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
      <div className="p-6 flex-1 space-y-4">
        {/* Page Title & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Sub Category</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your sub categories</p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PDF Button */}
            <button
              type="button"
              onClick={() => window.print()}
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
              title="Refresh Data"
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

            {/* + Add Sub Category (Orange Button) */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Sub Category</span>
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
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {/* Category & Status Dropdowns */}
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
                    {categoryOptions
                      .filter((c) => c !== 'All')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="All">Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAFBFD] text-slate-600 font-semibold border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedItems.length > 0 &&
                        paginatedItems.every((item) => selectedIds.includes(item.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700 w-16">Image</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Sub Category</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Category Code</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Description</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No sub-categories found</span>
                        <p className="text-xs text-slate-400">Try modifying your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#F9FAFC] transition-colors ${
                          isSelected ? 'bg-orange-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(item.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          />
                        </td>

                        {/* Image Thumbnail */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-8 h-8 rounded object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80';
                            }}
                          />
                        </td>

                        {/* Sub Category Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          {item.name}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {item.category}
                        </td>

                        {/* Category Code */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {item.code}
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {item.description}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold text-white ${
                              item.status === 'Active' ? 'bg-[#10B981]' : 'bg-gray-400'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>

                        {/* Actions: Edit, Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              title="Edit Sub Category"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.name)}
                              title="Delete Sub Category"
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

      {/* FLOATING QUICK SETTINGS COG */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40">
        <button
          type="button"
          title="Quick Settings"
          onClick={() => alert('Quick Settings Panel')}
          className="w-9 h-9 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
        </button>
      </div>

      {/* ADD / EDIT SUB CATEGORY MODAL (Screenshot 3 Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header with Red Close Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">
                {editingItem ? 'Edit Sub Category' : 'Add Sub Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-xs"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-6 space-y-4 text-xs">
              {/* Image Uploader Row */}
              <div className="flex items-center gap-4 pb-2">
                {/* Upload Box with Dashed Border */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/20 transition-all text-center p-2 bg-gray-50/50 group overflow-hidden"
                >
                  {formImage ? (
                    <img src={formImage} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5 text-gray-400 group-hover:text-orange-500 mb-1 transition-colors" />
                      <span className="text-[11px] font-medium text-gray-500 group-hover:text-orange-500">
                        Add Image
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <p className="text-[11px] text-gray-400">JPEG, PNG up to 2 MB</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/png, image/jpeg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Category Select */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="Computers">Computers</option>
                    <option value="Shoe">Shoe</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Bags">Bags</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Phone">Phone</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Sub Category Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Sub Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Laptop"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Category Code */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Category Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CT001"
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 font-mono text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter short description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 text-slate-800 placeholder-gray-400 resize-none"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">Status</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={formStatus}
                  onClick={() => setFormStatus(!formStatus)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    formStatus ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      formStatus ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-md bg-[#1D273B] hover:bg-[#111827] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-[#FF7034] hover:bg-[#E85B20] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Sub Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
