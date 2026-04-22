# 💊 MediStore — Online Medicine E-Commerce Platform

MediStore is a full-stack online medicine e-commerce platform that enables customers to browse, search, and purchase medicines, while providing sellers with inventory management tools and administrators with a comprehensive dashboard for platform oversight.

---

## 🌐 Live Links

| Service  | URL                                                  |
| -------- | ---------------------------------------------------- |
| Frontend | https://medistore-frontend-eight.vercel.app          |
| Backend  | https://medi-store-backend-u9ux.onrender.com         |

---

## 🛠️ Tech Stack

### Frontend

| Technology               | Purpose                            |
| ------------------------ | ---------------------------------- |
| **Next.js 16**           | React framework (App Router)       |
| **React 19**             | UI library                         |
| **TypeScript**           | Type safety                        |
| **Tailwind CSS 4**       | Utility-first styling              |
| **Radix UI**             | Accessible headless UI primitives  |
| **React Hook Form + Zod**| Form handling & validation         |
| **TanStack React Query** | Server state & data fetching       |
| **Sonner**               | Toast notifications                |
| **Lucide React**         | Icon library                       |
| **date-fns**             | Date formatting                    |

### Backend

| Technology              | Purpose                             |
| ----------------------- | ----------------------------------- |
| **Express.js 5**        | HTTP server framework               |
| **TypeScript**          | Type safety                         |
| **Prisma ORM 7**        | Database ORM                        |
| **PostgreSQL**          | Relational database                 |
| **Better Auth**         | Authentication library              |
| **JSON Web Tokens**     | Access & refresh token auth         |
| **Cloudinary**          | Image upload & CDN                  |
| **Multer**              | Multipart form handling             |
| **Nodemailer + EJS**    | Email delivery with templates       |
| **bcrypt**              | Password hashing                    |

---

## ✨ Features

### 🏠 Public Pages

- **Home Page** — Hero section, value propositions, featured products by category, and newsletter signup
- **Shop Page** — Browse all medicines with search, category/manufacturer filters, sorting, and pagination
- **Medicine Detail** — Individual product page with full description, pricing, and add-to-cart
- **Categories Page** — Visual grid of all active medicine categories

### 🔐 Authentication & Authorization

- **Email/Password Registration** with email OTP verification (6-digit code, 2-minute expiry)
- **Login** with role-based redirects (Admin → `/admin`, Seller → `/seller/dashboard`, Customer → `/`)
- **JWT Access Token + Refresh Token** cycle with automatic silent refresh on 401 responses
- **Cookie-based auth** (httpOnly, secure, sameSite) synced across SSR and client
- **Middleware route protection** — Protected routes redirect unauthenticated users to login
- **Role Guard** — Server-side layout guards enforce ADMIN, SELLER, or CUSTOMER access per route group
- **Ban system** — Banned users are blocked at the middleware level

### 🛒 Customer Features

- **Shopping Cart** — Add/remove/update items, persistent server-synced cart with optimistic updates
- **Cart Drawer** — Slide-out mini cart for quick access from any page
- **Checkout** — Address management (add/edit/select saved addresses), order summary, COD payment
- **Order History** — Paginated list of past orders with status badges
- **Order Details** — Full invoice view with item breakdown, shipping address, and order timeline
- **Order Cancellation** — Cancel pending orders (auto-restores stock on backend)
- **Profile Management** — Update name, profile picture (Cloudinary upload), and view account info
- **Global Search** — Real-time medicine search with debounced autocomplete in the navbar

### 🏪 Seller Features

- **Become a Seller** — Onboarding form (shop name, description, license number, logo upload) that upgrades a customer account to seller role
- **Seller Dashboard** — Analytics overview with stats cards (total medicines, orders, revenue), recent orders summary
- **Medicine Management** — Full CRUD for medicines: add, edit, delete with image upload, category selection, stock/price management
- **Order Management** — View and manage orders containing their products, update order statuses (Processing → Shipped → Delivered)
- **Seller Navbar** — Dedicated navigation with seller-specific links

### 🛡️ Admin Features

- **Admin Dashboard** — Platform-wide statistics (total users, sellers, medicines, orders, revenue)
- **User Management** — View all users, filter by role, ban/unban users, change roles
- **Medicine Management** — View all platform medicines with seller info, details modal
- **Category Management** — Full CRUD for medicine categories with image upload, active/inactive toggle
- **Order Management** — View all platform orders, filter by status, view order details, update statuses
- **Admin Sidebar** — Dedicated sidebar navigation with section icons

