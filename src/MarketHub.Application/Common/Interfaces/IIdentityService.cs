namespace MarketHub.Application.Common.Interfaces
{
    public record UserDto(string Id, string Email, string FullName, string Role, string? VendorId);

    public interface IIdentityService
    {
        Task<(bool Success, Guid UserId, string[] Errors)> RegisterAsync(string email, string password, string role);
        Task<(bool Success, string AccessToken, string RefreshToken, string[] Errors)> LoginAsync(string email, string password, string ipAddress);
        Task<(bool Success, string AccessToken, string RefreshToken, string[] Errors)> RefreshTokenAsync(string token, string ipAddress);
        Task<UserDto?> GetUserByIdAsync(Guid userId);
        Task<(bool Success, string[] Errors)> ForgotPasswordAsync(string email);
        Task<(bool Success, string[] Errors)> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
