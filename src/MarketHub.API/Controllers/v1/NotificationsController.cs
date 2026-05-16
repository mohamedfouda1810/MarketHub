using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MarketHub.API.Models;
using MarketHub.Application.Features.Notifications;
using MarketHub.Shared;
using MediatR;

namespace MarketHub.API.Controllers.v1;

[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/notifications")]
[Authorize]
public class NotificationsController : BaseController
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<PagedList<NotificationDto>>>> GetNotifications([FromQuery] bool? isRead, [FromQuery] PaginationParams paginationParams)
    {
        var result = await Mediator.Send(new GetMyNotificationsQuery(isRead, paginationParams.PageNumber, paginationParams.PageSize));
        
        Response.Headers.Append("X-Pagination", System.Text.Json.JsonSerializer.Serialize(new 
        { 
            result.TotalCount, 
            result.PageSize, 
            result.CurrentPage, 
            result.TotalPages 
        }));

        return OkResponse(result);
    }

    [HttpGet("unread-count")]
    public async Task<ActionResult<ApiResponse<UnreadCountDto>>> GetUnreadCount()
    {
        var result = await Mediator.Send(new GetUnreadNotificationCountQuery());
        return OkResponse(result);
    }

    [HttpPut("{id}/read")]
    public async Task<ActionResult<ApiResponse<Unit>>> MarkAsRead([FromRoute] Guid id)
    {
        var result = await Mediator.Send(new MarkNotificationReadCommand(id));
        return OkResponse(result, "Notification marked as read.");
    }

    [HttpPut("read-all")]
    public async Task<ActionResult<ApiResponse<Unit>>> MarkAllAsRead()
    {
        var result = await Mediator.Send(new MarkAllNotificationsReadCommand());
        return OkResponse(result, "All notifications marked as read.");
    }
}
