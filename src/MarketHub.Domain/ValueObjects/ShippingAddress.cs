namespace MarketHub.Domain.ValueObjects;

/// <summary>
/// Value object representing a snapshot of a shipping address.
/// </summary>
public record ShippingAddress(
    string FullName, 
    string PhoneNumber, 
    string Street, 
    string? Street2, 
    string City, 
    string State, 
    string Country, 
    string ZipCode);
