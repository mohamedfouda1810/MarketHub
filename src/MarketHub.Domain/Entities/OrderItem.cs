using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a specific item within an order.
/// </summary>
public class OrderItem : BaseEntity
{
    public Guid OrderId { get; private set; }
    public Guid ProductId { get; private set; }
    public Guid? VariantId { get; private set; }
    
    // Snapshots
    public string ProductNameSnapshot { get; private set; } = null!;
    public string? ProductImageSnapshot { get; private set; }
    public string? VariantNameSnapshot { get; private set; }
    
    public int Quantity { get; private set; }
    public decimal UnitPrice { get; private set; }
    public decimal TotalPrice => Quantity * UnitPrice;

    public virtual Order Order { get; private set; } = null!;
    public virtual Product Product { get; private set; } = null!;

    private OrderItem() { } // For EF Core

    internal OrderItem(Guid orderId, Guid productId, Guid? variantId, string productName, string? productImage, string? variantName, int quantity, decimal unitPrice)
    {
        OrderId = orderId;
        ProductId = productId;
        VariantId = variantId;
        ProductNameSnapshot = productName;
        ProductImageSnapshot = productImage;
        VariantNameSnapshot = variantName;
        Quantity = quantity;
        UnitPrice = unitPrice;
    }
}
