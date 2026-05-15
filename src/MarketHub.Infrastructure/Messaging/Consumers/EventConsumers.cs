using MassTransit;
using MarketHub.Application.Common.Interfaces;
using Microsoft.Extensions.Logging;

namespace MarketHub.Infrastructure.Messaging.Consumers
{
    // Define Events locally if not in Domain/Contracts
    public record OrderPlacedEvent(Guid OrderId, Guid CustomerId, Guid VendorId, decimal TotalAmount);
    public record PaymentConfirmedEvent(Guid OrderId, string TransactionId);
    public record VendorApprovedEvent(Guid VendorId, string VendorEmail, string VendorName);

    public class OrderPlacedEventConsumer : IConsumer<OrderPlacedEvent>
    {
        private readonly INotificationService _notificationService;
        private readonly ILogger<OrderPlacedEventConsumer> _logger;

        public OrderPlacedEventConsumer(INotificationService notificationService, ILogger<OrderPlacedEventConsumer> logger)
        {
            _notificationService = notificationService;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<OrderPlacedEvent> context)
        {
            var msg = context.Message;
            _logger.LogInformation($"Processing OrderPlacedEvent for Order {msg.OrderId}");

            await _notificationService.SendToVendorAsync(
                msg.VendorId,
                "New Order Received",
                $"You have received a new order for ${msg.TotalAmount}.",
                "Order"
            );
        }
    }

    public class VendorApprovedEventConsumer : IConsumer<VendorApprovedEvent>
    {
        private readonly IEmailService _emailService;

        public VendorApprovedEventConsumer(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task Consume(ConsumeContext<VendorApprovedEvent> context)
        {
            var msg = context.Message;
            
            await _emailService.SendEmailAsync(
                msg.VendorEmail,
                "Welcome to MarketHub - Account Approved!",
                $"Hello {msg.VendorName}, your store has been approved!"
            );
        }
    }
}
