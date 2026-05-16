using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Enums;
using MarketHub.Shared.Exceptions;

namespace MarketHub.Application.Features.Auth;

// DTOs
public record LoginResponseDto(string AccessToken, string RefreshToken, string[] Errors);
public record AuthResponseDto(bool Success, string[] Errors);

// Commands & Queries
public record RegisterCustomerCommand(string Email, string Password, string FullName, string PhoneNumber) : IRequest<AuthResponseDto>;
public record RegisterVendorCommand(string Email, string Password, string FullName, string StoreName, string StoreDescription, string StoreEmail) : IRequest<AuthResponseDto>;
public record LoginCommand(string Email, string Password, string IpAddress) : IRequest<LoginResponseDto>;
public record RefreshTokenCommand(string Token, string IpAddress) : IRequest<LoginResponseDto>;
public record ForgotPasswordCommand(string Email) : IRequest<AuthResponseDto>;
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<AuthResponseDto>;
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
    IRequestHandler<GetCurrentUserQuery, UserDto>
{
    private readonly IIdentityService _identityService;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public AuthHandlers(
        IIdentityService identityService,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService)
    {
        _identityService = identityService;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCustomerCommand request, CancellationToken cancellationToken)
    {
        var (success, userId, errors) = await _identityService.RegisterAsync(request.Email, request.Password, Role.Customer.ToString());
        
        if (success)
        {
            var customer = new Customer(userId);
            await _unitOfWork.Customers.AddAsync(customer, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new AuthResponseDto(success, errors);
    }

    public async Task<AuthResponseDto> Handle(RegisterVendorCommand request, CancellationToken cancellationToken)
    {
        var (success, userId, errors) = await _identityService.RegisterAsync(request.Email, request.Password, Role.Vendor.ToString());

        if (success)
        {
            var vendor = new Vendor(userId, request.StoreName, request.StoreName.ToLower().Replace(" ", "-"), request.StoreEmail);
            await _unitOfWork.Vendors.AddAsync(vendor, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return new AuthResponseDto(success, errors);
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

    public async Task<UserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var user = await _identityService.GetUserByIdAsync(userId);
        return user ?? throw new NotFoundException("User", userId);
    }
}
