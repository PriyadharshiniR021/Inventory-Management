# NexusStock — Inventory Management System

A high-performance **React 19 + TypeScript (TSX)** web application styled with modern **Tailwind CSS v4** and bundled with **Vite 8**.

---

## ⚡ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *JetBrains Mono*)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📁 Project Architecture

```
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ActivityLogView.tsx   # Audit & stock logs
│   │   ├── Navbar.tsx            # Navigation & header actions
│   │   ├── ProductModal.tsx      # Add/edit product modal
│   │   ├── ProductTable.tsx      # Interactive search, filter & data table
│   │   └── StatsOverview.tsx     # KPI metrics & valuation cards
│   ├── data/
│   │   └── mockProducts.ts       # Initial inventory data & activity logs
│   ├── types/
│   │   └── inventory.ts          # TypeScript interfaces & types
│   ├── App.tsx             # Main dashboard controller
│   ├── index.css           # Tailwind v4 import & custom styles
│   └── main.tsx            # React application entrypoint
├── index.html              # HTML shell & font definitions
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite & Tailwind CSS v4 plugin configuration
```

---

## 🎨 Tailwind CSS v4 Configuration

Tailwind CSS v4 uses a zero-config, CSS-first setup:
- **Vite Integration**: Registered via `@tailwindcss/vite` in [vite.config.ts](file:///d:/LancersLoom/Inventory-Management/vite.config.ts).
- **Styles**: Injected via `@import "tailwindcss";` in [src/index.css](file:///d:/LancersLoom/Inventory-Management/src/index.css).
