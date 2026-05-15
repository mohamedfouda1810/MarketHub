using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities
{
    public class RefreshToken : BaseEntity
    {
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
        public string CreatedByIp { get; set; } = null!;
        public DateTime? RevokedAt { get; set; }
        public string? RevokedByIp { get; set; }
        public bool IsRevoked { get; set; }
        public bool IsActive => !IsRevoked && !IsExpired;

        public Guid UserId { get; set; }
    }
}
