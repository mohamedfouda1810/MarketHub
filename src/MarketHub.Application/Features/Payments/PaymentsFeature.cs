using AutoMapper;
using FluentValidation;
using MediatR;
using MarketHub.Application.Common.Models;

namespace MarketHub.Application.Features.Payments;

// DTOs
public record PaymentInitDto(string TransactionId, string PaymentUrl);
public record PaymentDto(string Id, string OrderId, decimal Amount, string Status, DateTime CreatedAt);

// Commands & Queries
public record InitiatePaymentCommand(string OrderId, string Method, string ReturnUrl) : IRequest<PaymentInitDto>;
public record ConfirmPaymentCommand(string TransactionId, object GatewayPayload) : IRequest<Unit>;
public record RequestRefundCommand(string OrderId, string Reason, decimal? Amount) : IRequest<Unit>;
public record GetPaymentHistoryQuery(PaginationParams PaginationParams) : IRequest<PagedList<PaymentDto>>;

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
    public Task<PaymentInitDto> Handle(InitiatePaymentCommand request, CancellationToken cancellationToken) => Task.FromResult(default(PaymentInitDto)!);
    public Task<Unit> Handle(ConfirmPaymentCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<Unit> Handle(RequestRefundCommand request, CancellationToken cancellationToken) => Task.FromResult(Unit.Value);
    public Task<PagedList<PaymentDto>> Handle(GetPaymentHistoryQuery request, CancellationToken cancellationToken) => Task.FromResult(new PagedList<PaymentDto>());
}

// Profile
public class PaymentProfile : Profile
{
    public PaymentProfile()
    {
        // Add mappings
    }
}
