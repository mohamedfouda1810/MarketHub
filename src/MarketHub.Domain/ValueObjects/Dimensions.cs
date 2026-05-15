namespace MarketHub.Domain.ValueObjects;

/// <summary>
/// Value object representing physical dimensions.
/// </summary>
public record Dimensions(decimal Length, decimal Width, decimal Height, string Unit = "cm");
