using MarketHub.Domain.Entities;

namespace MarketHub.Domain.Interfaces;

/// <summary>
/// Repository interface for StoreCategory operations.
/// </summary>
public interface IStoreCategoryRepository : IRepository<StoreCategory>
{
    Task<StoreCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
