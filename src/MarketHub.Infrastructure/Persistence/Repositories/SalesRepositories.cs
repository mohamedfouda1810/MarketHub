using Microsoft.EntityFrameworkCore;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Enums;

namespace MarketHub.Infrastructure.Persistence.Repositories
{
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        public OrderRepository(AppDbContext context) : base(context) { }

        public async Task<Order?> GetWithFullDetailsAsync(Guid orderId)
        {
            return await _dbSet
                .Include(o => o.Items).ThenInclude(i => i.Product)
                .Include(o => o.Customer)
                .Include(o => o.Vendor)
                .Include(o => o.Payment)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<decimal> GetVendorRevenueAsync(Guid vendorId, DateTime from, DateTime to)
        {
            return await _dbSet
                .Where(o => o.VendorId == vendorId && o.Status == OrderStatus.Delivered && o.CreatedAt >= from && o.CreatedAt <= to)
                .SumAsync(o => o.TotalAmount);
        }

        public async Task<IEnumerable<Order>> GetOrdersByStatusAsync(OrderStatus status)
        {
            return await _dbSet.Where(o => o.Status == status).ToListAsync();
        }

        public async Task<Order?> GetWithItemsAsync(Guid id, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Include(o => o.Items)
                               .Include(o => o.StatusHistory)
                               .Include(o => o.Payment)
                               .FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
        }

        public async Task<IReadOnlyList<Order>> GetByVendorAsync(Guid vendorId, CancellationToken cancellationToken = default)
        {
            return await _dbSet.Where(o => o.VendorId == vendorId).ToListAsync(cancellationToken);
        }
    }

    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        public CustomerRepository(AppDbContext context) : base(context) { }

        public async Task<Customer?> GetWithAddressesAsync(Guid customerId)
        {
            return await _dbSet.Include(c => c.Addresses).FirstOrDefaultAsync(c => c.Id == customerId);
        }

        public async Task<Customer?> GetWithCartAsync(Guid customerId)
        {
            return await _dbSet.Include(c => c.Cart).ThenInclude(c => c.Items).FirstOrDefaultAsync(c => c.Id == customerId);
        }
    }

    public class CartRepository : GenericRepository<Cart>, ICartRepository
    {
        public CartRepository(AppDbContext context) : base(context) { }
    }
}
