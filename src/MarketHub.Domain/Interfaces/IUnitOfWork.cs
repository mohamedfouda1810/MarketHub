namespace MarketHub.Domain.Interfaces;

/// <summary>
/// Interface for the Unit of Work pattern, handling transaction boundaries.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    IVendorRepository Vendors { get; }
    IProductRepository Products { get; }
    IOrderRepository Orders { get; }
    ICustomerRepository Customers { get; }
    ICartRepository Carts { get; }
    IAddressRepository Addresses { get; }
    IUserRepository Users { get; }
    IStoreCategoryRepository StoreCategories { get; }
    
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
