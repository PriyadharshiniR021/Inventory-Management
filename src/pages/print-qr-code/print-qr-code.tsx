import React, { useState, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import {
  Search,
  RotateCw,
  ChevronUp,
  ChevronDown,
  Trash2,
  Eye,
  RotateCcw,
  Printer,
  Minus,
  Plus,
  CheckCircle2,
  X,
  Settings
} from 'lucide-react';

interface QrProductItem {
  id: string;
  name: string;
  image: string;
  sku: string;
  code: string;
  refNumber: string;
  qty: number;
}

const DEFAULT_ITEMS: QrProductItem[] = [
  {
    id: 'qp-1',
    name: 'Nike Jordan',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT002',
    code: 'HG3FK',
    refNumber: '32RRR554',
    qty: 4
  }
];

const AVAILABLE_CATALOG: QrProductItem[] = [
  ...DEFAULT_ITEMS,
  {
    id: 'qp-2',
    name: 'Apple Series 5 Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT003',
    code: 'TEUIU7',
    refNumber: '45AAB102',
    qty: 4
  },
  {
    id: 'qp-3',
    name: 'Amazon Echo Dot',
    image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT001',
    code: 'ECH01',
    refNumber: '88QQR201',
    qty: 2
  },
  {
    id: 'qp-4',
    name: 'Beats Studio Pro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT004',
    code: 'BTS04',
    refNumber: '99ZZK304',
    qty: 2
  },
  {
    id: 'qp-5',
    name: 'Lenovo ThinkPad',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80',
    sku: 'PT005',
    code: 'LNV05',
    refNumber: '12MMN505',
    qty: 1
  }
];

// Vector 2D QR Code Generator
const QrCodePattern: React.FC<{ code: string; size?: number }> = ({ code, size = 96 }) => {
  const matrix = useMemo(() => {
    const dim = 21;
    const grid: boolean[][] = Array.from({ length: dim }, () => Array(dim).fill(false));

    // Finder patterns
    const drawFinder = (startX: number, startY: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          if (
            r === 0 || r === 6 || c === 0 || c === 6 ||
            (r >= 2 && r <= 4 && c >= 2 && c <= 4)
          ) {
            grid[startY + r][startX + c] = true;
          }
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(dim - 7, 0);
    drawFinder(0, dim - 7);

    // Timing lines
    for (let i = 8; i < dim - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    // Deterministic module distribution based on code
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = (hash << 5) - hash + code.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < dim; r++) {
      for (let c = 0; c < dim; c++) {
        if ((r < 8 && c < 8) || (r < 8 && c >= dim - 8) || (r >= dim - 8 && c < 8)) continue;
        if (r === 6 || c === 6) continue;
        const val = Math.sin((r * 31 + c * 19 + hash)) * 10000;
        grid[r][c] = (val - Math.floor(val)) > 0.48;
      }
    }

    return grid;
  }, [code]);

  return (
    <svg width={size} height={size} viewBox="0 0 21 21" className="shape-rendering-crispEdges">
      {matrix.map((row, r) =>
        row.map((cell, c) =>
          cell ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111111" /> : null
        )
      )}
    </svg>
  );
};

export default function PrintQrCodePage() {
  // Header and Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [tableSearch, setTableSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form selections
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [paperSize, setPaperSize] = useState('36mm (1.4 Inch)');

  // Toggle matching Screenshot 1
  const [showReferenceNumber, setShowReferenceNumber] = useState(true);

  // QR items table
  const [items, setItems] = useState<QrProductItem[]>(DEFAULT_ITEMS);

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
    showToast(`Removed "${name}" from QR code list`);
  };

  // Add Product from Catalog
  const handleAddProduct = (prod: QrProductItem) => {
    if (items.some((i) => i.id === prod.id)) {
      handleQtyChange(prod.id, 1);
      showToast(`Increased quantity for ${prod.name}`);
    } else {
      setItems((prev) => [...prev, { ...prod, qty: 1 }]);
      showToast(`Added ${prod.name} to QR code list`);
    }
    setProductSearch('');
  };

  // Reset
  const handleReset = () => {
    setItems(DEFAULT_ITEMS);
    setSelectedWarehouse('');
    setSelectedStore('');
    setPaperSize('36mm (1.4 Inch)');
    setShowReferenceNumber(true);
    setProductSearch('');
    setTableSearch('');
    showToast('Reset QR code form to defaults');
  };

  // Refresh page
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
          p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
          p.refNumber.toLowerCase().includes(productSearch.toLowerCase())
      )
    : [];

  // Filtered Table Items
  const filteredTableItems = items.filter((item) => {
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.sku.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.refNumber.toLowerCase().includes(q)
    );
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Print QR Code</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your QR code</p>
          </div>

          {/* Action Buttons: Refresh & Collapse/Expand */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              title="Refresh Data"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#315EFB]' : ''}`} />
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

        {/* MAIN QR FORM CARD (Screenshot 1 Design) */}
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
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB] cursor-pointer"
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
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB] cursor-pointer"
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
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-[#315EFB]"
                />
              </div>

              {/* Dropdown Suggestions */}
              {productSearch.trim() && filteredCatalog.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-56 overflow-y-auto">
                  {filteredCatalog.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleAddProduct(prod)}
                      className="p-2.5 flex items-center justify-between hover:bg-[#F5F7FF] cursor-pointer border-b border-gray-100 last:border-b-0 text-xs"
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
                            SKU: {prod.sku} | Ref: {prod.refNumber}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-[#315EFB] text-xs font-mono">{prod.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INNER PRODUCTS TABLE CARD */}
            <div className="border border-gray-200/90 rounded-xl overflow-hidden bg-white">
              {/* Inner Search Box above the header row (matching Screenshot) */}
              <div className="p-3 border-b border-gray-100 bg-white">
                <div className="relative max-w-sm">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-md text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-[#315EFB]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#E9ECEF]/70 text-slate-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="py-3 px-5 font-semibold text-slate-700">Product</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">SKU</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">Code</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">Reference Number</th>
                      <th className="py-3 px-5 font-semibold text-slate-700">Qty</th>
                      <th className="py-3 px-5 font-semibold text-slate-700 text-center w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTableItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">
                          No products found in the list.
                        </td>
                      </tr>
                    ) : (
                      filteredTableItems.map((item) => (
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

                          {/* Reference Number */}
                          <td className="py-3.5 px-5 font-mono text-slate-700 whitespace-nowrap font-medium">
                            {item.refNumber}
                          </td>

                          {/* Quantity Stepper */}
                          <td className="py-3.5 px-5 whitespace-nowrap">
                            <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1 bg-white shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, -1)}
                                className="text-gray-500 hover:text-[#315EFB] transition-colors cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="font-semibold text-slate-800 text-xs w-4 text-center">
                                {item.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, 1)}
                                className="text-gray-500 hover:text-[#315EFB] transition-colors cursor-pointer"
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

            {/* Paper Size & Reference Number Toggle Row */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-6">
              {/* Paper Size Dropdown */}
              <div className="w-full sm:w-96">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Paper Size <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={paperSize}
                    onChange={(e) => setPaperSize(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3.5 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#315EFB] cursor-pointer"
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

              {/* Reference Number Toggle */}
              <div className="space-y-1">
                <span className="block text-xs font-medium text-slate-700">Reference Number</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showReferenceNumber}
                  onClick={() => setShowReferenceNumber(!showReferenceNumber)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    showReferenceNumber ? 'bg-emerald-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      showReferenceNumber ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* ACTION BUTTONS (Bottom Right matching Screenshot 1) */}
            <div className="flex items-center justify-end gap-3 flex-wrap pt-1">
              {/* 1. Generate QR Code (Cobalt) */}
              <button
                type="button"
                onClick={() => {
                  if (items.length === 0) {
                    alert('Please add at least one product');
                    return;
                  }
                  setShowPreviewModal(true);
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Generate QR Code</span>
              </button>

              {/* 2. Reset (Dark Navy) */}
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              {/* 3. Print QRCode (Vibrant Red) */}
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF0000] hover:bg-[#DC2626] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print QRCode</span>
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
          className="w-9 h-9 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
        </button>
      </div>

      {/* GENERATED QR CODES PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="font-bold text-base text-slate-800">Generated QR Codes Preview</h3>
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

            {/* Modal Body: Grid of Vector QR Codes */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#FAFBFD]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.flatMap((item) =>
                  Array.from({ length: item.qty }).map((_, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-between text-center shadow-2xs hover:border-[#315EFB] transition-colors"
                    >
                      {/* Product Name */}
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {item.name}
                      </p>

                      {/* Vector 2D QR Code */}
                      <div className="my-2.5 p-1 bg-white border border-gray-200 rounded flex justify-center">
                        <QrCodePattern code={item.refNumber || item.code} size={88} />
                      </div>

                      {/* Reference Number */}
                      {showReferenceNumber && (
                        <div className="text-center">
                          <span className="text-[10px] text-slate-500 block">Ref No:</span>
                          <span className="font-mono font-bold text-xs text-slate-900 tracking-wider">
                            {item.refNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-white">
              <span className="text-xs text-slate-500">
                Ready to print on {paperSize || 'standard paper'}
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
