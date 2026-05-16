using FluentValidation.Results;

namespace MarketHub.Application.Common.Exceptions;

public class NotFoundException : Exception
{
    public NotFoundException(string name, object key) : base($"Entity \"{name}\" ({key}) was not found.") { }
}

public class ValidationException : Exception
{
    public IEnumerable<ValidationFailure> Failures { get; }
    
    public ValidationException(IEnumerable<ValidationFailure> failures) : base("One or more validation failures have occurred.")
    {
        Failures = failures;
    }
}

public class UnauthorizedException : Exception
{
    public UnauthorizedException() : base("Unauthorized access.") { }
    public UnauthorizedException(string message) : base(message) { }
}

public class BadRequestException : Exception
{
    public BadRequestException(string message) : base(message) { }
}
