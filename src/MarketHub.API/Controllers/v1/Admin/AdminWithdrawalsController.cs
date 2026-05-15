using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers.v1.Admin;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/withdrawals")]
[Authorize(Policy = "RequireAdmin")]
public class AdminWithdrawalsController : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetWithdrawals()
    {
        return OkResponse<object>(new { Items = new[] { new { Id = Guid.NewGuid(), Amount = 500, Status = "Pending" } } });
    }

    [HttpPut("{id}/approve")]
    public async Task<ActionResult<ApiResponse<object>>> ApproveWithdrawal([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Withdrawal approved successfully.");
    }

    [HttpPut("{id}/reject")]
    public async Task<ActionResult<ApiResponse<object>>> RejectWithdrawal([FromRoute] Guid id, [FromBody] object command)
    {
        return OkResponse<object>(new { }, "Withdrawal rejected successfully.");
    }
}
