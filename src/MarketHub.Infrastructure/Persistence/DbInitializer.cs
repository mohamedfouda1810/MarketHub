using Microsoft.AspNetCore.Identity;
using MarketHub.Infrastructure.Identity;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Enums;
using MarketHub.Domain.Common;
using MarketHub.Shared;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace MarketHub.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedDataAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

        // Apply any pending migrations
        await context.Database.MigrateAsync();

        // Seed Roles
        string[] roles = { "SuperAdmin", "Admin", "Vendor", "Customer" };
        foreach (var roleName in roles)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                await roleManager.CreateAsync(new ApplicationRole { Name = roleName });
            }
        }

        // Seed Admins
        await CreateAdminAsync(userManager, context, "admin1@markethub.com", "Admin123!", "MarketHub Admin One");
        await CreateAdminAsync(userManager, context, "admin2@markethub.com", "Admin123!", "MarketHub Admin Two");

        // Seed Vendors
        await CreateVendorAsync(userManager, context, "vendor1@markethub.com", "Vendor123!", "Vendor One Store", "Vendor One");
        await CreateVendorAsync(userManager, context, "vendor2@markethub.com", "Vendor123!", "Vendor Two Store", "Vendor Two");
        await CreateVendorAsync(userManager, context, "vendor3@markethub.com", "Vendor123!", "Vendor Three Store", "Vendor Three");

        // Seed Customers
        await CreateCustomerAsync(userManager, context, "customer1@markethub.com", "Customer123!", "Customer One");
        await CreateCustomerAsync(userManager, context, "customer2@markethub.com", "Customer123!", "Customer Two");
        await CreateCustomerAsync(userManager, context, "customer3@markethub.com", "Customer123!", "Customer Three");
        await CreateCustomerAsync(userManager, context, "customer4@markethub.com", "Customer123!", "Customer Four");
        await CreateCustomerAsync(userManager, context, "customer5@markethub.com", "Customer123!", "Customer Five");
    }

    private static async Task CreateAdminAsync(UserManager<ApplicationUser> userManager, AppDbContext context, string email, string password, string fullName)
    {
        if (await userManager.FindByEmailAsync(email) == null)
        {
            var appUser = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
            var result = await userManager.CreateAsync(appUser, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(appUser, "Admin");

                var domainUser = new User(email, fullName, Role.Admin);
                // Set the ID to match Identity ID
                typeof(BaseEntity).GetProperty(nameof(BaseEntity.Id))?.SetValue(domainUser, appUser.Id);
                
                await context.AddAsync(domainUser);
                await context.SaveChangesAsync();
            }
        }
    }

    private static async Task CreateVendorAsync(UserManager<ApplicationUser> userManager, AppDbContext context, string email, string password, string storeName, string fullName)
    {
        if (await userManager.FindByEmailAsync(email) == null)
        {
            var appUser = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
            var result = await userManager.CreateAsync(appUser, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(appUser, "Vendor");

                var domainUser = new User(email, fullName, Role.Vendor);
                typeof(BaseEntity).GetProperty(nameof(BaseEntity.Id))?.SetValue(domainUser, appUser.Id);
                await context.AddAsync(domainUser);

                var vendor = new Vendor(appUser.Id, storeName, SlugHelper.Generate(storeName), email);
                // Use reflection if needed or public method to set to active
                vendor.Approve(appUser.Id); 

                await context.Vendors.AddAsync(vendor);
                await context.SaveChangesAsync();
            }
        }
    }

    private static async Task CreateCustomerAsync(UserManager<ApplicationUser> userManager, AppDbContext context, string email, string password, string fullName)
    {
        if (await userManager.FindByEmailAsync(email) == null)
        {
            var appUser = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
            var result = await userManager.CreateAsync(appUser, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(appUser, "Customer");

                var domainUser = new User(email, fullName, Role.Customer);
                typeof(BaseEntity).GetProperty(nameof(BaseEntity.Id))?.SetValue(domainUser, appUser.Id);
                await context.AddAsync(domainUser);

                var customer = new Customer(appUser.Id);
                await context.Customers.AddAsync(customer);
                
                // Create cart for customer
                var cart = new Cart(customer.Id);
                await context.Carts.AddAsync(cart);

                await context.SaveChangesAsync();
            }
        }
    }
}
