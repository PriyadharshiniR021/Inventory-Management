import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import {
  Package,
  DollarSign,
  AlertTriangle,
  XCircle,
  TrendingUp,

  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Tag,
  LayoutList,
  ShoppingCart,
  BarChart3,
  Activity,
  Clock,
  Settings,
  ChevronRight,
  Eye,
  Truck,
  RotateCw,
  PackagePlus,
  PackageMinus,
  Warehouse,
  CircleDot,
} from 'lucide-react';

/* ─────── Types ─────── */
interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  unit: string;
  qty: number;
  createdBy: string;
  creatorAvatar: string;
  image: string;
}

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

/* ─────── Initial Products (same source as Product page) ─────── */
const INITIAL_PRODUCTS: ProductItem[] = [
  { id: 'p-1', sku: 'PT001', name: 'Lenovo IdeaPad 3', category: 'Computers', brand: 'Lenovo', price: 600, unit: 'Pc', qty: 100, createdBy: 'James Kirwin', creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-2', sku: 'PT002', name: 'Beats Pro', category: 'Electronics', brand: 'Beats', price: 160, unit: 'Pc', qty: 140, createdBy: 'Francis Chang', creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-3', sku: 'PT003', name: 'Nike Jordan', category: 'Shoe', brand: 'Nike', price: 110, unit: 'Pc', qty: 300, createdBy: 'Antonio Engle', creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-4', sku: 'PT004', name: 'Apple Series 5 Watch', category: 'Electronics', brand: 'Apple', price: 120, unit: 'Pc', qty: 450, createdBy: 'Leo Kelly', creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-5', sku: 'PT005', name: 'Amazon Echo Dot', category: 'Electronics', brand: 'Amazon', price: 80, unit: 'Pc', qty: 320, createdBy: 'Annette Walker', creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-6', sku: 'PT006', name: 'Sanford Chair Sofa', category: 'Furnitures', brand: 'Modern Wave', price: 320, unit: 'Pc', qty: 650, createdBy: 'John Weaver', creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-7', sku: 'PT007', name: 'Red Premium Satchel', category: 'Bags', brand: 'Dior', price: 60, unit: 'Pc', qty: 700, createdBy: 'Gary Hennessy', creatorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-8', sku: 'PT008', name: 'Iphone 14 Pro', category: 'Phone', brand: 'Apple', price: 540, unit: 'Pc', qty: 630, createdBy: 'Eleanor Panek', creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-9', sku: 'PT009', name: 'Gaming Chair', category: 'Furniture', brand: 'Arlime', price: 200, unit: 'Pc', qty: 410, createdBy: 'William Levy', creatorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1580481077195-c22ae2913a49?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-10', sku: 'PT010', name: 'Borealis Backpack', category: 'Bags', brand: 'The North Face', price: 45, unit: 'Pc', qty: 550, createdBy: 'Charlotte Klotz', creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-11', sku: 'PT011', name: 'Sony WH-1000XM5', category: 'Electronics', brand: 'Sony', price: 380, unit: 'Pc', qty: 180, createdBy: 'James Kirwin', creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80' },
  { id: 'p-12', sku: 'PT012', name: 'Dell XPS 15 9530', category: 'Computers', brand: 'Dell', price: 1800, unit: 'Pc', qty: 90, createdBy: 'Francis Chang', creatorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&h=80&q=80', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80' },
];

/* ─────── Recent Activity Log ─────── */
const RECENT_ACTIVITY = [
  { id: 'a1', type: 'restock' as const, icon: PackagePlus, text: 'Restocked 50 units of Beats Pro', time: '10 min ago', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'a2', type: 'sale' as const, icon: ShoppingCart, text: 'Sold 12 units of Nike Jordan', time: '25 min ago', color: 'text-[#315EFB]', bg: 'bg-[#F5F7FF]' },
  { id: 'a3', type: 'alert' as const, icon: AlertTriangle, text: 'Dell XPS 15 low stock alert (90 units)', time: '1 hr ago', color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'a4', type: 'sale' as const, icon: PackageMinus, text: 'Dispatched 30 units of Amazon Echo Dot', time: '2 hrs ago', color: 'text-[#315EFB]', bg: 'bg-[#F5F7FF]' },
  { id: 'a5', type: 'add' as const, icon: PackagePlus, text: 'New product added: Gaming Chair', time: '3 hrs ago', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'a6', type: 'alert' as const, icon: XCircle, text: 'Lenovo IdeaPad 3 stock critically low', time: '5 hrs ago', color: 'text-red-500', bg: 'bg-red-50' },
];

/* ─────── Top Selling Products ─────── */
const TOP_SELLING = [
  { name: 'Iphone 14 Pro', category: 'Phone', sold: 234, revenue: 126360, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=80&h=80&q=80' },
  { name: 'Dell XPS 15 9530', category: 'Computers', sold: 189, revenue: 340200, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=80&h=80&q=80' },
  { name: 'Sanford Chair Sofa', category: 'Furnitures', sold: 156, revenue: 49920, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=80&h=80&q=80' },
  { name: 'Nike Jordan', category: 'Shoe', sold: 142, revenue: 15620, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=80&h=80&q=80' },
  { name: 'Sony WH-1000XM5', category: 'Electronics', sold: 128, revenue: 48640, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=80&h=80&q=80' },
];

/* ─────── Monthly Revenue Data (last 7 months) ─────── */
const MONTHLY_REVENUE = [
  { month: 'Apr', value: 42000 },
  { month: 'May', value: 55000 },
  { month: 'Jun', value: 48000 },
  { month: 'Jul', value: 62000 },
  { month: 'Aug', value: 58000 },
  { month: 'Sep', value: 71000 },
  { month: 'Oct', value: 84000 },
];

/* ─────── Stock by Category Data ─────── */
const STOCK_BY_CATEGORY = [
  { name: 'Electronics', count: 1090, color: '#315EFB' },
  { name: 'Bags', count: 1250, color: '#10B981' },
  { name: 'Furnitures', count: 1060, color: '#8B5CF6' },
  { name: 'Phone', count: 630, color: '#F59E0B' },
  { name: 'Shoe', count: 300, color: '#EF4444' },
  { name: 'Computers', count: 190, color: '#06B6D4' },
];

/* ─────── Warehouse Locations ─────── */
const WAREHOUSE_SUMMARY = [
  { location: 'Warehouse A', items: 2340, capacity: 85, status: 'Optimal' as const },
  { location: 'Warehouse B', items: 1680, capacity: 62, status: 'Moderate' as const },
  { location: 'Warehouse C', items: 500, capacity: 28, status: 'Low' as const },
];

/* ====================================================================== */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  /* Load products from localStorage (same source as products page) */
  const products: ProductItem[] = useMemo(() => {
    const saved = localStorage.getItem('products_list');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  }, []);

  /* ─── Computed Stats ─── */
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalQty = products.reduce((s, p) => s + p.qty, 0);
    const totalValue = products.reduce((s, p) => s + p.price * p.qty, 0);
    const categories = new Set(products.map((p) => p.category)).size;
    const brands = new Set(products.map((p) => p.brand)).size;
    const lowStockCount = products.filter((p) => p.qty < 150).length;
    const avgPrice = totalProducts > 0 ? totalValue / totalQty : 0;
    return { totalProducts, totalQty, totalValue, categories, brands, lowStockCount, avgPrice };
  }, [products]);

  const statCards: StatCard[] = [
    {
      title: 'Total Products',
      value: stats.totalProducts.toLocaleString(),
      change: '+3.2%',
      changeType: 'up',
      icon: Package,
      iconBg: 'bg-[#F5F7FF]',
      iconColor: 'text-[#315EFB]',
    },
    {
      title: 'Total Stock Value',
      value: `$${(stats.totalValue / 1000).toFixed(0)}K`,
      change: '+12.5%',
      changeType: 'up',
      icon: DollarSign,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockCount.toString(),
      change: '-2 items',
      changeType: 'down',
      icon: AlertTriangle,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Total Categories',
      value: stats.categories.toString(),
      change: '+1 new',
      changeType: 'up',
      icon: LayoutList,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
  ];

  /* Revenue chart max for scaling */
  const maxRevenue = Math.max(...MONTHLY_REVENUE.map((r) => r.value));
  const totalCategoryStock = STOCK_BY_CATEGORY.reduce((s, c) => s + c.count, 0);

  return (
    <div className="min-h-full flex flex-col font-sans bg-[#F4F5F7] text-slate-800 relative">
      {/* NAVBAR */}
      <Navbar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {/* PAGE BODY */}
      <div className="p-6 flex-1 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
            <p className="text-xs text-slate-500 mt-0.5">Welcome back! Here&apos;s your inventory overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-md px-3 py-1.5 text-xs text-slate-600">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Last updated: <span className="font-semibold text-slate-800">Just now</span></span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>View Products</span>
            </button>
          </div>
        </div>

        {/* ─── STAT CARDS ROW ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs hover:shadow-sm transition-shadow group"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
                    <p className="text-2xl font-bold text-slate-800 tracking-tight">{card.value}</p>
                    <div className="flex items-center gap-1">
                      {card.changeType === 'up' ? (
                        <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-semibold ${
                          card.changeType === 'up' ? 'text-emerald-600' : 'text-red-500'
                        }`}
                      >
                        {card.change}
                      </span>
                      <span className="text-xs text-slate-400 ml-0.5">vs last month</span>
                    </div>
                  </div>
                  <div
                    className={`w-11 h-11 rounded-lg ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-5 h-5 ${card.iconColor}`} strokeWidth={1.75} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ─── CHARTS ROW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Revenue Chart (spans 2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Revenue Overview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Monthly inventory revenue trend</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +18.3%
                </span>
              </div>
            </div>

            {/* Bar Chart (pure CSS) */}
            <div className="flex items-end gap-3 h-48 px-2">
              {MONTHLY_REVENUE.map((item, idx) => {
                const heightPct = (item.value / maxRevenue) * 100;
                const isLast = idx === MONTHLY_REVENUE.length - 1;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600">
                      ${(item.value / 1000).toFixed(0)}K
                    </span>
                    <div className="w-full relative group">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isLast
                            ? 'bg-[#315EFB] shadow-[0_2px_8px_rgba(49,94,251,0.25)]'
                            : 'bg-[#315EFB]/15 group-hover:bg-[#315EFB]/30'
                        }`}
                        style={{ height: `${heightPct * 1.6}px` }}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stock by Category (Donut-style) */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Stock by Category</h2>
                <p className="text-xs text-slate-500 mt-0.5">Distribution overview</p>
              </div>
              <BarChart3 className="w-4 h-4 text-slate-400" />
            </div>

            {/* Horizontal Stacked Progress Bars */}
            <div className="space-y-3.5">
              {STOCK_BY_CATEGORY.map((cat) => {
                const pct = ((cat.count / totalCategoryStock) * 100).toFixed(1);
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-slate-700">{cat.name}</span>
                      </div>
                      <span className="font-semibold text-slate-600">
                        {cat.count.toLocaleString()} <span className="text-slate-400 font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <p className="text-xs text-slate-500">
                Total: <span className="font-bold text-slate-800">{totalCategoryStock.toLocaleString()}</span> units
              </p>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM ROW: Top Products + Activity + Warehouse ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Top Selling Products */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Top Selling Products</h2>
                <p className="text-xs text-slate-500 mt-0.5">Best performers this month</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="text-xs font-semibold text-[#315EFB] hover:text-[#2448D8] flex items-center gap-0.5 transition-colors"
              >
                View All
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {TOP_SELLING.map((product, idx) => (
                <div
                  key={product.name}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F5F7FF] transition-colors cursor-pointer group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />
                    <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-full bg-[#315EFB] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#315EFB] transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[10px] text-slate-500">{product.category}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-slate-800">{product.sold} sold</p>
                    <p className="text-[10px] text-emerald-600 font-medium">
                      ${(product.revenue / 1000).toFixed(1)}K
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Recent Activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Latest inventory movements</p>
              </div>
              <Activity className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-1">
              {RECENT_ACTIVITY.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50/80 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${activity.color}`} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-700 leading-snug">{activity.text}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Warehouse Overview */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200/80 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">Warehouse Overview</h2>
                <p className="text-xs text-slate-500 mt-0.5">Storage capacity status</p>
              </div>
              <Warehouse className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {WAREHOUSE_SUMMARY.map((wh) => {
                const statusColor =
                  wh.status === 'Optimal'
                    ? { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' }
                    : wh.status === 'Moderate'
                      ? { text: 'text-[#315EFB]', bg: 'bg-[#F5F7FF]', bar: 'bg-[#315EFB]' }
                      : { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' };

                return (
                  <div key={wh.location} className="p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">{wh.location}</span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColor.text} ${statusColor.bg}`}
                      >
                        {wh.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1.5">
                      <span>{wh.items.toLocaleString()} items</span>
                      <span className="font-semibold">{wh.capacity}% full</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${statusColor.bar}`}
                        style={{ width: `${wh.capacity}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Row */}
            <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-800">4,520</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Total Items</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#315EFB]">58%</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide">Avg Capacity</p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── LOW STOCK ALERT TABLE ─── */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Low Stock Alerts</h2>
              <p className="text-xs text-slate-500 mt-0.5">Products that need immediate restocking</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/low-stocks')}
              className="text-xs font-semibold text-[#315EFB] hover:text-[#2448D8] flex items-center gap-0.5 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#FAFBFD] text-slate-600 font-semibold border-b border-gray-200/80">
                <tr>
                  <th className="py-3 px-5 font-semibold text-slate-700">Product</th>
                  <th className="py-3 px-5 font-semibold text-slate-700">SKU</th>
                  <th className="py-3 px-5 font-semibold text-slate-700">Category</th>
                  <th className="py-3 px-5 font-semibold text-slate-700">Current Stock</th>
                  <th className="py-3 px-5 font-semibold text-slate-700">Status</th>
                  <th className="py-3 px-5 font-semibold text-slate-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products
                  .filter((p) => p.qty < 150)
                  .sort((a, b) => a.qty - b.qty)
                  .slice(0, 5)
                  .map((p) => {
                    const isCritical = p.qty < 100;
                    return (
                      <tr key={p.id} className="hover:bg-[#F9FAFC] transition-colors">
                        <td className="py-3 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-8 h-8 rounded object-cover border border-gray-200 flex-shrink-0 bg-gray-50"
                            />
                            <span className="font-semibold text-slate-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-5 font-medium text-slate-600">{p.sku}</td>
                        <td className="py-3 px-5 text-slate-600">{p.category}</td>
                        <td className="py-3 px-5">
                          <span
                            className={`font-bold ${isCritical ? 'text-red-500' : 'text-amber-600'}`}
                          >
                            {p.qty}
                          </span>
                          <span className="text-slate-400 ml-1">units</span>
                        </td>
                        <td className="py-3 px-5">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                              isCritical
                                ? 'bg-red-50 text-red-600'
                                : 'bg-amber-50 text-amber-600'
                            }`}
                          >
                            <CircleDot className="w-2.5 h-2.5" />
                            {isCritical ? 'Critical' : 'Low Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-5 text-center">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-md text-[10px] font-semibold shadow-xs transition-colors"
                          >
                            <RotateCw className="w-3 h-3" />
                            Restock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ─── QUICK METRICS ROW ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs text-center">
            <Boxes className="w-5 h-5 text-[#315EFB] mx-auto mb-2" strokeWidth={1.75} />
            <p className="text-lg font-bold text-slate-800">{stats.totalQty.toLocaleString()}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Total Units in Stock</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs text-center">
            <Tag className="w-5 h-5 text-violet-500 mx-auto mb-2" strokeWidth={1.75} />
            <p className="text-lg font-bold text-slate-800">{stats.brands}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Active Brands</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs text-center">
            <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-2" strokeWidth={1.75} />
            <p className="text-lg font-bold text-slate-800">${stats.avgPrice.toFixed(0)}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Avg. Unit Value</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200/80 p-4 shadow-xs text-center">
            <TrendingUp className="w-5 h-5 text-[#315EFB] mx-auto mb-2" strokeWidth={1.75} />
            <p className="text-lg font-bold text-emerald-600">94.2%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">Stock Fulfillment Rate</p>
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
          onClick={() => alert('Quick Settings Panel: Color themes, RTL layout, and sidebar presets.')}
          className="w-9 h-9 bg-[#315EFB] hover:bg-[#2448D8] text-white rounded-l-md flex items-center justify-center shadow-lg transition-transform hover:-translate-x-0.5"
        >
          <Settings className="w-4 h-4 animate-spin-slow" />
        </button>
      </div>
    </div>
  );
}
