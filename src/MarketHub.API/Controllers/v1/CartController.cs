using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.Cart;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/cart")]
[Authorize] // Assume Customer
public class CartController : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<CartDto>>> GetCart()
    {
        var result = await Mediator.Send(new GetCartQuery());
        return OkResponse(result);
    }

    [HttpPost("items")]
    public async Task<ActionResult<ApiResponse<Unit>>> AddItemToCart([FromBody] AddToCartCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Item added to cart.");
    }

    [HttpPut("items/{id}")]
    public async Task<ActionResult<ApiResponse<Unit>>> UpdateCartItem([FromRoute] Guid id, [FromBody] UpdateCartItemCommand command)
    {
        if (id != command.CartItemId) return BadRequestResponse<Unit>(Unit.Value, "ID mismatch.");
        var result = await Mediator.Send(command);
        return OkResponse(result, "Cart item updated.");
    }

    [HttpDelete("items/{id}")]
    public async Task<ActionResult<ApiResponse<Unit>>> RemoveItemFromCart([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new RemoveFromCartCommand(id));
        return OkResponse(result, "Item removed from cart.");
    }

    [HttpDelete]
    public async Task<ActionResult<ApiResponse<Unit>>> ClearCart()
    {
        var result = await Mediator.Send(new ClearCartCommand());
        return OkResponse(result, "Cart cleared successfully.");
    }

    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<CartSummaryDto>>> GetCartSummary()
    {
        var result = await Mediator.Send(new GetCartSummaryQuery());
        return OkResponse(result);
    }
}
