using Microsoft.AspNetCore.SignalR;
using MarketHub.Infrastructure.Persistence;
using MarketHub.Domain.Entities;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Services
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.UserIdentifier;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }

    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly AppDbContext _context;

        public NotificationService(IHubContext<NotificationHub> hubContext, AppDbContext context)
        {
            _hubContext = hubContext;
            _context = context;
        }

        public async Task SendToUserAsync(Guid userId, string title, string message, string type, string? referenceId = null)
        {
            // First save to database
            var notification = new Notification(userId, title, message, Enum.Parse<MarketHub.Domain.Enums.NotificationType>(type), referenceId);

            await _context.Set<Notification>().AddAsync(notification);
            await _context.SaveChangesAsync();

            // Then send real-time update
            await _hubContext.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", new
            {
                Id = notification.Id,
                Title = title,
                Message = message,
                Type = type,
                ReferenceId = referenceId,
                CreatedAt = notification.CreatedAt
            });
        }

        public async Task SendToVendorAsync(Guid vendorId, string title, string message, string type, string? referenceId = null)
        {
            // Lookup user ID for this vendor
            var vendor = await _context.Vendors.FindAsync(vendorId);
            if (vendor != null)
            {
                await SendToUserAsync(vendor.UserId, title, message, type, referenceId);
            }
        }
    }
}