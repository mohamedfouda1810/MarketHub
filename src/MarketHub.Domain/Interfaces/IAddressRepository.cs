using MarketHub.Domain.Entities;

namespace MarketHub.Domain.Interfaces;

public interface IAddressRepository : IRepository<Address>
{
    Task<IEnumerable<Address>> GetByCustomerIdAsync(Guid customerId, CancellationToken cancellationToken = default);
}
