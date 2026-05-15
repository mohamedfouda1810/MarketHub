using MarketHub.API.Middleware;

namespace MarketHub.API.Extensions;

public static class WebApplicationExtensions
{
    public static WebApplication UseMarketHubMiddleware(this WebApplication app)
    {
        app.UseMiddleware<ExceptionHandlingMiddleware>();
        app.UseMiddleware<RequestLoggingMiddleware>();
        return app;
    }

    public static WebApplication UseSwaggerUIConfig(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "MarketHub API v1");
        });
        return app;
    }
}
