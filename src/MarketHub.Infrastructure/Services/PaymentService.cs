using Stripe;
using Microsoft.Extensions.Configuration;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IConfiguration _config;

        public PaymentService(IConfiguration config)
        {
            _config = config;
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];
        }

        public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency = "usd")
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = currency.ToLower(),
                PaymentMethodTypes = new List<string> { "card" }
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
                    // TODO: Update order status via MediatR or direct DB
                    await Task.CompletedTask; // Placeholder for now
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
