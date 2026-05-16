using Hangfire.Dashboard;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.API.Filters;

public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
{
    public bool Authorize(DashboardContext context)
    {
        var httpContext = context.GetHttpContext();
        
        // In development, allow all (optional)
        // if (httpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment()) return true;

        return httpContext.User.Identity?.IsAuthenticated == true && 
               (httpContext.User.IsInRole("Admin") || httpContext.User.IsInRole("SuperAdmin"));
    }
}
