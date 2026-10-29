import React, { useState, useMemo, useEffect } from 'react';
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
  X
} from 'lucide-react';

interface WarrantyItem {
  id: string;
  warranty: string;
  description: string;
  duration: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_WARRANTIES: WarrantyItem[] = [
  {
    id: 'w-1',
    warranty: 'Replacement Warranty',
    description: 'Covers replacement of faulty items',
    duration: '2 Year',
    status: 'Active'
  },
  {
    id: 'w-2',
    warranty: 'On-Site Warranty',
    description: "Product repairs done at the customer's location",
    duration: '1 Year',
    status: 'Active'
  },
  {
    id: 'w-3',
    warranty: 'Accidental Protection Plan',
    description: 'Coverage for accidental damage',
    duration: '6 Months',
    status: 'Active'
  },
  {
    id: 'w-4',
    warranty: 'Labor-Only Warranty',
    description: 'Covers only labor costs, not parts',
    duration: '6 Months',
    status: 'Active'
  },
  {
    id: 'w-5',
    warranty: 'No-Cost Repairs',
    description: 'No charge for repairs during warranty period',
    duration: '3 Months',
    status: 'Active'
  },
  {
    id: 'w-6',
    warranty: 'Accidental Damage',
    description: 'Coverage for unexpected damage',
    duration: '6 Months',
    status: 'Active'
  },
  {
    id: 'w-7',
    warranty: 'Wear & Tear Warranty',
    description: 'Covers specific product aging issues',
    duration: '1 Year',
    status: 'Active'
  },
  {
    id: 'w-8',
    warranty: 'Money-Back Guarantee',
    description: 'Refund within a specified period',
    duration: '3 Months',
    status: 'Active'
  },
  {
    id: 'w-9',
    warranty: 'Water Damage Warranty',
    description: 'Coverage for water-related issues',
    duration: '6 Months',
    status: 'Active'
  },
  {
    id: 'w-10',
    warranty: 'Power Surge Protection',
    description: 'Covers damage from power surges',
    duration: '6 Months',
    status: 'Active'
  }
];

export default function WarrantiesPage() {
  const navigate = useNavigate();

  // Load from localStorage or fallback
  const [warranties, setWarranties] = useState<WarrantyItem[]>(() => {
    const saved = localStorage.getItem('warranties_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_WARRANTIES;
  });

  useEffect(() => {
    localStorage.setItem('warranties_list', JSON.stringify(warranties));
  }, [warranties]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
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
  const [editingItem, setEditingItem] = useState<WarrantyItem | null>(null);

  // Modal form states
  const [formWarranty, setFormWarranty] = useState('');
  const [formDurationNumber, setFormDurationNumber] = useState('');
  const [formDurationPeriod, setFormDurationPeriod] = useState('Months');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Filtered warranties
  const filteredWarranties = useMemo(() => {
    return warranties.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          item.warranty.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.duration.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [warranties, statusFilter, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredWarranties.length / rowsPerPage));
  const paginatedWarranties = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredWarranties.slice(start, start + rowsPerPage);
  }, [filteredWarranties, currentPage, rowsPerPage]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedWarranties.map((w) => w.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete warranty
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete warranty "${name}"?`)) {
      setWarranties((prev) => prev.filter((w) => w.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Warranty "${name}" deleted`);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormWarranty('');
    setFormDurationNumber('');
    setFormDurationPeriod('Months');
    setFormDescription('');
    setFormStatus(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: WarrantyItem) => {
    setEditingItem(item);
    setFormWarranty(item.warranty);
    // Parse duration like "2 Year" or "6 Months"
    const parts = item.duration.split(' ');
    if (parts.length >= 2) {
      setFormDurationNumber(parts[0]);
      setFormDurationPeriod(parts[1]);
    } else {
      setFormDurationNumber(item.duration);
      setFormDurationPeriod('Months');
    }
    setFormDescription(item.description);
    setFormStatus(item.status === 'Active');
    setIsModalOpen(true);
  };

  // Save Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formWarranty.trim() || !formDurationNumber.trim() || !formDescription.trim()) {
      alert('Please fill in required fields');
      return;
    }

    const durationString = `${formDurationNumber.trim()} ${formDurationPeriod}`;

    if (editingItem) {
      // Edit
      setWarranties((prev) =>
        prev.map((w) =>
          w.id === editingItem.id
            ? {
                ...w,
                warranty: formWarranty.trim(),
                description: formDescription.trim(),
                duration: durationString,
                status: formStatus ? 'Active' : 'Inactive'
              }
            : w
        )
      );
      showToast(`Updated warranty "${formWarranty}"`);
    } else {
      // Add
      const newWarranty: WarrantyItem = {
        id: `w-${Date.now()}`,
        warranty: formWarranty.trim(),
        description: formDescription.trim(),
        duration: durationString,
        status: formStatus ? 'Active' : 'Inactive'
      };

      setWarranties([newWarranty, ...warranties]);
      showToast(`Added warranty "${formWarranty}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Warranty', 'Description', 'Duration', 'Status'];
    const rows = filteredWarranties.map((w) => [
      `"${w.warranty.replace(/"/g, '""')}"`,
      `"${w.description.replace(/"/g, '""')}"`,
      `"${w.duration}"`,
      w.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Warranties_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Warranties</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your warranties</p>
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

            {/* + Add Warranty (Orange Button) */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Warranty</span>
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
                        paginatedWarranties.length > 0 &&
                        paginatedWarranties.every((w) => selectedIds.includes(w.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Warranty</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Description</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Duration</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedWarranties.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No warranties found</span>
                        <p className="text-xs text-slate-400">Try modifying your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedWarranties.map((item) => {
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

                        {/* Warranty Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          {item.warranty}
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {item.description}
                        </td>

                        {/* Duration */}
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {item.duration}
                        </td>

                        {/* Status Badge with bullet dot */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-white ${
                              item.status === 'Active' ? 'bg-[#10B981]' : 'bg-gray-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{item.status}</span>
                          </span>
                        </td>

                        {/* Actions: Edit, Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEditModal(item)}
                              title="Edit Warranty"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-orange-600 hover:border-orange-300 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.warranty)}
                              title="Delete Warranty"
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

      {/* ADD / EDIT WARRANTY MODAL (Screenshot 3 Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header with Red Close Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">
                {editingItem ? 'Edit Warranty' : 'Add Warrranty'}
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
              {/* Warranty Name Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Warranty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter warranty name"
                  value={formWarranty}
                  onChange={(e) => setFormWarranty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Duration and Period Row */}
              <div className="grid grid-cols-2 gap-3">
                {/* Duration Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1"
                    value={formDurationNumber}
                    onChange={(e) => setFormDurationNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-orange-500 text-slate-800 placeholder-gray-400"
                  />
                </div>

                {/* Period Select */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Period <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formDurationPeriod}
                      onChange={(e) => setFormDurationPeriod(e.target.value)}
                      className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="">Select</option>
                      <option value="Day(s)">Day(s)</option>
                      <option value="Month(s)">Month(s)</option>
                      <option value="Months">Months</option>
                      <option value="Year">Year</option>
                      <option value="Years">Years</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter warranty description"
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
                  {editingItem ? 'Save Changes' : 'Add Warranty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
