using Stripe;
using Microsoft.Extensions.Configuration;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Domain.Enums;

namespace MarketHub.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;
        private readonly IUnitOfWork _unitOfWork;

        public PaymentService(IConfiguration config, IUnitOfWork unitOfWork)
        {
            _config = config;
            _unitOfWork = unitOfWork;
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
        }

        public async Task<string> CreatePaymentIntentAsync(Guid orderId, decimal amount, string currency = "usd")
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = currency.ToLower(),
                PaymentMethodTypes = new List<string> { "card" },
                Metadata = new Dictionary<string, string>
                {
                    { "OrderId", orderId.ToString() }
                }
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);
            return intent.ClientSecret;
        }

        public async Task<bool> RefundAsync(string paymentIntentId)
        {
            var options = new RefundCreateOptions
            {
                PaymentIntent = paymentIntentId,
            };

            var service = new RefundService();
            var refund = await service.CreateAsync(options);
            return refund.Status == "succeeded";
        }

        public async Task<bool> ProcessWebhookAsync(string json, string signature)
        {
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(json, signature, _config["StripeSettings:WebhookSecret"]);
                
                // Handle the event
                if (stripeEvent.Type == Events.PaymentIntentSucceeded)
                {
                    var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                    if (paymentIntent != null && paymentIntent.Metadata.TryGetValue("OrderId", out var orderIdStr))
                    {
                        if (Guid.TryParse(orderIdStr, out var orderId))
                        {
                            var order = await _unitOfWork.Orders.GetByIdAsync(orderId);
                            if (order != null)
                            {
                                // In a real app, you'd create a Payment entity here or update order status
                                // For now, let's assume we update the order to Confirmed/Paid
                                // order.Confirm(Guid.Empty); // System user
                                await _unitOfWork.SaveChangesAsync();
                            }
                        }
                    }
                }
                
                return true;
            }
            catch (StripeException)
            {
                return false;
            }
        }
    }
}
