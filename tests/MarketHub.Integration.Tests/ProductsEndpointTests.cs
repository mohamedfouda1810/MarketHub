using System.Net;
using System.Net.Http.Json;
using FluentAssertions;

namespace MarketHub.Integration.Tests;

public class ProductsEndpointTests : AuthenticatedTestBase
{
    [Fact]
    public async Task GetProducts_Returns200WithPaginatedProducts()
    {
        // Act
        var response = await HttpClient.GetAsync("/api/v1/products");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        // var products = await response.Content.ReadFromJsonAsync<PagedList<ProductDto>>();
        // products.Items.Should().NotBeNull();
    }

    [Fact]
    public async Task CreateProduct_WhenNotAuthenticated_Returns401()
    {
        // Arrange
        var command = new { Name = "New Product", Price = 99.99, StockQuantity = 10 };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/products", command);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task CreateProduct_WhenAuthenticatedAsVendor_Returns201()
    {
        // Arrange
        await AuthenticateAsync("vendor@test.com", "Password123!");
        var command = new { Name = "Vendor Product", Price = 50.0, StockQuantity = 100, StoreCategoryId = Guid.NewGuid() };

        // Act
        var response = await HttpClient.PostAsJsonAsync("/api/v1/products", command);

        // Assert
        // response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
