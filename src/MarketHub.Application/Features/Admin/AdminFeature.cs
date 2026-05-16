using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Features.Orders;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using MarketHub.Shared.Exceptions;

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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AdminHandlers(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<PagedList<VendorAdminDto>> Handle(AdminGetVendorsQuery request, CancellationToken cancellationToken)
    {
        var (vendors, total) = await _unitOfWork.Vendors.GetAllPagedAsync(request.PaginationParams.PageNumber, request.PaginationParams.PageSize, cancellationToken);
        var dtos = _mapper.Map<List<VendorAdminDto>>(vendors);
        return new PagedList<VendorAdminDto>(dtos, total, request.PaginationParams.PageNumber, request.PaginationParams.PageSize);
    }

    public async Task<Unit> Handle(AdminApproveVendorCommand request, CancellationToken cancellationToken)
    {
        var vendorId = Guid.Parse(request.VendorId);
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(vendorId, cancellationToken) ?? throw new NotFoundException("Vendor", vendorId);
        
        // Use a system admin ID or the current user ID
        vendor.Approve(Guid.Empty); 
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(AdminSuspendVendorCommand request, CancellationToken cancellationToken)
    {
        var vendorId = Guid.Parse(request.VendorId);
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(vendorId, cancellationToken) ?? throw new NotFoundException("Vendor", vendorId);
        
        // vendor.Suspend(); // Needs implementation in Entity
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<PagedList<OrderSummaryDto>> Handle(AdminGetAllOrdersQuery request, CancellationToken cancellationToken)
    {
        var allOrders = await _unitOfWork.Orders.GetAllAsync(cancellationToken);
        var page = request.PaginationParams.PageNumber;
        var size = request.PaginationParams.PageSize;
        var total = allOrders.Count();
        var paged = allOrders.Skip((page - 1) * size).Take(size).ToList();
        var dtos = _mapper.Map<List<OrderSummaryDto>>(paged);
        return new PagedList<OrderSummaryDto>(dtos, total, page, size);
    }

    public async Task<PlatformAnalyticsDto> Handle(AdminGetPlatformAnalyticsQuery request, CancellationToken cancellationToken)
    {
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var orders = await _unitOfWork.Orders.GetAllAsync(cancellationToken);
        var users = await _unitOfWork.Users.GetAllAsync(cancellationToken);

        var totalRevenue = orders.Where(o => o.Status != OrderStatus.Cancelled).Sum(o => o.TotalAmount);
        var activeVendors = vendors.Count(v => v.IsActive);
        var newCustomers = users.Count(u => u.Role == Role.Customer && u.CreatedAt >= request.DateFrom);

        // Simple revenue chart data (last 7 days)
        var chartData = orders
            .Where(o => o.CreatedAt >= DateTime.UtcNow.AddDays(-7))
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new { Date = g.Key.ToString("MMM dd"), Revenue = g.Sum(o => o.TotalAmount) })
            .Cast<object>()
            .ToList();

        return new PlatformAnalyticsDto(
            TotalRevenue: totalRevenue,
            TotalOrders: orders.Count,
            ActiveVendors: activeVendors,
            NewCustomers: newCustomers,
            DailyRevenueChart: chartData
        );
    }

    public Task<PagedList<object>> Handle(AdminGetWithdrawalRequestsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<object>());
    public Task<Unit> Handle(AdminApproveWithdrawalCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(AdminRejectWithdrawalCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
}

// Profile
public class AdminProfile : Profile
{
    public AdminProfile()
    {
        CreateMap<Vendor, VendorAdminDto>()
            .ForMember(d => d.Id, opt => opt.MapFrom(s => s.Id.ToString()))
            .ForMember(d => d.Email, opt => opt.MapFrom(s => s.StoreEmail))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.IsActive ? "Active" : "Pending"))
            .ForMember(d => d.RegisteredAt, opt => opt.MapFrom(s => s.CreatedAt))
            .ForMember(d => d.CommissionRate, opt => opt.MapFrom(s => 10.0m)); // Default
    }
}
