using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;
using MarketHub.Domain.ValueObjects;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a customer order from a specific vendor.
/// </summary>
public class Order : AuditableEntity
{
    public Guid CustomerId { get; private set; }
    public Guid VendorId { get; private set; }
    public string OrderNumber { get; private set; }
    public OrderStatus Status { get; private set; }

    public decimal SubTotal { get; private set; }
    public decimal ShippingAmount { get; private set; }
    public decimal DiscountAmount { get; private set; }
    public decimal TaxAmount { get; private set; }
    public decimal TotalAmount { get; private set; }

    public ShippingAddress ShippingAddressSnapshot { get; private set; }
    
    public string? Notes { get; private set; }
    public string? CancelReason { get; private set; }

    public DateTime? ConfirmedAt { get; private set; }
    public DateTime? ShippedAt { get; private set; }
    public DateTime? DeliveredAt { get; private set; }
    public DateTime? CancelledAt { get; private set; }

    public virtual Customer Customer { get; private set; } = null!;
    public virtual Vendor Vendor { get; private set; } = null!;
    public virtual Payment? Payment { get; private set; }

    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();

    private readonly List<OrderStatusHistory> _statusHistory = new();
    public IReadOnlyCollection<OrderStatusHistory> StatusHistory => _statusHistory.AsReadOnly();

    private Order() { } // For EF Core

    public Order(Guid customerId, Guid vendorId, string orderNumber, ShippingAddress shippingAddress, decimal shippingAmount, decimal discountAmount, decimal taxAmount)
    {
        CustomerId = customerId;
        VendorId = vendorId;
        OrderNumber = orderNumber;
        ShippingAddressSnapshot = shippingAddress;
        Status = OrderStatus.Pending;
        ShippingAmount = shippingAmount;
        DiscountAmount = discountAmount;
        TaxAmount = taxAmount;
    }

    public void AddItem(Guid productId, Guid? variantId, string productName, string? productImage, string? variantName, int quantity, decimal unitPrice)
    {
        var item = new OrderItem(Id, productId, variantId, productName, productImage, variantName, quantity, unitPrice);
        _items.Add(item);
        RecalculateTotal();
    }

    private void RecalculateTotal()
    {
        SubTotal = _items.Sum(i => i.TotalPrice);
        TotalAmount = SubTotal + ShippingAmount + TaxAmount - DiscountAmount;
    }

    public void Confirm(Guid changedByUserId)
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Only pending orders can be confirmed.");

        ChangeStatus(OrderStatus.Confirmed, changedByUserId, "Order confirmed by vendor.");
        ConfirmedAt = DateTime.UtcNow;
    }

    public void Ship(Guid changedByUserId, string trackingNumber)
    {
        if (Status != OrderStatus.Confirmed && Status != OrderStatus.Processing)
            throw new InvalidOperationException("Order must be confirmed or processing to be shipped.");

        ChangeStatus(OrderStatus.Shipped, changedByUserId, $"Order shipped. Tracking: {trackingNumber}");
        ShippedAt = DateTime.UtcNow;
    }

    public void Cancel(string reason, Guid cancelledByUserId)
    {
        if (Status == OrderStatus.Shipped || Status == OrderStatus.Delivered)
            throw new InvalidOperationException("Cannot cancel an order that has already been shipped or delivered.");

        CancelReason = reason;
        CancelledAt = DateTime.UtcNow;
        ChangeStatus(OrderStatus.Cancelled, cancelledByUserId, $"Order cancelled: {reason}");
    }

    private void ChangeStatus(OrderStatus newStatus, Guid changedByUserId, string? note = null)
    {
        var history = new OrderStatusHistory(Id, Status, newStatus, changedByUserId, note);
        _statusHistory.Add(history);
        Status = newStatus;
        UpdateTimestamp();
    }
}
