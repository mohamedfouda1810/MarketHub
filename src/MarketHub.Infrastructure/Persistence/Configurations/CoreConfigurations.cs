using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MarketHub.Domain.Entities;

namespace MarketHub.Infrastructure.Persistence.Configurations
{
    public class VendorConfiguration : IEntityTypeConfiguration<Vendor>
    {
        public void Configure(EntityTypeBuilder<Vendor> builder)
        {
            builder.HasIndex(v => v.StoreSlug).IsUnique();
            builder.HasIndex(v => v.StoreEmail).IsUnique();
            builder.Property(v => v.CommissionRate).HasPrecision(5, 2);
        }
    }

    public class StoreCategoryConfiguration : IEntityTypeConfiguration<StoreCategory>
    {
        public void Configure(EntityTypeBuilder<StoreCategory> builder)
        {
            builder.HasIndex(c => new { c.VendorId, c.Slug }).IsUnique();
            builder.HasOne(c => c.ParentCategory)
                   .WithMany(c => c.SubCategories)
                   .HasForeignKey(c => c.ParentCategoryId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {
        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.HasIndex(p => new { p.VendorId, p.Slug }).IsUnique();
            builder.HasIndex(p => new { p.VendorId, p.Status });
            builder.Property(p => p.Price).HasPrecision(18, 2);
            builder.OwnsOne(p => p.Dimensions);
            builder.Ignore(p => p.CategoryId);

            builder.HasOne(p => p.Vendor)
                   .WithMany(v => v.Products)
                   .HasForeignKey(p => p.VendorId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(p => p.Category)
                   .WithMany(c => c.Products)
                   .HasForeignKey(p => p.StoreCategoryId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }

    public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
    {
        public void Configure(EntityTypeBuilder<ProductVariant> builder)
        {
            builder.Property(pv => pv.Attributes).HasColumnType("nvarchar(max)");
            builder.Property(pv => pv.PriceAdjustment).HasPrecision(18, 2);
            builder.Ignore(pv => pv.PriceAdjustment);
        }
    }
}