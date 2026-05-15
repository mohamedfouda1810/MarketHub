using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/coupons")]
public class CouponsController : BaseController
{
    [HttpGet("validate")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<object>>> ValidateCoupon([FromQuery] string code, [FromQuery] decimal cartTotal)
    {
        return OkResponse<object>(new { Code = code, DiscountAmount = 10, Valid = true }, "Coupon is valid.");
    }

    [HttpPost]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> CreateCoupon([FromBody] object command)
    {
        return OkResponse<object>(new { Id = Guid.NewGuid() }, "Coupon created successfully.");
    }

    [HttpGet("me")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> GetMyCoupons()
    {
        return OkResponse<object>(new { Items = new[] { new { Code = "SUMMER20" } } });
    }

    [HttpPut("{id}/deactivate")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<object>>> DeactivateCoupon([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Coupon deactivated successfully.");
    }
}
