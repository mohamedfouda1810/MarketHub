using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a user in the system.
/// </summary>
public class User : BaseEntity
{
    public string Email { get; private set; }
    public string FullName { get; private set; }
    public string? PhoneNumber { get; private set; }
    public bool IsActive { get; private set; }
    public Role Role { get; private set; }

    private User() { } // For EF Core

    public User(string email, string fullName, Role role, string? phoneNumber = null)
    {
        Email = email;
        FullName = fullName;
        Role = role;
        PhoneNumber = phoneNumber;
        IsActive = true;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdateTimestamp();
    }

    public void Activate()
    {
        IsActive = true;
        UpdateTimestamp();
    }
}
