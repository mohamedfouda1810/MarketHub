# MARKETHUB — MASTER REFERENCE FILE
> **هذا الملف هو المرجع الرئيسي لكل Gemini CLI Agent يعمل على المشروع.**
> اقرأ القسم الخاص بك أولاً، ثم اقرأ SHARED CONTEXT قبل أي تغيير.

---

## QUICK START — HOW TO RUN THE PROJECT

### Prerequisites
- .NET 8 SDK
- Node.js 20+
- Docker Desktop
- SQL Server (local) — connection string في appsettings
- Git

### 1. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/markethub.git
cd markethub
```

### 2. Run with Docker (Recommended)
```bash
# Start all infrastructure (SQL Server, Redis, RabbitMQ, Elasticsearch)
docker-compose up -d

# Run backend
cd src/MarketHub.API
dotnet run

# Run frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 3. Run Locally (without Docker for app code)
```bash
# Start only infrastructure containers
docker-compose up -d sqlserver redis rabbitmq elasticsearch

# Backend
cd src/MarketHub.API
dotnet ef database update
dotnet run

# Frontend
cd frontend
npm install
npm run dev
```

### URLs
| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | https://localhost:7001 |
| Swagger UI | https://localhost:7001/swagger |
| Hangfire Dashboard | https://localhost:7001/hangfire |
| RabbitMQ Management | http://localhost:15672 (guest/guest) |
| Seq Logs | http://localhost:5341 |

---

## PROJECT OVERVIEW

**MarketHub** is a multi-vendor e-commerce platform where:
- Every **Vendor** owns a **Store** on the platform
- Each Store has its own **StoreCategories** (not global)
- Each StoreCategory contains **Products**
- **Customers** browse Stores → Categories → Products → Buy
- **Admin** manages vendors, approves stores, takes commission

### Tech Stack
| Layer | Technology |
|---|---|
| Backend Framework | ASP.NET Core 8 Web API |
| Architecture | Clean Architecture + CQRS + MediatR |
| ORM | Entity Framework Core 8 + Dapper |
| Auth | ASP.NET Identity + JWT (RS256) + Refresh Tokens |
| Frontend | Next.js 14 (App Router) + TypeScript + TailwindCSS |
| State Management | Redux Toolkit + RTK Query |
| Forms | React Hook Form + Zod |
| Caching | Redis (StackExchange.Redis) |
| Search | Elasticsearch 8 |
| Message Bus | RabbitMQ + MassTransit |
| Real-Time | SignalR |
| Background Jobs | Hangfire |
| File Storage | Azure Blob Storage (or local MinIO in dev) |
| Payments | Stripe |
| Email | MailKit + HTML templates |
| Logging | Serilog → File + Seq |
| Monitoring | Health Checks (SQL, Redis, RabbitMQ, ES) |
| Containers | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Testing | xUnit + Moq + FluentAssertions + Playwright |

---

## SOLUTION STRUCTURE

