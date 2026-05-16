using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.Orders;
using MarketHub.Shared;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/orders")]
public class OrdersController : BaseController
{
    [HttpPost("checkout")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<List<OrderDto>>>> Checkout([FromBody] CreateOrderCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Checkout completed successfully.");
    }

    [HttpGet("my")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<PagedList<OrderSummaryDto>>>> GetMyOrders([FromQuery] string? status, [FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetMyOrdersQuery(status, paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpGet("my/{orderNumber}")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<OrderDetailDto>>> GetMyOrderDetails([FromRoute] string orderNumber)
    {
        var result = await Mediator.Send(new GetOrderByNumberQuery(orderNumber));
        return OkResponse(result);
    }

    [HttpPut("my/{id}/cancel")]
    [Authorize] // Assume Customer
    public async Task<ActionResult<ApiResponse<Unit>>> CancelOrder([FromRoute] Guid id, [FromBody] CancelOrderCommand command)
    {
        if (id != command.OrderId) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Order cancelled successfully.");
    }

    [HttpGet("vendor")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<PagedList<OrderSummaryDto>>>> GetVendorOrders([FromQuery] string? status, [FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetVendorOrdersQuery(status, null, null, paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpPut("vendor/{id}/confirm")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> ConfirmOrder([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new ConfirmOrderCommand(id));
        return OkResponse(result, "Order confirmed successfully.");
    }

    [HttpPut("vendor/{id}/ship")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> ShipOrder([FromRoute] Guid id, [FromBody] MarkOrderShippedCommand command)
    {
        if (id != command.OrderId) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Order shipped successfully.");
    }

    [HttpPut("vendor/{id}/deliver")]
    [Authorize(Policy = "RequireVendor")]
    public async Task<ActionResult<ApiResponse<Unit>>> DeliverOrder([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new MarkOrderDeliveredCommand(id));
        return OkResponse(result, "Order marked as delivered.");
    }

    [HttpGet("track/{orderNumber}")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<TrackingDto>>> TrackOrder([FromRoute] string orderNumber)
    {
        var result = await Mediator.Send(new GetOrderTrackingQuery(orderNumber));
        return OkResponse(result);
    }
}
