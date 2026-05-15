using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a history record of order status changes.
/// </summary>
public class OrderStatusHistory : BaseEntity
{
    public Guid OrderId { get; private set; }
    public OrderStatus OldStatus { get; private set; }
    public OrderStatus NewStatus { get; private set; }
    public Guid ChangedByUserId { get; private set; }
    public string? Note { get; private set; }
    public DateTime ChangedAt { get; private set; }

    private OrderStatusHistory() { } // For EF Core

    internal OrderStatusHistory(Guid orderId, OrderStatus oldStatus, OrderStatus newStatus, Guid changedByUserId, string? note)
    {
        OrderId = orderId;
        OldStatus = oldStatus;
        NewStatus = newStatus;
        ChangedByUserId = changedByUserId;
        Note = note;
        ChangedAt = DateTime.UtcNow;
    }
}
