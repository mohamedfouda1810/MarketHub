using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents an item in a shopping cart.
/// </summary>
public class CartItem : BaseEntity
{
    public Guid CartId { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid? VariantId { get; private set; }
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; } // Snapshot price

    public virtual Cart Cart { get; private set; } = null!;
    public virtual Product Product { get; private set; } = null!;

    private CartItem() { } // For EF Core

    internal CartItem(Guid cartId, Guid productId, Guid? variantId, int quantity, decimal unitPrice)
    {
        CartId = cartId;
        ProductId = productId;
        VariantId = variantId;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }

    internal void UpdateQuantity(int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));
        Quantity = quantity;
        UpdateTimestamp();
    }
}
