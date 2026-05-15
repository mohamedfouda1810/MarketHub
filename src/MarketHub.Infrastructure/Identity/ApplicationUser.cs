using Microsoft.AspNetCore.Identity;

namespace MarketHub.Infrastructure.Identity
{
    public class ApplicationUser : IdentityUser<Guid>
    {
    }

    public class ApplicationRole : IdentityRole<Guid>
    {
    }
}
