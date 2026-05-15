using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers.v1.Admin;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/admin/reviews")]
[Authorize(Policy = "RequireAdmin")]
public class AdminReviewsController : BaseController
{
    [HttpGet("pending")]
    public async Task<ActionResult<ApiResponse<object>>> GetPendingReviews()
    {
        return OkResponse<object>(new { Items = new[] { new { Id = Guid.NewGuid(), Status = "Pending" } } });
    }

    [HttpPut("{id}/approve")]
    public async Task<ActionResult<ApiResponse<object>>> ApproveReview([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Review approved successfully.");
    }

    [HttpPut("{id}/reject")]
    public async Task<ActionResult<ApiResponse<object>>> RejectReview([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Review rejected successfully.");
    }
}
