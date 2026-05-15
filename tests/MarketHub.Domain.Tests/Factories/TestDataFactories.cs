using Bogus;
using MarketHub.Domain.Entities;
using MarketHub.Domain.ValueObjects;

namespace MarketHub.Domain.Tests.Factories;

public static class TestDataFactories
{
    public static Faker<Vendor> VendorFactory => new Faker<Vendor>()
        .CustomInstantiator(f => new Vendor(
            Guid.NewGuid(),
            f.Company.CompanyName(),
            f.Internet.DomainWord(),
            f.Internet.Email()
        ));

    public static Faker<Product> ProductFactory(Guid vendorId, Guid categoryId) => new Faker<Product>()
        .CustomInstantiator(f => new Product(
            vendorId,
            categoryId,
            f.Commerce.ProductName(),
            f.Internet.DomainWord(),
            decimal.Parse(f.Commerce.Price()),
            f.Random.Number(1, 100)
        ));

    public static Faker<Order> OrderFactory(Guid customerId, Guid vendorId) => new Faker<Order>()
        .CustomInstantiator(f => new Order(
            customerId,
            vendorId,
            $"ORD-{f.Random.Number(1000, 9999)}",
            new ShippingAddress(
                f.Name.FullName(),
                f.Phone.PhoneNumber(),
                f.Address.StreetAddress(),
                null,
                f.Address.City(),
                f.Address.State(),
                f.Address.Country(),
                f.Address.ZipCode()
            ),
            10m,
            0m,
            5m
        ));
}
