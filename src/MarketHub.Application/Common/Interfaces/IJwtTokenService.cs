namespace MarketHub.Application.Common.Interfaces
{
    public interface IJwtTokenService
    {
        string GenerateAccessToken(Guid userId, string email, IEnumerable<string> roles, Guid? vendorId = null);
        string GenerateRefreshToken();
    }
}
