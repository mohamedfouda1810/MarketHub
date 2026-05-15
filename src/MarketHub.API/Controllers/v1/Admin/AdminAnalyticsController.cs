using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers.v1.Admin;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/analytics")]
[Authorize(Policy = "RequireAdmin")]
public class AdminAnalyticsController : BaseController
{
    [HttpGet("platform")]
    public async Task<ActionResult<ApiResponse<object>>> GetPlatformAnalytics()
    {
        return OkResponse<object>(new 
        { 
            TotalRevenue = 100000, 
            TotalOrders = 5000, 
            TotalUsers = 10000, 
            TotalVendors = 500 
        });
    }
}
