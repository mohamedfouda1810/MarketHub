using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MarketHub.Domain.Entities;

namespace MarketHub.Infrastructure.Persistence.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasIndex(o => o.OrderNumber).IsUnique();
            builder.Property(o => o.TotalAmount).HasPrecision(18, 2);
            builder.OwnsOne(o => o.ShippingAddressSnapshot, a =>
            {
                a.Property(p => p.Street).HasColumnName("ShippingStreet");
                a.Property(p => p.City).HasColumnName("ShippingCity");
                a.Property(p => p.State).HasColumnName("ShippingState");
                a.Property(p => p.ZipCode).HasColumnName("ShippingZipCode");
                a.Property(p => p.Country).HasColumnName("ShippingCountry");
            });
        }
    }

    public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
    {
        public void Configure(EntityTypeBuilder<Payment> builder)
        {
            builder.HasIndex(p => p.TransactionId);
            builder.Property(p => p.Amount).HasPrecision(18, 2);
            builder.Property(p => p.GatewayResponse).HasColumnType("nvarchar(max)");
        }
    }

    public class CouponConfiguration : IEntityTypeConfiguration<Coupon>
    {
        public void Configure(EntityTypeBuilder<Coupon> builder)
        {
            builder.HasIndex(c => c.Code).IsUnique();
            builder.HasIndex(c => c.IsActive).HasFilter("[IsActive] = 1");
            builder.Property(c => c.DiscountAmount).HasPrecision(18, 2);
        }
    }

    public class ReviewConfiguration : IEntityTypeConfiguration<Review>
    {
        public void Configure(EntityTypeBuilder<Review> builder)
        {
            // One review per order per product for a customer
            builder.HasIndex(r => new { r.ProductId, r.CustomerId, r.OrderId }).IsUnique();
        }
    }
}