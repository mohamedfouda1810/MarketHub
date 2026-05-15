using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using FluentAssertions;

namespace MarketHub.Domain.Tests;

public class VendorTests
{
    [Fact]
    public void Approve_WithValidAdmin_SetsActiveStatusAndApprovedAt()
    {
        // Arrange
        var vendor = new Vendor(Guid.NewGuid(), "Test Store", "test-store");
        var adminId = Guid.NewGuid();

        // Act
        vendor.Approve(adminId);

        // Assert
        vendor.Status.Should().Be(VendorStatus.Active);
        vendor.ApprovedAt.Should().NotBeNull();
        vendor.ApprovedByAdminId.Should().Be(adminId);
    }

    [Fact]
    public void Suspend_ActiveVendor_SetsSuspendedStatus()
    {
        // Arrange
        var vendor = new Vendor(Guid.NewGuid(), "Test Store", "test-store");
        vendor.Approve(Guid.NewGuid());

        // Act
        vendor.Suspend("Violation of terms");

        // Assert
        vendor.Status.Should().Be(VendorStatus.Suspended);
    }

    [Fact]
    public void AddToBalance_WithPositiveAmount_IncreasesBalance()
    {
        // Arrange
        var vendor = new Vendor(Guid.NewGuid(), "Test Store", "test-store");
        var initialBalance = vendor.BalanceAmount;
        var amountToAdd = 100m;

        // Act
        vendor.AddToBalance(amountToAdd);

        // Assert
        vendor.BalanceAmount.Should().Be(initialBalance + amountToAdd);
    }

    [Fact]
    public void DeductFromBalance_WithSufficientFunds_DecreasesBalance()
    {
        // Arrange
        var vendor = new Vendor(Guid.NewGuid(), "Test Store", "test-store");
        vendor.AddToBalance(200m);
        var initialBalance = vendor.BalanceAmount;
        var amountToDeduct = 50m;

        // Act
        vendor.DeductFromBalance(amountToDeduct);

        // Assert
        vendor.BalanceAmount.Should().Be(initialBalance - amountToDeduct);
    }

    [Fact]
    public void DeductFromBalance_WithInsufficientFunds_ThrowsInvalidOperationException()
    {
        // Arrange
        var vendor = new Vendor(Guid.NewGuid(), "Test Store", "test-store");
        vendor.AddToBalance(10m);

        // Act
        var act = () => vendor.DeductFromBalance(100m);

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Insufficient balance.");
    }
}
