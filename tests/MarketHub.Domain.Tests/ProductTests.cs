using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using FluentAssertions;

namespace MarketHub.Domain.Tests;

public class ProductTests
{
    [Fact]
    public void Publish_WithStockAboveZero_SetsActiveStatus()
    {
        // Arrange
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Test Product", "test-product", 100m, 10);

        // Act
        product.Publish();

        // Assert
        product.Status.Should().Be(ProductStatus.Active);
    }

    [Fact]
    public void Publish_WithZeroStockAndNotDigital_ThrowsInvalidOperationException()
    {
        // Arrange
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Test Product", "test-product", 100m, 0);

        // Act
        var act = () => product.Publish();

        // Assert
        act.Should().Throw<InvalidOperationException>()
            .WithMessage("Cannot publish a physical product with no stock.");
    }

    [Fact]
    public void Archive_ActiveProduct_SetsArchivedStatus()
    {
        // Arrange
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Test Product", "test-product", 100m, 10);
        product.Publish();

        // Act
        product.Archive();

        // Assert
        product.Status.Should().Be(ProductStatus.Archived);
    }

    [Fact]
    public void AdjustStock_ReducesStock_AndSetsOutOfStockStatusWhenZero()
    {
        // Arrange
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Test Product", "test-product", 100m, 5);
        product.Publish();

        // Act
        product.AdjustStock(-5);

        // Assert
        product.StockQuantity.Should().Be(0);
        product.Status.Should().Be(ProductStatus.OutOfStock);
    }

    [Fact]
    public void AdjustStock_IncreasesStock_AndSetsActiveStatusWhenAboveZero()
    {
        // Arrange
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Test Product", "test-product", 100m, 0);
        // Manually set status to OutOfStock to simulate a product that was previously active
        typeof(Product).GetProperty("Status")?.SetValue(product, ProductStatus.OutOfStock);

        // Act
        product.AdjustStock(5);

        // Assert
        product.StockQuantity.Should().Be(5);
        product.Status.Should().Be(ProductStatus.Active);
    }
}
