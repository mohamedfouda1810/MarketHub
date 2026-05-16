using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Shared;
using MarketHub.Application.Features.Vendors;
using MarketHub.Application.Features.Products;
using MarketHub.Domain.Common;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/vendors")]
public class VendorsController : BaseController
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedList<VendorStoreDto>>>> GetVendors([FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetVendorsQuery(paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpGet("{slug}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<VendorStoreDto>>> GetVendorBySlug([FromRoute] string slug)
    {
        var result = await Mediator.Send(new GetVendorStoreQuery(slug));
        return OkResponse(result);
    }

    [HttpGet("{slug}/categories")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<object>>> GetVendorCategories([FromRoute] string slug)
    {
        // Category feature might be needed here, stub for now
        return OkResponse<object>(new[] { new { Name = "Electronics" } });
    }

    [HttpGet("{slug}/products")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedList<ProductDto>>>> GetVendorProducts([FromRoute] string slug, [FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetProductsQuery(null, new ProductFilters { VendorSlug = slug }, paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ApiResponse<Unit>>> ApproveVendor([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new ApproveVendorCommand(id));
        return OkResponse(result, "Vendor approved successfully.");
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<ActionResult<ApiResponse<Unit>>> RejectVendor([FromRoute] Guid id, [FromBody] string reason)
    {
        var result = await Mediator.Send(new RejectVendorCommand(id, reason));
        return OkResponse(result, "Vendor rejected successfully.");
    }

    [HttpGet("me/dashboard")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<DashboardDto>>> GetDashboard()
    {
        var result = await Mediator.Send(new GetVendorDashboardQuery());
        return OkResponse(result);
    }

    [HttpGet("me/earnings")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<EarningsDto>>> GetEarnings([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        var result = await Mediator.Send(new GetVendorEarningsQuery(startDate, endDate));
        return OkResponse(result);
    }

    [HttpPut("me/profile")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> UpdateProfile([FromForm] UpdateStoreProfileCommand command, IFormFile? logo, IFormFile? banner)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Profile updated successfully.");
    }

    [HttpPost("me/withdrawal")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> RequestWithdrawal([FromBody] object command)
    {
        // Withdrawal command needed
        return OkResponse(Unit.Value, "Withdrawal requested successfully.");
    }
}
