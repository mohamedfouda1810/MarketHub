using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.API.Filters;
using MarketHub.Application.Features.Payments;
using MarketHub.Shared;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/payments")]
public class PaymentsController : BaseController
{
    [HttpPost("initiate")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<PaymentInitDto>>> InitiatePayment([FromBody] InitiatePaymentCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Payment intent created.");
    }

    [HttpPost("webhook/stripe")]
    [AllowAnonymous]
    [ServiceFilter(typeof(ApiKeyAuthFilter))]
    [ServiceFilter(typeof(IdempotencyFilter))]
    public async Task<IActionResult> StripeWebhook()
    {
        // Webhook processing logic
        return Ok();
    }

    [HttpPost("refund")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<Unit>>> RefundPayment([FromBody] RequestRefundCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Refund requested successfully.");
    }

    [HttpGet("history")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<PagedList<PaymentDto>>>> GetPaymentHistory([FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetPaymentHistoryQuery(paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }
}
