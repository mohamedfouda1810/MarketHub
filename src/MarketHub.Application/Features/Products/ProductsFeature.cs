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
public record ProductImageDto(Guid Id, string ImageUrl, bool IsPrimary);
public record ProductDto(
    Guid Id, 
    string Name, 
    string Slug, 
    decimal Price, 
    decimal? CompareAtPrice,
    int StockQuantity, 
    string? Description, 
    string VendorName, 
    string VendorSlug,
    double Rating,
    int ReviewCount,
    List<ProductImageDto> Images);

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
public record AddProductImageCommand(Guid ProductId, string ImageUrl, bool IsPrimary = false) : IRequest<Unit>;
public record DeleteProductImageCommand(Guid ProductId, Guid ImageId) : IRequest<Unit>;

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
    IRequestHandler<DeleteProductCommand, Unit>,
    IRequestHandler<AddProductImageCommand, Unit>,
    IRequestHandler<DeleteProductImageCommand, Unit>
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

    public async Task<Unit> Handle(AddProductImageCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.ProductId, cancellationToken) ?? throw new NotFoundException("Product", request.ProductId);
        
        product.AddImage(request.ImageUrl, request.IsPrimary);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteProductImageCommand request, CancellationToken cancellationToken)
    {
        var product = await _unitOfWork.Products.GetByIdAsync(request.ProductId, cancellationToken) ?? throw new NotFoundException("Product", request.ProductId);
        
        product.RemoveImage(request.ImageId);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
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
        // Use targeted DB query — no full table scan
        var featured = await _unitOfWork.Products.GetFeaturedAsync(10, cancellationToken);
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
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var (items, totalCount) = await _unitOfWork.Products.GetByVendorIdAsync(vendor.Id, request.PageNumber, request.PageSize, cancellationToken);
        var dtos = _mapper.Map<List<ProductDto>>(items);
        return new PagedList<ProductDto>(dtos, totalCount, request.PageNumber, request.PageSize);
    }

    public async Task<Guid> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var product = new Product(vendor.Id, request.StoreCategoryId, request.Name, SlugHelper.Generate(request.Name), request.Price, request.StockQuantity);
        
        await _unitOfWork.Products.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        
        return product.Id;
    }

    public async Task<Unit> Handle(UpdateProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to update this product.");

        product.UpdateDetails(request.Name, request.Description, request.Price, request.StockQuantity, request.StoreCategoryId);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(PublishProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to publish this product.");

        product.Publish();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(ArchiveProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to archive this product.");

        product.Archive();
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(AdjustStockCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var product = await _unitOfWork.Products.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException("Product", request.Id);
        
        if (product.VendorId != vendor.Id) throw new ForbiddenException("You do not have permission to adjust stock for this product.");

        product.AdjustStock(request.Quantity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

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
        CreateMap<ProductImage, ProductImageDto>();
        CreateMap<Product, ProductDto>()
            .ForMember(d => d.VendorName, opt => opt.MapFrom(s => s.Vendor.StoreName))
            .ForMember(d => d.VendorSlug, opt => opt.MapFrom(s => s.Vendor.StoreSlug))
            .ForMember(d => d.Rating, opt => opt.MapFrom(s => s.Reviews.Any() ? s.Reviews.Average(r => r.Rating) : 0))
            .ForMember(d => d.ReviewCount, opt => opt.MapFrom(s => s.Reviews.Count))
            .ForMember(d => d.Images, opt => opt.MapFrom(s => s.Images));
    }
}
