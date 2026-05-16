using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Infrastructure.Persistence.Repositories;

namespace MarketHub.Infrastructure.Persistence
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _context;
        public IVendorRepository Vendors { get; }
        public IProductRepository Products { get; }
        public IOrderRepository Orders { get; }
        public ICustomerRepository Customers { get; }
        public ICartRepository Carts { get; }
        public IAddressRepository Addresses { get; }

        public UnitOfWork(
            AppDbContext context,
            IVendorRepository vendors,
            IProductRepository products,
            IOrderRepository orders,
            ICustomerRepository customers,
            ICartRepository carts,
            IAddressRepository addresses)
        {
            _context = context;
            Vendors = vendors;
            Products = products;
            Orders = orders;
            Customers = customers;
            Carts = carts;
            Addresses = addresses;
        }

        public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return await _context.SaveChangesAsync(cancellationToken);
        }

        public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _context.Database.BeginTransactionAsync(cancellationToken);
        }

        public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _context.Database.CommitTransactionAsync(cancellationToken);
        }

        public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
        {
            await _context.Database.RollbackTransactionAsync(cancellationToken);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
