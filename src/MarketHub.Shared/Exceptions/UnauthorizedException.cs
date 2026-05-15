namespace MarketHub.Shared.Exceptions;

/// <summary>
/// Exception thrown when an operation is unauthorized.
/// </summary>
public class UnauthorizedException : AppException
{
    public UnauthorizedException(string message) : base(message) { }
}
