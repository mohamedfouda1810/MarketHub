using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Shared;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/vendors")]
public class VendorsController : BaseController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetVendors([FromQuery] PaginationParams paginationParams)
    {
        // Add X-Pagination header
        Response.Headers.Append("X-Pagination", "{\"totalCount\":100,\"pageSize\":10,\"currentPage\":1,\"totalPages\":10}");
        return OkResponse<object>(new { Items = new[] { new { Name = "Store 1" } } });
    }

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetVendorBySlug([FromRoute] string slug)
    {
        return OkResponse<object>(new { Name = "Store 1", Slug = slug });
    }

    [HttpGet("{slug}/categories")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetVendorCategories([FromRoute] string slug)
    {
        return OkResponse<object>(new[] { new { Name = "Electronics" } });
    }

    [HttpGet("{slug}/products")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetVendorProducts([FromRoute] string slug, [FromQuery] PaginationParams paginationParams)
    {
        Response.Headers.Append("X-Pagination", "{\"totalCount\":50,\"pageSize\":10,\"currentPage\":1,\"totalPages\":5}");
        return OkResponse<object>(new { Items = new[] { new { Name = "Laptop" } } });
    }

    [HttpGet("me/dashboard")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> GetDashboard()
    {
        return OkResponse<object>(new { TotalOrders = 150, Revenue = 5000 });
    }

    [HttpGet("me/earnings")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> GetEarnings([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        return OkResponse<object>(new { TotalEarnings = 4500 });
    }

    [HttpPut("me/profile")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> UpdateProfile([FromForm] object command, IFormFile? logo, IFormFile? banner)
    {
        return OkResponse<object>(new { }, "Profile updated successfully.");
    }

    [HttpPost("me/withdrawal")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> RequestWithdrawal([FromBody] object command)
    {
        return OkResponse<object>(new { }, "Withdrawal requested successfully.");
    }
}
