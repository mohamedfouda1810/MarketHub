using MarketHub.Domain.Entities;
using MarketHub.Domain.Common;
using MarketHub.Shared;

namespace MarketHub.Domain.Interfaces;

/// <summary>
/// Repository interface for Product specific operations.
/// </summary>
public interface IProductRepository : IRepository<Product>
{
    Task<(IEnumerable<Product> Items, int TotalCount)> SearchAsync(string term, ProductFilters filters, int page, int pageSize);
    Task<Product?> GetBySlugAsync(string vendorSlug, string slug, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Product> Items, int TotalCount)> GetByVendorIdAsync(Guid vendorId, int page, int pageSize, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Product>> GetByVendorAsync(Guid vendorId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Product>> GetByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetRelatedProductsAsync(Guid productId, int limit);
    Task<IEnumerable<Product>> GetLowStockProductsAsync(Guid vendorId, int threshold = 5);
}
