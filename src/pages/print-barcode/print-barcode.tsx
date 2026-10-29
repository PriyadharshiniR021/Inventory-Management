import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Mail,
  Bell,
  Settings,
  Store as StoreIcon,
  CreditCard,
  Trash2,
  Eye,
  RotateCcw,
  Printer,
  Minus,
  Plus,
  CheckCircle2,
  X
} from 'lucide-react';

interface BarcodeProductItem {
  id: string;
  name: string;
  image: string;
  sku: string;
  code: string;
  price: string;
  qty: number;
}

const DEFAULT_PRODUCTS: BarcodeProductItem[] = [
  {
    id: 'bp-1',
    name: 'Nike Jordan',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT002',
    code: 'HG3FK',
    price: '$120.00',
    qty: 4
  },
  {
    id: 'bp-2',
    name: 'Apple Series 5 Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT003',
    code: 'TEUIU7',
    price: '$399.00',
    qty: 4
  }
];

const AVAILABLE_CATALOG: BarcodeProductItem[] = [
  ...DEFAULT_PRODUCTS,
  {
    id: 'bp-3',
    name: 'Amazon Echo Dot',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT001',
    code: 'ECH01',
    price: '$49.99',
    qty: 2
  },
  {
    id: 'bp-4',
    name: 'Beats Studio Pro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT004',
    code: 'BTS04',
    price: '$299.00',
    qty: 2
  },
  {
    id: 'bp-5',
    name: 'Lenovo ThinkPad',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT005',
    code: 'LNV05',
    price: '$1,199.00',
    qty: 1
  }
];

// Realistic Barcode SVG Generator
const BarcodePattern: React.FC<{ code: string }> = ({ code }) => {
  const bars = [
    2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 3, 2, 1, 2, 2, 1, 3, 1, 2, 3, 1, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 2, 1, 1, 3, 2, 1, 2
  ];

  return (
    <div className="flex flex-col items-center">
      <svg className="h-9 w-36" viewBox="0 0 144 36" preserveAspectRatio="none">
        {bars.map((w, idx) => {
          const x = idx * 3.6;
          return (
            <rect
              key={idx}
              x={x}
              y={0}
              width={w * 0.9}
              height={36}
              fill={idx % 2 === 0 ? '#111111' : 'transparent'}
            />
          );
        })}
      </svg>
      <span className="font-mono text-[10px] tracking-widest text-slate-700 mt-0.5">{code}</span>
    </div>
  );
};

