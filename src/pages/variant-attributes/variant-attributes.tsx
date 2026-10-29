import React, { useState, useMemo, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import {
  Search,
  PlusCircle,
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
  Settings
} from 'lucide-react';

interface VariantAttributeItem {
  id: string;
  variant: string;
  values: string;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_VARIANTS: VariantAttributeItem[] = [
  {
    id: 'va-1',
    variant: 'Size',
    values: 'XS, S, M, L, XL',
    createdDate: '24 Dec 2024',
    status: 'Active'
  },
  {
    id: 'va-2',
    variant: 'Color',
    values: 'Red, Blue , Green',
    createdDate: '10 Dec 2024',
    status: 'Active'
  },
  {
    id: 'va-3',
    variant: 'Capacity',
    values: 'Small, Medium, Large',
    createdDate: '27 Nov 2024',
    status: 'Active'
  },
  {
    id: 'va-4',
    variant: 'Material',
    values: 'Cotton, Leather, Synthetic',
    createdDate: '18 Nov 2024',
    status: 'Active'
  },
  {
    id: 'va-5',
    variant: 'Weight',
    values: 'Light, Heavy',
    createdDate: '06 Nov 2024',
    status: 'Active'
  },
  {
    id: 'va-6',
    variant: 'Style',
    values: 'Casual, Formal, Sporty',
    createdDate: '25 Oct 2024',
    status: 'Active'
  },
  {
    id: 'va-7',
    variant: 'Pattern',
    values: 'Solid, Striped, Printed',
    createdDate: '14 Oct 2024',
    status: 'Active'
  },
  {
    id: 'va-8',
    variant: 'Memory',
    values: '8 GB, 16 GB, 36 GB',
    createdDate: '03 Oct 2024',
    status: 'Active'
  },
  {
    id: 'va-9',
    variant: 'Storage',
    values: '128 GB, 256 GB, 512 GB, 1TB',
    createdDate: '20 Sep 2024',
    status: 'Active'
  },
  {
    id: 'va-10',
    variant: 'Length',
    values: 'Short, Regular, Long',
    createdDate: '10 Sep 2024',
    status: 'Active'
  }
];

export default function VariantAttributesPage() {
  // Load from localStorage or default
  const [variants, setVariants] = useState<VariantAttributeItem[]>(() => {
    const saved = localStorage.getItem('variant_attributes_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_VARIANTS;
  });

  useEffect(() => {
    localStorage.setItem('variant_attributes_list', JSON.stringify(variants));
  }, [variants]);

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
  const [editingItem, setEditingItem] = useState<VariantAttributeItem | null>(null);

  // Modal form states
  const [formVariant, setFormVariant] = useState('');
  const [formValues, setFormValues] = useState('');
  const [formStatus, setFormStatus] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Filtered variants
  const filteredVariants = useMemo(() => {
    return variants.filter((item) => {
      if (statusFilter !== 'All' && item.status !== statusFilter) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          item.variant.toLowerCase().includes(q) ||
          item.values.toLowerCase().includes(q) ||
          item.createdDate.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [variants, statusFilter, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredVariants.length / rowsPerPage));
  const paginatedVariants = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredVariants.slice(start, start + rowsPerPage);
  }, [filteredVariants, currentPage, rowsPerPage]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedVariants.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete variant
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete variant attribute "${name}"?`)) {
      setVariants((prev) => prev.filter((v) => v.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Variant "${name}" deleted`);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingItem(null);
    setFormVariant('');
    setFormValues('');
    setFormStatus(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (item: VariantAttributeItem) => {
    setEditingItem(item);
    setFormVariant(item.variant);
    setFormValues(item.values);
    setFormStatus(item.status === 'Active');
    setIsModalOpen(true);
  };

  // Save Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVariant.trim() || !formValues.trim()) {
      alert('Please fill in required fields');
      return;
    }

    if (editingItem) {
      // Edit
      setVariants((prev) =>
        prev.map((v) =>
          v.id === editingItem.id
            ? {
                ...v,
                variant: formVariant.trim(),
                values: formValues.trim(),
                status: formStatus ? 'Active' : 'Inactive'
              }
            : v
        )
      );
      showToast(`Updated variant "${formVariant}"`);
    } else {
      // Add
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

      const newVariant: VariantAttributeItem = {
        id: `va-${Date.now()}`,
        variant: formVariant.trim(),
        values: formValues.trim(),
        createdDate: formattedDate,
        status: formStatus ? 'Active' : 'Inactive'
      };

      setVariants([newVariant, ...variants]);
      showToast(`Added variant "${formVariant}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Variant', 'Values', 'Created Date', 'Status'];
    const rows = filteredVariants.map((v) => [
      `"${v.variant.replace(/"/g, '""')}"`,
      `"${v.values.replace(/"/g, '""')}"`,
      v.createdDate,
      v.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Variant_Attributes_${new Date().toISOString().slice(0, 10)}.csv`);
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

      {/* TOP NAVBAR */}
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* PAGE BODY */}
      <div className="p-6 flex-1 space-y-4">
        {/* Page Title & Action Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Variant Attributes</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your variant attributes</p>
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

            {/* + Add Variant (Cobalt Button) */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Variant</span>
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
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#315EFB] transition-colors"
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
                  className="appearance-none bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700 pl-3 pr-8 py-1.5 hover:border-gray-300 focus:outline-none focus:border-[#315EFB] cursor-pointer"
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
                        paginatedVariants.length > 0 &&
                        paginatedVariants.every((v) => selectedIds.includes(v.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Variant</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Values</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedVariants.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No variant attributes found</span>
                        <p className="text-xs text-slate-400">Try modifying your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedVariants.map((item) => {
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

                        {/* Variant Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          {item.variant}
                        </td>

                        {/* Values */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {item.values}
                        </td>

                        {/* Created Date */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {item.createdDate}
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
                              title="Edit Variant"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#315EFB] hover:border-[#315EFB] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, item.variant)}
                              title="Delete Variant"
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

      {/* ADD / EDIT VARIANT MODAL (Screenshot 3 Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header with Red Close Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">
                {editingItem ? 'Edit Variant' : 'Add Variant'}
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
              {/* Variant Name Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Variant <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter variant name"
                  value={formVariant}
                  onChange={(e) => setFormVariant(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB] text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Values Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Values <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red, Blue, Green"
                  value={formValues}
                  onChange={(e) => setFormValues(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB] text-slate-800 placeholder-gray-400"
                />
                <p className="text-[11px] text-gray-400 mt-1">Enter value separated by comma</p>
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
                  className="px-5 py-2 rounded-md bg-[#315EFB] hover:bg-[#2448D8] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingItem ? 'Save Changes' : 'Add Variant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
