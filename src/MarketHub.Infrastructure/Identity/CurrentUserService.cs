using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Identity
{
    public class CurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public Guid? UserId
        {
            get
            {
                var idString = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier) ??
                               _httpContextAccessor.HttpContext?.User?.FindFirstValue("sub") ??
                               _httpContextAccessor.HttpContext?.User?.FindFirstValue("id");
                
                if (Guid.TryParse(idString, out var id))
                    return id;
                    
                return null;
            }
        }

        public string? Email => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Email);

        public string? Role => _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.Role) ??
                               _httpContextAccessor.HttpContext?.User?.FindFirstValue("role");

        public bool IsAuthenticated => _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
    }
}
