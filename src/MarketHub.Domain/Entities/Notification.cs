using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a system notification for a user.
/// </summary>
public class Notification : BaseEntity
{
    public Guid UserId { get; private set; }
    public string Title { get; private set; }
    public string Body { get; private set; }
    public NotificationType Type { get; private set; }
    public bool IsRead { get; private set; }
    public DateTime? ReadAt { get; private set; }
    public string? ActionUrl { get; private set; }

    private Notification() { } // For EF Core

    public Notification(Guid userId, string title, string body, NotificationType type, string? actionUrl = null)
    {
        UserId = userId;
        Title = title;
        Body = body;
        Type = type;
        ActionUrl = actionUrl;
        IsRead = false;
    }

    public void MarkAsRead()
    {
        IsRead = true;
        ReadAt = DateTime.UtcNow;
        UpdateTimestamp();
    }
}
