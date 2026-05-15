using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Common;
using MarketHub.Shared;
using MarketHub.Shared.Exceptions;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Application.Features.Products;

// DTOs
public record ProductDto(Guid Id, string Name, string Slug, decimal Price, int StockQuantity, string? Description, string VendorName);

// Queries
public record GetProductsQuery(string? SearchTerm, ProductFilters? Filters, int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<ProductDto>>;
public record GetProductDetailQuery(string VendorSlug, string Slug) : IRequest<ProductDto>;

// Commands
public record CreateProductCommand(string Name, string? Description, decimal Price, int StockQuantity, Guid StoreCategoryId) : IRequest<Guid>;
public record UpdateProductCommand(Guid Id, string Name, string? Description, decimal Price, int StockQuantity) : IRequest<Unit>;
public record PublishProductCommand(Guid Id) : IRequest<Unit>;

// Handlers
public class ProductHandlers : 
    IRequestHandler<GetProductsQuery, PagedList<ProductDto>>,
    IRequestHandler<GetProductDetailQuery, ProductDto>,
    IRequestHandler<CreateProductCommand, Guid>,
    IRequestHandler<UpdateProductCommand, Unit>,
    IRequestHandler<PublishProductCommand, Unit>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public ProductHandlers(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<PagedList<ProductDto>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        var filters = request.Filters ?? new ProductFilters();
        var (items, totalCount) = await _unitOfWork.Products.SearchAsync(request.SearchTerm ?? "", filters, request.PageNumber, request.PageSize);
        var dtos = _mapper.Map<List<ProductDto>>(items);
        return new PagedList<ProductDto>(dtos, totalCount, request.PageNumber, request.PageSize);
    }

    public async Task<ProductDto> Handle(GetProductDetailQuery request, CancellationToken cancellationToken)
    {
        var products = await _unitOfWork.Products.GetAllAsync(cancellationToken);
        var product = products.FirstOrDefault(p => p.Slug == request.Slug);
        
        if (product == null) throw new NotFoundException("Product", request.Slug);
        
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var product = new Product(vendor.Id, request.StoreCategoryId, request.Name, SlugHelper.Generate(request.Name), request.Price, request.StockQuantity);
        
        await _unitOfWork.Products.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return product.Id;
    }

    public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(PublishProductCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        product.Publish();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

// Profile
public class ProductProfile : Profile
{
    public ProductProfile()
    {
        CreateMap<Product, ProductDto>();
    }
}
