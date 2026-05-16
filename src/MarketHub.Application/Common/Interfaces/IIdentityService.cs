namespace MarketHub.Application.Common.Interfaces
{
    public record UserDto(string Id, string Email, string FullName, string Role, string? VendorId, string? ProfilePictureUrl = null);

    public interface IIdentityService
    {
        Task<(bool Success, Guid UserId, string[] Errors)> RegisterAsync(string email, string password, string fullName, string role);
        Task<(bool Success, string AccessToken, string RefreshToken, string Role, string[] Errors)> LoginAsync(string email, string password, string ipAddress);
        Task<(bool Success, string AccessToken, string RefreshToken, string Role, string[] Errors)> RefreshTokenAsync(string token, string ipAddress);
        Task<UserDto?> GetUserByIdAsync(Guid userId);
        Task<(bool Success, string[] Errors)> UpdateUserAsync(Guid userId, string fullName);
        Task<(bool Success, string[] Errors)> UpdateProfilePictureAsync(Guid userId, string imageUrl);
        Task<(bool Success, string[] Errors)> ForgotPasswordAsync(string email);
        Task<(bool Success, string[] Errors)> ResetPasswordAsync(string email, string token, string newPassword);
        Task<(bool Success, string[] Errors)> ConfirmEmailAsync(string userId, string token);
        Task<string> GenerateEmailConfirmationTokenAsync(Guid userId);
        Task<UserDto?> GetUserByEmailAsync(string email);
        Task<bool> RevokeRefreshTokenAsync(string refreshToken, string ipAddress);
    }
}
