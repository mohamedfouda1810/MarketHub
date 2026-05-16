using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;

namespace MarketHub.Application.Features.Cart;

// DTOs
public record CartItemDto(Guid Id, Guid ProductId, Guid? VariantId, string ProductName, string ImageUrl, decimal UnitPrice, int Quantity, decimal TotalPrice);
public record CartDto(Guid Id, List<CartItemDto> Items, decimal Subtotal, int ItemCount);
public record CartSummaryDto(int ItemCount, decimal Subtotal);

// Queries & Commands
public record GetCartQuery() : IRequest<CartDto>;
public record AddToCartCommand(Guid ProductId, Guid? VariantId, int Quantity) : IRequest<Unit>;
public record UpdateCartItemCommand(Guid CartItemId, int Quantity) : IRequest<Unit>;
public record RemoveFromCartCommand(Guid CartItemId) : IRequest<Unit>;
public record ClearCartCommand() : IRequest<Unit>;
public record GetCartSummaryQuery() : IRequest<CartSummaryDto>;

// Validators
public class AddToCartCommandValidator : AbstractValidator<AddToCartCommand>
{
    public AddToCartCommandValidator()
    {
        RuleFor(x => x.ProductId).NotEmpty();
        RuleFor(x => x.Quantity).GreaterThan(0);
    }
}

// Handlers
public class CartHandlers : 
    IRequestHandler<GetCartQuery, CartDto>,
    IRequestHandler<AddToCartCommand, Unit>,
    IRequestHandler<UpdateCartItemCommand, Unit>,
    IRequestHandler<RemoveFromCartCommand, Unit>,
    IRequestHandler<ClearCartCommand, Unit>,
    IRequestHandler<GetCartSummaryQuery, CartSummaryDto>
{
    public Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken) => Task.FromResult(new CartDto(Guid.NewGuid(), new List<CartItemDto>(), 0, 0));
    public Task<Unit> Handle(AddToCartCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(ClearCartCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<CartSummaryDto> Handle(GetCartSummaryQuery request, CancellationToken cancellationToken) => Task.FromResult(new CartSummaryDto(0, 0));
}

// Profile
public class CartProfile : Profile
{
    public CartProfile()
    {
        // Add mappings
    }
}
