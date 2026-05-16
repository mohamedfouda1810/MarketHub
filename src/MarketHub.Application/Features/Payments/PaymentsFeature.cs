using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Shared;
using MarketHub.Shared;

namespace MarketHub.Application.Features.Payments;

// DTOs
public record PaymentInitDto(Guid TransactionId, string PaymentUrl, string? ClientSecret);
public record PaymentDto(Guid Id, Guid OrderId, decimal Amount, string Status, DateTime CreatedAt);

// Commands & Queries
public record InitiatePaymentCommand(Guid OrderId, string Method, string ReturnUrl) : IRequest<PaymentInitDto>;
public record ConfirmPaymentCommand(Guid TransactionId, object GatewayPayload) : IRequest<Unit>;
public record RequestRefundCommand(Guid OrderId, string Reason, decimal? Amount) : IRequest<Unit>;
public record GetPaymentHistoryQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedList<PaymentDto>>;

// Validators
public class InitiatePaymentCommandValidator : AbstractValidator<InitiatePaymentCommand>
{
    public InitiatePaymentCommandValidator()
    {
        RuleFor(x => x.OrderId).NotEmpty();
        RuleFor(x => x.Method).NotEmpty();
    }
}

// Handlers
public class PaymentHandlers : 
    IRequestHandler<InitiatePaymentCommand, PaymentInitDto>,
    IRequestHandler<ConfirmPaymentCommand, Unit>,
    IRequestHandler<RequestRefundCommand, Unit>,
    IRequestHandler<GetPaymentHistoryQuery, PagedList<PaymentDto>>
{
    public Task<PaymentInitDto> Handle(InitiatePaymentCommand request, CancellationToken cancellationToken) => Task.FromResult(new PaymentInitDto(Guid.NewGuid(), "", "pi_temp_secret"));
    public Task<Unit> Handle(ConfirmPaymentCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(RequestRefundCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<PagedList<PaymentDto>> Handle(GetPaymentHistoryQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<PaymentDto>(new List<PaymentDto>(), 0, 1, 10));
}

// Profile
public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        // Add mappings
    }
}