```
markethub/
├── MARKETHUB_MASTER_REF.md          ← هذا الملف
├── docker-compose.yml
├── docker-compose.override.yml      ← dev overrides
├── .github/
│   └── workflows/
│       ├── backend-ci.yml
│       └── frontend-ci.yml
├── src/
│   ├── MarketHub.sln
│   ├── MarketHub.Domain/            ← Layer 1: zero dependencies
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Vendor.cs            ← owns a Store
│   │   │   ├── StoreCategory.cs     ← vendor-owned categories
│   │   │   ├── Product.cs
│   │   │   ├── ProductImage.cs
│   │   │   ├── ProductVariant.cs
│   │   │   ├── Customer.cs
│   │   │   ├── Address.cs
│   │   │   ├── Cart.cs
│   │   │   ├── CartItem.cs
│   │   │   ├── Order.cs
│   │   │   ├── OrderItem.cs
│   │   │   ├── OrderStatusHistory.cs
│   │   │   ├── Payment.cs
│   │   │   ├── Review.cs
│   │   │   ├── Coupon.cs
│   │   │   ├── CouponUsage.cs
│   │   │   ├── Notification.cs
│   │   │   └── WithdrawalRequest.cs
│   │   ├── ValueObjects/
│   │   │   ├── Money.cs
│   │   │   ├── Dimensions.cs
│   │   │   └── ShippingAddress.cs
│   │   ├── Enums/
│   │   │   ├── UserRole.cs
│   │   │   ├── VendorStatus.cs
│   │   │   ├── OrderStatus.cs
│   │   │   ├── ProductStatus.cs
│   │   │   ├── PaymentStatus.cs
│   │   │   ├── PaymentMethod.cs
│   │   │   ├── ReviewStatus.cs
│   │   │   ├── NotificationType.cs
│   │   │   └── CouponType.cs
│   │   ├── Interfaces/
│   │   │   ├── IRepository.cs
│   │   │   ├── IVendorRepository.cs
│   │   │   ├── IProductRepository.cs
│   │   │   ├── IOrderRepository.cs
│   │   │   └── IUnitOfWork.cs
│   │   └── Common/
│   │       ├── BaseEntity.cs
│   │       ├── AuditableEntity.cs
│   │       └── DomainEvent.cs
│   ├── MarketHub.Application/       ← Layer 2: depends on Domain only
│   │   ├── Common/
│   │   │   ├── Behaviors/
│   │   │   │   ├── LoggingBehavior.cs
│   │   │   │   ├── ValidationBehavior.cs
│   │   │   │   └── PerformanceBehavior.cs
│   │   │   ├── Interfaces/
│   │   │   │   ├── ICurrentUserService.cs
│   │   │   │   ├── IEmailService.cs
│   │   │   │   ├── IFileStorageService.cs
│   │   │   │   ├── IPaymentGateway.cs
│   │   │   │   ├── INotificationService.cs
│   │   │   │   └── ICacheService.cs
│   │   │   └── Mappings/
│   │   ├── Features/
│   │   │   ├── Auth/
│   │   │   ├── Vendors/
│   │   │   ├── StoreCategories/
│   │   │   ├── Products/
│   │   │   ├── Cart/
│   │   │   ├── Orders/
│   │   │   ├── Payments/
│   │   │   ├── Reviews/
│   │   │   ├── Coupons/
│   │   │   ├── Notifications/
│   │   │   ├── Analytics/
│   │   │   └── Admin/
│   │   └── DependencyInjection.cs
│   ├── MarketHub.Infrastructure/    ← Layer 3: implements interfaces
│   │   ├── Persistence/
│   │   │   ├── AppDbContext.cs
│   │   │   ├── Configurations/      ← IEntityTypeConfiguration per entity
│   │   │   ├── Repositories/
│   │   │   ├── UnitOfWork.cs
│   │   │   └── Migrations/
│   │   ├── Identity/
│   │   │   ├── JwtTokenService.cs
│   │   │   ├── CurrentUserService.cs
│   │   │   └── IdentityService.cs
│   │   ├── Services/
│   │   │   ├── EmailService.cs
│   │   │   ├── FileStorageService.cs
│   │   │   ├── CacheService.cs
│   │   │   ├── NotificationService.cs
│   │   │   ├── PaymentService.cs
│   │   │   └── SearchService.cs
│   │   ├── BackgroundJobs/
│   │   │   └── Jobs/
│   │   ├── Messaging/
│   │   │   ├── Consumers/
│   │   │   └── Events/
│   │   └── DependencyInjection.cs
│   ├── MarketHub.API/               ← Layer 4: entry point
│   │   ├── Controllers/
│   │   │   ├── v1/
│   │   │   └── v1/Admin/
│   │   ├── Hubs/
│   │   │   └── NotificationHub.cs
│   │   ├── Middleware/
│   │   ├── Filters/
│   │   └── Program.cs
│   └── MarketHub.Shared/            ← cross-cutting utilities
│       ├── Result.cs
│       ├── PagedList.cs
│       ├── PaginationParams.cs
│       └── SlugHelper.cs
├── tests/
│   ├── MarketHub.Domain.Tests/
│   ├── MarketHub.Application.Tests/
│   └── MarketHub.Integration.Tests/
└── frontend/                        ← Next.js 14
    ├── app/
    │   ├── (auth)/
    │   ├── (customer)/
    │   ├── (vendor)/
    │   └── (admin)/
    ├── components/
    ├── lib/
    │   ├── api/         ← RTK Query endpoints
    │   ├── store/       ← Redux slices
    │   ├── hooks/
    │   └── types/
    └── middleware.ts
```

