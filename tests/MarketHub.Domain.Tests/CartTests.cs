using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using FluentAssertions;

namespace MarketHub.Domain.Tests;

public class CartTests
{
    [Fact]
    public void AddItem_NewProduct_AddsItemWithCorrectPrice()
    {
        // Arrange
        var cart = new Cart(Guid.NewGuid());
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Product 1", "p1", 100m, 10);

        // Act
        cart.AddItem(product, null, 2);

        // Assert
        cart.Items.Should().HaveCount(1);
        var item = cart.Items.First();
        item.ProductId.Should().Be(product.Id);
        item.Quantity.Should().Be(2);
        item.UnitPrice.Should().Be(100m);
    }

    [Fact]
    public void AddItem_ExistingProduct_IncreasesQuantity()
    {
        // Arrange
        var cart = new Cart(Guid.NewGuid());
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Product 1", "p1", 100m, 10);
        cart.AddItem(product, null, 2);

        // Act
        cart.AddItem(product, null, 3);

        // Assert
        cart.Items.Should().HaveCount(1);
        cart.Items.First().Quantity.Should().Be(5);
    }

    [Fact]
    public void RemoveItem_ExistingItem_RemovesFromList()
    {
        // Arrange
        var cart = new Cart(Guid.NewGuid());
        var product = new Product(Guid.NewGuid(), Guid.NewGuid(), "Product 1", "p1", 100m, 10);
        cart.AddItem(product, null, 2);
        var itemId = cart.Items.First().Id;

        // Act
        cart.RemoveItem(itemId);

        // Assert
        cart.Items.Should().BeEmpty();
    }

    [Fact]
    public void Clear_WithItems_RemovesAllItems()
    {
        // Arrange
        var cart = new Cart(Guid.NewGuid());
        cart.AddItem(new Product(Guid.NewGuid(), Guid.NewGuid(), "P1", "p1", 10m, 10), null, 1);
        cart.AddItem(new Product(Guid.NewGuid(), Guid.NewGuid(), "P2", "p2", 20m, 10), null, 1);

        // Act
        cart.Clear();

        // Assert
        cart.Items.Should().BeEmpty();
    }
}
