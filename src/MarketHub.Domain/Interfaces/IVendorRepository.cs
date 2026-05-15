using MarketHub.Domain.Entities;

namespace MarketHub.Domain.Interfaces;

/// <summary>
/// Repository interface for Vendor specific operations.
/// </summary>
public interface IVendorRepository : IRepository<Vendor>
{
    Task<Vendor?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
    Task<Vendor?> GetWithCategoriesAndProductsAsync(Guid vendorId);
    Task<IEnumerable<Vendor>> GetTopVendorsAsync(int limit);
}
