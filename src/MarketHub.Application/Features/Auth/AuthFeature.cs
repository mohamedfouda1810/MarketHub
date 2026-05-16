using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Enums;
using MarketHub.Shared;
using MarketHub.Shared.Exceptions;

namespace MarketHub.Application.Features.Auth;

// DTOs
public record LoginResponseDto(string AccessToken, string RefreshToken, string[] Errors);
public record AuthResponseDto(bool Success, string[] Errors);

// Commands & Queries
public record RegisterCustomerCommand(string Email, string Password, string FullName, string PhoneNumber) : IRequest<AuthResponseDto>;
public record RegisterVendorCommand(string Email, string Password, string FullName, string StoreName, string StoreDescription, string StoreEmail) : IRequest<AuthResponseDto>;
public record LoginCommand : IRequest<LoginResponseDto>
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
    public string IpAddress { get; init; } = string.Empty;
}
public record RefreshTokenCommand(string Token, string IpAddress) : IRequest<LoginResponseDto>;
public record ForgotPasswordCommand(string Email) : IRequest<AuthResponseDto>;
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<AuthResponseDto>;
public record ConfirmEmailCommand(string UserId, string Token) : IRequest<AuthResponseDto>;
public record ResendConfirmationEmailCommand(string Email) : IRequest<AuthResponseDto>;
public record GetCurrentUserQuery() : IRequest<UserDto>;

// Validators
public class RegisterCustomerCommandValidator : AbstractValidator<RegisterCustomerCommand>
{
    public RegisterCustomerCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.FullName).NotEmpty().MaximumLength(100);
    }
}

public class RegisterVendorCommandValidator : AbstractValidator<RegisterVendorCommand>
{
    public RegisterVendorCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(8);
        RuleFor(x => x.StoreName).NotEmpty().Length(3, 100);
    }
}

// Handlers
public class AuthHandlers : 
    IRequestHandler<RegisterCustomerCommand, AuthResponseDto>,
    IRequestHandler<RegisterVendorCommand, AuthResponseDto>,
    IRequestHandler<LoginCommand, LoginResponseDto>,
    IRequestHandler<RefreshTokenCommand, LoginResponseDto>,
    IRequestHandler<ForgotPasswordCommand, AuthResponseDto>,
    IRequestHandler<ResetPasswordCommand, AuthResponseDto>,
    IRequestHandler<ConfirmEmailCommand, AuthResponseDto>,
    IRequestHandler<ResendConfirmationEmailCommand, AuthResponseDto>,
    IRequestHandler<GetCurrentUserQuery, UserDto>
{
    private readonly IIdentityService _identityService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly IEmailService _emailService;

    public AuthHandlers(
        IIdentityService identityService,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        IEmailService emailService)
    {
        _identityService = identityService;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _emailService = emailService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCustomerCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var (success, userId, errors) = await _identityService.RegisterAsync(request.Email, request.Password, Role.Customer.ToString());
            
            if (!success)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return new AuthResponseDto(false, errors);
            }

            var customer = new Customer(userId);
            await _unitOfWork.Customers.AddAsync(customer, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            // Send Confirmation Email
            var token = await _identityService.GenerateEmailConfirmationTokenAsync(userId);
            var confirmationLink = $"http://localhost:3000/verify-email?userId={userId}&token={Uri.EscapeDataString(token)}";
            await _emailService.SendEmailAsync(request.Email, "Confirm your email", 
                $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.", true);

            return new AuthResponseDto(true, Array.Empty<string>());
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    public async Task<AuthResponseDto> Handle(RegisterVendorCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            var (success, userId, errors) = await _identityService.RegisterAsync(request.Email, request.Password, Role.Vendor.ToString());

            if (!success)
            {
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return new AuthResponseDto(false, errors);
            }

            var vendor = new Vendor(userId, request.StoreName, SlugHelper.Generate(request.StoreName), request.StoreEmail);
            await _unitOfWork.Vendors.AddAsync(vendor, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            // Send Confirmation Email
            var token = await _identityService.GenerateEmailConfirmationTokenAsync(userId);
            var confirmationLink = $"http://localhost:3000/verify-email?userId={userId}&token={Uri.EscapeDataString(token)}";
            await _emailService.SendEmailAsync(request.Email, "Confirm your email", 
                $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.", true);

            return new AuthResponseDto(true, Array.Empty<string>());
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    public async Task<LoginResponseDto> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var (success, accessToken, refreshToken, errors) = await _identityService.LoginAsync(request.Email, request.Password, request.IpAddress);
        return new LoginResponseDto(accessToken, refreshToken, errors);
    }

    public async Task<LoginResponseDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var (success, accessToken, refreshToken, errors) = await _identityService.RefreshTokenAsync(request.Token, request.IpAddress);
        return new LoginResponseDto(accessToken, refreshToken, errors);
    }

    public async Task<AuthResponseDto> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var (success, errors) = await _identityService.ForgotPasswordAsync(request.Email);
        return new AuthResponseDto(success, errors);
    }

    public async Task<AuthResponseDto> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var (success, errors) = await _identityService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
        return new AuthResponseDto(success, errors);
    }

    public async Task<AuthResponseDto> Handle(ConfirmEmailCommand request, CancellationToken cancellationToken)
    {
        var (success, errors) = await _identityService.ConfirmEmailAsync(request.UserId, request.Token);
        return new AuthResponseDto(success, errors);
    }

    public async Task<AuthResponseDto> Handle(ResendConfirmationEmailCommand request, CancellationToken cancellationToken)
    {
        var userDto = await _identityService.GetUserByEmailAsync(request.Email);
        if (userDto != null)
        {
            var userId = Guid.Parse(userDto.Id);
            var token = await _identityService.GenerateEmailConfirmationTokenAsync(userId);
            var confirmationLink = $"http://localhost:3000/verify-email?userId={userId}&token={Uri.EscapeDataString(token)}";
            await _emailService.SendEmailAsync(request.Email, "Confirm your email", 
                $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.", true);
        }
        
        // Always return true to avoid revealing account existence
        return new AuthResponseDto(true, Array.Empty<string>());
    }

    public async Task<UserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var user = await _identityService.GetUserByIdAsync(userId);
        return user ?? throw new NotFoundException("User", userId);
    }
}
