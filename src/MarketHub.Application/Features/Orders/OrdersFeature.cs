using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Application.Features.Orders;

// DTOs
public record OrderSummaryDto(string OrderNumber, string Status, decimal TotalAmount, int ItemCount, string VendorStoreName, DateTime CreatedAt, string? TrackingNumber);
public record OrderDetailDto(Guid Id, string OrderNumber, string Status, decimal TotalAmount, List<object> Items, object ShippingAddress, string PaymentMethod, DateTime CreatedAt);
public record OrderDto(Guid Id, string OrderNumber);
public record TrackingDto(string OrderNumber, string TrackingNumber, string CarrierName, string Status, List<object> TrackingEvents);

// Commands & Queries
public record CreateOrderCommand(Guid CartId, Guid ShippingAddressId, string PaymentMethod, string? CouponCode) : IRequest<OrderDto>;
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
        RuleFor(x => x.CartId).NotEmpty();
        RuleFor(x => x.ShippingAddressId).NotEmpty();
        RuleFor(x => x.PaymentMethod).NotEmpty();
    }
}

// Handlers
public class OrderHandlers : 
    IRequestHandler<CreateOrderCommand, OrderDto>,
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
    public Task<OrderDto> Handle(CreateOrderCommand request, CancellationToken cancellationToken) => Task.FromResult(new OrderDto(Guid.NewGuid(), "ORD-TEMP"));
    public Task<PagedList<OrderSummaryDto>> Handle(GetMyOrdersQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<OrderSummaryDto>(new List<OrderSummaryDto>(), 0, 1, 10));
    public Task<OrderDetailDto> Handle(GetOrderDetailQuery request, CancellationToken cancellationToken) => Task.FromResult(default(OrderDetailDto)!);
    public Task<OrderDetailDto> Handle(GetOrderByNumberQuery request, CancellationToken cancellationToken) => Task.FromResult(default(OrderDetailDto)!);
    public Task<Unit> Handle(CancelOrderCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<PagedList<OrderSummaryDto>> Handle(GetVendorOrdersQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<OrderSummaryDto>(new List<OrderSummaryDto>(), 0, 1, 10));
    public Task<Unit> Handle(ConfirmOrderCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(MarkOrderShippedCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(MarkOrderDeliveredCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<TrackingDto> Handle(GetOrderTrackingQuery request, CancellationToken cancellationToken) => Task.FromResult(new TrackingDto(request.OrderNumber, "", "", "", new List<object>()));
}

// Profile
public class OrderProfile : Profile
{
    public OrderProfile()
    {
        // Add mappings
    }
}
