# 🌾 Bagdi Atta - Organic Staples Store & B2B Partner Portal

A high-performance, modern, responsive e-commerce application built using **Next.js 16 (Turbopack)**, **TypeScript**, and **MongoDB/Mongoose**. The store supports direct-to-consumer (D2C) retail shopping and B2B wholesale distribution of organic staples (stone-ground flours, cold-pressed oils, and unpolished pulses) with dynamic variant packaging graphics, an AI-guided support chatbot, automated weight validators for B2B Minimum Order Quantities (MOQ), and a comprehensive administration dashboard.

---

## 🚀 Key Features

### 1. Dynamic Staples Catalog & Product Showcase
* **Structured Categories**: Interactive catalog page supporting three primary organic categories: Flours (`flours`), Oils (`oils`), and Pulses (`pulses`).
* **Packaging Visuals**: CSS-drawn realistic package graphics (Kraft Paper Flour Bag, Liquid Amber Oil Bottle with reflection, Moong Dal seed pouch) that dynamically scale in size depending on the selected variant size (e.g. `25kg` vs `5kg`, `5L` vs `1L`).
* **Sidebar Filtering**: Real-time searching and filtering by categories and subcategories with synchronized URL parameters (enabling sharing pre-filtered links).
* **Role-Based Pricing**: Dynamically toggles product pricing between B2C retail rates and wholesale B2B distributor rates depending on the authenticated user's role.

### 2. B2B Distributor Portal & MOQ Constraint Checker
* **Distributor Applications**: Seamless application portal for business owners to submit business details, GSTIN, and monthly volume expectations.
* **100 kg MOQ Validator**: Implements a strict weight parser in the shopping cart and checkout API. It parses variants (converting `L`, `kg`, `g`, `ml` to kg equivalents) and enforces a **Minimum Order Quantity of 100 kg** for B2B orders before checkout can proceed.

### 3. Floating Support Chatbot Widget
* **Dynmic Auto-Replies**: Mounted globally in the layout. Allows customers to query B2B MOQ terms, shipping rules, return policies, product lists, or request a direct WhatsApp human support link.
* **Database-Driven Content**: Responses are fetched dynamically from MongoDB. Administrators can customize the welcome greeting, replies, and contact links on the fly.
* **Keyword Matching**: Employs an intelligent scanner that parses custom messages (matching keywords like *moq*, *distributor*, *shipping*, *returns*, *oil*, *atta*) to deliver target responses.

### 4. Admin Management Dashboard (`/admin/dashboard`)
An administrative console containing five tabs:
* **Orders**: Review orders, customer contact info, order types (D2C vs. Distributor), total billing, and track status.
* **Inventory (Products)**: Create and edit catalog listings, manage multi-size variant stocks/prices, and modify nutritional facts and specification lists.
* **Categories**: Define and configure categories and subcategories.
* **Chatbot Settings**: Edit auto-reply configurations, welcome text, and WhatsApp URLs.
* **Distributor Applications**: Manage pending business sign-ups with options to Approve or Reject.

---

## 🛠️ Technology Stack

* **Frontend Framework**: Next.js 16.2.9 (Turbopack compiler)
* **Language**: TypeScript 5.x
* **Database**: MongoDB Atlas via Mongoose 9.x
* **Styling**: TailwindCSS 4.x
* **Icons**: Lucide Icons & Custom SVG graphics
* **Security & Auth**: JWT (JSON Web Tokens) & BcryptJS password hashing

---

## 📂 Project Structure

```text
├── app/                        # Next.js App Router Pages & API Endpoints
│   ├── admin/                  # Admin dashboard & login screens
│   ├── api/                    # Serverless API routes (auth, checkout, chatbot, admin)
│   ├── checkout/               # Shopping cart checkout page
│   ├── contact/                # Interactive Customer Support form
│   ├── distributor/            # Distributor login, application, & portal dashboard
│   ├── policies/               # Legal pages (privacy, terms, shipping, returns)
│   ├── product/                # Dynamic product details page [slug]
│   ├── products/               # Catalog sidebar filter and search index
│   ├── globals.css             # Tailwind styling and custom packaging graphic rules
│   └── layout.tsx              # Root wrapper mounting Navbar, Footer, and Chatbot
├── components/                 # Reusable UI Components (Navbar, Footer, CartDrawer, etc.)
├── context/                    # React Context states (CartContext, etc.)
├── lib/                        # Shared helper functions (Auth verify, DB Connect)
├── models/                     # Mongoose Schema definitions
├── scripts/                    # CLI Helper scripts (database seed scripts)
└── public/                     # Static media files and svgs
```

---

## ⚡ Quick Setup & Installation Guide

### 1. Prerequisites
Make sure you have node.js (v18+) and git installed.

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/YakshitJhajhria/bagdi_atta.git
cd bagdi_atta
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and define the following variables:
```env
# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Admin Credentials Setup
ADMIN_EMAIL=admin@bagdiatta.com
ADMIN_PASSWORD_HASH=$2b$10$QBvKQFJzuFsE0H4ZZTub5OxWGKO0LIlkW0qJgqP85JIeJagfm2JMu # BCrypt hash for "admin123"
JWT_SECRET=your_super_secret_jwt_token_signing_key

# Public WhatsApp Support Helpline
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
```

### 4. Seed the Database
Run the seeder script to populate default categories (Flours, Oils, Pulses), products (Sharbati Flour, Cold Pressed Mustard Oil, split pulses), and default Chatbot configurations:
```bash
node scripts/seed.js
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
```

---

## 🌐 Deployment on Vercel

1. Push your code to your GitHub repository.
2. Log in to Vercel, click **Add New Project**, and import `bagdi_atta`.
3. Add the Environment Variables (`MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`) in the Vercel project settings dashboard.
4. Click **Deploy**. Next.js will build the project statically and configure the API endpoints automatically!
