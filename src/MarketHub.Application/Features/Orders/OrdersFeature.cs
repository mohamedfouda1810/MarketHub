using MarketHub.Domain.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using MarketHub.Domain.ValueObjects;
using MarketHub.Shared.Exceptions;

namespace MarketHub.Application.Features.Orders;

// DTOs
public record OrderSummaryDto(Guid Id, string OrderNumber, string Status, decimal TotalAmount, int ItemCount, string VendorStoreName, DateTime CreatedAt, string? TrackingNumber);
public record OrderDetailDto(Guid Id, string OrderNumber, string Status, decimal TotalAmount, List<OrderItemDto> Items, ShippingAddress ShippingAddressSnapshot, string PaymentMethod, DateTime CreatedAt);
public record OrderItemDto(Guid ProductId, string ProductName, string? ProductImage, int Quantity, decimal UnitPrice, decimal TotalPrice);
public record OrderDto(Guid Id, string OrderNumber);
public record TrackingDto(string OrderNumber, string TrackingNumber, string CarrierName, string Status, List<object> TrackingEvents);

// Commands & Queries
public record CreateOrderCommand(Guid ShippingAddressId, string PaymentMethod, string? CouponCode) : IRequest<List<OrderDto>>;
public record GetMyOrdersQuery(string? Status, int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<OrderSummaryDto>>;
public record GetOrderDetailQuery(Guid OrderId) : IRequest<OrderDetailDto>;
public record GetOrderByNumberQuery(string OrderNumber) : IRequest<OrderDetailDto>;
public record CancelOrderCommand(Guid OrderId, string Reason) : IRequest<Unit>;
public record GetVendorOrdersQuery(string? Status, DateTime? DateFrom, DateTime? DateTo, int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<OrderSummaryDto>>;
public record ConfirmOrderCommand(Guid OrderId) : IRequest<Unit>;
public record MarkOrderShippedCommand(Guid OrderId, string TrackingNumber, string? CarrierName) : IRequest<Unit>;
public record MarkOrderDeliveredCommand(Guid OrderId) : IRequest<Unit>;
public record GetOrderTrackingQuery(string OrderNumber) : IRequest<TrackingDto>, ICacheableQuery
{
    public string CacheKey => $"Tracking_{OrderNumber}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(5);
}

// Validators
public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.ShippingAddressId).NotEmpty();
        RuleFor(x => x.PaymentMethod).NotEmpty();
    }
}

