import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import {
  Search,
  RotateCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FileSpreadsheet,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  Mail,
  Settings
} from 'lucide-react';

interface StockItem {
  id: string;
  warehouse: string;
  store: string;
  name: string;
  category: string;
  sku: string;
  qty: number;
  qtyAlert: number;
  image: string;
}

const INITIAL_LOW_STOCKS: StockItem[] = [
  {
    id: 'ls-1',
    warehouse: 'Lavish Warehouse',
    store: 'Electro Mart',
    name: 'Lenovo IdeaPad 3',
    category: 'Computers',
    sku: 'PT001',
    qty: 20,
    qtyAlert: 15,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-2',
    warehouse: 'Quaint Warehouse',
    store: 'Quantum Gadgets',
    name: 'Beats Pro',
    category: 'Electronics',
    sku: 'PT002',
    qty: 25,
    qtyAlert: 20,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-3',
    warehouse: 'Traditional Warehouse',
    store: 'Prime Bazaar',
    name: 'Nike Jordan',
    category: 'Shoe',
    sku: 'PT003',
    qty: 40,
    qtyAlert: 35,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-4',
    warehouse: 'Cool Warehouse',
    store: 'Gadget World',
    name: 'Apple Series 5 Watch',
    category: 'Electronics',
    sku: 'PT004',
    qty: 50,
    qtyAlert: 45,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-5',
    warehouse: 'Overflow Warehouse',
    store: 'Volt Vault',
    name: 'Amazon Echo Dot',
    category: 'Electronics',
    sku: 'PT005',
    qty: 30,
    qtyAlert: 25,
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-6',
    warehouse: 'Nova Storage Hub',
    store: 'Elite Retail',
    name: 'Sanford Chair Sofa',
    category: 'Furniture',
    sku: 'PT006',
    qty: 10,
    qtyAlert: 8,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-7',
    warehouse: 'Retail Supply Hub',
    store: 'Prime Mart',
    name: 'Red Premium Satchel',
    category: 'Bags',
    sku: 'PT007',
    qty: 70,
    qtyAlert: 60,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-8',
    warehouse: 'EdgeWare Solutions',
    store: 'NeoTech Store',
    name: 'Iphone 14 Pro',
    category: 'Phone',
    sku: 'PT008',
    qty: 35,
    qtyAlert: 30,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-9',
    warehouse: 'North Zone Warehouse',
    store: 'Urban Mart',
    name: 'Gaming Chair',
    category: 'Furniture',
    sku: 'PT009',
    qty: 15,
    qtyAlert: 10,
    image: 'https://images.unsplash.com/photo-1580481077195-c22ae2913a49?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'ls-10',
    warehouse: 'Fulfillment Hub',
    store: 'Travel Mart',
    name: 'Borealis Backpack',
    category: 'Bags',
    sku: 'PT010',
    qty: 45,
    qtyAlert: 40,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=80&h=80&q=80'
  }
];

const INITIAL_OUT_OF_STOCKS: StockItem[] = [
  {
    id: 'os-1',
    warehouse: 'East Bay Warehouse',
    store: 'Electro Mart',
    name: 'SFP28 25GbE Optical Transceiver',
    category: 'Networking',
    sku: 'CAB-SFP-25G',
    qty: 0,
    qtyAlert: 15,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'os-2',
    warehouse: 'Nova Storage Hub',
    store: 'Quantum Gadgets',
    name: 'Wireless Telemetry Gateway v4',
    category: 'Electronics',
    sku: 'IOT-WTL-900',
    qty: 0,
    qtyAlert: 20,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=80&h=80&q=80'
  },
  {
    id: 'os-3',
    warehouse: 'Cool Warehouse',
    store: 'Gadget World',
    name: 'Titanium Torque Driver Kit',
    category: 'Hardware',
    sku: 'HDW-TRQ-400',
    qty: 0,
    qtyAlert: 12,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=80&h=80&q=80'
  }
];

