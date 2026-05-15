using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a customer in the system.
/// </summary>
public class Customer : BaseEntity
{
    public Guid UserId { get; private set; }

    public virtual User User { get; private set; } = null!;
    public virtual Cart Cart { get; private set; } = null!;

    public Guid? DefaultAddressId { get; private set; }

    private readonly List<Address> _addresses = new();
    public IReadOnlyCollection<Address> Addresses => _addresses.AsReadOnly();

    private readonly List<Order> _orders = new();
    public IReadOnlyCollection<Order> Orders => _orders.AsReadOnly();
    
    // We can add WishlistItem and CartItem navigations if we create those entities, for now simplifying.

    private Customer() { } // For EF Core

    public Customer(Guid userId)
    {
        UserId = userId;
    }

    public void SetDefaultAddress(Guid addressId)
    {
        DefaultAddressId = addressId;
        UpdateTimestamp();
    }
}
