import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  RotateCw,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  Maximize2,
  Mail,
  Bell,
  Settings,
  Store,
  CreditCard,
  Info,
  BadgePercent,
  Image as ImageIcon,
  SlidersHorizontal,
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  RemoveFormatting,
  Calendar,
  CheckCircle2
} from 'lucide-react';

interface UploadedImage {
  id: string;
  url: string;
  name: string;
}

export default function CreateProductPage() {
  const navigate = useNavigate();

  // Collapsible section toggles
  const [openSections, setOpenSections] = useState({
    info: true,
    pricing: true,
    images: true,
    custom: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleAllSections = () => {
    const allOpen = Object.values(openSections).every(Boolean);
    setOpenSections({
      info: !allOpen,
      pricing: !allOpen,
      images: !allOpen,
      custom: !allOpen
    });
  };

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3000);
  };

  // Section 1: Product Information
  const [store, setStore] = useState('Freshmart - Main');
  const [warehouse, setWarehouse] = useState('Bay 4A-12');
  const [productName, setProductName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('PT015');
  const [sellingType, setSellingType] = useState('Transactional');
  const [category, setCategory] = useState('Electronics');
  const [subCategory, setSubCategory] = useState('Smartphones');
  const [brand, setBrand] = useState('Apple');
  const [unit, setUnit] = useState('Pc');
  const [barcodeSymbology, setBarcodeSymbology] = useState('Code 128');
  const [itemBarcode, setItemBarcode] = useState('8901234567890');
  const [description, setDescription] = useState('');

  // Rich text active formatting simulation
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  // Section 2: Pricing & Stocks
  const [productType, setProductType] = useState<'single' | 'variable'>('single');
  const [quantity, setQuantity] = useState<number | ''>(50);
  const [price, setPrice] = useState<number | ''>(699);
  const [taxType, setTaxType] = useState('Exclusive');
  const [tax, setTax] = useState('GST 18%');
  const [discountType, setDiscountType] = useState('Percentage (%)');
  const [discountValue, setDiscountValue] = useState<number | ''>(5);
  const [quantityAlert, setQuantityAlert] = useState<number | ''>(10);

  // Section 3: Images
  const [images, setImages] = useState<UploadedImage[]>([
    {
      id: 'img-1',
      url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&h=200&q=80',
      name: 'Phone Front'
    },
    {
      id: 'img-2',
      url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&h=200&q=80',
      name: 'Phone Back'
    }
  ]);

  // Section 4: Custom Fields
  const [showWarranties, setShowWarranties] = useState(true);
  const [showManufacturer, setShowManufacturer] = useState(true);
  const [showExpiry, setShowExpiry] = useState(true);

  const [warranty, setWarranty] = useState('1 Year Standard');
  const [manufacturer, setManufacturer] = useState('Apple California');
  const [manufacturedDate, setManufacturedDate] = useState('2026-01-15');
  const [expiryDate, setExpiryDate] = useState('2028-01-15');

  // Auto-slug generator
  const handleNameChange = (val: string) => {
    setProductName(val);
    if (!slug || slug === productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  // Generate random SKU
  const handleGenerateSku = () => {
    const randomCode = Math.floor(100 + Math.random() * 900);
    setSku(`PT0${randomCode}`);
    showToast('Generated new SKU');
  };

  // Generate random Barcode
  const handleGenerateBarcode = () => {
    const randomBarcode = '890' + Math.floor(1000000000 + Math.random() * 9000000000);
    setItemBarcode(randomBarcode);
    showToast('Generated new Item Barcode');
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileList = Array.from(e.target.files);
      const newImgs: UploadedImage[] = fileList.map((file, idx) => ({
        id: `img-${Date.now()}-${idx}`,
        url: URL.createObjectURL(file),
        name: file.name
      }));
      setImages((prev) => [...prev, ...newImgs]);
      showToast(`Uploaded ${newImgs.length} image(s)`);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  // Reset form
  const handleResetForm = () => {
    setProductName('');
    setSlug('');
    setPrice('');
    setQuantity('');
    setDescription('');
    showToast('Form fields cleared');
  };

  // Word count calculator
  const wordCount = description.trim() === '' ? 0 : description.trim().split(/\s+/).length;

  // Submit & Save Product
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      alert('Product Name is required.');
      return;
    }
    if (!sku.trim()) {
      alert('SKU is required.');
      return;
    }

    // Read existing products from localStorage
    const saved = localStorage.getItem('products_list');
    let productList = [];
    if (saved) {
      try {
        productList = JSON.parse(saved);
      } catch {
        productList = [];
      }
    }

    const newProduct = {
      id: `p-${Date.now()}`,
      sku: sku.trim(),
      name: productName.trim(),
      category: category || 'General',
      brand: brand || 'Generic',
      price: Number(price) || 0,
      unit: unit || 'Pc',
      qty: Number(quantity) || 0,
      createdBy: 'James Kirwin',
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80',
      image: images.length > 0
        ? images[0].url
        : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80'
    };

    // Prepend new product
    const updatedList = [newProduct, ...productList];
    localStorage.setItem('products_list', JSON.stringify(updatedList));

    showToast(`Product "${productName}" added successfully!`);

    // Navigate to product page
    setTimeout(() => {
      navigate('/products');
    }, 500);
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

      {/* TOP NAVBAR (Exact match from screenshots) */}
      <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Left Search Bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search"
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
            onClick={handleResetForm}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Create Product</h1>
            <p className="text-xs text-slate-500 mt-0.5">Create new product</p>
          </div>

          {/* Right Action Icons Bar */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            <button
              type="button"
              onClick={handleResetForm}
              title="Reset Form"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Collapse/Expand Sections */}
            <button
              type="button"
              onClick={toggleAllSections}
              title="Toggle All Sections"
              className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 shadow-2xs transition-colors"
            >
              {Object.values(openSections).every(Boolean) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {/* Back to Product (Navy Button) */}
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1D273B] hover:bg-[#111827] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Product</span>
            </button>
          </div>
        </div>

        {/* CREATE PRODUCT FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ================= SECTION 1: PRODUCT INFORMATION ================= */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
            <div
              onClick={() => toggleSection('info')}
              className="px-5 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF7034] flex items-center justify-center text-xs">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-bold text-sm text-slate-800">Product Information</h2>
              </div>
              <button type="button" className="text-gray-400 hover:text-gray-600">
                {openSections.info ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {openSections.info && (
              <div className="p-5 space-y-4 text-xs">
                {/* Row 1: Store & Warehouse */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Store <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Freshmart - Main">Freshmart - Main</option>
                        <option value="Downtown Outlet">Downtown Outlet</option>
                        <option value="Warehouse East">Warehouse East</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Warehouse <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={warehouse}
                        onChange={(e) => setWarehouse(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Bay 4A-12">Bay 4A-12</option>
                        <option value="Bay 2B-04">Bay 2B-04</option>
                        <option value="Bay 1A-01">Bay 1A-01</option>
                        <option value="Central Depot">Central Depot</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Product Name & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 14 Pro Max"
                      value={productName}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iphone-14-pro-max"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Row 3: SKU & Selling Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        required
                        placeholder="e.g. PT015"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-md pl-3 pr-24 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateSku}
                        className="absolute right-1.5 px-3 py-1 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Selling Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={sellingType}
                        onChange={(e) => setSellingType(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Transactional">Transactional</option>
                        <option value="Retail">Retail</option>
                        <option value="Wholesale">Wholesale</option>
                        <option value="Online Only">Online Only</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 4: Category & Sub Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-semibold text-slate-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const newCat = prompt('Enter new category name:');
                          if (newCat) {
                            setCategory(newCat);
                            showToast(`Added category: ${newCat}`);
                          }
                        }}
                        className="text-[#FF7034] hover:underline flex items-center gap-1 font-semibold text-[11px]"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Add New</span>
                      </button>
                    </div>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Computers">Computers</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Shoe">Shoe</option>
                        <option value="Furnitures">Furnitures</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Bags">Bags</option>
                        <option value="Phone">Phone</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Sub Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Smartphones">Smartphones</option>
                        <option value="Laptops">Laptops</option>
                        <option value="Headphones">Headphones</option>
                        <option value="Sneakers">Sneakers</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 5: Brand & Unit */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Apple">Apple</option>
                        <option value="Lenovo">Lenovo</option>
                        <option value="Beats">Beats</option>
                        <option value="Nike">Nike</option>
                        <option value="Amazon">Amazon</option>
                        <option value="Modern Wave">Modern Wave</option>
                        <option value="Dior">Dior</option>
                        <option value="Arlime">Arlime</option>
                        <option value="The North Face">The North Face</option>
                        <option value="Sony">Sony</option>
                        <option value="Dell">Dell</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Pc">Pc</option>
                        <option value="Kg">Kg</option>
                        <option value="Box">Box</option>
                        <option value="Meter">Meter</option>
                        <option value="Pair">Pair</option>
                        <option value="Set">Set</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 6: Barcode Symbology & Item Barcode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Barcode Symbology <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={barcodeSymbology}
                        onChange={(e) => setBarcodeSymbology(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Code 128">Code 128</option>
                        <option value="Code 39">Code 39</option>
                        <option value="EAN-13">EAN-13</option>
                        <option value="UPC-A">UPC-A</option>
                        <option value="QR Code">QR Code</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Item Barcode <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        placeholder="Scan or enter item barcode"
                        value={itemBarcode}
                        onChange={(e) => setItemBarcode(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-md pl-3 pr-24 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleGenerateBarcode}
                        className="absolute right-1.5 px-3 py-1 bg-[#FF7034] hover:bg-[#E85B20] text-white rounded text-[11px] font-semibold transition-colors"
                      >
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                {/* Row 7: Description (Rich Text Editor style) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Description</label>
                  <div className="border border-gray-200 rounded-md overflow-hidden bg-white focus-within:border-orange-500 transition-colors">
                    {/* Editor Toolbar */}
                    <div className="flex items-center gap-1.5 p-2 border-b border-gray-200 bg-gray-50/80 text-gray-600">
                      <select className="bg-transparent text-xs text-gray-700 border-none focus:outline-none cursor-pointer pr-2">
                        <option>Normal</option>
                        <option>Heading 1</option>
                        <option>Heading 2</option>
                        <option>Heading 3</option>
                      </select>
                      <span className="w-px h-4 bg-gray-300 mx-1"></span>

                      <button
                        type="button"
                        onClick={() => setIsBold(!isBold)}
                        className={`p-1 rounded hover:bg-gray-200 ${isBold ? 'bg-gray-200 text-slate-900 font-bold' : ''}`}
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsItalic(!isItalic)}
                        className={`p-1 rounded hover:bg-gray-200 ${isItalic ? 'bg-gray-200 text-slate-900 italic' : ''}`}
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsUnderline(!isUnderline)}
                        className={`p-1 rounded hover:bg-gray-200 ${isUnderline ? 'bg-gray-200 text-slate-900 underline' : ''}`}
                        title="Underline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-200"
                        title="Strikethrough"
                      >
                        <Strikethrough className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-px h-4 bg-gray-300 mx-1"></span>

                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-200"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        className="p-1 rounded hover:bg-gray-200"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsBold(false);
                          setIsItalic(false);
                          setIsUnderline(false);
                        }}
                        className="p-1 rounded hover:bg-gray-200"
                        title="Clear Formatting"
                      >
                        <RemoveFormatting className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Editor Textarea */}
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter detailed product description, specifications, and warranty guidance..."
                      className={`w-full p-3 text-xs text-slate-800 placeholder-gray-400 focus:outline-none resize-y ${
                        isBold ? 'font-bold' : ''
                      } ${isItalic ? 'italic' : ''} ${isUnderline ? 'underline' : ''}`}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-gray-400">
                    <span>Maximum 60 Words</span>
                    <span className={wordCount > 60 ? 'text-red-500 font-semibold' : ''}>
                      {wordCount} / 60 words
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= SECTION 2: PRICING & STOCKS ================= */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
            <div
              onClick={() => toggleSection('pricing')}
              className="px-5 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF7034] flex items-center justify-center text-xs">
                  <BadgePercent className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-bold text-sm text-slate-800">Pricing & Stocks</h2>
              </div>
              <button type="button" className="text-gray-400 hover:text-gray-600">
                {openSections.pricing ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {openSections.pricing && (
              <div className="p-5 space-y-4 text-xs">
                {/* Product Type Radios */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-2">
                    Product Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name="productType"
                        value="single"
                        checked={productType === 'single'}
                        onChange={() => setProductType('single')}
                        className="w-4 h-4 text-orange-500 accent-orange-500 cursor-pointer"
                      />
                      <span>Single Product</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-500 hover:text-slate-700">
                      <input
                        type="radio"
                        name="productType"
                        value="variable"
                        checked={productType === 'variable'}
                        onChange={() => setProductType('variable')}
                        className="w-4 h-4 text-orange-500 accent-orange-500 cursor-pointer"
                      />
                      <span>Variable Product</span>
                    </label>
                  </div>
                </div>

                {/* Row 1: Quantity, Price, Tax Type */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 50"
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 699"
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Tax Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={taxType}
                        onChange={(e) => setTaxType(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Exclusive">Exclusive</option>
                        <option value="Inclusive">Inclusive</option>
                        <option value="None">None</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Tax, Discount Type, Discount Value */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Tax <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={tax}
                        onChange={(e) => setTax(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="GST 18%">GST 18%</option>
                        <option value="GST 12%">GST 12%</option>
                        <option value="GST 5%">GST 5%</option>
                        <option value="VAT 10%">VAT 10%</option>
                        <option value="None">None</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Discount Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={discountType}
                        onChange={(e) => setDiscountType(e.target.value)}
                        className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="Percentage (%)">Percentage (%)</option>
                        <option value="Fixed Amount ($)">Fixed Amount ($)</option>
                        <option value="None">None</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Discount Value <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 5"
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Row 3: Quantity Alert */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Quantity Alert <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantityAlert}
                      onChange={(e) => setQuantityAlert(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 10"
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ================= SECTION 3: IMAGES ================= */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
            <div
              onClick={() => toggleSection('images')}
              className="px-5 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF7034] flex items-center justify-center text-xs">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-bold text-sm text-slate-800">Images</h2>
              </div>
              <button type="button" className="text-gray-400 hover:text-gray-600">
                {openSections.images ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {openSections.images && (
              <div className="p-5 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  {/* Upload Box */}
                  <label className="w-28 h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50/30 transition-all text-center p-2 group">
                    <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-orange-100 text-gray-500 group-hover:text-[#FF7034] flex items-center justify-center mb-1.5 transition-colors">
                      <PlusCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-gray-600 group-hover:text-[#FF7034] transition-colors">
                      Add Images
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Uploaded Preview Cards */}
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="relative w-28 h-28 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group shadow-xs"
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Red delete button on top-right */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        title="Remove image"
                        className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded flex items-center justify-center shadow-xs transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ================= SECTION 4: CUSTOM FIELDS ================= */}
          <div className="bg-white border border-gray-200/80 rounded-xl shadow-xs overflow-hidden">
            <div
              onClick={() => toggleSection('custom')}
              className="px-5 py-4 border-b border-gray-100 flex items-center justify-between cursor-pointer select-none bg-white hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF7034] flex items-center justify-center text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-bold text-sm text-slate-800">Custom Fields</h2>
              </div>
              <button type="button" className="text-gray-400 hover:text-gray-600">
                {openSections.custom ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {openSections.custom && (
              <div className="p-5 space-y-4 text-xs">
                {/* Checkbox Selector Row */}
                <div className="bg-gray-50 border border-gray-200/80 rounded-lg p-3 flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showWarranties}
                      onChange={(e) => setShowWarranties(e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <span>Warranties</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showManufacturer}
                      onChange={(e) => setShowManufacturer(e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <span>Manufacturer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={showExpiry}
                      onChange={(e) => setShowExpiry(e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500 cursor-pointer"
                    />
                    <span>Expiry</span>
                  </label>
                </div>

                {/* Custom Fields Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {showWarranties && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Warranty <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={warranty}
                          onChange={(e) => setWarranty(e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="">Select</option>
                          <option value="No Warranty">No Warranty</option>
                          <option value="3 Months">3 Months</option>
                          <option value="6 Months">6 Months</option>
                          <option value="1 Year Standard">1 Year Standard</option>
                          <option value="2 Years Extended">2 Years Extended</option>
                          <option value="Lifetime">Lifetime</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {showManufacturer && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1.5">
                        Manufacturer <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Foxconn Technology Group"
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs text-slate-800 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  )}

                  {showExpiry && (
                    <>
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Manufactured Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={manufacturedDate}
                            onChange={(e) => setManufacturedDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1.5">
                          Expiry On <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-md pl-3 pr-8 py-2 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                          />
                          <Calendar className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================= FORM FOOTER ACTIONS ================= */}
          <div className="pt-2 flex items-center justify-end gap-3">
            {/* Cancel Button (Dark Navy) */}
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="px-6 py-2.5 rounded-md bg-[#1D273B] hover:bg-[#111827] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Cancel
            </button>

            {/* Add Product Button (Orange) */}
            <button
              type="submit"
              className="px-6 py-2.5 rounded-md bg-[#FF7034] hover:bg-[#E85B20] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Add Product
            </button>
          </div>
        </form>

        {/* BOTTOM COPYRIGHT FOOTER */}
        <footer className="pt-6 pb-2 border-t border-gray-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
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
    </div>
  );
}
