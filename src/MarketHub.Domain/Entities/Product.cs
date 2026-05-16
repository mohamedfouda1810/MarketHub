using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;
using MarketHub.Domain.ValueObjects;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a product sold by a vendor.
/// </summary>
public class Product : AuditableEntity
{
    public Guid VendorId { get; private set; }
    public Guid StoreCategoryId { get; private set; }
    public Guid CategoryId => StoreCategoryId; // Alias for Infrastructure
    
    public string Name { get; private set; }
    public string Slug { get; private set; }
    public string? Description { get; private set; }
    public string? ShortDescription { get; private set; }
    
    public decimal Price { get; private set; }
    public decimal? CompareAtPrice { get; private set; }
    
    public int StockQuantity { get; private set; }
    public int LowStockThreshold { get; private set; } = 5;
    
    public string? SKU { get; private set; }
    public string? Barcode { get; private set; }
    
    public ProductStatus Status { get; private set; }
    public bool IsFeatured { get; private set; }
    public bool IsDigital { get; private set; }
    
    public decimal? Weight { get; private set; }
    public Dimensions? Dimensions { get; private set; }

    public virtual Vendor Vendor { get; private set; } = null!;
    public virtual StoreCategory Category { get; private set; } = null!;

    private readonly List<ProductImage> _images = new();
    public IReadOnlyCollection<ProductImage> Images => _images.AsReadOnly();

    private readonly List<ProductVariant> _variants = new();
    public IReadOnlyCollection<ProductVariant> Variants => _variants.AsReadOnly();

    private readonly List<Review> _reviews = new();
    public IReadOnlyCollection<Review> Reviews => _reviews.AsReadOnly();

    private Product() { } // For EF Core

    public Product(Guid vendorId, Guid storeCategoryId, string name, string slug, decimal price, int stockQuantity)
    {
        VendorId = vendorId;
        StoreCategoryId = storeCategoryId;
        Name = name;
        Slug = slug;
        Price = price;
        StockQuantity = stockQuantity;
        Status = ProductStatus.Draft;
    }

    /// <summary>
    /// Publishes the product.
    /// </summary>
    public void Publish()
    {
        if (StockQuantity <= 0 && !IsDigital)
        {
            throw new InvalidOperationException("Cannot publish a physical product with no stock.");
        }
        
        Status = ProductStatus.Active;
        UpdateTimestamp();
    }

    /// <summary>
    /// Archives the product.
    /// </summary>
    public void Archive()
    {
        Status = ProductStatus.Archived;
        UpdateTimestamp();
    }

    /// <summary>
    /// Adjusts the stock quantity.
    /// </summary>
    public void AdjustStock(int amount)
    {
        if (StockQuantity + amount < 0)
        {
            throw new InvalidOperationException("Stock quantity cannot be negative.");
        }

        StockQuantity += amount;
        
        if (StockQuantity == 0 && Status == ProductStatus.Active && !IsDigital)
        {
            Status = ProductStatus.OutOfStock;
        }
        else if (StockQuantity > 0 && Status == ProductStatus.OutOfStock)
        {
            Status = ProductStatus.Active;
        }

        UpdateTimestamp();
    }

    public void UpdateDetails(string name, string? description, decimal price, int stockQuantity, Guid storeCategoryId)
    {
        Name = name;
        Description = description;
        Price = price;
        StockQuantity = stockQuantity;
        StoreCategoryId = storeCategoryId;
        UpdateTimestamp();
    }
}
