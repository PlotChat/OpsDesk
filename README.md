# OpsDesk ( WIP )⚡

> A modern, responsive office dashboard built with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS v4**, and **Supabase**.

[![React](https://img.shields.io/badge/React-19-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154.svg?logo=react-query)](https://tanstack.com/query)

## 📖 Overview

**OpsDesk** is an administrative dashboard designed for handling core commerce operations: catalog inventory, category classifications, and order fulfillment tracking.

## ✨ Features

### 🏷️ Inventory Management
- **Catalog Browsing**: Server-paginated product grid with configurable page sizes.
- **Search & Filtering**: Multi-field search across product names and SKUs, plus multi-select category filters.
- **Dynamic Sorting**: Sort by Alphabetical (name), Price, or Date (created at) in ascending/descending order.
- **Product Lifecycle**: Create new products, view/edit product details, and delete entries with immediate query invalidation and toast feedback.

### 📋 Order Management
- **Order Tracking**: Paginated orders overview showing customer details, totals, and timestamps.
- **Status Workflows**: Colored badge states for `Pending`, `Processing`, `Shipped`, `Delivered`, and `Cancelled`.
- **Order Handling Modal**: Inspect order details and update fulfillment statuses on the fly.

### WIP:
- Authentication and what not.

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + `class-variance-authority`
- **Component Primitives**: [@base-ui/react](https://base-ui.com/) & Lucide / React Icons
- **Server State & Caching**: [TanStack Query v5](https://tanstack.com/query)
- **Routing**: [React Router v8](https://reactrouter.com/)
- **Backend / Database**: [Supabase](https://supabase.com/) (PostgreSQL + PostgREST)

## 📂 Project Structure (So far)

```text
OpsDesk/
├── public/
├── src/
│   ├── components/
│   │   └── ui/                     # Reusable design system components
│   │       ├── feature-tables/     # Composable data-table & pagination components
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input-group.tsx
│   │       └── toast.tsx
│   ├── features/
│   │   ├── inventory/              # Inventory feature module
│   │   │   ├── api/                # Supabase queries (getProducts, createProduct, etc.)
│   │   │   ├── hooks/              # TanStack Query hooks
│   │   │   ├── types/              # Domain models (Product, Category, Filter types)
│   │   │   └── ui/                 # Table, dialogs, and action bars
│   │   └── orders/                 # Order handling feature module
│   │       ├── api/                # Order REST / Supabase endpoints
│   │       ├── hooks/              # TanStack Query hooks
│   │       ├── types/              # Order & OrderStatus models
│   │       └── ui/                 # Orders table & status dialog
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client initialization
│   │   └── utils.ts                # Tailwind class utility (`cn`)
│   ├── pages/
│   │   └── DashboardPage.tsx       # Main operations dashboard page
│   ├── App.tsx                     # App routing & protected route definitions
│   └── main.tsx                    # React DOM entry point
├── .env.example
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- A [Supabase](https://supabase.com/) project

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/opsdesk.git
cd opsdesk
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup (Supabase SQL)

OpsDesk expects the following core tables in your Supabase database:

```sql
-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  stock_level INT NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  total_amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

> **Note:** Ensure your Supabase tables have **Row Level Security (RLS)** policies enabled that permit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` operations for your required auth roles (or `anon` during development).

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server with HMR. |
| `npm run build` | Runs TypeScript compilation (`tsc -b`) and Vite production bundle. |
| `npm run preview` | Locally serves the production build. |
| `npm run lint` | Runs ESLint across the codebase. |
