using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a category specific to a vendor's store.
/// </summary>
public class StoreCategory : BaseEntity
{
    public Guid VendorId { get; private set; }
    public string Name { get; private set; } = null!;
    public string Slug { get; private set; } = null!;
    public string? Description { get; private set; }
    public string? ImageUrl { get; private set; }
    
    public Guid? ParentCategoryId { get; private set; }
    
    public virtual Vendor Vendor { get; private set; } = null!;
    public virtual StoreCategory? ParentCategory { get; private set; }

    public int DisplayOrder { get; private set; }
    public bool IsActive { get; private set; }

    private readonly List<StoreCategory> _subCategories = new();
    public IReadOnlyCollection<StoreCategory> SubCategories => _subCategories.AsReadOnly();

    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private StoreCategory() { } // For EF Core

    public StoreCategory(Guid vendorId, string name, string slug, Guid? parentCategoryId = null)
    {
        VendorId = vendorId;
        Name = name;
        Slug = slug;
        ParentCategoryId = parentCategoryId;
        DisplayOrder = 0;
        IsActive = true;
    }

    public void UpdateDetails(string name, string? description, string? imageUrl, int displayOrder)
    {
        Name = name;
        Description = description;
        ImageUrl = imageUrl;
        DisplayOrder = displayOrder;
        UpdateTimestamp();
    }
}