---

## DATABASE — SQL SERVER LOCAL SETUP

### Connection String (appsettings.Development.json)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=MarketHubDb;User Id=sa;Password=MarketHub@123!;TrustServerCertificate=True;MultipleActiveResultSets=True"
  }
}
```

### Run SQL Server in Docker
```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=MarketHub@123!" \
  -p 1433:1433 --name markethub-sqlserver \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

### Migrations
```bash
cd src/MarketHub.API

# Create first migration
dotnet ef migrations add InitialCreate --project ../MarketHub.Infrastructure --startup-project .

# Apply migrations
dotnet ef database update --project ../MarketHub.Infrastructure --startup-project .

# Reset database (dev only)
dotnet ef database drop --project ../MarketHub.Infrastructure --startup-project .
dotnet ef database update --project ../MarketHub.Infrastructure --startup-project .
```

### Database Tables (auto-created by EF Core)
| Table | Description |
|---|---|
| AspNetUsers | Identity users |
| AspNetRoles | Roles: SuperAdmin, Admin, Vendor, Customer |
| Vendors | Store info, commission, status, wallet balance |
| StoreCategories | Vendor-owned categories with parent/child |
| Products | Products with status, SEO slug, variants |
| ProductImages | Product images with display order |
| ProductVariants | Size/color variants with individual price/stock |
| Customers | Customer profiles linked to users |
| Addresses | Saved shipping addresses |
| Carts | Shopping carts |
| CartItems | Cart items (snapshot price) |
| Orders | Orders grouped per vendor |
| OrderItems | Order line items with snapshots |
| OrderStatusHistory | Full audit trail of status changes |
| Payments | Payment records + gateway refs |
| Reviews | Verified-purchase reviews with moderation |
| Coupons | Platform-wide and vendor-specific |
| CouponUsages | Usage tracking |
| Notifications | In-app notifications |
| WithdrawalRequests | Vendor payout requests |
| RefreshTokens | JWT refresh token rotation |

---

## DOCKER COMPOSE

```yaml
# docker-compose.yml
version: '3.8'

services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: markethub-sqlserver
    environment:
      ACCEPT_EULA: "Y"
      SA_PASSWORD: "MarketHub@123!"
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

  redis:
    image: redis:7-alpine
    container_name: markethub-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: markethub-rabbitmq
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  elasticsearch:
    image: elasticsearch:8.11.0
    container_name: markethub-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data

  seq:
    image: datalust/seq:latest
    container_name: markethub-seq
    environment:
      ACCEPT_EULA: "Y"
    ports:
      - "5341:80"
    volumes:
      - seq_data:/data

  minio:
    image: minio/minio
    container_name: markethub-minio
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: markethub
      MINIO_ROOT_PASSWORD: markethub123
    volumes:
      - minio_data:/data

volumes:
  sqlserver_data:
  redis_data:
  rabbitmq_data:
  elasticsearch_data:
  seq_data:
  minio_data:
```

---

## GITHUB SETUP

### Initial Push
```bash
cd markethub
git init
git add .
git commit -m "feat: initial project structure"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/markethub.git
git push -u origin main
```

### Branch Strategy
```
main          ← production-ready only
develop       ← integration branch
feature/*     ← new features (feature/vendor-dashboard)
fix/*         ← bug fixes
```

