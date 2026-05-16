using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.Reviews;
using MarketHub.Shared;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/reviews")]
public class ReviewsController : BaseController
{
    [HttpGet("product/{productId}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<PagedList<ReviewDto>>>> GetProductReviews([FromRoute] Guid productId, [FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetProductReviewsQuery(productId, paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpGet("product/{productId}/summary")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<RatingSummaryDto>>> GetProductReviewSummary([FromRoute] Guid productId)
    {
        var result = await Mediator.Send(new GetProductRatingSummaryQuery(productId));
        return OkResponse(result);
    }

    [HttpPost]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<Guid>>> CreateReview([FromBody] CreateReviewCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Review submitted successfully.");
    }

    [HttpPut("{id}")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<Unit>>> UpdateReview([FromRoute] Guid id, [FromBody] UpdateReviewCommand command)
    {
        if (id != command.ReviewId) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Review updated successfully.");
    }

    [HttpDelete("{id}")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<Unit>>> DeleteReview([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new DeleteReviewCommand(id));
        return OkResponse(result, "Review deleted successfully.");
    }

    [HttpPost("{id}/vendor-reply")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> VendorReply([FromRoute] Guid id, [FromBody] VendorReplyToReviewCommand command)
    {
        if (id != command.ReviewId) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Vendor reply added successfully.");
    }
}
