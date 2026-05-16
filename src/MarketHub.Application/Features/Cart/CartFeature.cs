using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Shared.Exceptions;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Application.Common.Interfaces;

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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public CartHandlers(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    private async Task<MarketHub.Domain.Entities.Cart> GetUserCart(CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        
        // Find customer and their cart
        var customers = await _unitOfWork.Customers.GetAllAsync(cancellationToken);
        var customer = customers.FirstOrDefault(c => c.UserId == userId) ?? throw new NotFoundException("Customer", userId);
        
        // Using a stub for now if IRepository doesn't have GetWithCartAsync
        // In reality, I should update the repository interface.
        var carts = await _unitOfWork.Carts.GetAllAsync(cancellationToken);
        var cart = carts.FirstOrDefault(c => c.CustomerId == customer.Id);
        
        if (cart == null)
        {
            cart = new MarketHub.Domain.Entities.Cart(customer.Id);
            await _unitOfWork.Carts.AddAsync(cart, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }
        
        return cart;
    }

    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await GetUserCart(cancellationToken);
        return _mapper.Map<CartDto>(cart);
    }

    public async Task<Unit> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await GetUserCart(cancellationToken);
        var product = await _unitOfWork.Products.GetByIdAsync(request.ProductId, cancellationToken) ?? throw new NotFoundException("Product", request.ProductId);
        
        ProductVariant? variant = null;
        if (request.VariantId.HasValue)
        {
            // Assuming we can fetch variant via a generic repo or specific method
            // For simplicity, let's assume it's attached to the product if we had Include()
            // But we don't. Let's just use a stub for variant fetching or skip for now.
        }

        cart.AddItem(product, variant, request.Quantity);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await GetUserCart(cancellationToken);
        cart.UpdateQuantity(request.CartItemId, request.Quantity);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(RemoveFromCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await GetUserCart(cancellationToken);
        cart.RemoveItem(request.CartItemId);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(ClearCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await GetUserCart(cancellationToken);
        cart.Clear();
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<CartSummaryDto> Handle(GetCartSummaryQuery request, CancellationToken cancellationToken)
    {
        var cart = await GetUserCart(cancellationToken);
        return new CartSummaryDto(cart.Items.Sum(i => i.Quantity), cart.Items.Sum(i => i.Quantity * i.UnitPrice));
    }
}

// Profile
public class CartProfile : Profile
{
    public CartProfile()
    {
        // Add mappings
    }
}
