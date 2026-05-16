namespace MarketHub.Domain.Common
{
    public class ProductFilters
    {
        public Guid? VendorId { get; set; }
        public string? VendorSlug { get; set; }
        public Guid? CategoryId { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
    }
}