### .gitignore (important entries)
```
# .NET
**/bin/
**/obj/
**/*.user
appsettings.Development.json    ← NEVER commit secrets
**/Migrations/                  ← commit migrations

# Node
node_modules/
.next/
.env.local                      ← NEVER commit

# Docker
.docker/

# IDE
.vs/
.vscode/settings.json
*.DotSettings.user
```

### GitHub Actions CI (`.github/workflows/backend-ci.yml`)
```yaml
name: Backend CI
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      sqlserver:
        image: mcr.microsoft.com/mssql/server:2022-latest
        env:
          ACCEPT_EULA: Y
          SA_PASSWORD: Test@123456!
        ports:
          - 1433:1433
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0.x'
      - run: dotnet restore src/MarketHub.sln
      - run: dotnet build src/MarketHub.sln --no-restore
      - run: dotnet test tests/ --no-build --verbosity normal
```

---

## FEATURES CHECKLIST

### Authentication & Users
- [ ] Customer registration (email + password)
- [ ] Vendor registration (+ store info)
- [ ] Login → JWT access token (15min) + HttpOnly refresh token cookie (30d)
- [ ] Refresh token rotation (old invalidated on use)
- [ ] Forgot password → email reset link
- [ ] Reset password with token
- [ ] Change password (authenticated)
- [ ] Google OAuth login
- [ ] Email verification on register
- [ ] Role-based authorization: SuperAdmin | Admin | Vendor | Customer

### Vendor Store Management
- [ ] Vendor onboarding flow (register → pending → admin approves → active)
- [ ] Store profile: name, slug (unique URL), description, logo, banner
- [ ] Store status: Pending | Active | Suspended | Rejected
- [ ] Commission rate per vendor (set by admin, default 10%)
- [ ] Vendor wallet balance (accumulates after sales - commission)
- [ ] Withdrawal requests (vendor requests payout → admin approves)
- [ ] Vendor dashboard: revenue, orders, top products, sales chart
- [ ] Vendor earnings report by date range

### Store Categories (Vendor-Owned)
- [ ] Each vendor manages their own category tree
- [ ] Create/Update/Delete categories
- [ ] Sub-categories (parent/child relationship)
- [ ] Category image + description
- [ ] Display order (drag to reorder)
- [ ] Soft delete (checks no active products before delete)

### Products
- [ ] Create product (name, slug, description, price, stock, SKU, images)
- [ ] Compare-at price (shows discount %)
- [ ] Product variants (size/color with individual price + stock)
- [ ] Multiple images (reorderable, set primary)
- [ ] Product status: Draft | Active | OutOfStock | Archived
- [ ] Bulk status update
- [ ] Low stock threshold + alerts
- [ ] Digital product flag (no shipping)
- [ ] Weight + dimensions (for shipping calc)
- [ ] Featured product flag
- [ ] SEO slug (auto-generated, editable)
- [ ] Full-text search via Elasticsearch
- [ ] Filter by: vendor, category, price range, rating, in-stock
- [ ] Sort by: relevance, price, rating, newest

### Shopping Cart
- [ ] Persistent cart (synced to DB when authenticated)
- [ ] Guest cart (localStorage) → merge on login
- [ ] Add/update/remove items
- [ ] Stock validation on add
- [ ] Price snapshot (shows price at time of adding)
- [ ] Cart summary for header badge (item count + subtotal)
- [ ] Optimistic UI updates

### Orders & Checkout
- [ ] Multi-vendor cart → splits into one order per vendor on checkout
- [ ] Shipping address selection (saved or new)
- [ ] Coupon code validation + application
- [ ] Tax + shipping calculation
- [ ] Order number (human-readable, auto-generated)
- [ ] Order status: Pending → Confirmed → Processing → Shipped → Delivered | Cancelled | Refunded
- [ ] Order status history (full audit trail with timestamps)
- [ ] Shipping address snapshot (stored at order time, not live address)
- [ ] Customer: view orders, cancel pending orders
- [ ] Vendor: confirm, mark shipped (+ tracking number), mark delivered
- [ ] Public order tracking page (no login required)
- [ ] Order cancellation with reason

