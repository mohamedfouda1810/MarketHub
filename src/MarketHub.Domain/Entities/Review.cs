using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a customer review for a product.
/// </summary>
public class Review : BaseEntity
{
    public Guid ProductId { get; private set; }
    public Guid CustomerId { get; private set; }
    public Guid? OrderId { get; private set; }
    
    public int Rating { get; private set; }
    public string Title { get; private set; }
    public string Body { get; private set; }
    
    public ReviewStatus Status { get; private set; }
    public bool IsVerifiedPurchase { get; private set; }
    
    public string? VendorReply { get; private set; }
    public DateTime? VendorRepliedAt { get; private set; }

    private Review() { } // For EF Core

    public Review(Guid productId, Guid customerId, int rating, string title, string body, Guid? orderId = null)
    {
        if (rating < 1 || rating > 5) throw new ArgumentOutOfRangeException(nameof(rating), "Rating must be between 1 and 5.");

        ProductId = productId;
        CustomerId = customerId;
        OrderId = orderId;
        Rating = rating;
        Title = title;
        Body = body;
        Status = ReviewStatus.Pending;
        IsVerifiedPurchase = orderId.HasValue;
    }

    public void Approve()
    {
        Status = ReviewStatus.Approved;
        UpdateTimestamp();
    }

    public void Reject()
    {
        Status = ReviewStatus.Rejected;
        UpdateTimestamp();
    }

    public void AddVendorReply(string reply)
    {
        VendorReply = reply;
        VendorRepliedAt = DateTime.UtcNow;
        UpdateTimestamp();
    }
}
