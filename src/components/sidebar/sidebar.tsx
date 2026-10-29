import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Box,
  Grid2x2Plus,
  ClockAlert,
  TrendingUp,
  LayoutList,
  Layers,
  Tag,
  Boxes,
  SlidersHorizontal,
  BadgeCheck,
  ScanBarcode,
  QrCode
} from 'lucide-react';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Box },
  { name: 'Create Product', path: '/create-product', icon: Grid2x2Plus },
  { name: 'Expired Products', path: '/expired-products', icon: ClockAlert },
  { name: 'Low Stocks', path: '/low-stocks', icon: TrendingUp },
  { name: 'Category', path: '/category', icon: LayoutList },
  { name: 'Sub Category', path: '/sub-category', icon: Layers },
  { name: 'Brands', path: '/brands', icon: Tag },
  { name: 'Units', path: '/units', icon: Boxes },
  { name: 'Variant Attributes', path: '/variant-attributes', icon: SlidersHorizontal },
  { name: 'Warranties', path: '/warranties', icon: BadgeCheck },
  { name: 'Print Barcode', path: '/print-barcode', icon: ScanBarcode },
  { name: 'Print QR Code', path: '/print-qr-code', icon: QrCode }
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-[#FFFFFF] h-screen sticky top-0 border-r border-[#E8EAF0] flex flex-col py-5 px-3 select-none flex-shrink-0 overflow-hidden">
      {/* Brand Header */}
      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-3 pb-5 mb-4 border-b border-[#E8EAF0] hover:opacity-90 transition-opacity group flex-shrink-0"
      >
        <img
          src="/logo.jpeg"
          alt="LancersLoom Logo"
          className="w-10 h-10 object-contain rounded-xl p-1"
        />
        <div className="min-w-0">
          <h2 className="font-semibold text-[17px] text-[#000000] leading-tight tracking-[-0.03em] truncate group-hover:text-[#315EFB] transition-colors">
            LancersLoom
          </h2>
          <p className="text-[10px] text-[#526078] tracking-[0.1em] font-semibold mt-0.5 truncate">
            Inventory Management
          </p>
        </div>
      </Link>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto min-h-0 pr-1.5 custom-scrollbar">
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-[14px] font-medium tracking-[-0.01em] transition-all duration-200 ${
                  isActive
                    ? 'bg-[#315EFB] text-[#FFFFFF] shadow-[0_2px_8px_rgba(49,94,251,0.25)]'
                    : 'text-[#526078] hover:text-[#000000] hover:bg-[#F5F7FF]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#FFFFFF]' : 'text-[#526078]'
                    }`}
                    strokeWidth={1.75}
                  />
                  <span className="truncate">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

    </aside>

  );
};

export default Sidebar;
