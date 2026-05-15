namespace MarketHub.Domain.ValueObjects;

/// <summary>
/// Value object representing money.
/// </summary>
public record Money(decimal Amount, string Currency = "USD")
{
    public static Money Zero(string currency = "USD") => new(0m, currency);
}
