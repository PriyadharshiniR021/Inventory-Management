import Navbar from '../../components/Navbar';

export default function ExpiredProductsPage() {
  return (
    <div className="min-h-full flex flex-col font-sans bg-[#F4F5F7] text-slate-800 relative">
      <Navbar />
      <div className="p-6 flex-1 space-y-4">
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Expired Products</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage expired inventory</p>
      </div>
    </div>
  );
}
