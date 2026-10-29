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

interface UnitItem {
  id: string;
  name: string;
  shortName: string;
  noOfProducts: number;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

const INITIAL_UNITS: UnitItem[] = [
  {
    id: 'u-1',
    name: 'Kilograms',
    shortName: 'kg',
    noOfProducts: 25,
    createdDate: '24 Dec 2024',
    status: 'Active'
  },
  {
    id: 'u-2',
    name: 'Liters',
    shortName: 'L',
    noOfProducts: 18,
    createdDate: '10 Dec 2024',
    status: 'Active'
  },
  {
    id: 'u-3',
    name: 'Dozen',
    shortName: 'dz',
    noOfProducts: 30,
    createdDate: '27 Nov 2024',
    status: 'Active'
  },
  {
    id: 'u-4',
    name: 'Pieces',
    shortName: 'pcs',
    noOfProducts: 42,
    createdDate: '18 Nov 2024',
    status: 'Active'
  },
  {
    id: 'u-5',
    name: 'Boxes',
    shortName: 'bx',
    noOfProducts: 60,
    createdDate: '06 Nov 2024',
    status: 'Active'
  },
  {
    id: 'u-6',
    name: 'Tons',
    shortName: 't',
    noOfProducts: 10,
    createdDate: '25 Oct 2024',
    status: 'Active'
  },
  {
    id: 'u-7',
    name: 'Grams',
    shortName: 'g',
    noOfProducts: 70,
    createdDate: '03 Oct 2024',
    status: 'Active'
  },
  {
    id: 'u-8',
    name: 'Meters',
    shortName: 'm',
    noOfProducts: 80,
    createdDate: '20 Sep 2024',
    status: 'Active'
  },
  {
    id: 'u-9',
    name: 'Centimeters',
    shortName: 'cm',
    noOfProducts: 120,
    createdDate: '10 Sep 2024',
    status: 'Active'
  },
  {
    id: 'u-10',
    name: 'Milligrams',
    shortName: 'mg',
    noOfProducts: 15,
    createdDate: '15 Aug 2024',
    status: 'Active'
  },
  {
    id: 'u-11',
    name: 'Inches',
    shortName: 'in',
    noOfProducts: 50,
    createdDate: '01 Aug 2024',
    status: 'Active'
  }
];

export default function UnitsPage() {
  // Load from localStorage or default
  const [units, setUnits] = useState<UnitItem[]>(() => {
    const saved = localStorage.getItem('units_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_UNITS;
  });

  useEffect(() => {
    localStorage.setItem('units_list', JSON.stringify(units));
  }, [units]);

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
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);

  // Modal form states
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formStatus, setFormStatus] = useState<boolean>(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Filtered units
  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      if (statusFilter !== 'All' && unit.status !== statusFilter) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        return (
          unit.name.toLowerCase().includes(q) ||
          unit.shortName.toLowerCase().includes(q) ||
          unit.createdDate.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [units, statusFilter, searchTerm]);

  // Paginated list
  const totalPages = Math.max(1, Math.ceil(filteredUnits.length / rowsPerPage));
  const paginatedUnits = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredUnits.slice(start, start + rowsPerPage);
  }, [filteredUnits, currentPage, rowsPerPage]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedUnits.map((u) => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete unit
  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete unit "${name}"?`)) {
      setUnits((prev) => prev.filter((u) => u.id !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
      showToast(`Unit "${name}" deleted`);
    }
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingUnit(null);
    setFormName('');
    setFormShortName('');
    setFormStatus(true);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (unit: UnitItem) => {
    setEditingUnit(unit);
    setFormName(unit.name);
    setFormShortName(unit.shortName);
    setFormStatus(unit.status === 'Active');
    setIsModalOpen(true);
  };

  // Save Modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formShortName.trim()) {
      alert('Please fill in required fields');
      return;
    }

    if (editingUnit) {
      // Edit
      setUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnit.id
            ? {
                ...u,
                name: formName.trim(),
                shortName: formShortName.trim(),
                status: formStatus ? 'Active' : 'Inactive'
              }
            : u
        )
      );
      showToast(`Updated unit "${formName}"`);
    } else {
      // Add
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const formattedDate = `${String(now.getDate()).padStart(2, '0')} ${months[now.getMonth()]} ${now.getFullYear()}`;

      const newUnit: UnitItem = {
        id: `u-${Date.now()}`,
        name: formName.trim(),
        shortName: formShortName.trim(),
        noOfProducts: 0,
        createdDate: formattedDate,
        status: formStatus ? 'Active' : 'Inactive'
      };

      setUnits([newUnit, ...units]);
      showToast(`Added unit "${formName}"`);
    }

    setIsModalOpen(false);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Unit', 'Short name', 'No of Products', 'Created Date', 'Status'];
    const rows = filteredUnits.map((u) => [
      `"${u.name.replace(/"/g, '""')}"`,
      `"${u.shortName}"`,
      u.noOfProducts,
      u.createdDate,
      u.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Units_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Units</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage your units</p>
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

            {/* + Add Unit (Cobalt Button) */}
            <button
              type="button"
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Unit</span>
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
                        paginatedUnits.length > 0 &&
                        paginatedUnits.every((u) => selectedIds.includes(u.id))
                      }
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Unit</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Short name</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">No of Products</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Created Date</th>
                  <th className="py-3 px-4 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-4 font-semibold text-slate-700 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <AlertCircle className="w-8 h-8 text-gray-300" />
                        <span className="text-sm font-medium text-slate-600">No units found</span>
                        <p className="text-xs text-slate-400">Try modifying your filters or search term</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedUnits.map((unit) => {
                    const isSelected = selectedIds.includes(unit.id);
                    return (
                      <tr
                        key={unit.id}
                        className={`hover:bg-[#F9FAFC] transition-colors ${
                          isSelected ? 'bg-[#F5F7FF]' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(unit.id)}
                            className="rounded border-gray-300 text-[#315EFB] focus:ring-[#315EFB] cursor-pointer"
                          />
                        </td>

                        {/* Unit Name */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                          {unit.name}
                        </td>

                        {/* Short Name */}
                        <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {unit.shortName}
                        </td>

                        {/* No of Products */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {unit.noOfProducts}
                        </td>

                        {/* Created Date */}
                        <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                          {unit.createdDate}
                        </td>

                        {/* Status Badge with bullet dot */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-white ${
                              unit.status === 'Active' ? 'bg-[#10B981]' : 'bg-gray-400'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                            <span>{unit.status}</span>
                          </span>
                        </td>

                        {/* Actions: Edit, Delete */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Pencil */}
                            <button
                              type="button"
                              onClick={() => openEditModal(unit)}
                              title="Edit Unit"
                              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-[#315EFB] hover:border-[#315EFB] transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Trash */}
                            <button
                              type="button"
                              onClick={() => handleDelete(unit.id, unit.name)}
                              title="Delete Unit"
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

      {/* ADD / EDIT UNIT MODAL (Screenshot 3 Design) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 animate-fade-in">
            {/* Modal Header with Red Close Button */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-800">
                {editingUnit ? 'Edit Unit' : 'Add Unit'}
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
              {/* Unit Name Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter unit name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB] text-slate-800 placeholder-gray-400"
                />
              </div>

              {/* Short Name Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Short Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter short name"
                  value={formShortName}
                  onChange={(e) => setFormShortName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#315EFB] font-mono text-slate-800 placeholder-gray-400"
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
                  className="px-5 py-2 rounded-md bg-[#315EFB] hover:bg-[#2448D8] text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingUnit ? 'Save Changes' : 'Add Unit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
