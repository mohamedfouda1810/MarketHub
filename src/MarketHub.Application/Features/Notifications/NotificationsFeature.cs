using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Models;

namespace MarketHub.Application.Features.Notifications;

// DTOs
public record NotificationDto(string Id, string Title, string Message, string Type, bool IsRead, DateTime CreatedAt);

// Commands & Queries
public record GetMyNotificationsQuery(bool? IsRead, PaginationParams PaginationParams) : IRequest<PagedList<NotificationDto>>;
public record MarkNotificationReadCommand(string NotificationId) : IRequest<Unit>;
public record MarkAllNotificationsReadCommand() : IRequest<Unit>;
public record GetUnreadNotificationCountQuery() : IRequest<int>;

// Handlers
public class NotificationHandlers : 
    IRequestHandler<GetMyNotificationsQuery, PagedList<NotificationDto>>,
    IRequestHandler<MarkNotificationReadCommand, Unit>,
    IRequestHandler<MarkAllNotificationsReadCommand, Unit>,
    IRequestHandler<GetUnreadNotificationCountQuery, int>
{
    public Task<PagedList<NotificationDto>> Handle(GetMyNotificationsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<NotificationDto>());
    public Task<Unit> Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(MarkAllNotificationsReadCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<int> Handle(GetUnreadNotificationCountQuery request, CancellationToken cancellationToken) => Task.FromResult(0);
}

// Profile
public class NotificationProfile : Profile
{
    public NotificationProfile()
    {
        // Add mappings
    }
}
