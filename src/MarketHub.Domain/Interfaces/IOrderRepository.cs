using MarketHub.Domain.Entities;

namespace MarketHub.Domain.Interfaces;

/// <summary>
/// Repository interface for Order specific operations.
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
    Task<Order?> GetWithItemsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Order>> GetByVendorAsync(Guid vendorId, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Order> Items, int TotalCount)> GetByCustomerIdAsync(Guid customerId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
    Task<Order?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);
    Task<(IEnumerable<Order> Items, int TotalCount)> GetByVendorIdAsync(Guid vendorId, int pageNumber, int pageSize, CancellationToken cancellationToken = default);
}
