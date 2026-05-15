namespace MarketHub.Domain.Common;

/// <summary>
/// Base class for entities that need tracking of who created/modified them.
/// </summary>
public abstract class AuditableEntity : BaseEntity
{
    public string? CreatedBy { get; set; }
    public string? UpdatedBy { get; set; }
}