### Payments
- [ ] Stripe credit card (Payment Intents API)
- [ ] Cash on Delivery option
- [ ] Wallet payment (vendor wallet)
- [ ] Stripe webhook handler (idempotent)
- [ ] Payment status: Pending | Completed | Failed | Refunded
- [ ] Refund flow
- [ ] Idempotency keys for payment endpoints

### Reviews & Ratings
- [ ] Verified purchase reviews only (must have delivered order)
- [ ] Rating 1-5 stars + title + body
- [ ] Review images
- [ ] Review moderation: Pending → Approved | Rejected
- [ ] Rating summary (average, distribution bar chart)
- [ ] Vendor reply to review
- [ ] Customer edit/delete own review
- [ ] Report inappropriate review

### Coupons & Discounts
- [ ] Platform-wide coupons (admin) and vendor-specific coupons
- [ ] Types: Percentage | Fixed Amount | Free Shipping
- [ ] Min order amount requirement
- [ ] Max discount cap
- [ ] Usage limit + per-user limit
- [ ] Expiry date
- [ ] Real-time validation at checkout

### Notifications
- [ ] Real-time in-app notifications via SignalR
- [ ] Notification types: Order | Payment | Review | System | Promotion
- [ ] Unread count badge on bell icon
- [ ] Mark single/all as read
- [ ] Customer events: OrderConfirmed, OrderShipped, OrderDelivered, ReviewApproved
- [ ] Vendor events: NewOrder, OrderCancelled, LowStock, WithdrawalProcessed, AccountApproved
- [ ] Email notifications for critical events (queued via Hangfire)

### Admin Panel
- [ ] Vendor management: list, approve, suspend, reject
- [ ] Platform analytics: total revenue, orders, users, top vendors
- [ ] All orders view with filters
- [ ] Review moderation queue
- [ ] Withdrawal request processing
- [ ] Commission management per vendor

### Technical Features
- [ ] Clean Architecture (Domain → Application → Infrastructure → API)
- [ ] CQRS with MediatR (Commands + Queries separated)
- [ ] Repository Pattern + Unit of Work
- [ ] FluentValidation on all commands
- [ ] AutoMapper for DTO mapping
- [ ] Global exception handling middleware
- [ ] Structured logging (Serilog → Seq)
- [ ] Health check endpoints (/health, /health/live)
- [ ] API versioning (/api/v1/...)
- [ ] Rate limiting (per IP + per user)
- [ ] Response compression
- [ ] Swagger with JWT auth support
- [ ] Redis caching (products, vendor store, cart, search)
- [ ] Background jobs (Hangfire): emails, reports, stock alerts, cart cleanup
- [ ] Event-driven (RabbitMQ + MassTransit): OrderPlaced, PaymentConfirmed, etc.
- [ ] Soft delete (global query filter)
- [ ] Audit trail (CreatedAt, UpdatedAt, CreatedBy, UpdatedBy)
- [ ] Correlation ID on all requests
- [ ] Idempotency filter for payment endpoints
- [ ] Docker Compose for all infrastructure
- [ ] GitHub Actions CI (build + test)
- [ ] xUnit unit tests (Domain + Application layers)
- [ ] Integration tests with Testcontainers
- [ ] Playwright E2E tests (full customer + vendor journeys)

---

## GEMINI CLI AGENTS — SCOPE OF WORK

> **IMPORTANT FOR ALL AGENTS:**
> 1. Read this entire file before starting
> 2. Never change files outside your scope without noting it here
> 3. After finishing a task, update the FEATURES CHECKLIST above (change [ ] to [x])
> 4. Run tests before marking complete
> 5. All secrets go in appsettings.Development.json (gitignored) or .env.local (gitignored)

---

### AGENT 1 — DOMAIN & SHARED (Terminal 1)
**Scope:** `src/MarketHub.Domain/` + `src/MarketHub.Shared/` + `tests/MarketHub.Domain.Tests/`

