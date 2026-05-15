using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Models;

namespace MarketHub.Application.Features.Reviews;

// DTOs
public record ReviewDto(string Id, string ProductId, string AuthorName, int Rating, string Title, string Body, List<string> Images, DateTime CreatedAt, string? VendorReply);
public record RatingSummaryDto(decimal Average, int Count, List<int> Distribution);

// Commands & Queries
public record GetProductReviewsQuery(string ProductId, PaginationParams PaginationParams, string? SortBy) : IRequest<PagedList<ReviewDto>>;
public record GetProductRatingSummaryQuery(string ProductId) : IRequest<RatingSummaryDto>;
public record CreateReviewCommand(string ProductId, string OrderId, int Rating, string Title, string Body, List<Stream> Images) : IRequest<Unit>;
public record UpdateReviewCommand(string ReviewId, int Rating, string Title, string Body) : IRequest<Unit>;
public record DeleteReviewCommand(string ReviewId) : IRequest<Unit>;
public record VendorReplyToReviewCommand(string ReviewId, string Reply) : IRequest<Unit>;
public record AdminApproveReviewCommand(string ReviewId) : IRequest<Unit>;
public record AdminRejectReviewCommand(string ReviewId, string Reason) : IRequest<Unit>;

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
    IRequestHandler<CreateReviewCommand, Unit>,
    IRequestHandler<UpdateReviewCommand, Unit>,
    IRequestHandler<DeleteReviewCommand, Unit>,
    IRequestHandler<VendorReplyToReviewCommand, Unit>,
    IRequestHandler<AdminApproveReviewCommand, Unit>,
    IRequestHandler<AdminRejectReviewCommand, Unit>
{
    public Task<PagedList<ReviewDto>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<ReviewDto>());
    public Task<RatingSummaryDto> Handle(GetProductRatingSummaryQuery request, CancellationToken cancellationToken) => Task.FromResult(default(RatingSummaryDto)!);
    public Task<Unit> Handle(CreateReviewCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
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
