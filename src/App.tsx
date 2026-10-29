import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/sidebar/sidebar';
import DashboardPage from './pages/dashboard/dashboard';

import ProductPage from './pages/product/product';
import CreateProductPage from './pages/create-product/create-product';
import ExpiredProductsPage from './pages/expired-products/expired-products';
import LowStocksPage from './pages/low-stocks/low-stocks';
import CategoryPage from './pages/category/category';
import SubCategoryPage from './pages/sub-category/sub-category';
import BrandsPage from './pages/brands/brands';
import UnitsPage from './pages/units/units';
import VariantAttributesPage from './pages/variant-attributes/variant-attributes';
import WarrantiesPage from './pages/warranties/warranties';
import PrintBarcodePage from './pages/print-barcode/print-barcode';
import PrintQrCodePage from './pages/print-qr-code/print-qr-code';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen overflow-hidden bg-[#FFFFFF] font-sans text-[#000000]">
        {/* Sidebar Alone */}
        <Sidebar />

        {/* Content Area for building pages one by one */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto bg-[#F8F9FA] custom-scrollbar">

          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/create-product" element={<CreateProductPage />} />
            <Route path="/expired-products" element={<ExpiredProductsPage />} />
            <Route path="/low-stocks" element={<LowStocksPage />} />
            <Route path="/category" element={<CategoryPage />} />
            <Route path="/sub-category" element={<SubCategoryPage />} />
            <Route path="/brands" element={<BrandsPage />} />
            <Route path="/units" element={<UnitsPage />} />
            <Route path="/variant-attributes" element={<VariantAttributesPage />} />
            <Route path="/warranties" element={<WarrantiesPage />} />
            <Route path="/print-barcode" element={<PrintBarcodePage />} />
            <Route path="/print-qr-code" element={<PrintQrCodePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}