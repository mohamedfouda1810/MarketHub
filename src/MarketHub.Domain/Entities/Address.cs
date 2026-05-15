using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a physical address for a customer.
/// </summary>
public class Address : BaseEntity
{
    public Guid CustomerId { get; private set; }
    public string FullName { get; private set; }
    public string PhoneNumber { get; private set; }
    public string AddressLine1 { get; private set; }
    public string? AddressLine2 { get; private set; }
    public string City { get; private set; }
    public string State { get; private set; }
    public string Country { get; private set; }
    public string PostalCode { get; private set; }
    public bool IsDefault { get; private set; }

    private Address() { } // For EF Core

    public Address(Guid customerId, string fullName, string phoneNumber, string addressLine1, string city, string state, string country, string postalCode)
    {
        CustomerId = customerId;
        FullName = fullName;
        PhoneNumber = phoneNumber;
        AddressLine1 = addressLine1;
        City = city;
        State = state;
        Country = country;
        PostalCode = postalCode;
    }

    public void SetDefault()
    {
        IsDefault = true;
        UpdateTimestamp();
    }

    public void RemoveDefault()
    {
        IsDefault = false;
        UpdateTimestamp();
    }
}
