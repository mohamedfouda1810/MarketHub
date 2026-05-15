using MediatR;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
    private IMediator? _mediator;
    protected IMediator Mediator => _mediator ??= HttpContext.RequestServices.GetRequiredService<IMediator>();

    protected ActionResult<ApiResponse<T>> OkResponse<T>(T data, string? message = null)
    {
        return Ok(ApiResponse<T>.Ok(data, message));
    }

    protected ActionResult<ApiResponse<T>> BadRequestResponse<T>(T data, string message)
    {
        return BadRequest(ApiResponse<T>.Error(message, data));
    }

    protected ActionResult<ApiResponse<T>> UnauthorizedResponse<T>(T? data, string message)
    {
        return Unauthorized(ApiResponse<T>.Error(message, data));
    }

    protected ActionResult<ApiResponse<T>> NotFoundResponse<T>(string message)
    {
        return NotFound(ApiResponse<T>.Error(message));
    }
}
