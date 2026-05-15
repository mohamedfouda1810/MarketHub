using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a specific variant of a product (e.g., Size/Color).
/// </summary>
public class ProductVariant : BaseEntity
{
    public Guid ProductId { get; private set; }
    public string Name { get; private set; } = null!;
    public string? SKU { get; private set; }
    public decimal Price { get; private set; }
    public decimal PriceAdjustment => Price; // Alias for Infrastructure
    public int StockQuantity { get; private set; }
    
    // JSON representing attributes like {"Size":"XL", "Color":"Blue"}
    public string? Attributes { get; private set; }

    public virtual Product Product { get; private set; } = null!;

    private ProductVariant() { } // For EF Core

    public ProductVariant(Guid productId, string name, decimal price, int stockQuantity)
    {
        ProductId = productId;
        Name = name;
        Price = price;
        StockQuantity = stockQuantity;
    }

    public void AdjustStock(int amount)
    {
        if (StockQuantity + amount < 0)
        {
            throw new InvalidOperationException("Variant stock quantity cannot be negative.");
        }
        
        StockQuantity += amount;
        UpdateTimestamp();
    }
}
