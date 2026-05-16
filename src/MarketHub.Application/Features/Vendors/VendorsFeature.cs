using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Enums;
using MarketHub.Shared.Exceptions;
using MarketHub.Domain.Entities;


namespace MarketHub.Application.Features.Vendors;

// DTOs
public record VendorStoreDto(
    Guid Id, 
    string StoreName, 
    string StoreSlug, 
    string? StoreDescription, 
    string? StoreLogoUrl, 
    string? StoreBannerUrl, 
    string? StoreEmail, 
    string? StorePhone, 
    int TotalProducts, 
    decimal Rating,
    int ReviewCount);
public record DashboardDto(decimal TotalSales, int TotalOrders, int PendingOrders, decimal TotalRevenue, List<object> RecentOrders, List<object> TopProducts, List<object> SalesChartData);
public record EarningsDto(decimal TotalEarnings, decimal PendingClearance, decimal AvailableForWithdrawal, List<object> Transactions);

// Queries & Commands
public record GetVendorsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<VendorStoreDto>>;
public record GetVendorStoreQuery(string StoreSlug) : IRequest<VendorStoreDto>;
public record UpdateStoreProfileCommand(string StoreName, string Description, string StoreEmail, string StorePhone) : IRequest<Unit>;
public record GetVendorDashboardQuery() : IRequest<DashboardDto>;
public record GetVendorEarningsQuery(DateTime? DateFrom, DateTime? DateTo) : IRequest<EarningsDto>;
public record ApproveVendorCommand(Guid VendorId) : IRequest<Unit>;
public record RejectVendorCommand(Guid VendorId, string Reason) : IRequest<Unit>;

// Handlers
public class VendorHandlers : 
    IRequestHandler<GetVendorsQuery, PagedList<VendorStoreDto>>,
    IRequestHandler<GetVendorStoreQuery, VendorStoreDto>,
    IRequestHandler<UpdateStoreProfileCommand, Unit>,
    IRequestHandler<GetVendorDashboardQuery, DashboardDto>,
    IRequestHandler<GetVendorEarningsQuery, EarningsDto>,
    IRequestHandler<ApproveVendorCommand, Unit>,
    IRequestHandler<RejectVendorCommand, Unit>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public VendorHandlers(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PagedList<VendorStoreDto>> Handle(GetVendorsQuery request, CancellationToken cancellationToken)
    {
        var (vendors, total) = await _unitOfWork.Vendors.GetAllPagedAsync(request.PageNumber, request.PageSize, cancellationToken);
        var dtos = _mapper.Map<List<VendorStoreDto>>(vendors);
        return new PagedList<VendorStoreDto>(dtos, total, request.PageNumber, request.PageSize);
    }

    public async Task<VendorStoreDto> Handle(GetVendorStoreQuery request, CancellationToken cancellationToken)
    {
        var vendor = await _unitOfWork.Vendors.GetBySlugAsync(request.StoreSlug, cancellationToken) ?? throw new NotFoundException("Vendor", request.StoreSlug);
        return _mapper.Map<VendorStoreDto>(vendor);
    }

    public async Task<Unit> Handle(UpdateStoreProfileCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        // Update logic
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<DashboardDto> Handle(GetVendorDashboardQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var (orders, totalOrders) = await _unitOfWork.Orders.GetByVendorIdAsync(vendor.Id, 1, 100, cancellationToken);
        var (productItems, _) = await _unitOfWork.Products.GetByVendorIdAsync(vendor.Id, 1, 100, cancellationToken);

        var totalSales = orders.Where(o => o.Status != OrderStatus.Cancelled).Sum(o => o.TotalAmount);
        var pendingOrders = orders.Count(o => o.Status == OrderStatus.Pending);
        var recentOrders = orders.OrderByDescending(o => o.CreatedAt).Take(5).ToList();
        var topProducts = productItems.OrderByDescending(p => p.Reviews.Any() ? p.Reviews.Average(r => r.Rating) : 0).Take(5).ToList();

        return new DashboardDto(
            TotalSales: totalSales,
            TotalOrders: totalOrders,
            PendingOrders: pendingOrders,
            TotalRevenue: totalSales * 0.9m,
            RecentOrders: _mapper.Map<List<object>>(recentOrders),
            TopProducts: _mapper.Map<List<object>>(topProducts),
            SalesChartData: new List<object>()
        );
    }

    public async Task<EarningsDto> Handle(GetVendorEarningsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var (orders, _) = await _unitOfWork.Orders.GetByVendorIdAsync(vendor.Id, 1, 1000, cancellationToken);

        var totalEarnings = orders.Where(o => o.Status == OrderStatus.Delivered).Sum(o => o.TotalAmount) * 0.9m;
        var pendingClearance = orders.Where(o => o.Status == OrderStatus.Shipped).Sum(o => o.TotalAmount) * 0.9m;

        return new EarningsDto(
            TotalEarnings: totalEarnings,
            PendingClearance: pendingClearance,
            AvailableForWithdrawal: vendor.BalanceAmount,
            Transactions: new List<object>()
        );
    }

    public async Task<Unit> Handle(ApproveVendorCommand request, CancellationToken cancellationToken)
    {
        var adminId = _currentUserService.UserId ?? throw new UnauthorizedException();
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(request.VendorId, cancellationToken) ?? throw new NotFoundException("Vendor", request.VendorId);
        
        vendor.Approve(adminId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(RejectVendorCommand request, CancellationToken cancellationToken)
    {
        var vendor = await _unitOfWork.Vendors.GetByIdAsync(request.VendorId, cancellationToken) ?? throw new NotFoundException("Vendor", request.VendorId);
        // Implement rejection logic if status exists
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

// Profile
public class VendorProfile : Profile
{
    public VendorProfile()
    {
        CreateMap<Vendor, VendorStoreDto>()
            .ForMember(d => d.TotalProducts, opt => opt.MapFrom(s => s.Products.Count))
            .ForMember(d => d.ReviewCount, opt => opt.MapFrom(s => s.Products.Sum(p => p.Reviews.Count)));
    }
}
