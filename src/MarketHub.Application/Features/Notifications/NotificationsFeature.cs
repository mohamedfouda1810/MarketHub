using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;

namespace MarketHub.Application.Features.Notifications;

// DTOs
public record NotificationDto(Guid Id, string Title, string Message, string Type, bool IsRead, DateTime CreatedAt);
public record UnreadCountDto(int Count);

// Commands & Queries
public record GetMyNotificationsQuery(bool? IsRead, int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<NotificationDto>>;
public record MarkNotificationReadCommand(Guid NotificationId) : IRequest<Unit>;
public record MarkAllNotificationsReadCommand() : IRequest<Unit>;
public record GetUnreadNotificationCountQuery() : IRequest<UnreadCountDto>;

// Handlers
public class NotificationHandlers : 
    IRequestHandler<GetMyNotificationsQuery, PagedList<NotificationDto>>,
    IRequestHandler<MarkNotificationReadCommand, Unit>,
    IRequestHandler<MarkAllNotificationsReadCommand, Unit>,
    IRequestHandler<GetUnreadNotificationCountQuery, UnreadCountDto>
{
    public Task<PagedList<NotificationDto>> Handle(GetMyNotificationsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<NotificationDto>(new List<NotificationDto>(), 0, 1, 10));
    public Task<Unit> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(MarkAllNotificationsReadCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<UnreadCountDto> Handle(GetUnreadNotificationCountQuery request, CancellationToken cancellationToken) => Task.FromResult(new UnreadCountDto(0));
}

// Profile
public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        // Add mappings
    }
}
