import type { Product, ActivityLog } from '../types/inventory';


export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-101',
    name: 'Quantum NVMe SSD 2TB',
    sku: 'ELC-QNT-2048',
    category: 'Electronics',
    quantity: 142,
    minStock: 25,
    unitPrice: 189.99,
    supplier: 'Apex Silicon Tech',
    warehouseLocation: 'Bay 4A-12',
    lastUpdated: '2026-10-28 14:20'
  },
  {
    id: 'prod-102',
    name: 'Industrial Li-Ion Pack 48V',
    sku: 'ELC-PWR-4800',
    category: 'Electronics',
    quantity: 14,
    minStock: 20,
    unitPrice: 420.00,
    supplier: 'VoltEdge Energy',
    warehouseLocation: 'Bay 2B-04',
    lastUpdated: '2026-10-28 11:45'
  },
  {
    id: 'prod-103',
    name: 'Wireless Telemetry Gateway v4',
    sku: 'IOT-WTL-900',
    category: 'Sensors & IoT',
    quantity: 68,
    minStock: 15,
    unitPrice: 245.50,
    supplier: 'Aether Wave Inc.',
    warehouseLocation: 'Bay 3C-09',
    lastUpdated: '2026-10-27 16:30'
  },
  {
    id: 'prod-104',
    name: 'Precision Barometric Sensor M8',
    sku: 'IOT-BRM-008',
    category: 'Sensors & IoT',
    quantity: 6,
    minStock: 30,
    unitPrice: 49.90,
    supplier: 'MicroSens Systems',
    warehouseLocation: 'Bay 3C-14',
    lastUpdated: '2026-10-28 09:15'
  },
  {
    id: 'prod-105',
    name: 'Armored Cat6A Shielded Reel (500m)',
    sku: 'CAB-CAT6-500',
    category: 'Cables & Networking',
    quantity: 34,
    minStock: 10,
    unitPrice: 310.00,
    supplier: 'Nexis Optical & Wire',
    warehouseLocation: 'Bay 1A-01',
    lastUpdated: '2026-10-26 18:00'
  },
  {
    id: 'prod-106',
    name: 'Titanium Torque Driver Kit',
    sku: 'HDW-TRQ-400',
    category: 'Hardware & Tools',
    quantity: 85,
    minStock: 12,
    unitPrice: 129.00,
    supplier: 'Krupp Precision Tools',
    warehouseLocation: 'Tool Room B',
    lastUpdated: '2026-10-28 13:00'
  },
  {
    id: 'prod-107',
    name: 'Anti-Static ESD Safe Foam Inserts',
    sku: 'PKG-ESD-500',
    category: 'Packaging',
    quantity: 420,
    minStock: 100,
    unitPrice: 4.80,
    supplier: 'PolyGuard Pack Corp',
    warehouseLocation: 'Bay 5D-22',
    lastUpdated: '2026-10-25 10:10'
  },
  {
    id: 'prod-108',
    name: 'SFP28 25GbE Optical Transceiver',
    sku: 'CAB-SFP-25G',
    category: 'Cables & Networking',
    quantity: 0,
    minStock: 15,
    unitPrice: 145.00,
    supplier: 'Nexis Optical & Wire',
    warehouseLocation: 'Bay 1A-08',
    lastUpdated: '2026-10-28 08:00'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    timestamp: '10 mins ago',
    type: 'adjust',
    productName: 'Quantum NVMe SSD 2TB',
    sku: 'ELC-QNT-2048',
    details: 'Cycle count verified: +5 units added'
  },
  {
    id: 'log-2',
    timestamp: '1 hour ago',
    type: 'sale',
    productName: 'SFP28 25GbE Optical Transceiver',
    sku: 'CAB-SFP-25G',
    details: 'Dispatched 15 units to Client Sector 9 (Stock reached 0)'
  },
  {
    id: 'log-3',
    timestamp: '3 hours ago',
    type: 'restock',
    productName: 'Armored Cat6A Shielded Reel (500m)',
    sku: 'CAB-CAT6-500',
    details: 'Received PO #88392 from Nexis Optical (+10 reels)'
  }
];