// Handlers
public class OrderHandlers : 
    IRequestHandler<CreateOrderCommand, List<OrderDto>>,
    IRequestHandler<GetMyOrdersQuery, PagedList<OrderSummaryDto>>,
    IRequestHandler<GetOrderDetailQuery, OrderDetailDto>,
    IRequestHandler<GetOrderByNumberQuery, OrderDetailDto>,
    IRequestHandler<CancelOrderCommand, Unit>,
    IRequestHandler<GetVendorOrdersQuery, PagedList<OrderSummaryDto>>,
    IRequestHandler<ConfirmOrderCommand, Unit>,
    IRequestHandler<MarkOrderShippedCommand, Unit>,
    IRequestHandler<MarkOrderDeliveredCommand, Unit>,
    IRequestHandler<GetOrderTrackingQuery, TrackingDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly IMapper _mapper;

    public OrderHandlers(IUnitOfWork unitOfWork, ICurrentUserService currentUserService, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _mapper = mapper;
    }

    public async Task<List<OrderDto>> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var customers = await _unitOfWork.Customers.GetAllAsync(cancellationToken);
        var customer = customers.FirstOrDefault(c => c.UserId == userId) ?? throw new NotFoundException("Customer", userId);

        var cart = await _unitOfWork.Carts.GetByCustomerIdAsync(customer.Id, cancellationToken) ?? throw new NotFoundException("Cart", customer.Id);
        
        if (!cart.Items.Any()) throw new BadRequestException("Cannot create order from an empty cart.");

        // Fetch shipping address
        var address = await _unitOfWork.Addresses.GetByIdAsync(request.ShippingAddressId, cancellationToken) ?? throw new NotFoundException("Address", request.ShippingAddressId);
        var shippingSnapshot = new ShippingAddress(address.FullName, address.PhoneNumber, address.AddressLine1, address.AddressLine2, address.City, address.State, address.Country, address.PostalCode);

        var createdOrders = new List<OrderDto>();
        
        // Group items by Vendor
        var vendorGroups = cart.Items.GroupBy(i => i.Product.VendorId);

        await _unitOfWork.BeginTransactionAsync(cancellationToken);
        try
        {
            foreach (var group in vendorGroups)
            {
                var vendorId = group.Key;
                var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
                
                var order = new Order(customer.Id, vendorId, orderNumber, shippingSnapshot, 9.99m, 0, 0);

                foreach (var cartItem in group)
                {
                    if (cartItem.Product.StockQuantity < cartItem.Quantity)
                        throw new BadRequestException($"Insufficient stock for product: {cartItem.Product.Name}");

                    order.AddItem(cartItem.ProductId, null, cartItem.Product.Name, null, null, cartItem.Quantity, cartItem.Product.Price);
                    
                    // Reduce stock
                    cartItem.Product.AdjustStock(-cartItem.Quantity);
                }

                await _unitOfWork.Orders.AddAsync(order, cancellationToken);
                await _unitOfWork.SaveChangesAsync(cancellationToken);
                
                createdOrders.Add(new OrderDto(order.Id, order.OrderNumber));
            }

            // Clear cart
            cart.Clear();
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            
            await _unitOfWork.CommitTransactionAsync(cancellationToken);
            return createdOrders;
        }
        catch (Exception)
        {
            await _unitOfWork.RollbackTransactionAsync(cancellationToken);
            throw;
        }
    }

    public async Task<PagedList<OrderSummaryDto>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var customers = await _unitOfWork.Customers.GetAllAsync(cancellationToken);
        var customer = customers.FirstOrDefault(c => c.UserId == userId) ?? throw new NotFoundException("Customer", userId);

        var (orders, total) = await _unitOfWork.Orders.GetByCustomerIdAsync(customer.Id, request.PageNumber, request.PageSize, cancellationToken);
        var dtos = _mapper.Map<List<OrderSummaryDto>>(orders);
        
        return new PagedList<OrderSummaryDto>(dtos, total, request.PageNumber, request.PageSize);
    }

    public async Task<OrderDetailDto> Handle(GetOrderDetailQuery request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken) ?? throw new NotFoundException("Order", request.OrderId);
        return _mapper.Map<OrderDetailDto>(order);
    }

    public async Task<OrderDetailDto> Handle(GetOrderByNumberQuery request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByOrderNumberAsync(request.OrderNumber, cancellationToken) ?? throw new NotFoundException("Order", request.OrderNumber);
        return _mapper.Map<OrderDetailDto>(order);
    }

    public async Task<Unit> Handle(CancelOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken) ?? throw new NotFoundException("Order", request.OrderId);
        
        order.Cancel(request.Reason, userId);
        
        // Restore stock
        foreach (var item in order.Items)
        {
            var product = await _unitOfWork.Products.GetByIdAsync(item.ProductId, cancellationToken);
            product?.AdjustStock(item.Quantity);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<PagedList<OrderSummaryDto>> Handle(GetVendorOrdersQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var (orders, total) = await _unitOfWork.Orders.GetByVendorIdAsync(vendor.Id, request.PageNumber, request.PageSize, cancellationToken);
        var dtos = _mapper.Map<List<OrderSummaryDto>>(orders);
        
        return new PagedList<OrderSummaryDto>(dtos, total, request.PageNumber, request.PageSize);
    }

    public async Task<Unit> Handle(ConfirmOrderCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken) ?? throw new NotFoundException("Order", request.OrderId);
        
        order.Confirm(userId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(MarkOrderShippedCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken) ?? throw new NotFoundException("Order", request.OrderId);
        
        order.Ship(userId, request.TrackingNumber);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(MarkOrderDeliveredCommand request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.OrderId, cancellationToken) ?? throw new NotFoundException("Order", request.OrderId);
        // Implement logic if Status needs manual transition or automatic via tracking
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<TrackingDto> Handle(GetOrderTrackingQuery request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByOrderNumberAsync(request.OrderNumber, cancellationToken) ?? throw new NotFoundException("Order", request.OrderNumber);
        return new TrackingDto(order.OrderNumber, "TRK123456", "FedEx", order.Status.ToString(), new List<object>());
    }
}

// Profile
public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderSummaryDto>()
            .ForMember(d => d.VendorStoreName, opt => opt.MapFrom(s => s.Vendor.StoreName))
            .ForMember(d => d.ItemCount, opt => opt.MapFrom(s => s.Items.Count));

        CreateMap<Order, OrderDetailDto>();
        CreateMap<OrderItem, OrderItemDto>()
            .ForMember(d => d.ProductName, opt => opt.MapFrom(s => s.ProductNameSnapshot))
            .ForMember(d => d.ProductImage, opt => opt.MapFrom(s => s.ProductImageSnapshot));
    }
}

