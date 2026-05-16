namespace MarketHub.Shared.Exceptions;

/// <summary>
/// Exception thrown when a request is invalid.
/// </summary>
public class BadRequestException : AppException
{
    public BadRequestException(string message) : base(message) { }
}
