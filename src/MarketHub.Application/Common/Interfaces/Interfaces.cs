using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;

namespace MarketHub.Application.Common.Interfaces;

public interface ICurrentUserService
{
    Guid? UserId { get; }
    string? Email { get; }
    string? Role { get; }
    bool IsAuthenticated { get; }
}

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body, bool isHtml = true);
    void EnqueueEmail(string to, string subject, string templateName, object model);
}

public interface IFileStorageService
{
    Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
    Task DeleteFileAsync(string fileUrl);
}

public interface IPaymentService
{
    Task<string> CreatePaymentIntentAsync(decimal amount, string currency = "usd");
    Task<bool> RefundAsync(string paymentIntentId);
    Task<bool> ProcessWebhookAsync(string json, string signature);
}

public interface INotificationService
{
    Task SendToUserAsync(Guid userId, string title, string message, string type, string? referenceId = null);
    Task SendToVendorAsync(Guid vendorId, string title, string message, string type, string? referenceId = null);
}

public interface ICacheService
{
    Task<T?> GetAsync<T>(string key);
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null);
    Task RemoveAsync(string key);
}

public class ProductSearchDocument
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public Guid VendorId { get; set; }
    public string VendorName { get; set; } = null!;
    public Guid CategoryId { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; }
}

public interface ISearchService
{
    Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm);
    Task IndexProductAsync(ProductSearchDocument doc);
    Task DeleteProductAsync(Guid productId);
}
