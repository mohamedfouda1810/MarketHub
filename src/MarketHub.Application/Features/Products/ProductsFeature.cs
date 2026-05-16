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
public record GetFeaturedProductsQuery() : IRequest<List<ProductDto>>, ICacheableQuery
{
    public string CacheKey => "FeaturedProducts";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(30);
}
public record GetProductDetailQuery(string VendorSlug, string Slug) : IRequest<ProductDto>, ICacheableQuery
{
    public string CacheKey => $"ProductDetail_{VendorSlug}_{Slug}";
    public TimeSpan? Expiration => TimeSpan.FromMinutes(10);
}
public record GetVendorProductsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<ProductDto>>;

// Commands
public record CreateProductCommand(string Name, string? Description, decimal Price, int StockQuantity, Guid StoreCategoryId) : IRequest<Guid>;
public record UpdateProductCommand(Guid Id, string Name, string? Description, decimal Price, int StockQuantity, Guid StoreCategoryId) : IRequest<Unit>;
public record PublishProductCommand(Guid Id) : IRequest<Unit>;
public record ArchiveProductCommand(Guid Id) : IRequest<Unit>;
public record AdjustStockCommand(Guid Id, int Quantity) : IRequest<Unit>;
public record DeleteProductCommand(Guid Id) : IRequest<Unit>;

// Handlers
public class ProductHandlers : 
    IRequestHandler<GetProductsQuery, PagedList<ProductDto>>,
    IRequestHandler<GetFeaturedProductsQuery, List<ProductDto>>,
    IRequestHandler<GetProductDetailQuery, ProductDto>,
    IRequestHandler<GetVendorProductsQuery, PagedList<ProductDto>>,
    IRequestHandler<CreateProductCommand, Guid>,
    IRequestHandler<UpdateProductCommand, Unit>,
    IRequestHandler<PublishProductCommand, Unit>,
    IRequestHandler<ArchiveProductCommand, Unit>,
    IRequestHandler<AdjustStockCommand, Unit>,
    IRequestHandler<DeleteProductCommand, Unit>
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

    public async Task<List<ProductDto>> Handle(GetFeaturedProductsQuery request, CancellationToken cancellationToken)
    {
        // Assuming featured products are those with high rating or flagged (stub for now)
        var products = await _unitOfWork.Products.GetAllAsync(cancellationToken);
        var featured = products.Take(10).ToList(); 
        return _mapper.Map<List<ProductDto>>(featured);
    }

    public async Task<ProductDto> Handle(GetProductDetailQuery request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetBySlugAsync(request.VendorSlug, request.Slug, cancellationToken);
        
        if (product == null) throw new NotFoundException("Product", request.Slug);
        
        return _mapper.Map<ProductDto>(product);
    }

    public async Task<PagedList<ProductDto>> Handle(GetVendorProductsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var (items, totalCount) = await _unitOfWork.Products.GetByVendorIdAsync(vendor.Id, request.PageNumber, request.PageSize, cancellationToken);
        var dtos = _mapper.Map<List<ProductDto>>(items);
        return new PagedList<ProductDto>(dtos, totalCount, request.PageNumber, request.PageSize);
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
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to update this product.");

        product.UpdateDetails(request.Name, request.Description, request.Price, request.StockQuantity, request.StoreCategoryId);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(PublishProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to publish this product.");

        product.Publish();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(ArchiveProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to archive this product.");

        product.Archive();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to adjust stock for this product.");

        product.AdjustStock(request.Quantity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendors = await _unitOfWork.Vendors.GetAllAsync(cancellationToken);
        var vendor = vendors.FirstOrDefault(v => v.UserId == userId) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to delete this product.");

        await _unitOfWork.Products.DeleteAsync(product, cancellationToken);
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
