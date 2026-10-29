export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type ProductCategory = 
  | 'All'
  | 'Electronics'
  | 'Sensors & IoT'
  | 'Hardware & Tools'
  | 'Cables & Networking'
  | 'Packaging';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Exclude<ProductCategory, 'All'>;
  quantity: number;
  minStock: number;
  unitPrice: number;
  supplier: string;
  warehouseLocation: string;
  lastUpdated: string;
}

export interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockCount: number;
  outOfStockCount: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'restock' | 'sale' | 'add' | 'delete' | 'adjust';
  productName: string;
  sku: string;
  details: string;
}
