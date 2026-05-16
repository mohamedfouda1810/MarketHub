using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Common;
using System.Reflection;
using MarketHub.Infrastructure.Identity;
using System.Linq.Expressions;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    private readonly ICurrentUserService _currentUserService;

    public AppDbContext(
        DbContextOptions<AppDbContext> options,
        ICurrentUserService currentUserService) : base(options) 
    {
        _currentUserService = currentUserService;
    }

    public DbSet<Vendor> Vendors => Set<Vendor>();
    public DbSet<StoreCategory> StoreCategories => Set<StoreCategory>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductVariant> ProductVariants => Set<ProductVariant>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Address> Addresses => Set<Address>();
    public DbSet<Cart> Carts => Set<Cart>();
    public DbSet<CartItem> CartItems => Set<CartItem>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<OrderStatusHistory> OrderStatusHistories => Set<OrderStatusHistory>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<Coupon> Coupons => Set<Coupon>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<WithdrawalRequest> WithdrawalRequests => Set<WithdrawalRequest>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        // Global configuration for decimal precision
        foreach (var property in builder.Model.GetEntityTypes()
            .SelectMany(t => t.GetProperties())
            .Where(p => p.ClrType == typeof(decimal) || p.ClrType == typeof(decimal?)))
        {
            property.SetPrecision(18);
            property.SetScale(2);
        }

        // Global Query Filter for Soft Delete
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
            {
                builder.Entity(entityType.ClrType).HasQueryFilter(
                    ConvertFilterExpression(entityType.ClrType));
            }
        }
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.IsDeleted = false;
                    if (entry.Entity is AuditableEntity auditableAdded)
                    {
                        auditableAdded.CreatedBy = _currentUserService.UserId?.ToString() ?? "System";
                    }
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdateTimestamp();
                    if (entry.Entity is AuditableEntity auditableModified)
                    {
                        auditableModified.UpdatedBy = _currentUserService.UserId?.ToString() ?? "System";
                    }
                    break;
                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.Entity.IsDeleted = true;
                    entry.Entity.DeletedAt = DateTime.UtcNow;
                    if (entry.Entity is AuditableEntity auditableDeleted)
                    {
                        auditableDeleted.UpdatedBy = _currentUserService.UserId?.ToString() ?? "System";
                    }
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    private static LambdaExpression ConvertFilterExpression(Type type)
    {
        var param = Expression.Parameter(type, "e");
        var body = Expression.Equal(
            Expression.Property(param, nameof(BaseEntity.IsDeleted)),
            Expression.Constant(false));
        return Expression.Lambda(body, param);
    }
}
