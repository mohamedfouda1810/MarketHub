# MarketHub — Multi-Vendor E-Commerce Platform

A full-stack multi-vendor e-commerce platform built with ASP.NET Core 8 + Next.js 14, following Clean Architecture principles.

## Architecture

```
Vendor → owns a Store → has StoreCategories → contain Products
Customer → browses Stores → Categories → Products → Checkout
Admin → approves Vendors, manages platform, takes commission
```

## Tech Stack

| | Technology |
|---|---|
| Backend | ASP.NET Core 8, Clean Architecture, CQRS + MediatR |
| Database | SQL Server + EF Core 8 |
| Cache | Redis |
| Search | Elasticsearch |
| Queue | RabbitMQ + MassTransit |
| Real-time | SignalR |
| Jobs | Hangfire |
| Frontend | Next.js 14, TypeScript, TailwindCSS, Redux Toolkit |
| Payments | Stripe |
| DevOps | Docker, GitHub Actions |

## Quick Start

```bash
# Start infrastructure
docker-compose up -d

# Backend
cd src/MarketHub.API
dotnet ef database update
dotnet run

# Frontend
cd frontend
npm install && npm run dev
```

| Service | URL |
|---|---|
| App | http://localhost:3000 |
| API | https://localhost:7001 |
| Swagger | https://localhost:7001/swagger |
| RabbitMQ | http://localhost:15672 |
| Seq Logs | http://localhost:5341 |
| MinIO | http://localhost:9001 |

## Development

See **MARKETHUB_MASTER_REF.md** for full architecture, all features, agent scopes, and database setup.

## License

MIT
