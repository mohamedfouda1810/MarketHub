using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Models;

namespace MarketHub.Application.Features.Coupons;

// DTOs
public record CouponValidationDto(bool IsValid, decimal DiscountAmount, string Message);
public record CouponDto(string Id, string Code, decimal DiscountValue, string DiscountType, DateTime ExpiryDate, bool IsActive);

// Commands & Queries
public record ValidateCouponQuery(string Code, decimal CartTotal, string? VendorId) : IRequest<CouponValidationDto>;
public record CreateCouponCommand(string Code, decimal DiscountValue, string DiscountType, DateTime ExpiryDate, int? UsageLimit, string? VendorId) : IRequest<string>;
public record GetVendorCouponsQuery(PaginationParams PaginationParams) : IRequest<PagedList<CouponDto>>;
public record DeactivateCouponCommand(string CouponId) : IRequest<Unit>;

// Validators
public class CreateCouponCommandValidator : AbstractValidator<CreateCouponCommand>
{
    public CreateCouponCommandValidator()
    {
        RuleFor(x => x.Code).NotEmpty().Matches("^[A-Z0-9]{4,20}$");
        RuleFor(x => x.DiscountValue).GreaterThan(0);
    }
}

// Handlers
public class CouponHandlers : 
    IRequestHandler<ValidateCouponQuery, CouponValidationDto>,
    IRequestHandler<CreateCouponCommand, string>,
    IRequestHandler<GetVendorCouponsQuery, PagedList<CouponDto>>,
    IRequestHandler<DeactivateCouponCommand, Unit>
{
    public Task<CouponValidationDto> Handle(ValidateCouponQuery request, CancellationToken cancellationToken) => Task.FromResult(default(CouponValidationDto)!);
    public Task<string> Handle(CreateCouponCommand request, CancellationToken cancellationToken) => Task.FromResult(string.Empty);
    public Task<PagedList<CouponDto>> Handle(GetVendorCouponsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<CouponDto>());
    public Task<Unit> Handle(DeactivateCouponCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
}

// Profile
public class CouponProfile : Profile
{
    public CouponProfile()
    {
        // Add mappings
    }
}
