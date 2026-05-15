using System.Diagnostics;
using Serilog.Context;

namespace MarketHub.API.Middleware;

public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = Guid.NewGuid().ToString();
        context.Response.Headers.Append("X-Correlation-Id", correlationId);

        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            var sw = Stopwatch.StartNew();
            
            try
            {
                await _next(context);
            }
            finally
            {
                sw.Stop();
                var userId = context.User?.Identity?.IsAuthenticated == true 
                    ? context.User.Claims.FirstOrDefault(c => c.Type == "id")?.Value 
                    : "Anonymous";

                _logger.LogInformation(
                    "HTTP {RequestMethod} {RequestPath} responded {StatusCode} in {Elapsed:0.0000} ms. User: {UserId}, IP: {IpAddress}",
                    context.Request.Method,
                    context.Request.Path,
                    context.Response.StatusCode,
                    sw.ElapsedMilliseconds,
                    userId,
                    context.Connection.RemoteIpAddress?.ToString());
            }
        }
    }
}
