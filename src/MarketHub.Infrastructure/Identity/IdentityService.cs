using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MarketHub.Domain.Entities;
using MarketHub.Infrastructure.Persistence;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Identity
{
    public class IdentityService : IIdentityService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly AppDbContext _context;

        public IdentityService(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IJwtTokenService jwtTokenService,
            AppDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtTokenService = jwtTokenService;
            _context = context;
        }

        public async Task<(bool Success, Guid UserId, string[] Errors)> RegisterAsync(string email, string password, string role)
        {
            var user = new ApplicationUser { UserName = email, Email = email };
            var result = await _userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return (false, Guid.Empty, result.Errors.Select(e => e.Description).ToArray());
            }

            await _userManager.AddToRoleAsync(user, role);
            
            return (true, user.Id, Array.Empty<string>());
        }

        public async Task<(bool Success, string AccessToken, string RefreshToken, string[] Errors)> LoginAsync(string email, string password, string ipAddress)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return (false, string.Empty, string.Empty, new[] { "Invalid credentials." });
            }

            var result = await _signInManager.CheckPasswordSignInAsync(user, password, false);
            if (!result.Succeeded)
            {
                return (false, string.Empty, string.Empty, new[] { "Invalid credentials." });
            }

            // check email confirmed if required
            // if (!user.EmailConfirmed) ...

            return await GenerateTokensAsync(user, ipAddress);
        }

        public async Task<(bool Success, string AccessToken, string RefreshToken, string[] Errors)> RefreshTokenAsync(string token, string ipAddress)
        {
            var refreshToken = await _context.RefreshTokens.FirstOrDefaultAsync(x => x.Token == token);

            if (refreshToken == null || !refreshToken.IsActive)
            {
                return (false, string.Empty, string.Empty, new[] { "Invalid refresh token." });
            }

            // Revoke current refresh token
            refreshToken.IsRevoked = true;
            refreshToken.RevokedAt = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            _context.RefreshTokens.Update(refreshToken);
            await _context.SaveChangesAsync();

            var user = await _userManager.FindByIdAsync(refreshToken.UserId.ToString());
            if (user == null)
            {
                return (false, string.Empty, string.Empty, new[] { "User not found." });
            }

            return await GenerateTokensAsync(user, ipAddress);
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid userId)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Customer";

            Guid? vendorId = null;
            if (role == "Vendor")
            {
                var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == user.Id);
                vendorId = vendor?.Id;
            }

            return new UserDto(user.Id.ToString(), user.Email!, user.UserName!, role, vendorId?.ToString());
        }

        public async Task<(bool Success, string[] Errors)> ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                // Don't reveal that the user does not exist
                return (true, Array.Empty<string>());
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            // TODO: Send email with token
            
            return (true, Array.Empty<string>());
        }

        public async Task<(bool Success, string[] Errors)> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return (false, new[] { "Invalid request." });
            }

            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (!result.Succeeded)
            {
                return (false, result.Errors.Select(e => e.Description).ToArray());
            }

            return (true, Array.Empty<string>());
        }

        private async Task<(bool Success, string AccessToken, string RefreshToken, string[] Errors)> GenerateTokensAsync(ApplicationUser user, string ipAddress)
        {
            var roles = await _userManager.GetRolesAsync(user);
            
            // Check if user is a vendor
            Guid? vendorId = null;
            if (roles.Contains("Vendor"))
            {
                var vendor = await _context.Vendors.FirstOrDefaultAsync(v => v.UserId == user.Id);
                if (vendor != null) vendorId = vendor.Id;
            }

            var accessToken = _jwtTokenService.GenerateAccessToken(user, roles, vendorId);
            var refreshTokenString = _jwtTokenService.GenerateRefreshToken();

            var refreshToken = new RefreshToken
            {
                Token = refreshTokenString,
                UserId = user.Id,
                ExpiresAt = DateTime.UtcNow.AddDays(30),
                CreatedByIp = ipAddress,
                CreatedAt = DateTime.UtcNow
            };

            await _context.RefreshTokens.AddAsync(refreshToken);
            await _context.SaveChangesAsync();

            return (true, accessToken, refreshTokenString, Array.Empty<string>());
        }
    }
}