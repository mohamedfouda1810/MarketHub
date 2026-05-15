namespace MarketHub.Domain.Common;

/// <summary>
/// Base class for all domain events.
/// </summary>
public abstract record DomainEvent
{
    public DateTime OccurredOn { get; protected set; } = DateTime.UtcNow;
}
