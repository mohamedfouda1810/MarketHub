using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using MarketHub.Domain.ValueObjects;
using FluentAssertions;

namespace MarketHub.Domain.Tests;

public class OrderTests
{
    private ShippingAddress CreateTestAddress() => new("John Doe", "123456789", "123 Street", null, "City", "State", "Country", "12345");

    [Fact]
    public void Confirm_PendingOrder_SetsConfirmedStatusAndSetsConfirmedAt()
    {
        // Arrange
        var order = new Order(Guid.NewGuid(), Guid.NewGuid(), "ORD-001", CreateTestAddress(), 10m, 0m, 5m);
        var vendorUserId = Guid.NewGuid();

        // Act
        order.Confirm(vendorUserId);

        // Assert
        order.Status.Should().Be(OrderStatus.Confirmed);
        order.ConfirmedAt.Should().NotBeNull();
        order.StatusHistory.Should().ContainSingle(h => h.NewStatus == OrderStatus.Confirmed);
    }

    [Fact]
    public void Confirm_NonPendingOrder_ThrowsInvalidOperationException()
    {
        // Arrange
        var order = new Order(Guid.NewGuid(), Guid.NewGuid(), "ORD-001", CreateTestAddress(), 10m, 0m, 5m);
        order.Confirm(Guid.NewGuid());

        // Act
        var act = () => order.Confirm(Guid.NewGuid());

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Only pending orders can be confirmed.");
    }

    [Fact]
    public void Ship_ConfirmedOrder_SetsShippedStatus()
    {
        // Arrange
        var order = new Order(Guid.NewGuid(), Guid.NewGuid(), "ORD-001", CreateTestAddress(), 10m, 0m, 5m);
        var vendorUserId = Guid.NewGuid();
        order.Confirm(vendorUserId);

        // Act
        order.Ship(vendorUserId, "TRACK-123");

        // Assert
        order.Status.Should().Be(OrderStatus.Shipped);
        order.ShippedAt.Should().NotBeNull();
        order.StatusHistory.Should().Contain(h => h.NewStatus == OrderStatus.Shipped);
    }

    [Fact]
    public void Cancel_PendingOrder_SetsCancelledStatusWithReason()
    {
        // Arrange
        var order = new Order(Guid.NewGuid(), Guid.NewGuid(), "ORD-001", CreateTestAddress(), 10m, 0m, 5m);
        var customerUserId = Guid.NewGuid();
        var reason = "Changed my mind";

        // Act
        order.Cancel(reason, customerUserId);

        // Assert
        order.Status.Should().Be(OrderStatus.Cancelled);
        order.CancelReason.Should().Be(reason);
    }

    [Fact]
    public void TotalAmount_CalculatesCorrectlyWithDiscountAndShipping()
    {
        // Arrange
        var shippingAmount = 15m;
        var discountAmount = 10m;
        var taxAmount = 5m;
        var order = new Order(Guid.NewGuid(), Guid.NewGuid(), "ORD-001", CreateTestAddress(), shippingAmount, discountAmount, taxAmount);
        
        // Act
        order.AddItem(Guid.NewGuid(), null, "Product 1", null, null, 2, 50m); // Subtotal 100
        order.AddItem(Guid.NewGuid(), null, "Product 2", null, null, 1, 30m); // Subtotal 130

        // Assert
        // Total = 130 + 15 + 5 - 10 = 140
        order.TotalAmount.Should().Be(140m);
    }
}
