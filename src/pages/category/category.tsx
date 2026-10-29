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
  Check,
  Settings
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  createdOn: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Computers',
    slug: 'computers',
    createdOn: '24 Dec 2024',
    status: 'Active'
  },
  {
    id: 'cat-2',
    name: 'Electronics',
    slug: 'electronics',
    createdOn: '10 Dec 2024',
    status: 'Active'
  },
  {
    id: 'cat-3',
    name: 'Shoe',
    slug: 'shoe',
    createdOn: '27 Nov 2024',
    status: 'Active'
  },
  {
    id: 'cat-4',
    name: 'Cosmetics',
    slug: 'cosmetics',
    createdOn: '18 Nov 2024',
    status: 'Active'
  },
  {
    id: 'cat-5',
    name: 'Groceries',
    slug: 'groceries',
    createdOn: '06 Nov 2024',
    status: 'Active'
  },
  {
    id: 'cat-6',
    name: 'Furniture',
    slug: 'furniture',
    createdOn: '25 Oct 2024',
    status: 'Active'
  },
  {
    id: 'cat-7',
    name: 'Bags',
    slug: 'bags',
    createdOn: '14 Oct 2024',
    status: 'Active'
  },
  {
    id: 'cat-8',
    name: 'Phone',
    slug: 'phone',
    createdOn: '03 Oct 2024',
    status: 'Active'
  },
  {
    id: 'cat-9',
    name: 'Appliances',
    slug: 'appliances',
    createdOn: '20 Sep 2024',
    status: 'Active'
  },
  {
    id: 'cat-10',
    name: 'Clothing',
    slug: 'clothing',
    createdOn: '10 Sep 2024',
    status: 'Active'
  },
  {
    id: 'cat-11',
    name: 'Accessories',
    slug: 'accessories',
    createdOn: '15 Aug 2024',
    status: 'Active'
  },
  {
    id: 'cat-12',
    name: 'Stationery',
    slug: 'stationery',
    createdOn: '01 Aug 2024',
    status: 'Inactive'
  }
];

export default function CategoryPage() {
  // Load from localStorage or default
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('categories_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem('categories_list', JSON.stringify(categories));
  }, [categories]);

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
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Modal form states
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (statusFilter !== 'All' && cat.status !== statusFilter) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          cat.name.toLowerCase().includes(q) ||
          cat.slug.toLowerCase().includes(q) ||
          cat.createdOn.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categories, statusFilter, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / rowsPerPage));
  const paginatedCategories = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredCategories.slice(start, start + rowsPerPage);
  }, [filteredCategories, currentPage, rowsPerPage]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedCategories.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete category
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete category "${name}"?`)) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Category "${name}" deleted`);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormStatus('Active');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormStatus(cat.status);
    setIsModalOpen(true);
  };

  // Auto-slug on name change
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!formSlug || formSlug === formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setFormSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Save Modal (Create or Edit)
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSlug.trim()) {
      alert('Please fill in required fields');
      return;
    }

    if (editingCategory) {
      // Edit
      setCategories((prev) =>
        prev.map((c) =>
          c.id === editingCategory.id
            ? {
                ...c,
                name: formName.trim(),
                slug: formSlug.trim().toLowerCase(),
                status: formStatus
              }
            : c
        )
      );
      showToast(`Updated category "${formName}"`);
    } else {
      // Add
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        name: formName.trim(),
        slug: formSlug.trim().toLowerCase(),
        createdOn: formattedDate,
        status: formStatus
      };

      setCategories([newCat, ...categories]);
      showToast(`Created category "${formName}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Category', 'Category slug', 'Created On', 'Status'];
    const rows = filteredCategories.map((c) => [
      `"${c.name.replace(/"/g, '""')}"`,
      c.slug,
      c.createdOn,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Categories_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Category</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your categories</p>
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

            {/* + Add Category (Cobalt Button) */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Category</span>
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
                        paginatedCategories.length > 0 &&
                        paginatedCategories.every((cat) => selectedIds.includes(cat.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Category</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Category slug</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Created On</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No categories found</span>
                        <p className="text-xs text-slate-400">Try modifying your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedCategories.map((cat) => {
                    const isSelected = selectedIds.includes(cat.id);
                    return (
                      <tr
                        key={cat.id}
                        className={`hover:bg-[#F9FAFC] transition-colors ${
                          isSelected ? 'bg-[#F5F7FF]' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(cat.id)}
                            className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                          />
                        </td>

                        {/* Category Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          {cat.name}
                        </td>

                        {/* Category Slug */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {cat.slug}
                        </td>

                        {/* Created On */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {cat.createdOn}
                        </td>

                        {/* Status Badge (Green pill badge) */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold text-white ${
                              cat.status === 'Active' ? 'bg-[#10B981]' : 'bg-gray-400'
                            }`}
                          >
                            {cat.status}
                          </span>
                        </td>

                        {/* Actions: Edit, Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              title="Edit Category"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#315EFB] hover:border-[#315EFB] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(cat.id, cat.name)}
                              title="Delete Category"
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

      {/* ADD / EDIT CATEGORY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-fade-in">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home Appliances"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB] text-slate-800 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Category Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. home-appliances"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB] font-mono text-slate-800 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Status</label>
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="radio"
                      name="catStatus"
                      value="Active"
                      checked={formStatus === 'Active'}
                      onChange={() => setFormStatus('Active')}
                      className="w-4 h-4 text-[#315EFB] accent-[#315EFB] cursor-pointer"
                    />
                    <span>Active</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-500 hover:text-slate-700">
                    <input
                      type="radio"
                      name="catStatus"
                      value="Inactive"
                      checked={formStatus === 'Inactive'}
                      onChange={() => setFormStatus('Inactive')}
                      className="w-4 h-4 text-[#315EFB] accent-[#315EFB] cursor-pointer"
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-[#315EFB] hover:bg-[#2448D8] text-white font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