**Tasks in order:**
1. Create solution file: `dotnet new sln -n MarketHub -o src`
2. Create all projects: `dotnet new classlib -n MarketHub.Domain`, etc.
3. Add project references (Domain has none; Application → Domain; etc.)
4. Implement all entities in `Domain/Entities/` with domain methods
5. Implement value objects (Money, Dimensions, ShippingAddress) as C# records
6. Define all enums
7. Define repository interfaces (IRepository<T>, IVendorRepository, etc.)
8. Implement BaseEntity, AuditableEntity
9. Implement Shared utilities: Result<T>, PagedList<T>, SlugHelper
10. Write Domain unit tests (VendorTests, ProductTests, OrderTests, CartTests)
11. Run: `dotnet test tests/MarketHub.Domain.Tests/` — all must pass

**Must NOT touch:** Infrastructure, API, Frontend

**Done signal:** All Domain tests green. Post "AGENT1_DONE" in git commit message.

---

### AGENT 2 — APPLICATION LAYER (Terminal 2)
**Scope:** `src/MarketHub.Application/`

**Wait for:** AGENT1_DONE commit on develop branch

**Tasks in order:**
1. Install NuGet packages: MediatR, FluentValidation, AutoMapper
2. Implement pipeline behaviors (Logging, Validation, Performance)
3. Define application interfaces (ICurrentUserService, IEmailService, etc.)
4. Implement Features in this order:
   - Auth (Commands: Register, Login, Refresh, ForgotPassword, ResetPassword)
   - Vendors (Commands + Queries for store management)
   - StoreCategories (full CRUD)
   - Products (full CRUD + search + publish/archive)
   - Cart (add/remove/update/clear)
   - Orders (checkout + status flow + tracking)
   - Payments (initiate + confirm + refund)
   - Reviews (create + moderate + vendor reply)
   - Coupons (validate + CRUD)
   - Notifications (fetch + mark read)
   - Admin (vendor approval + analytics)
5. AutoMapper profiles for all DTOs
6. DependencyInjection.cs wiring
7. Write Application unit tests

**Done signal:** `dotnet build` zero errors. Post "AGENT2_DONE".

---

### AGENT 3 — INFRASTRUCTURE LAYER (Terminal 3)
**Scope:** `src/MarketHub.Infrastructure/`

**Wait for:** AGENT2_DONE

**Tasks in order:**
1. Install NuGet packages (EF Core, Redis, Identity, Stripe, MassTransit, Serilog, etc.)
2. AppDbContext with:
   - IdentityDbContext base
   - SaveChangesAsync override (auto timestamps, audit fields)
   - Global soft-delete query filter
   - All DbSets
3. Entity configurations (Fluent API) for every entity
4. Migrations: `dotnet ef migrations add InitialCreate`
5. Generic Repository + Specific repositories
6. UnitOfWork
7. Identity: JwtTokenService, IdentityService (register/login/refresh/google)
8. Services: EmailService, CacheService (Redis), FileStorageService, PaymentService (Stripe), SearchService (ES), NotificationService (SignalR + DB)
9. MassTransit consumers: OrderPlaced, PaymentConfirmed, OrderShipped, VendorApproved, LowStock
10. Hangfire jobs: SendEmail, SyncToElasticsearch, LowStockAlerts, CleanExpiredCarts
11. Seed data: roles, admin user, 2 sample vendors with categories + products
12. DependencyInjection.cs

**Verify:** `dotnet ef database update` runs clean on local SQL Server.

**Done signal:** DB schema created, seed data applied. Post "AGENT3_DONE".

---

### AGENT 4 — API LAYER (Terminal 4)
**Scope:** `src/MarketHub.API/`

**Wait for:** AGENT3_DONE

