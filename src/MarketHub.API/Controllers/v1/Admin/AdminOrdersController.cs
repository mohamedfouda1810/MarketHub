using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Shared;

namespace MarketHub.API.Controllers.v1.Admin;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/orders")]
[Authorize(Policy = "RequireAdmin")]
public class AdminOrdersController : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetAllOrders([FromQuery] string? status, [FromQuery] PaginationParams paginationParams)
    {
        Response.Headers.Append("X-Pagination", "{\"totalCount\":500,\"pageSize\":10,\"currentPage\":1,\"totalPages\":50}");
        return OkResponse<object>(new { Items = new[] { new { OrderNumber = "ORD-123", Status = "Shipped" } } });
    }
}
