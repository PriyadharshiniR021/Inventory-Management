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

interface BrandItem {
  id: string;
  name: string;
  logo: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

const BRAND_LOGOS: Record<string, string> = {
  Lenovo: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><rect width="100" height="40" rx="4" fill="%230F62FE"/><text x="50" y="25" fill="%23FFFFFF" font-family="Arial,sans-serif" font-size="16" font-weight="bold" text-anchor="middle">lenovo</text></svg>`,
  Beats: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%23E01F3D"/><circle cx="20" cy="20" r="10" fill="none" stroke="%23FFFFFF" stroke-width="3"/><rect x="10" y="7" width="3" height="23" fill="%23FFFFFF" rx="1.5"/></svg>`,
  Nike: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><path d="M10 24 C 20 25, 35 15, 52 4 C 42 16, 25 25, 12 25 C 8 25, 6 22, 10 24 Z" fill="%23111111"/></svg>`,
  Apple: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 36"><path d="M18.7 0.5 C 19.8 2 19 4 17.5 5 C 16.3 6 15 5.5 14.8 5 C 14.5 3.5 15.8 1.5 18.7 0.5 Z M 21 11 C 24 11 26 12.8 27.5 15 C 24 17 24.5 21.5 28 23 C 26 27.5 23 31.5 20 31.5 C 18.5 31.5 17.5 30.5 15.5 30.5 C 13.5 30.5 12.5 31.5 11 31.5 C 8 31.5 4.5 26.5 4.5 19 C 4.5 13 8 10 11.5 10 C 13.8 10 15.5 11.5 17 11.5 C 18.5 11.5 19.8 11 21 11 Z" fill="%23111111"/></svg>`,
  Amazon: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 30"><text x="35" y="18" fill="%23111111" font-family="Arial,sans-serif" font-size="15" font-weight="bold" text-anchor="middle">amazon</text><path d="M 12 23 Q 35 30 60 21" stroke="%23FF9900" stroke-width="2.5" fill="none" stroke-linecap="round"/><polygon points="58,19 63,22 58,24" fill="%23FF9900"/></svg>`,
  Woodmart: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 30"><rect x="5" y="13" width="12" height="4" fill="%23555555"/><text x="48" y="19" fill="%23222222" font-family="Arial,sans-serif" font-size="12" font-weight="bold" text-anchor="middle">Woodmart</text></svg>`,
  Dior: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><text x="30" y="20" fill="%23111111" font-family="Georgia,serif" font-size="16" font-weight="bold" text-anchor="middle" letter-spacing="1">Dior</text></svg>`,
  Lava: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><text x="30" y="20" fill="%23E50914" font-family="Impact,Arial Black,sans-serif" font-size="16" font-style="italic" text-anchor="middle">LAVA</text></svg>`,
  Nilkamal: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 30"><rect x="6" y="8" width="14" height="14" rx="2" fill="%230284C7"/><text x="48" y="19" fill="%230284C7" font-family="Arial,sans-serif" font-size="11" font-weight="bold" text-anchor="middle">Nilkamal</text></svg>`,
  'The North Face': `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 30"><circle cx="12" cy="15" r="8" fill="none" stroke="%23111111" stroke-width="2"/><text x="54" y="18" fill="%23111111" font-family="Arial,sans-serif" font-size="9" font-weight="bold" text-anchor="middle">THE NORTH FACE</text></svg>`
};

const INITIAL_BRANDS: BrandItem[] = [
  {
    id: 'br-1',
    name: 'Lenovo',
    logo: BRAND_LOGOS['Lenovo'],
    createdDate: '24 Dec 2024',
    status: 'Active'
  },
  {
    id: 'br-2',
    name: 'Beats',
    logo: BRAND_LOGOS['Beats'],
    createdDate: '10 Dec 2024',
    status: 'Active'
  },
  {
    id: 'br-3',
    name: 'Nike',
    logo: BRAND_LOGOS['Nike'],
    createdDate: '27 Nov 2024',
    status: 'Active'
  },
  {
    id: 'br-4',
    name: 'Apple',
    logo: BRAND_LOGOS['Apple'],
    createdDate: '18 Nov 2024',
    status: 'Active'
  },
  {
    id: 'br-5',
    name: 'Amazon',
    logo: BRAND_LOGOS['Amazon'],
    createdDate: '06 Nov 2024',
    status: 'Active'
  },
  {
    id: 'br-6',
    name: 'Woodmart',
    logo: BRAND_LOGOS['Woodmart'],
    createdDate: '25 Oct 2024',
    status: 'Active'
  },
  {
    id: 'br-7',
    name: 'Dior',
    logo: BRAND_LOGOS['Dior'],
    createdDate: '14 Oct 2024',
    status: 'Active'
  },
  {
    id: 'br-8',
    name: 'Lava',
    logo: BRAND_LOGOS['Lava'],
    createdDate: '03 Oct 2024',
    status: 'Active'
  },
  {
    id: 'br-9',
    name: 'Nilkamal',
    logo: BRAND_LOGOS['Nilkamal'],
    createdDate: '20 Sep 2024',
    status: 'Active'
  },
  {
    id: 'br-10',
    name: 'The North Face',
    logo: BRAND_LOGOS['The North Face'],
    createdDate: '10 Sep 2024',
    status: 'Active'
  }
];

export default function BrandsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from localStorage or initial
  const [brands, setBrands] = useState<BrandItem[]>(() => {
    const saved = localStorage.getItem('brands_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_BRANDS;
  });

  useEffect(() => {
    localStorage.setItem('brands_list', JSON.stringify(brands));
  }, [brands]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [sortBy, setSortBy] = useState<string>('Latest');
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
  const [editingBrand, setEditingBrand] = useState<BrandItem | null>(null);

  // Modal Form States
  const [formImage, setFormImage] = useState<string>('');
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Filtered & Sorted brands
  const filteredBrands = useMemo(() => {
    let result = brands.filter((brand) => {
      if (statusFilter !== 'All' && brand.status !== statusFilter) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          brand.name.toLowerCase().includes(q) ||
          brand.createdDate.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy === 'Latest') {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
      if (sortBy === 'Oldest') {
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
      }
      if (sortBy === 'Name A-Z') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'Name Z-A') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [brands, statusFilter, searchTerm, sortBy]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / rowsPerPage));
  const paginatedBrands = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredBrands.slice(start, start + rowsPerPage);
  }, [filteredBrands, currentPage, rowsPerPage]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedBrands.map((b) => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete brand
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete brand "${name}"?`)) {
      setBrands((prev) => prev.filter((b) => b.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Brand "${name}" deleted`);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingBrand(null);
    setFormImage('');
    setFormName('');
    setFormStatus(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (brand: BrandItem) => {
    setEditingBrand(brand);
    setFormImage(brand.logo);
    setFormName(brand.name);
    setFormStatus(brand.status === 'Active');
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
    if (!formName.trim()) {
      alert('Please fill in the Brand name');
      return;
    }

    // Default logo if none provided
    const resolvedLogo =
      formImage ||
      BRAND_LOGOS[formName.trim()] ||
      `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 30"><rect width="80" height="30" rx="4" fill="%23F3F4F6"/><text x="40" y="19" fill="%234B5563" font-family="Arial,sans-serif" font-size="12" font-weight="bold" text-anchor="middle">${encodeURIComponent(formName.trim().slice(0, 10))}</text></svg>`;

    if (editingBrand) {
      // Edit
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingBrand.id
            ? {
                ...b,
                name: formName.trim(),
                logo: resolvedLogo,
                status: formStatus ? 'Active' : 'Inactive'
              }
            : b
        )
      );
      showToast(`Updated brand "${formName}"`);
    } else {
      // Add
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

      const newBrand: BrandItem = {
        id: `br-${Date.now()}`,
        name: formName.trim(),
        logo: resolvedLogo,
        createdDate: formattedDate,
        status: formStatus ? 'Active' : 'Inactive'
      };

      setBrands([newBrand, ...brands]);
      showToast(`Added brand "${formName}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Brand', 'Created Date', 'Status'];
    const rows = filteredBrands.map((b) => [
      `"${b.name.replace(/"/g, '""')}"`,
      b.createdDate,
      b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Brands_${new Date().toISOString().slice(0, 10)}.csv`);
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
      setStatusFilter('All');
      setSortBy('Latest');
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
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Brand</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your brands</p>
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

            {/* + Add Brand (Orange Button) */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Brand</span>
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

              {/* Status & Sort By Dropdowns */}
              <div className="flex items-center gap-2.5">
                {/* Status Dropdown */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as any);
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

                {/* Sort By Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Latest">Sort By : Latest</option>
                    <option value="Oldest">Sort By : Oldest</option>
                    <option value="Name A-Z">Sort By : Name (A-Z)</option>
                    <option value="Name Z-A">Sort By : Name (Z-A)</option>
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
                        paginatedBrands.length > 0 &&
                        paginatedBrands.every((b) => selectedIds.includes(b.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Brand</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedBrands.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No brands found</span>
                        <p className="text-xs text-slate-400">Try modifying your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedBrands.map((brand) => {
                    const isSelected = selectedIds.includes(brand.id);
                    return (
                      <tr
                        key={brand.id}
                        className={`hover:bg-[#F9FAFC] transition-colors ${
                          isSelected ? 'bg-orange-50/40' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(brand.id)}
                            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                          />
                        </td>

                        {/* Brand Logo & Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-7 rounded border border-gray-200/80 bg-white flex items-center justify-center overflow-hidden p-0.5 shadow-2xs flex-shrink-0">
                              <img
                                src={brand.logo}
                                alt={brand.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>
                            <span className="text-slate-800 font-medium text-xs">
                              {brand.name}
                            </span>
                          </div>
                        </td>

                        {/* Created Date */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {brand.createdDate}
                        </td>

                        {/* Status Badge with bullet dot */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-white ${
                              brand.status === 'Active' ? 'bg-[#10B981]' : 'bg-gray-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{brand.status}</span>
                          </span>
                        </td>

                        {/* Actions: Edit, Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEditModal(brand)}
                              title="Edit Brand"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(brand.id, brand.name)}
                              title="Delete Brand"
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

      {/* ADD / EDIT BRAND MODAL (Screenshot 3 Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header with Red Close Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">
                {editingBrand ? 'Edit Brand' : 'Add Brand'}
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
                    <img src={formImage} alt="Preview" className="w-full h-full object-contain rounded-lg" />
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
                    accept="image/png, image/jpeg, image/svg+xml"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Brand Name Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Brand <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter brand name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between pt-2">
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
                  {editingBrand ? 'Save Changes' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
