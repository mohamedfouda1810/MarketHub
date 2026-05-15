using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents an image associated with a product.
/// </summary>
public class ProductImage : BaseEntity
{
    public Guid ProductId { get; private set; }
    public string ImageUrl { get; private set; }
    public string? AltText { get; private set; }
    public int DisplayOrder { get; private set; }
    public bool IsPrimary { get; private set; }

    private ProductImage() { } // For EF Core

    public ProductImage(Guid productId, string imageUrl, bool isPrimary = false)
    {
        ProductId = productId;
        ImageUrl = imageUrl;
        IsPrimary = isPrimary;
        DisplayOrder = 0;
    }

    public void SetPrimary()
    {
        IsPrimary = true;
        UpdateTimestamp();
    }

    public void RemovePrimary()
    {
        IsPrimary = false;
        UpdateTimestamp();
    }
}
