# LancersLoom — Inventory Management System

A state-of-the-art **React 19 + TypeScript** enterprise inventory management platform built with **Vite 8** and styled with **Tailwind CSS v4**, adhering to the LancersLoom Management Software Design System.

---

## ⚡ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Bundler & Tooling**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Linter**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- **Deployment**: [Vercel](https://vercel.com/) with SPA rewrite configuration

---

## 🎨 Design System & Visual Identity

The interface features an editorial, high-precision aesthetic powered by Electric Cobalt Blue:

- **Primary Accent**: `#315EFB` (Electric Cobalt Blue)
- **Primary Hover**: `#2448D8`
- **Light Accent Background**: `#F5F7FF` (Row selection, dropdown options, and hover highlights)
- **Primary Text**: `#000000` / `#0F172A`
- **Secondary Text**: `#526078`
- **Main Canvas**: `#FFFFFF` with `#F8F9FA` background
- **Hairline Borders**: `#E8EAF0`
- **Absolute Color Rule**: Zero orange anywhere across the application.
- **Documentation**: See [design.md](file:///home/ashwin/Downloads/Antigravity%20IDE/LL/IM/Inventory-Management/design.md) for complete design tokens and the Antigravity migration guide.

---

## 🧩 Shell & Layout Architecture

- **Independent Two-Column Shell**: The sidebar is fixed (`h-screen sticky top-0`) and scrolls internally if navigation links overflow the viewport height. It **never scrolls when the page content scrolls**.
- **Unified Reusable Navbar**: A single shared `<Navbar />` component across all pages provides global search (⌘K shortcut), fullscreen toggle, message badge counter, notification center, quick settings, and user profile management.
- **Page Layout**: Clean modular structure featuring standard headers, export actions (PDF, CSV, Print), search/filter toolbars, responsive tables with selection states, and floating settings cog.

---

## 📦 Modules & Screens

| Route | Module | Features |
|-------|--------|----------|
| `/products` | **Product List** | Paginated catalog, advanced search, stock badges, bulk actions, barcode generation |
| `/create-product` | **Create Product** | Multi-section product creator with SKU auto-generator, tax calculator, dropzone image upload |
| `/expired-products`| **Expired Products** | Batch tracking, expiry warning indicators, purge actions |
| `/low-stocks` | **Low Stocks** | Real-time threshold monitoring, out-of-stock tabs, email supplier triggers |
| `/category` | **Categories** | Category hierarchy management, image uploads, active product counters |
| `/sub-category` | **Sub Categories** | Nested taxonomy management linked to parent categories |
| `/brands` | **Brands** | Brand registry with logo uploads and status toggles |
| `/units` | **Units** | Measurement units (Kg, Pc, Ltr, etc.) and short-code designations |
| `/variant-attributes` | **Variant Attributes** | Attribute options (Sizes, Colors, Materials) for multi-SKU variants |
| `/warranties` | **Warranties** | Warranty periods, claim terms, and coverage definitions |
| `/print-barcode` | **Print Barcode** | Warehouse/store selector, quantity stepper, paper size selector, vector barcode generation |
| `/print-qr-code` | **Print QR Code** | High-density 2D QR code generator with batch label print preview modal |

---

## 📁 Project Architecture

```
├── public/                     # Static assets (logo, icons, images)
├── src/
│   ├── components/             # Reusable core components
│   │   ├── navbar/             # Unified top navigation bar
│   │   │   └── navbar.tsx
│   │   ├── sidebar/            # Fixed independent-scroll sidebar
│   │   │   └── sidebar.tsx
│   │   ├── Navbar.tsx          # Clean component re-exports
│   │   └── Sidebar.tsx
│   ├── pages/                  # Page views (12 modules)
│   │   ├── brands/
│   │   ├── category/
│   │   ├── create-product/
│   │   ├── expired-products/
│   │   ├── low-stocks/
│   │   ├── print-barcode/
│   │   ├── print-qr-code/
│   │   ├── product/
│   │   ├── sub-category/
│   │   ├── units/
│   │   ├── variant-attributes/
│   │   └── warranties/
│   ├── data/                   # Mock stores, initial data & types
│   ├── App.tsx                 # Root router and shell layout
│   ├── index.css               # Tailwind CSS v4 imports, tokens & custom scrollbars
│   └── main.tsx                # React application entrypoint
├── design.md                   # Single Source of Truth Design System & Migration Guide
├── vercel.json                 # Vercel SPA routing rewrite rules
├── package.json                # Dependencies and project scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite 8 & Tailwind CSS v4 plugin configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```
Runs TypeScript verification (`tsc -b`) and generates production bundles with Vite.

### 5. Code Quality & Linting
```bash
npm run lint
```
Runs high-speed linting with [Oxlint](https://oxc.rs/).

### 6. Preview Production Build
```bash
npm run preview
```

---

## 🌐 Deployment (Vercel)

The repository includes a [vercel.json](file:///home/ashwin/Downloads/Antigravity%20IDE/LL/IM/Inventory-Management/vercel.json) file that configures single-page application (SPA) rewrites to prevent 404 errors when refreshing direct routes:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Simply push to GitHub and import the repository into your [Vercel Dashboard](https://vercel.com/dashboard).

---

## 📄 License & Credits

Designed & Developed by **LancersLoom**.  
© 2014 - 2026 LancersLoom. All Rights Reserved.
