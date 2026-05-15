using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a discount coupon.
/// </summary>
public class Coupon : AuditableEntity
{
    public Guid? VendorId { get; private set; } // Null if platform-wide
    public string Code { get; private set; } = null!;
    public CouponType Type { get; private set; }
    public decimal Value { get; private set; }
    public decimal DiscountAmount => Value; // Alias for Infrastructure
    
    public decimal? MinOrderAmount { get; private set; }
    public decimal? MaxDiscountAmount { get; private set; }
    
    public int? UsageLimit { get; private set; }
    public int UsedCount { get; private set; }
    
    public DateTime? ExpiresAt { get; private set; }
    public bool IsActive { get; private set; }

    public virtual Vendor? Vendor { get; private set; }

    private Coupon() { } // For EF Core

    public Coupon(string code, CouponType type, decimal value, Guid? vendorId = null)
    {
        Code = code.ToUpperInvariant();
        Type = type;
        Value = value;
        VendorId = vendorId;
        IsActive = true;
        UsedCount = 0;
    }

    public void RecordUsage()
    {
        if (!IsActive) throw new InvalidOperationException("Coupon is not active.");
        if (ExpiresAt.HasValue && ExpiresAt.Value < DateTime.UtcNow) throw new InvalidOperationException("Coupon has expired.");
        if (UsageLimit.HasValue && UsedCount >= UsageLimit.Value) throw new InvalidOperationException("Coupon usage limit reached.");

        UsedCount++;
        UpdateTimestamp();
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }
}