export default function LowStocksPage() {
  // Active Tab: 'low' or 'out'
  const [activeTab, setActiveTab] = useState<'low' | 'out'>('low');

  // Notify switch state
  const [notifyEnabled, setNotifyEnabled] = useState(true);

  // Data states
  const [lowStocks, setLowStocks] = useState<StockItem[]>(INITIAL_LOW_STOCKS);
  const [outOfStocks, setOutOfStocks] = useState<StockItem[]>(INITIAL_OUT_OF_STOCKS);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilterCard, setShowFilterCard] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Checkbox multi-select
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modals & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editQtyAlert, setEditQtyAlert] = useState<number>(0);

  // Email form
  const [emailRecipient, setEmailRecipient] = useState('procurement@freshmart.com');
  const [emailSubject, setEmailSubject] = useState('Urgent: Low Stock Re-order Alert');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Active list based on tab
  const currentList = activeTab === 'low' ? lowStocks : outOfStocks;

  // Warehouses, Stores, Categories lists for dropdowns
  const warehouses = useMemo(() => {
    const set = new Set<string>();
    [...lowStocks, ...outOfStocks].forEach((i) => set.add(i.warehouse));
    return ['All', ...Array.from(set)];
  }, [lowStocks, outOfStocks]);

  const stores = useMemo(() => {
    const set = new Set<string>();
    [...lowStocks, ...outOfStocks].forEach((i) => set.add(i.store));
    return ['All', ...Array.from(set)];
  }, [lowStocks, outOfStocks]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    [...lowStocks, ...outOfStocks].forEach((i) => set.add(i.category));
    return ['All', ...Array.from(set)];
  }, [lowStocks, outOfStocks]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return currentList.filter((item) => {
      if (selectedWarehouse !== 'All' && item.warehouse !== selectedWarehouse) return false;
      if (selectedStore !== 'All' && item.store !== selectedStore) return false;
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.sku.toLowerCase().includes(q) ||
          item.warehouse.toLowerCase().includes(q) ||
          item.store.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [currentList, selectedWarehouse, selectedStore, selectedCategory, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [filteredItems, currentPage, rowsPerPage]);

  // Select all handler
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedItems.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete item
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Remove "${name}" from stock watchlist?`)) {
      if (activeTab === 'low') {
        setLowStocks((prev) => prev.filter((i) => i.id !== id));
      } else {
        setOutOfStocks((prev) => prev.filter((i) => i.id !== id));
      }
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Removed "${name}"`);
    }
  };

  // Open Edit Stock Modal
  const openEdit = (item: StockItem) => {
    setEditingItem(item);
    setEditQty(item.qty);
    setEditQtyAlert(item.qtyAlert);
  };

  // Save Edit Stock Modal
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updater = (prev: StockItem[]) =>
      prev.map((i) =>
        i.id === editingItem.id
          ? { ...i, qty: Number(editQty), qtyAlert: Number(editQtyAlert) }
          : i
      );

    if (activeTab === 'low') {
      setLowStocks(updater);
    } else {
      setOutOfStocks(updater);
    }

    showToast(`Updated stock levels for "${editingItem.name}"`);
    setEditingItem(null);
  };

  // Send Email submit
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Low stock requisition email dispatched to ${emailRecipient}!`);
    setIsEmailModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Warehouse', 'Store', 'Product Name', 'Category', 'SKU', 'Qty', 'Qty Alert'];
    const rows = filteredItems.map((item) => [
      `"${item.warehouse}"`,
      `"${item.store}"`,
      `"${item.name.replace(/"/g, '""')}"`,
      item.category,
      item.sku,
      item.qty,
      item.qtyAlert
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Low_Stocks_${new Date().toISOString().slice(0, 10)}.csv`);
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
      setSelectedWarehouse('All');
      setSelectedStore('All');
      setSelectedCategory('All');
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

      {/* TOP NAVBAR */}
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* PAGE BODY */}
      <div className="p-6 flex-1 space-y-4">
        {/* Page Title & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Low Stocks</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your low stocks</p>
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
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#315EFB]' : ''}`} />
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

            {/* Send Email Button (Dark Navy) */}
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Email</span>
            </button>
          </div>
        </div>

        {/* SUBHEADER: TABS & NOTIFY TOGGLE ROW */}
        <div className="flex items-center justify-between gap-4 pt-1">
          {/* Tabs: Low Stocks / Out of Stocks */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('low');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'low'
                  ? 'bg-[#315EFB] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              Low Stocks
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('out');
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'out'
                  ? 'bg-[#315EFB] text-white shadow-xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              Out of Stocks
            </button>
          </div>

          {/* Notify Switch */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={notifyEnabled}
              onClick={() => {
                setNotifyEnabled(!notifyEnabled);
                showToast(
                  !notifyEnabled
                    ? 'Automated stock notification alerts enabled'
                    : 'Stock notification alerts muted'
                );
              }}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notifyEnabled ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  notifyEnabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-medium text-slate-600">Notify</span>
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
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#315EFB] transition-colors"
                />
              </div>

              {/* Filter Dropdowns (Warehouse, Store, Category) */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Warehouse Dropdown */}
                <div className="relative">
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => {
                      setSelectedWarehouse(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-[#315EFB] cursor-pointer"
                  >
                    <option value="All">Warehouse</option>
                    {warehouses
                      .filter((w) => w !== 'All')
                      .map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Store Dropdown */}
                <div className="relative">
                  <select
                    value={selectedStore}
                    onChange={(e) => {
                      setSelectedStore(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-[#315EFB] cursor-pointer"
                  >
                    <option value="All">Store</option>
                    {stores
                      .filter((s) => s !== 'All')
                      .map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-[#315EFB] cursor-pointer"
                  >
                    <option value="All">Category</option>
                    {categories
                      .filter((c) => c !== 'All')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
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
                      className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Warehouse</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Store</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Product Name</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">SKU</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Qty</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Qty Alert</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">
                          {activeTab === 'low' ? 'No low stock products found' : 'No out-of-stock items'}
                        </span>
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
                          isSelected ? 'bg-[#F5F7FF]' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(item.id)}
                            className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                          />
                        </td>

                        {/* Warehouse */}
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          {item.warehouse}
                        </td>

                        {/* Store */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {item.store}
                        </td>

                        {/* Product Name with Thumbnail */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-8 h-8 rounded object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80';
                              }}
                            />
                            <span className="font-semibold text-slate-800">{item.name}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {item.category}
                        </td>

                        {/* SKU */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {item.sku}
                        </td>

                        {/* Qty */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`font-semibold ${
                              item.qty === 0
                                ? 'text-rose-600 bg-rose-50 px-2 py-0.5 rounded'
                                : 'text-slate-700'
                            }`}
                          >
                            {item.qty}
                          </span>
                        </td>

                        {/* Qty Alert */}
                        <td className="py-3.5 px-4 text-slate-600 font-medium whitespace-nowrap">
                          {item.qtyAlert < 10 ? `0${item.qtyAlert}` : item.qtyAlert}
                        </td>

                        {/* Action Buttons: Edit, Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEdit(item)}
                              title="Edit Stock Level"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#315EFB] hover:border-[#315EFB] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.name)}
                              title="Delete Item"
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
                  className="bg-white border border-gray-200 rounded px-2.5 py-1 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#315EFB]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <span>Entries</span>
              {selectedIds.length > 0 && (
                <span className="ml-3 font-semibold text-[#315EFB]">
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
                        ? 'bg-[#315EFB] text-white shadow-xs'
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
          className="w-9 h-9 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
        </button>
      </div>

      {/* SEND EMAIL MODAL */}
      {isEmailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-fade-in">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#315EFB]" />
                <h3 className="font-bold text-base text-slate-800">Send Low Stock Notification</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Send To *</label>
                <input
                  type="email"
                  required
                  value={emailRecipient}
                  onChange={(e) => setEmailRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB]"
                  placeholder="vendor@company.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Message Preview</label>
                <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-slate-600 space-y-1.5">
                  <p>Hello Team,</p>
                  <p>
                    This is an automated low-stock alert from <strong>LancersLoom Freshmart</strong>. Currently{' '}
                    <strong>{lowStocks.length} items</strong> have reached or dipped below safety buffer thresholds.
                  </p>
                  <p>Please expedite purchase order fulfillment.</p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#315EFB] hover:bg-[#2448D8] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STOCK LEVEL MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden border border-gray-200 animate-fade-in">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">Edit Stock Buffer</h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                <img
                  src={editingItem.image}
                  alt={editingItem.name}
                  className="w-10 h-10 rounded object-cover border border-gray-200"
                />
                <div>
                  <h4 className="font-bold text-slate-800">{editingItem.name}</h4>
                  <p className="text-gray-500 font-mono text-[11px]">{editingItem.sku}</p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Quantity *</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editQty}
                  onChange={(e) => setEditQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity Alert Threshold *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={editQtyAlert}
                  onChange={(e) => setEditQtyAlert(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-3.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#315EFB] hover:bg-[#2448D8] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <span>Save Levels</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
