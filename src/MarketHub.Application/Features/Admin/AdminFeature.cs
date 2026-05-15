using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Models;
using MarketHub.Application.Features.Orders;

namespace MarketHub.Application.Features.Admin;

// DTOs
public record VendorAdminDto(string Id, string StoreName, string Email, string Status, DateTime RegisteredAt, decimal CommissionRate);
public record PlatformAnalyticsDto(decimal TotalRevenue, int TotalOrders, int ActiveVendors, int NewCustomers, List<object> DailyRevenueChart);

// Commands & Queries
public record AdminGetVendorsQuery(string? Status, PaginationParams PaginationParams, string? SearchTerm) : IRequest<PagedList<VendorAdminDto>>;
public record AdminApproveVendorCommand(string VendorId, decimal CommissionRate) : IRequest<Unit>;
public record AdminSuspendVendorCommand(string VendorId, string Reason) : IRequest<Unit>;
public record AdminGetAllOrdersQuery(string? Status, string? VendorId, DateTime? DateFrom, DateTime? DateTo, PaginationParams PaginationParams) : IRequest<PagedList<OrderSummaryDto>>;
public record AdminGetPlatformAnalyticsQuery(DateTime DateFrom, DateTime DateTo) : IRequest<PlatformAnalyticsDto>;
public record AdminGetWithdrawalRequestsQuery(string? Status, PaginationParams PaginationParams) : IRequest<PagedList<object>>;
public record AdminApproveWithdrawalCommand(string RequestId, string TransactionNote) : IRequest<Unit>;
public record AdminRejectWithdrawalCommand(string RequestId, string Reason) : IRequest<Unit>;

// Validators
public class AdminApproveVendorCommandValidator : AbstractValidator<AdminApproveVendorCommand>
{
    public AdminApproveVendorCommandValidator()
    {
        RuleFor(x => x.VendorId).NotEmpty();
        RuleFor(x => x.CommissionRate).InclusiveBetween(0, 100);
    }
}

// Handlers
public class AdminHandlers : 
    IRequestHandler<AdminGetVendorsQuery, PagedList<VendorAdminDto>>,
    IRequestHandler<AdminApproveVendorCommand, Unit>,
    IRequestHandler<AdminSuspendVendorCommand, Unit>,
    IRequestHandler<AdminGetAllOrdersQuery, PagedList<OrderSummaryDto>>,
    IRequestHandler<AdminGetPlatformAnalyticsQuery, PlatformAnalyticsDto>,
    IRequestHandler<AdminGetWithdrawalRequestsQuery, PagedList<object>>,
    IRequestHandler<AdminApproveWithdrawalCommand, Unit>,
    IRequestHandler<AdminRejectWithdrawalCommand, Unit>
{
    public Task<PagedList<VendorAdminDto>> Handle(AdminGetVendorsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<VendorAdminDto>());
    public Task<Unit> Handle(AdminApproveVendorCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(AdminSuspendVendorCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<PagedList<OrderSummaryDto>> Handle(AdminGetAllOrdersQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<OrderSummaryDto>());
    public Task<PlatformAnalyticsDto> Handle(AdminGetPlatformAnalyticsQuery request, CancellationToken cancellationToken) => Task.FromResult(default(PlatformAnalyticsDto)!);
    public Task<PagedList<object>> Handle(AdminGetWithdrawalRequestsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<object>());
    public Task<Unit> Handle(AdminApproveWithdrawalCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(AdminRejectWithdrawalCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
}

// Profile
public class AdminProfile : Profile
{
    public AdminProfile()
    {
        // Add mappings
    }
}
