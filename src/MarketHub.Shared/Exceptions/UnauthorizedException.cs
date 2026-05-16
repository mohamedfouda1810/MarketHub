namespace MarketHub.Shared.Exceptions;

/// <summary>
/// Exception thrown when an operation is unauthorized.
/// </summary>
public class UnauthorizedException : AppException
{
    public UnauthorizedException() : base("Unauthorized access.") { }
    public UnauthorizedException(string message) : base(message) { }
}
