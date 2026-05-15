using Hangfire;
using MarketHub.Infrastructure.Services;
using MarketHub.Infrastructure.Persistence;
using MarketHub.Application.Common.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MarketHub.Domain.Enums;
using MarketHub.Domain.Entities;

namespace MarketHub.Infrastructure.BackgroundJobs.Jobs
{
    public class GenerateDailyVendorReportJob
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<GenerateDailyVendorReportJob> _logger;

        public GenerateDailyVendorReportJob(AppDbContext context, IEmailService emailService, ILogger<GenerateDailyVendorReportJob> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        public async Task ExecuteAsync()
        {
            _logger.LogInformation("Starting daily vendor report generation.");
            var yesterday = DateTime.UtcNow.Date.AddDays(-1);
            var today = DateTime.UtcNow.Date;

            var vendors = await _context.Vendors.Where(v => v.IsActive).ToListAsync();

            foreach (var vendor in vendors)
            {
                var dailyOrders = await _context.Orders
                    .Where(o => o.VendorId == vendor.Id && o.CreatedAt >= yesterday && o.CreatedAt < today)
                    .ToListAsync();

                var totalSales = dailyOrders.Sum(o => o.TotalAmount);
                var orderCount = dailyOrders.Count;

                _emailService.EnqueueEmail(
                    vendor.StoreEmail,
                    $"Daily Sales Report - {yesterday:d}",
                    "DailyVendorReport",
                    new { VendorName = vendor.StoreName, TotalSales = totalSales, OrderCount = orderCount }
                );
            }
            _logger.LogInformation("Finished daily vendor report generation.");
        }
    }

    public class SyncProductToElasticsearchJob
    {
        private readonly AppDbContext _context;
        private readonly ISearchService _searchService;

        public SyncProductToElasticsearchJob(AppDbContext context, ISearchService searchService)
        {
            _context = context;
            _searchService = searchService;
        }

        public async Task ExecuteAsync(Guid productId)
        {
            var product = await _context.Products
                .Include(p => p.Vendor)
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
            {
                await _searchService.DeleteProductAsync(productId);
                return;
            }

            var doc = new ProductSearchDocument
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                VendorId = product.VendorId,
                VendorName = product.Vendor?.StoreName ?? string.Empty,
                CategoryId = product.CategoryId,
                Price = product.Price,
                IsActive = product.Status == ProductStatus.Active
                // Add more mappings
            };

            await _searchService.IndexProductAsync(doc);
        }
    }

    public class CleanExpiredCartItemsJob
    {
        private readonly AppDbContext _context;

        public CleanExpiredCartItemsJob(AppDbContext context)
        {
            _context = context;
        }

        public async Task ExecuteAsync()
        {
            var expiryThreshold = DateTime.UtcNow.AddHours(-24);
            var expiredItems = await _context.Set<CartItem>()
                .Where(ci => ci.CreatedAt < expiryThreshold)
                .ToListAsync();

            if (expiredItems.Any())
            {
                _context.Set<CartItem>().RemoveRange(expiredItems);
                await _context.SaveChangesAsync();
            }
        }
    }

    public class SendLowStockAlertsJob
    {
        private readonly AppDbContext _context;
        private readonly INotificationService _notificationService;

        public SendLowStockAlertsJob(AppDbContext context, INotificationService notificationService)
        {
            _context = context;
            _notificationService = notificationService;
        }

        public async Task ExecuteAsync()
        {
            var lowStockProducts = await _context.Products
                .Include(p => p.Vendor)
                .Where(p => p.StockQuantity <= 5 && p.Status == ProductStatus.Active)
                .ToListAsync();

            var alertsByVendor = lowStockProducts.GroupBy(p => p.VendorId);

            foreach (var group in alertsByVendor)
            {
                var vendor = group.First().Vendor;
                if (vendor == null) continue;

                var productNames = string.Join(", ", group.Select(p => p.Name));
                
                await _notificationService.SendToVendorAsync(
                    vendor.Id,
                    "Low Stock Alert",
                    $"The following products are running low on stock: {productNames}",
                    "Alert"
                );
            }
        }
    }
}