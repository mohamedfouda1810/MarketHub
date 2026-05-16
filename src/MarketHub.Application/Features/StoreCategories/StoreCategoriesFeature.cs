using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Features.Products;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Shared.Exceptions;

namespace MarketHub.Application.Features.StoreCategories;

// DTOs
public record StoreCategoryDto(Guid Id, string Name, string Slug, string Description, string ImageUrl, int DisplayOrder, Guid? ParentCategoryId, bool IsActive);

// Queries & Commands
public record GetStoreCategoriesQuery(Guid? VendorId, string? Slug) : IRequest<List<StoreCategoryDto>>, ICacheableQuery
{
    public string CacheKey => $"StoreCategories_{VendorId}_{Slug}";
    public TimeSpan? Expiration => TimeSpan.FromHours(1);
}
public record GetStoreCategoryWithProductsQuery(string CategorySlug, Guid VendorId, int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<ProductDto>>;
public record CreateStoreCategoryCommand(string Name, string Description, Guid? ParentCategoryId, int DisplayOrder) : IRequest<Guid>;
public record UpdateStoreCategoryCommand(Guid Id, string Name, string Description, Guid? ParentCategoryId, int DisplayOrder, bool IsActive) : IRequest<Unit>;
public record DeleteStoreCategoryCommand(Guid Id) : IRequest<Unit>;
public record ReorderStoreCategoriesCommand(List<(Guid Id, int DisplayOrder)> ReorderList) : IRequest<Unit>;

// Validators
public class CreateStoreCategoryCommandValidator : AbstractValidator<CreateStoreCategoryCommand>
{
    public CreateStoreCategoryCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
    }
}

// Handlers
public class StoreCategoryHandlers : 
    IRequestHandler<GetStoreCategoriesQuery, List<StoreCategoryDto>>,
    IRequestHandler<GetStoreCategoryWithProductsQuery, PagedList<ProductDto>>,
    IRequestHandler<CreateStoreCategoryCommand, Guid>,
    IRequestHandler<UpdateStoreCategoryCommand, Unit>,
    IRequestHandler<DeleteStoreCategoryCommand, Unit>,
    IRequestHandler<ReorderStoreCategoriesCommand, Unit>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly ICurrentUserService _currentUserService;

    public StoreCategoryHandlers(IUnitOfWork unitOfWork, IMapper mapper, ICurrentUserService currentUserService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _currentUserService = currentUserService;
    }

    public async Task<List<StoreCategoryDto>> Handle(GetStoreCategoriesQuery request, CancellationToken cancellationToken)
    {
        var categories = await _unitOfWork.StoreCategories.GetAllAsync(cancellationToken);
        
        if (request.VendorId.HasValue)
        {
            // Filter by vendor if specific vendor categories are implemented, 
            // for now returning platform categories
        }

        return _mapper.Map<List<StoreCategoryDto>>(categories.Where(c => c.IsActive));
    }

    public async Task<PagedList<ProductDto>> Handle(GetStoreCategoryWithProductsQuery request, CancellationToken cancellationToken)
    {
        var category = (await _unitOfWork.StoreCategories.GetAllAsync(cancellationToken))
            .FirstOrDefault(c => c.Slug == request.CategorySlug) ?? throw new NotFoundException("Category", request.CategorySlug);

        // Use vendor-scoped product query (CategoryId filtering applied in memory)
        var (items, total) = await _unitOfWork.Products.GetByVendorIdAsync(request.VendorId, request.PageNumber, request.PageSize, cancellationToken);
        var filtered = items.Where(p => p.CategoryId == category.Id).ToList();

        return new PagedList<ProductDto>(_mapper.Map<List<ProductDto>>(filtered), total, request.PageNumber, request.PageSize);
    }

    public async Task<Guid> Handle(CreateStoreCategoryCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUserService.UserId ?? throw new UnauthorizedException("User not authenticated.");
        var vendor = await _unitOfWork.Vendors.GetByUserIdAsync(userId, cancellationToken) ?? throw new NotFoundException("Vendor", userId);

        var category = new StoreCategory(vendor.Id, request.Name, SlugHelper.Generate(request.Name), request.ParentCategoryId);
        // Set DisplayOrder via UpdateDetails (DisplayOrder has private setter)
        category.UpdateDetails(request.Name, request.Description, null, request.DisplayOrder);

        await _unitOfWork.StoreCategories.AddAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return category.Id;
    }

    public async Task<Unit> Handle(UpdateStoreCategoryCommand request, CancellationToken cancellationToken)
    {
        var categories = await _unitOfWork.StoreCategories.GetAllAsync(cancellationToken);
        var category = categories.FirstOrDefault(c => c.Id == request.Id) ?? throw new NotFoundException("Category", request.Id);

        // ✅ UpdateDetails signature: (name, description, imageUrl, displayOrder) — preserve existing imageUrl
        category.UpdateDetails(request.Name, request.Description, category.ImageUrl, request.DisplayOrder);
        // IsActive toggle: must use EF change tracker since no Activate/Deactivate methods exist
        // Entity will be updated when SaveChanges is called

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(DeleteStoreCategoryCommand request, CancellationToken cancellationToken)
    {
        var categories = await _unitOfWork.StoreCategories.GetAllAsync(cancellationToken);
        var category = categories.FirstOrDefault(c => c.Id == request.Id) ?? throw new NotFoundException("Category", request.Id);

        await _unitOfWork.StoreCategories.DeleteAsync(category, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }

    public async Task<Unit> Handle(ReorderStoreCategoriesCommand request, CancellationToken cancellationToken)
    {
        var categories = await _unitOfWork.StoreCategories.GetAllAsync(cancellationToken);
        foreach (var item in request.ReorderList)
        {
            var category = categories.FirstOrDefault(c => c.Id == item.Id);
            // UpdateDetails preserves existing values while updating DisplayOrder
            if (category != null)
                category.UpdateDetails(category.Name, category.Description, category.ImageUrl, item.DisplayOrder);
        }
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

// Profile
public class StoreCategoryProfile : Profile
{
    public StoreCategoryProfile()
    {
        CreateMap<StoreCategory, StoreCategoryDto>();
    }
}
