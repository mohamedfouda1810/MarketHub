namespace MarketHub.Shared.Exceptions;

/// <summary>
/// Exception thrown when a requested resource is not found.
/// </summary>
public class NotFoundException : AppException
{
    public NotFoundException(string message) : base(message) { }
    public NotFoundException(string entityName, object key) : base($"Entity '{entityName}' with key ({key}) was not found.") { }
}
