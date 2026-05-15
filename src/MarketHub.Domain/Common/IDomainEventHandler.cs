namespace MarketHub.Domain.Common;

/// <summary>
/// Interface for domain event handlers.
/// </summary>
public interface IDomainEventHandler<in T> where T : DomainEvent
{
    Task HandleAsync(T domainEvent, CancellationToken cancellationToken = default);
}
