using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a vendor (store) on the platform.
/// </summary>
public class Vendor : AuditableEntity
{
    public Guid UserId { get; private set; }
    public string StoreName { get; private set; } = null!;
    public string StoreSlug { get; private set; } = null!;
    public string? StoreDescription { get; private set; }
    public string? StoreLogoUrl { get; private set; }
    public string? StoreBannerUrl { get; private set; }
    public string? StoreEmail { get; private set; }
    public string? StorePhone { get; private set; }
    
    public VendorStatus Status { get; private set; }
    public decimal CommissionRate { get; private set; }
    public decimal BalanceAmount { get; private set; }
    public decimal Rating { get; set; }
    
    public DateTime? ApprovedAt { get; private set; }
    public Guid? ApprovedByAdminId { get; private set; }
    
    public bool IsActive => Status == VendorStatus.Active && !IsDeleted;

    public virtual User User { get; private set; } = null!;

    private readonly List<StoreCategory> _categories = new();
    public IReadOnlyCollection<StoreCategory> Categories => _categories.AsReadOnly();

    private readonly List<Product> _products = new();
    public IReadOnlyCollection<Product> Products => _products.AsReadOnly();

    private readonly List<Order> _orders = new();
    public IReadOnlyCollection<Order> Orders => _orders.AsReadOnly();

    private readonly List<WithdrawalRequest> _withdrawalRequests = new();
    public IReadOnlyCollection<WithdrawalRequest> WithdrawalRequests => _withdrawalRequests.AsReadOnly();

    private Vendor() { } // For EF Core

    public Vendor(Guid userId, string storeName, string storeSlug, string? storeEmail = null)
    {
        UserId = userId;
        StoreName = storeName;
        StoreSlug = storeSlug;
        StoreEmail = storeEmail;
        Status = VendorStatus.Pending;
        CommissionRate = 10m; // Default 10%
        BalanceAmount = 0m;
    }

    public void Approve(Guid adminId)
    {
        Status = VendorStatus.Active;
        ApprovedAt = DateTime.UtcNow;
        ApprovedByAdminId = adminId;
        UpdateTimestamp();
    }

    public void Suspend(string reason)
    {
        Status = VendorStatus.Suspended;
        UpdateTimestamp();
    }
    
    public void AddToBalance(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive", nameof(amount));
        BalanceAmount += amount;
        UpdateTimestamp();
    }

    public void DeductFromBalance(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive", nameof(amount));
        if (BalanceAmount < amount) throw new InvalidOperationException("Insufficient balance.");
        BalanceAmount -= amount;
        UpdateTimestamp();
    }
}
