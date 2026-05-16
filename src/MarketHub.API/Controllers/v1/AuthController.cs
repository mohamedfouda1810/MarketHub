using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.Auth;
using MarketHub.Application.Common.Interfaces;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/auth")]
[Microsoft.AspNetCore.RateLimiting.EnableRateLimiting("auth")]
public class AuthController : BaseController
{
    [HttpPost("register/customer")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> RegisterCustomer([FromBody] RegisterCustomerCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success) return BadRequestResponse<AuthResponseDto>(result, "Registration failed.");
        return OkResponse(result, "Customer registered successfully.");
    }

    [HttpPost("register/vendor")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> RegisterVendor([FromBody] RegisterVendorCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success) return BadRequestResponse<AuthResponseDto>(result, "Registration failed.");
        return OkResponse(result, "Vendor registered successfully.");
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginCommand command)
    {
        // Add IP address to command
        var commandWithIp = command with { IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown" };
        var result = await Mediator.Send(commandWithIp);
        
        if (string.IsNullOrEmpty(result.AccessToken))
            return BadRequestResponse<LoginResponseDto>(result, string.Join(", ", result.Errors));

        Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(30)
        });
        
        return OkResponse(result, "Login successful.");
    }

    [HttpPost("refresh-token")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refreshToken)) return UnauthorizedResponse<LoginResponseDto>(null, "Refresh token missing.");
        
        var command = new RefreshTokenCommand(refreshToken, HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown");
        var result = await Mediator.Send(command);
        
        if (string.IsNullOrEmpty(result.AccessToken))
            return BadRequestResponse<LoginResponseDto>(result, string.Join(", ", result.Errors));

        Response.Cookies.Append("refreshToken", result.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddDays(30)
        });
        
        return OkResponse(result, "Token refreshed.");
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<Unit>>> Logout()
    {
        Response.Cookies.Delete("refreshToken");
        return OkResponse(Unit.Value, "Logged out successfully.");
    }

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> ForgotPassword([FromBody] ForgotPasswordCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "Password reset link sent if email exists.");
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> ResetPassword([FromBody] ResetPasswordCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success) return BadRequestResponse<AuthResponseDto>(result, string.Join(", ", result.Errors));
        return OkResponse(result, "Password reset successfully.");
    }

    [HttpGet("confirm-email")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> ConfirmEmail([FromQuery] string userId, [FromQuery] string token)
    {
        var result = await Mediator.Send(new ConfirmEmailCommand(userId, token));
        if (!result.Success) return BadRequestResponse<AuthResponseDto>(result, "Email confirmation failed.");
        return OkResponse(result, "Email confirmed successfully.");
    }

    [HttpPost("resend-confirmation-email")]
    [AllowAnonymous]
    public async Task<ActionResult<ApiResponse<AuthResponseDto>>> ResendConfirmationEmail([FromBody] ResendConfirmationEmailCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result, "If an account exists with that email, a new confirmation link has been sent.");
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser()
    {
        var result = await Mediator.Send(new GetCurrentUserQuery());
        return OkResponse(result);
    }
}
