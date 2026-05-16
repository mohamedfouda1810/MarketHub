using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Features.Products;
using MarketHub.Application.Common.Interfaces;

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
    public Task<List<StoreCategoryDto>> Handle(GetStoreCategoriesQuery request, CancellationToken cancellationToken) => Task.FromResult(new List<StoreCategoryDto>());
    public Task<PagedList<ProductDto>> Handle(GetStoreCategoryWithProductsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<ProductDto>(new List<ProductDto>(), 0, 1, 10));
    public Task<Guid> Handle(CreateStoreCategoryCommand request, CancellationToken cancellationToken) => Task.FromResult(Guid.NewGuid());
    public Task<Unit> Handle(UpdateStoreCategoryCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(DeleteStoreCategoryCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(ReorderStoreCategoriesCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
}

// Profile
public class StoreCategoryProfile : Profile
{
    public StoreCategoryProfile()
    {
        // Add mappings
    }
}
