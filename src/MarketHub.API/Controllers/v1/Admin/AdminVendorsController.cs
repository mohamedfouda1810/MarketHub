using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Shared;

namespace MarketHub.API.Controllers.v1.Admin;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/vendors")]
[Authorize(Policy = "RequireAdmin")]
public class AdminVendorsController : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetVendors([FromQuery] string? search, [FromQuery] string? status, [FromQuery] PaginationParams paginationParams)
    {
        Response.Headers.Append("X-Pagination", "{\"totalCount\":50,\"pageSize\":10,\"currentPage\":1,\"totalPages\":5}");
        return OkResponse<object>(new { Items = new[] { new { Name = "Store 1", Status = "Pending" } } });
    }

    [HttpPut("{id}/approve")]
    public async Task<ActionResult<ApiResponse<object>>> ApproveVendor([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Vendor approved successfully.");
    }

    [HttpPut("{id}/suspend")]
    public async Task<ActionResult<ApiResponse<object>>> SuspendVendor([FromRoute] Guid id, [FromBody] object command)
    {
        return OkResponse<object>(new { }, "Vendor suspended successfully.");
    }
}
