using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Shared;

namespace MarketHub.Application.Features.Coupons;

// DTOs
public record CouponValidationDto(bool IsValid, decimal DiscountAmount, string Message);
public record CouponDto(Guid Id, string Code, decimal DiscountValue, string DiscountType, DateTime ExpiryDate, bool IsActive);

// Commands & Queries
public record ValidateCouponQuery(string Code, decimal CartTotal, Guid? VendorId) : IRequest<CouponValidationDto>;
public record CreateCouponCommand(string Code, decimal DiscountValue, string DiscountType, DateTime ExpiryDate, int? UsageLimit, Guid? VendorId) : IRequest<Guid>;
public record GetVendorCouponsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<CouponDto>>;
public record DeactivateCouponCommand(Guid CouponId) : IRequest<Unit>;

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
    IRequestHandler<CreateCouponCommand, Guid>,
    IRequestHandler<GetVendorCouponsQuery, PagedList<CouponDto>>,
    IRequestHandler<DeactivateCouponCommand, Unit>
{
    public Task<CouponValidationDto> Handle(ValidateCouponQuery request, CancellationToken cancellationToken) => Task.FromResult(new CouponValidationDto(false, 0, "Invalid coupon"));
    public Task<Guid> Handle(CreateCouponCommand request, CancellationToken cancellationToken) => Task.FromResult(Guid.NewGuid());
    public Task<PagedList<CouponDto>> Handle(GetVendorCouponsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<CouponDto>(new List<CouponDto>(), 0, 1, 10));
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
