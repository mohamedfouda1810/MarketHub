using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Models;
using MarketHub.Application.Features.Products;

namespace MarketHub.Application.Features.StoreCategories;

// DTOs
public record StoreCategoryDto(string Id, string Name, string Slug, string Description, string ImageUrl, int DisplayOrder, string? ParentCategoryId, bool IsActive);

// Queries & Commands
public record GetStoreCategoriesQuery(string? VendorId, string? Slug) : IRequest<List<StoreCategoryDto>>;
public record GetStoreCategoryWithProductsQuery(string CategorySlug, string VendorId, PaginationParams PaginationParams) : IRequest<PagedList<ProductDto>>;
public record CreateStoreCategoryCommand(string Name, string Description, string? ParentCategoryId, Stream? ImageFile, int DisplayOrder) : IRequest<string>;
public record UpdateStoreCategoryCommand(string Id, string Name, string Description, string? ParentCategoryId, Stream? ImageFile, int DisplayOrder, bool IsActive) : IRequest<Unit>;
public record DeleteStoreCategoryCommand(string Id) : IRequest<Unit>;
public record ReorderStoreCategoriesCommand(List<(string Id, int DisplayOrder)> ReorderList) : IRequest<Unit>;

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
    IRequestHandler<CreateStoreCategoryCommand, string>,
    IRequestHandler<UpdateStoreCategoryCommand, Unit>,
    IRequestHandler<DeleteStoreCategoryCommand, Unit>,
    IRequestHandler<ReorderStoreCategoriesCommand, Unit>
{
    public Task<List<StoreCategoryDto>> Handle(GetStoreCategoriesQuery request, CancellationToken cancellationToken) => Task.FromResult(new List<StoreCategoryDto>());
    public Task<PagedList<ProductDto>> Handle(GetStoreCategoryWithProductsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<ProductDto>());
    public Task<string> Handle(CreateStoreCategoryCommand request, CancellationToken cancellationToken) => Task.FromResult(string.Empty);
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
