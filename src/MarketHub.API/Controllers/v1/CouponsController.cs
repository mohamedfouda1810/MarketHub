using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.Coupons;
using MarketHub.Shared;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/coupons")]
public class CouponsController : BaseController
{
    [HttpGet("validate")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<CouponValidationDto>>> ValidateCoupon([FromQuery] string code, [FromQuery] decimal cartTotal)
    {
        var result = await Mediator.Send(new ValidateCouponQuery(code, cartTotal, null));
        return OkResponse(result);
    }

    [HttpPost]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Guid>>> CreateCoupon([FromBody] CreateCouponCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Coupon created successfully.");
    }

    [HttpGet("me")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<PagedList<CouponDto>>>> GetMyCoupons([FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetVendorCouponsQuery(paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpPut("{id}/deactivate")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> DeactivateCoupon([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new DeactivateCouponCommand(id));
        return OkResponse(result, "Coupon deactivated successfully.");
    }
}
