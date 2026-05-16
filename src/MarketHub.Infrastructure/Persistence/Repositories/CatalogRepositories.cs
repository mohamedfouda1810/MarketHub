using Microsoft.EntityFrameworkCore;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Common;

namespace MarketHub.Infrastructure.Persistence.Repositories
{
    public class VendorRepository : GenericRepository<Vendor>, IVendorRepository
    {
        public VendorRepository(AppDbContext context) : base(context) { }

        public async Task<(IEnumerable<Vendor> Items, int TotalCount)> GetAllPagedAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _dbSet.AsQueryable();
            int total = await query.CountAsync(cancellationToken);
            var items = await query.OrderBy(v => v.StoreName)
                                   .Skip((pageNumber - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync(cancellationToken);
            return (items, total);
        }

        public async Task<Vendor?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FirstOrDefaultAsync(v => v.StoreSlug == slug, cancellationToken);
        }

        public async Task<Vendor?> GetWithCategoriesAndProductsAsync(Guid vendorId)
        {
            return await _dbSet
                .Include(v => v.Categories)
                .Include(v => v.Products)
                .FirstOrDefaultAsync(v => v.Id == vendorId);
        }

        public async Task<IEnumerable<Vendor>> GetTopVendorsAsync(int limit)
        {
            return await _dbSet
                .OrderByDescending(v => v.Rating)
                .Take(limit)
                .ToListAsync();
        }
    }

    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }

        public async Task<(IEnumerable<Product> Items, int TotalCount)> SearchAsync(string term, ProductFilters filters, int page, int pageSize)
        {
            var query = _dbSet.Include(p => p.Vendor).AsQueryable();
            
            if (!string.IsNullOrEmpty(term))
                query = query.Where(p => p.Name.Contains(term) || p.Description.Contains(term));
            
            if (filters.VendorId.HasValue)
                query = query.Where(p => p.VendorId == filters.VendorId);
                
            if (filters.CategoryId.HasValue)
                query = query.Where(p => p.CategoryId == filters.CategoryId);

            if (filters.MinPrice.HasValue)
                query = query.Where(p => p.Price >= filters.MinPrice);
                
            if (filters.MaxPrice.HasValue)
                query = query.Where(p => p.Price <= filters.MaxPrice);

            int total = await query.CountAsync();
            var items = await query.OrderByDescending(p => p.CreatedAt)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync();
            return (items, total);
        }

        public async Task<Product?> GetBySlugAsync(string vendorSlug, string slug, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Include(p => p.Vendor)
                               .FirstOrDefaultAsync(p => p.Vendor.StoreSlug == vendorSlug && p.Slug == slug, cancellationToken);
        }

        public async Task<(IEnumerable<Product> Items, int TotalCount)> GetByVendorIdAsync(Guid vendorId, int page, int pageSize, CancellationToken cancellationToken = default)
        {
            var query = _dbSet.Where(p => p.VendorId == vendorId);
            int total = await query.CountAsync(cancellationToken);
            var items = await query.OrderByDescending(p => p.CreatedAt)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .ToListAsync(cancellationToken);
            return (items, total);
        }

        public async Task<IEnumerable<Product>> GetRelatedProductsAsync(Guid productId, int limit)
        {
            var product = await GetByIdAsync(productId);
            if (product == null) return Enumerable.Empty<Product>();

            return await _dbSet.Where(p => p.CategoryId == product.CategoryId && p.Id != productId)
                               .Take(limit)
                               .ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetLowStockProductsAsync(Guid vendorId, int threshold = 5)
        {
            return await _dbSet.Where(p => p.VendorId == vendorId && p.StockQuantity <= threshold)
                               .ToListAsync();
        }

        public async Task<IReadOnlyList<Product>> GetByVendorAsync(Guid vendorId, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(p => p.VendorId == vendorId).ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(p => p.CategoryId == categoryId).ToListAsync(cancellationToken);
        }
    }
}