---

## 📁 Project Structure

```
medistore/
├── medistore-frontend/          # Next.js 16 App
│   ├── src/
│   │   ├── app/
│   │   │   ├── (commonLayout)/  # Public pages (home, shop, login, signup, categories)
│   │   │   ├── (protectedLayout)/
│   │   │   │   ├── admin/       # Admin dashboard, users, medicines, categories, orders
│   │   │   │   ├── seller/      # Seller dashboard, manage medicines, orders
│   │   │   │   └── (customer)/  # Cart, checkout, orders, profile
│   │   │   └── actions/         # Server actions
│   │   ├── components/
│   │   │   ├── admin/           # Admin dashboard & management views
│   │   │   ├── auth/            # Login, signup, verify email forms
│   │   │   ├── cart/            # Cart page view
│   │   │   ├── checkout/        # Checkout flow
│   │   │   ├── home/            # Landing page sections
│   │   │   ├── orders/          # Order history & details
│   │   │   ├── profile/         # Profile update form
│   │   │   ├── seller/          # Seller dashboard & management views
│   │   │   ├── shared/          # Reusable components (product card, nav search, cart drawer)
│   │   │   ├── shop/            # Medicine grid, filters, add-to-cart
│   │   │   └── ui/              # Radix-based design system (button, input, dialog, etc.)
│   │   ├── hooks/               # Custom React Query hooks
│   │   ├── services/            # API service layer
│   │   ├── types/               # TypeScript type definitions
│   │   ├── zod/                 # Zod validation schemas
│   │   ├── lib/                 # API client with token refresh
│   │   └── providers/           # React Query provider
│   ├── .env                     # Environment variables
│   └── next.config.ts           # Next.js config with API proxy rewrites
│
└── medistore-backend/           # Express.js 5 API
    ├── src/
    │   ├── modules/
    │   │   ├── auth/            # Register, login, logout, refresh token, verify email
    │   │   ├── user/            # Get/update current user
    │   │   ├── admin/           # Admin CRUD (users, stats, ban/unban)
    │   │   ├── seller/          # Seller medicine CRUD & order management
    │   │   ├── sellerProfile/   # Seller onboarding & profile management
    │   │   ├── medicine/        # Public medicine queries (search, filter, paginate)
    │   │   ├── categories/      # Category CRUD
    │   │   ├── cartItem/        # Shopping cart operations
    │   │   ├── order/           # Order placement & history
    │   │   ├── address/         # Shipping address CRUD
    │   │   └── reviews/         # Product reviews
    │   ├── middlewares/         # Auth, role guard, upload, 404 handler
    │   ├── utils/               # Cloudinary, slugify, JWT helpers
    │   ├── lib/                 # Prisma client, Better Auth config, admin seed
    │   └── routes/              # Centralized route registry
    ├── prisma/
    │   └── schema.prisma        # Database schema (14 models)
    └── example.env              # Environment template
```

---

## 🗄️ Database Models

| Model             | Description                                      |
| ----------------- | ------------------------------------------------ |
| **User**          | Customer/Seller/Admin with role, ban, email verification |
| **Session**       | Auth sessions (Better Auth managed)              |
| **Account**       | OAuth & credential accounts                      |
| **Verification**  | Email verification OTPs                          |
| **SellerProfile** | Shop name, description, logo, license number     |
| **Category**      | Medicine categories with name, slug, image       |
| **Medicine**      | Products with price, stock, dosage form, manufacturer |
| **CartItem**      | User shopping cart items (unique per user+medicine) |
| **Address**       | Saved shipping addresses per user                |
| **Order**         | Customer orders with status tracking             |
| **OrderItem**     | Individual items within an order                 |
| **Review**        | Product ratings and comments                     |

---

## ⚙️ Configuration & Setup

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database (or a hosted instance like Supabase/Neon)
- **Cloudinary** account (for image uploads)
- **SMTP Email provider** (Gmail, SendGrid, etc.)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medistore
```

### 2. Backend Setup

```bash
cd medistore-backend
npm install
```

Create a `.env` file based on `example.env`:

```env
# Database
DATABASE_URL='postgresql://user:password@host:port/dbname'