**Tasks in order:**
1. Program.cs: wire all services, JWT auth, CORS, versioning, rate limiting, Swagger, SignalR, Hangfire, health checks
2. ExceptionHandlingMiddleware (maps all exceptions to correct HTTP status)
3. RequestLoggingMiddleware (correlation ID + Serilog)
4. IdempotencyFilter (Redis-backed, for payments)
5. Authorization policies (RequireVendor, RequireAdmin, RequireSuperAdmin, ResourceOwner)
6. All controllers in /v1/:
   - AuthController
   - VendorsController
   - StoreCategoriesController
   - ProductsController
   - CartController
   - OrdersController
   - PaymentsController
   - ReviewsController
   - CouponsController
   - NotificationsController
   - CustomersController
   - Admin/*Controller
7. NotificationHub (SignalR)
8. Dockerfile for API
9. Swagger: JWT support + XML comments + response examples

**Verify:** `dotnet run` → open https://localhost:7001/swagger → all endpoints visible.

**Done signal:** Swagger loads, POST /api/v1/auth/login returns 200. Post "AGENT4_DONE".

---

### AGENT 5 — FRONTEND (Terminal 5)
**Scope:** `frontend/`

**Wait for:** AGENT4_DONE (Swagger must be working)

**Tasks in order:**
1. `npx create-next-app@latest frontend --typescript --tailwind --app`
2. Install: shadcn/ui, Redux Toolkit, RTK Query, React Hook Form, Zod, Framer Motion, next-themes, Lucide React, Recharts, @stripe/stripe-js, @microsoft/signalr
3. Setup Redux store with authSlice, cartSlice, notificationSlice
4. RTK Query baseApi with JWT interceptor + token refresh
5. All API service files (authApi, productApi, vendorApi, cartApi, orderApi, reviewApi, notificationApi)
6. Layout components: Header (cart badge, notifications, user menu), Footer, VendorSidebar, AdminSidebar
7. Pages in this order:
   - /login, /register, /register/vendor
   - / (homepage: hero search, featured stores, featured products)
   - /stores (browse all stores)
   - /stores/[slug] (store page with category sidebar)
   - /stores/[slug]/[category] (category products)
   - /products/[vendorSlug]/[slug] (product detail + reviews)
   - /search (search results with filters)
   - /cart
   - /checkout (multi-step)
   - /account/orders
   - /account/orders/[orderNumber]
   - /track/[orderNumber]
   - /vendor/dashboard
   - /vendor/products (+ /new + /[id]/edit)
   - /vendor/categories
   - /vendor/orders
   - /vendor/analytics
   - /admin/dashboard
   - /admin/vendors
   - /admin/orders
8. middleware.ts (route protection by role)
9. SignalR hook (useSignalR) — connect on auth, dispatch notifications
10. Dark mode (next-themes)
11. Dockerfile for frontend
12. .env.local (from .env.example)

**Verify:** `npm run dev` → homepage loads, login works, products visible.

**Done signal:** Customer can register + browse stores + add to cart. Post "AGENT5_DONE".

---

### AGENT 6 — TESTING & CI (Terminal 6)
**Scope:** `tests/` + `.github/workflows/`

**Wait for:** AGENT4_DONE (backend) + AGENT5_DONE (frontend)

**Tasks in order:**
1. MarketHub.Domain.Tests — xUnit tests for all entities + value objects
2. MarketHub.Application.Tests — handler tests with Moq (all handlers)
3. MarketHub.Integration.Tests:
   - WebApplicationFactory setup
   - Testcontainers for SQL Server + Redis
   - Respawn for DB reset between tests
   - Tests for: Auth, Products, Cart, Orders endpoints
4. Playwright E2E:
   - Install: `npm install -D @playwright/test`
   - customer-journey.spec.ts (register → browse → cart → checkout → order)
   - vendor-journey.spec.ts (login → create product → manage orders)
   - authentication.spec.ts (route protection)
5. GitHub Actions:
   - backend-ci.yml (build + test with SQL Server service container)
   - frontend-ci.yml (lint + build + Playwright)
6. Update FEATURES CHECKLIST in this file for every passing test

**Done signal:** `dotnet test` all green + Playwright journeys pass. Post "AGENT6_DONE".

---

## SHARED CONTEXT — ALL AGENTS MUST READ

### API Response Format (always)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "errors": []
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "totalCount": 100,
    "pageNumber": 1,
    "pageSize": 20,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Auth Header
```
Authorization: Bearer {accessToken}
```

### Key Business Rules (MUST enforce)
1. A vendor can only manage their OWN store's categories and products
2. A vendor can only see and act on their OWN orders
3. A customer can only view/cancel their OWN orders
4. Reviews require a verified delivered order (one review per order per product)
5. Cart items are split into separate orders per vendor on checkout
6. Commission is deducted from vendor balance at order confirmation
7. Product slug must be unique within a vendor's store (not globally)
8. StoreCategory belongs to ONE vendor — not shared across vendors
9. Coupon code: vendor-specific coupons only apply to that vendor's products

### Environment Variables

**Backend (appsettings.Development.json):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=MarketHubDb;User Id=sa;Password=MarketHub@123!;TrustServerCertificate=True",
    "Redis": "localhost:6379",
    "RabbitMQ": "amqp://guest:guest@localhost:5672",
    "Elasticsearch": "http://localhost:9200"
  },
  "JwtSettings": {
    "SecretKey": "YOUR-256-BIT-SECRET-CHANGE-IN-PRODUCTION",
    "Issuer": "MarketHub",
    "Audience": "MarketHub-Client",
    "AccessTokenExpiryMinutes": 15,
    "RefreshTokenExpiryDays": 30
  },
  "StripeSettings": {
    "SecretKey": "sk_test_...",
    "WebhookSecret": "whsec_..."
  },
  "EmailSettings": {
    "SmtpHost": "localhost",
    "SmtpPort": 1025,
    "FromEmail": "noreply@markethub.com",
    "FromName": "MarketHub"
  },
  "AzureBlob": {
    "ConnectionString": "UseDevelopmentStorage=true",
    "ContainerName": "markethub"
  },
  "Hangfire": {
    "Dashboard": "/hangfire",
    "AllowedRoles": ["SuperAdmin", "Admin"]
  }
}
```

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=https://localhost:7001/api/v1
NEXT_PUBLIC_SIGNALR_URL=https://localhost:7001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

### Naming Conventions
| Type | Convention | Example |
|---|---|---|
| C# Classes | PascalCase | `OrderService` |
| C# Methods | PascalCase | `GetByIdAsync` |
| C# Properties | PascalCase | `TotalAmount` |
| C# Private fields | _camelCase | `_unitOfWork` |
| EF Migrations | PascalCase descriptive | `AddVendorWalletField` |
| API Routes | kebab-case | `/store-categories` |
| TypeScript interfaces | PascalCase + I prefix | `IProductDto` |
| React components | PascalCase | `ProductCard` |
| React hooks | camelCase + use | `useCart` |
| Redux slices | camelCase + Slice | `cartSlice` |
| Git branches | kebab-case | `feature/vendor-dashboard` |

### Critical: Soft Delete
Every entity inherits BaseEntity which has `IsDeleted` (bool).
AppDbContext applies global query filter: `.HasQueryFilter(e => !e.IsDeleted)`
**Never use hard delete in production code.** Use `repository.DeleteAsync()` which sets IsDeleted=true.

### Critical: Never expose
- Raw database IDs in public URLs (use slug instead for products/stores)
- Stack traces in production API responses
- Passwords or secrets in logs
- User emails in non-admin API responses

---

## STATUS TRACKER

| Agent | Status | Last Updated |
|---|---|---|
| Agent 1 (Domain) | ✅ Completed | 2026-05-16 |
| Agent 2 (Application) | ✅ Completed | 2026-05-16 |
| Agent 3 (Infrastructure) | ✅ Completed | 2026-05-16 |
| Agent 4 (API) | ✅ Completed | 2026-05-16 |
| Agent 5 (Frontend) | ⏳ In progress | 2026-05-16 |
| Agent 6 (Testing) | ⏳ Waiting for 5 | 2026-05-16 |

---

*Last updated: generated by Claude Sonnet — update this file as you progress.*
