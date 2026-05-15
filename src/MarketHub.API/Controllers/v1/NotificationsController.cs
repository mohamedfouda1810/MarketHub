using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/notifications")]
[Authorize]
public class NotificationsController : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<object>>> GetNotifications()
    {
        return OkResponse<object>(new { Items = new[] { new { Message = "Your order shipped." } } });
    }

    [HttpPut("{id}/read")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAsRead([FromRoute] Guid id)
    {
        return OkResponse<object>(new { }, "Notification marked as read.");
    }

    [HttpPut("read-all")]
    public async Task<ActionResult<ApiResponse<object>>> MarkAllAsRead()
    {
        return OkResponse<object>(new { }, "All notifications marked as read.");
    }
}