# Server
PORT=5000
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:5000
APP_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (SMTP)
APP_USER=your_email@gmail.com
APP_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_FROM=no-reply@medistore.com

# Admin Seed
ADMIN_EMAIL=admin@medistore.com
ADMIN_NAME=Admin
ADMIN_PASS=secure_password
```

Push the database schema and seed the admin user:

```bash
npx prisma db push
npm run seed:admin
```

Start the development server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd medistore-frontend
npm install
```

Create a `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

### Frontend

| Command          | Description                        |
| ---------------- | ---------------------------------- |
| `npm run dev`    | Start Next.js dev server           |
| `npm run build`  | Build for production               |
| `npm run start`  | Start production server            |
| `npm run lint`   | Run ESLint                         |

### Backend

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start Express dev server (tsx watch) |
| `npm run build`     | Generate Prisma client & bundle with tsup |
| `npm run start`     | Run production build                 |
| `npm run db:push`   | Push Prisma schema to database       |
| `npm run seed:admin`| Seed the admin user                  |

---



## 🚀 Deployment

### Frontend (Vercel)

1. Push the `medistore-frontend` directory to a GitHub repository
2. Import the repository on [Vercel](https://vercel.com)
3. Set the environment variables (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_URL`)
4. Deploy — Vercel auto-detects Next.js

### Backend (Render)

1. Push the `medistore-backend` directory to a GitHub repository
2. Create a new **Web Service** on [Render](https://render.com)
3. Set the build command: `npm install && npm run build`
4. Set the start command: `npm run start`
5. Add all environment variables from `example.env`
6. Deploy

---

## 🧑‍💻 Admin Credentials

After running `npm run seed:admin`, use the credentials from your `.env` file:

```
Email: <ADMIN_EMAIL from .env>
Password: <ADMIN_PASS from .env>
```

---

## 🧩 Challenges Faced

Building MediStore was a deeply rewarding experience, but it came with its fair share of challenges:

- **Server Components vs. Client Components** — This was the biggest game-changer and the most challenging aspect of the entire project. Next.js App Router encourages keeping pages as **Server Components** by default for better performance and SEO. I made it a priority to keep all main pages as server components and extract any interactive or client-side logic (state, effects, event handlers) into **separate client components**. This architectural pattern made the application significantly faster — pages load with pre-rendered HTML from the server, and only the interactive parts hydrate on the client. Getting this separation right required careful planning of the component tree and a deep understanding of the React Server Component model.

- **Search with TanStack Query** — Implementing the real-time medicine search in the navbar was another challenge. I used **TanStack React Query** with a debounced input to fetch search results and display them in a dropdown. Coordinating the query caching, loading states, and dropdown visibility while keeping the search component as a client island within the server-rendered navbar required thoughtful composition.

- **Authentication Across SSR & Client** — Synchronizing JWT-based authentication between server-side rendering, middleware route protection, and client-side state was complex. Cookies needed to be forwarded manually during SSR fetches, and the automatic token refresh cycle had to work seamlessly on both sides without causing redirect loops.

- **Image Uploads with Cloudinary** — Handling `FormData` with `multer` on the backend and ensuring proper content-type headers were set (or deliberately *not* set) on the frontend required careful debugging, especially for medicine and profile image uploads.

---

## 🔮 Future Implementations

- **Medicine Expiry Date Tracking** — Add an expiry date field to medicines. The system will automatically monitor expiry dates and send notifications to the admin when a medicine is about to expire or has expired. The admin can then review and remove expired medicines from the platform to ensure customer safety.

- **Seller Verification by Admin** — Currently sellers can onboard and start listing immediately. In the future, new seller profiles will require **admin verification** before they can list medicines. Admins will be able to review seller credentials (license number, shop details) and approve or reject seller applications, adding an extra layer of trust and quality control to the platform.

- **Payment Gateway Integration** — Integrate online payment options (SSLCommerz, Stripe, etc.) alongside the existing Cash on Delivery method.

- **Product Reviews & Ratings** — Enable customers to leave reviews and ratings on medicines they have purchased, helping other buyers make informed decisions.

---

## 📬 Contact

If you have any questions, suggestions, or would like to connect:

**Abdullah Ragib Toqi**
- LinkedIn: [Abdullah Ragib Toqi](https://www.linkedin.com/in/abdullah-ragib-toqi-b5154a297)

---

