using Microsoft.AspNetCore.Identity;

namespace MarketHub.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
        public string? FullName { get; set; }
        public string? ProfilePictureUrl { get; set; }
    }

    public class ApplicationRole : IdentityRole<Guid>
    {
    }
}