export default function PrintBarcodePage() {
  const navigate = useNavigate();

  // Header and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form selections
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedStore, setSelectedStore] = useState('Freshmart');
  const [productSearch, setProductSearch] = useState('');
  const [paperSize, setPaperSize] = useState('36mm (1.4 Inch)');

  // Toggles matching Screenshot 1
  const [showStoreName, setShowStoreName] = useState(true);
  const [showProductName, setShowProductName] = useState(true);
  const [showPrice, setShowPrice] = useState(true);

  // Barcode items table
  const [items, setItems] = useState<BarcodeProductItem[]>(DEFAULT_PRODUCTS);

  // Generated Preview Modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Adjust Quantity
  const handleQtyChange = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(1, item.qty + delta);
          return { ...item, qty: newQty };
        }
        return item;
      })
    );
  };

  // Delete Item
  const handleDeleteItem = (id: string, name: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast(`Removed "${name}" from barcode list`);
  };

  // Add Product from Catalog
  const handleAddProduct = (prod: BarcodeProductItem) => {
    if (items.some((i) => i.id === prod.id)) {
      handleQtyChange(prod.id, 1);
      showToast(`Increased quantity for ${prod.name}`);
    } else {
      setItems((prev) => [...prev, { ...prod, qty: 1 }]);
      showToast(`Added ${prod.name} to barcode list`);
    }
    setProductSearch('');
  };

  // Reset Barcode
  const handleResetBarcode = () => {
    setItems(DEFAULT_PRODUCTS);
    setSelectedWarehouse('');
    setSelectedStore('Freshmart');
    setPaperSize('36mm (1.4 Inch)');
    setShowStoreName(true);
    setShowProductName(true);
    setShowPrice(true);
    setProductSearch('');
    showToast('Reset barcode form to defaults');
  };

  // Refresh page data
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Page data reloaded');
    }, 450);
  };

  // Filter Catalog suggestions
  const filteredCatalog = productSearch.trim()
    ? AVAILABLE_CATALOG.filter(
        (p) =>
          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.code.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.sku.toLowerCase().includes(productSearch.toLowerCase())
      )
    : [];

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
            <StoreIcon className="w-3.5 h-3.5 text-emerald-600" />
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Print Barcode</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your barcodes</p>
          </div>

          {/* Action Buttons: Refresh & Collapse/Expand */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Data"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-orange-500' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsCardCollapsed(!isCardCollapsed)}
              title={isCardCollapsed ? 'Expand panel' : 'Collapse panel'}
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              {isCardCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* MAIN BARCODE FORM CARD (Screenshot 1 Design) */}
        {!isCardCollapsed && (
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs p-6 space-y-5">
            {/* Top 2 Columns: Warehouse & Store */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Warehouse Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Warehouse <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedWarehouse}
                    onChange={(e) => setSelectedWarehouse(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="Warehouse A (Main)">Warehouse A (Main)</option>
                    <option value="Warehouse B (North)">Warehouse B (North)</option>
                    <option value="Central Logistics Hub">Central Logistics Hub</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Store Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Store <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedStore}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="Freshmart">Freshmart</option>
                    <option value="Downtown Store">Downtown Store</option>
                    <option value="Metro Hub">Metro Hub</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Search Bar */}
            <div className="relative">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Product <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Product by Code"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Dropdown Suggestions */}
              {productSearch.trim() && filteredCatalog.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-56 overflow-y-auto">
                  {filteredCatalog.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleAddProduct(prod)}
                      className="p-2.5 flex items-center justify-between hover:bg-orange-50/60 cursor-pointer border-b border-gray-100 last:border-b-0 text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-7 h-7 rounded object-cover border border-gray-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-800">{prod.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            SKU: {prod.sku} | Code: {prod.code}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-orange-600 text-xs">{prod.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INNER PRODUCTS TABLE CARD */}
            <div className="border border-gray-200/90 rounded-xl overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-5 font-semibold text-slate-700">Product</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">SKU</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">Code</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">Qty</th>
                      <th className="py-3 px-5 font-semibold text-slate-700 text-center w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-10 text-center text-slate-400">
                          No products added to the barcode list. Search and select above.
                        </td>
                      </tr>
                    ) : (
                      items.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          {/* Product Thumbnail & Name */}
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded object-cover border border-gray-200 bg-gray-50 flex-shrink-0"
                              />
                              <span className="font-medium text-slate-800 text-xs">{item.name}</span>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">
                            {item.sku}
                          </td>

                          {/* Code */}
                          <td className="py-3.5 px-5 font-mono text-slate-600 whitespace-nowrap">
                            {item.code}
                          </td>

                          {/* Quantity Stepper */}
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 bg-white shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, -1)}
                                className="text-gray-500 hover:text-orange-600 transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-semibold text-slate-800 text-xs w-4 text-center">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, 1)}
                                className="text-gray-500 hover:text-orange-600 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Delete Action */}
                          <td className="py-3.5 px-5 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id, item.name)}
                              title="Remove item"
                              className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-300 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paper Size & Toggle Options Row */}
            <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-gray-100 pb-6">
              {/* Paper Size Dropdown */}
              <div className="w-full lg:w-96">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paper Size <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="36mm (1.4 Inch)">36mm (1.4 Inch)</option>
                    <option value="24mm (0.94 Inch)">24mm (0.94 Inch)</option>
                    <option value="18mm (0.7 Inch)">18mm (0.7 Inch)</option>
                    <option value="12mm (0.47 Inch)">12mm (0.47 Inch)</option>
                    <option value="Continuous label">Continuous label</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Toggles: Show Store Name, Show Product Name, Show Price */}
              <div className="flex items-center gap-8 flex-wrap">
                {/* Show Store Name */}
                <div className="space-y-1">
                  <span className="block text-xs font-medium text-slate-700">Show Store Name</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showStoreName}
                    onClick={() => setShowStoreName(!showStoreName)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showStoreName ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        showStoreName ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Product Name */}
                <div className="space-y-1">
                  <span className="block text-xs font-medium text-slate-700">Show Product Name</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showProductName}
                    onClick={() => setShowProductName(!showProductName)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showProductName ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        showProductName ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Show Price */}
                <div className="space-y-1">
                  <span className="block text-xs font-medium text-slate-700">Show Price</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showPrice}
                    onClick={() => setShowPrice(!showPrice)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showPrice ? 'bg-emerald-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        showPrice ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS (Bottom Right matching Screenshot 1) */}
            <div className="flex items-center justify-end gap-3 flex-wrap pt-1">
              {/* 1. Generate Barcode (Orange) */}
              <button
                type="button"
                onClick={() => {
                  if (items.length === 0) {
                    alert('Please add at least one product');
                    return;
                  }
                  setShowPreviewModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Generate Barcode</span>
              </button>

              {/* 2. Reset Barcode (Dark Navy) */}
              <button
                type="button"
                onClick={handleResetBarcode}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Barcode</span>
              </button>

              {/* 3. Print Barcode (Vibrant Red) */}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] hover:bg-[#DC2626] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Barcode</span>
              </button>
            </div>
          </div>
        )}

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

      {/* GENERATED BARCODE PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-base text-slate-800">Generated Barcodes Preview</h3>
                <p className="text-xs text-slate-500">
                  Paper size: {paperSize || 'Standard'} • Total Labels:{' '}
                  {items.reduce((acc, curr) => acc + curr.qty, 0)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-xs"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body: Grid of Realistic Barcodes */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFBFD]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.flatMap((item) =>
                  Array.from({ length: item.qty }).map((_, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-between text-center shadow-2xs hover:border-orange-400 transition-colors"
                    >
                      {/* Store Name Header */}
                      {showStoreName && (
                        <p className="font-bold text-[11px] text-slate-800 tracking-wide uppercase">
                          {selectedStore || 'Freshmart'}
                        </p>
                      )}

                      {/* Product Name */}
                      {showProductName && (
                        <p className="text-[11px] text-slate-600 font-medium line-clamp-1 mt-0.5">
                          {item.name}
                        </p>
                      )}

                      {/* Barcode SVG Pattern */}
                      <div className="my-2 w-full flex justify-center">
                        <BarcodePattern code={item.code} />
                      </div>

                      {/* Price Tag */}
                      {showPrice && (
                        <p className="font-bold text-xs text-slate-900 mt-0.5">
                          Price: <span className="text-orange-600">{item.price}</span>
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-xs text-slate-500">
                Ready to print on {paperSize || 'continuous feed'}
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 rounded-md bg-[#1D273B] hover:bg-[#111827] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Close Preview
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#FF0000] hover:bg-[#DC2626] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
