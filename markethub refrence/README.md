# MarketHub — Multi-Vendor E-Commerce Platform

A production-grade, full-stack multi-vendor e-commerce platform built with **ASP.NET Core 8** + **Next.js 14**, following Clean Architecture, CQRS, and Repository/Unit-of-Work patterns.

## Production Status

**Build:** ✅ 0 errors | **Push:** `main` @ `df84da9`

---

## Architecture

```
Vendor → owns a Store → has StoreCategories → contain Products
Customer → browses Stores → Categories → Products → Checkout
Admin → approves Vendors, manages platform, takes commission
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | ASP.NET Core 8, Clean Architecture, CQRS + MediatR |
| Database | SQL Server + EF Core 8 |
| Cache | Redis |
| Search | Elasticsearch |
| Queue | RabbitMQ + MassTransit |
| Real-time | SignalR |
| Jobs | Hangfire |
| Frontend | Next.js 14, TypeScript, TailwindCSS, Redux Toolkit, RTK Query |
| Auth | ASP.NET Identity + JWT (HttpOnly cookie) + Refresh token rotation |
| Payments | Stripe |
| Storage | MinIO / Cloudinary |
| DevOps | Docker, GitHub Actions |

---

## Quick Start

```bash
# 1. Start infrastructure (SQL Server, Redis, RabbitMQ, MinIO, Seq)
docker-compose up -d

# 2. Backend
cd src/MarketHub.API
dotnet ef database update
dotnet run

# 3. Frontend
cd frontend
npm install
npm run dev
```

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | https://localhost:7001 |
| Swagger | https://localhost:7001/swagger |
| RabbitMQ | http://localhost:15672 |
| Seq Logs | http://localhost:5341 |
| MinIO | http://localhost:9001 |

---

## Seed Credentials (dev only)

| Role | Email | Password |
|---|---|---|
| Admin | admin1@markethub.com | Admin123! |
| Vendor | vendor1@markethub.com | Vendor123! |
| Customer | customer1@markethub.com | Customer123! |

---

## Recent Changes (Production Hardening)

### Backend
- ✅ **IStoreCategoryRepository** — new interface + `StoreCategoryRepository` impl + DI registration + `IUnitOfWork.StoreCategories`
- ✅ **CS build errors resolved** — `AdminFeature`, `StoreCategoriesFeature`, `VendorsFeature`, `DbInitializer` (missing usings, private setters, wrong ctor args, missing methods)
- ✅ **O(N) eliminated** — `VendorsFeature` Dashboard/Earnings use `GetByUserIdAsync` instead of `GetAllAsync + FirstOrDefault`
- ✅ **Auth hardening** — `RevokeRefreshTokenAsync` on logout, HttpOnly cookies enforced
- ✅ **Redis dedup** — removed redundant `AddStackExchangeRedisCache` in `Program.cs`

### Frontend
- ✅ **Design system** — 4-color palette (Indigo/Amber/Emerald/Rose) in `globals.css` + Tailwind glow shadows
- ✅ **Header** — search navigates to `/products?search=term`; full mobile drawer (spring animation)
- ✅ **Footer** — trust badge row, social brand-color hover, newsletter form with toast
- ✅ **ProductCard** — real `cartApi` add-to-cart; `Loader2` spinner; amber star ratings
- ✅ **Cart** — coupon code input (`SAVE10` demo), discount line, `AnimatePresence`
- ✅ **Vendor Products page** — real API (list/delete/publish/archive), skeleton loading, delete confirmation modal, pagination
- ✅ **Products page** — 300ms debounced search wired to RTK Query

---

## Architecture Reference

See **[MARKETHUB_MASTER_REF.md](./markethub%20refrence/MARKETHUB_MASTER_REF.md)** for the full API surface, database schema, feature scope, and agent guidance.

## License

MIT
