using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Caching.Distributed;
using System.Text.Json;

namespace MarketHub.API.Filters;

public class IdempotencyFilter : IAsyncActionFilter
{
    private readonly IDistributedCache _cache;

    public IdempotencyFilter(IDistributedCache cache)
    {
        _cache = cache;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.HttpContext.Request.Headers.TryGetValue("Idempotency-Key", out var keyValues))
        {
            context.Result = new BadRequestObjectResult("Idempotency-Key header is missing.");
            return;
        }

        var idempotencyKey = keyValues.ToString();
        var cacheKey = $"idempotency_{idempotencyKey}";

        var cachedResponse = await _cache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cachedResponse))
        {
            context.Result = new ContentResult
            {
                Content = cachedResponse,
                ContentType = "application/json",
                StatusCode = 200
            };
            return;
        }

        var executedContext = await next();

        if (executedContext.Result is ObjectResult objectResult)
        {
            var responseJson = JsonSerializer.Serialize(objectResult.Value);
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(24)
            };
            
            await _cache.SetStringAsync(cacheKey, responseJson, cacheOptions);
        }
    }
}
