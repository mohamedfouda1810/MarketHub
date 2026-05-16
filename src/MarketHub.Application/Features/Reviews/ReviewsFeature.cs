using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Application.Features.Reviews;

// DTOs
public record ReviewDto(Guid Id, Guid ProductId, string AuthorName, int Rating, string Title, string Body, List<string> Images, DateTime CreatedAt, string? VendorReply);
public record RatingSummaryDto(decimal Average, int Count, List<int> Distribution);

// Commands & Queries
public record GetProductReviewsQuery(Guid ProductId, int PageNumber = 1, int PageSize = 10, string? SortBy = null) : IRequest<PagedList<ReviewDto>>;
public record GetProductRatingSummaryQuery(Guid ProductId) : IRequest<RatingSummaryDto>, ICacheableQuery
{
    public string CacheKey => $"RatingSummary_{ProductId}";
    public TimeSpan? Expiration => TimeSpan.FromHours(1);
}
public record CreateReviewCommand(Guid ProductId, Guid OrderId, int Rating, string Title, string Body, List<string>? Images = null) : IRequest<Guid>;
public record UpdateReviewCommand(Guid ReviewId, int Rating, string Title, string Body) : IRequest<Unit>;
public record DeleteReviewCommand(Guid ReviewId) : IRequest<Unit>;
public record VendorReplyToReviewCommand(Guid ReviewId, string Reply) : IRequest<Unit>;
public record AdminApproveReviewCommand(Guid ReviewId) : IRequest<Unit>;
public record AdminRejectReviewCommand(Guid ReviewId, string Reason) : IRequest<Unit>;

// Validators
public class CreateReviewCommandValidator : AbstractValidator<CreateReviewCommand>
{
    public CreateReviewCommandValidator()
    {
        RuleFor(x => x.Rating).InclusiveBetween(1, 5);
        RuleFor(x => x.Body).MaximumLength(2000);
    }
}

// Handlers
public class ReviewHandlers : 
    IRequestHandler<GetProductReviewsQuery, PagedList<ReviewDto>>,
    IRequestHandler<GetProductRatingSummaryQuery, RatingSummaryDto>,
    IRequestHandler<CreateReviewCommand, Guid>,
    IRequestHandler<UpdateReviewCommand, Unit>,
    IRequestHandler<DeleteReviewCommand, Unit>,
    IRequestHandler<VendorReplyToReviewCommand, Unit>,
    IRequestHandler<AdminApproveReviewCommand, Unit>,
    IRequestHandler<AdminRejectReviewCommand, Unit>
{
    public Task<PagedList<ReviewDto>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<ReviewDto>(new List<ReviewDto>(), 0, 1, 10));
    public Task<RatingSummaryDto> Handle(GetProductRatingSummaryQuery request, CancellationToken cancellationToken) => Task.FromResult(new RatingSummaryDto(0, 0, new List<int> { 0, 0, 0, 0, 0 }));
    public Task<Guid> Handle(CreateReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Guid.NewGuid());
    public Task<Unit> Handle(UpdateReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(DeleteReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(VendorReplyToReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(AdminApproveReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(AdminRejectReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
}

// Profile
public class ReviewProfile : Profile
{
    public ReviewProfile()
    {
        // Add mappings
    }
}
