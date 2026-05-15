using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a payment made for an order.
/// </summary>
public class Payment : BaseEntity
{
    public Guid OrderId { get; private set; }
    public decimal Amount { get; private set; }
    public string Currency { get; private set; }
    public PaymentMethod Method { get; private set; }
    public PaymentStatus Status { get; private set; }
    
    public string? TransactionId { get; private set; }
    public string? GatewayResponse { get; private set; } // JSON
    
    public DateTime? PaidAt { get; private set; }
    public DateTime? RefundedAt { get; private set; }

    private Payment() { } // For EF Core

    public Payment(Guid orderId, decimal amount, PaymentMethod method, string currency = "USD")
    {
        OrderId = orderId;
        Amount = amount;
        Method = method;
        Currency = currency;
        Status = PaymentStatus.Pending;
    }

    public void MarkAsCompleted(string transactionId, string? gatewayResponse)
    {
        Status = PaymentStatus.Completed;
        TransactionId = transactionId;
        GatewayResponse = gatewayResponse;
        PaidAt = DateTime.UtcNow;
        UpdateTimestamp();
    }

    public void MarkAsFailed(string? gatewayResponse)
    {
        Status = PaymentStatus.Failed;
        GatewayResponse = gatewayResponse;
        UpdateTimestamp();
    }

    public void Refund()
    {
        Status = PaymentStatus.Refunded;
        RefundedAt = DateTime.UtcNow;
        UpdateTimestamp();
    }
}
