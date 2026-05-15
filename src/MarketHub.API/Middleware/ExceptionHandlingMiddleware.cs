using System.Net;
using System.Text.Json;
using MarketHub.API.Models;
using MarketHub.Shared.Exceptions;

namespace MarketHub.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";
        
        var response = new ApiResponse<object> { Success = false };
        var statusCode = (int)HttpStatusCode.InternalServerError;

        switch (exception)
        {
            case NotFoundException notFoundException:
                statusCode = (int)HttpStatusCode.NotFound;
                response.Message = notFoundException.Message;
                break;
            case ValidationException validationException:
                statusCode = (int)HttpStatusCode.UnprocessableEntity;
                response.Message = "Validation failed";
                response.Errors = validationException.Errors.SelectMany(e => e.Value);
                break;
            case UnauthorizedException unauthorizedException:
                statusCode = (int)HttpStatusCode.Unauthorized;
                response.Message = unauthorizedException.Message;
                break;
            case AppException appException:
                statusCode = (int)HttpStatusCode.BadRequest;
                response.Message = appException.Message;
                break;
            default:
                statusCode = (int)HttpStatusCode.InternalServerError;
                response.Message = "An internal server error occurred.";
                break;
        }

        context.Response.StatusCode = statusCode;
        
        var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        var result = JsonSerializer.Serialize(response, options);
        
        return context.Response.WriteAsync(result);
    }
}
