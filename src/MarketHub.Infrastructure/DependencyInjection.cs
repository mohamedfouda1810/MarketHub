using Elastic.Clients.Elasticsearch;
using Hangfire;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using System.Text;
using Azure.Storage.Blobs;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;
using MarketHub.Application.Common.Interfaces;
using MarketHub.Infrastructure.Identity;
using MarketHub.Infrastructure.Persistence;
using MarketHub.Infrastructure.Persistence.Repositories;
using MarketHub.Infrastructure.Services;
using MarketHub.Infrastructure.BackgroundJobs.Jobs;
using MarketHub.Infrastructure.Messaging.Consumers;

namespace MarketHub.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddPersistence(configuration);
            services.AddIdentityServices(configuration);
            services.AddCaching(configuration);
            services.AddFileStorage(configuration);
            services.AddMessaging(configuration);
            services.AddBackgroundJobs(configuration);
            services.AddSearchService(configuration);
            services.AddEmailService(configuration);
            services.AddNotificationService();
            services.AddPaymentService();

            return services;
        }

        private static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"),
                    b => b.MigrationsAssembly(typeof(AppDbContext).Assembly.FullName)));

            services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IVendorRepository, VendorRepository>();
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }

        private static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddIdentity<ApplicationUser, ApplicationRole>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 8;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();

            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourDefaultSecretKeyForDevelopmentOnly";

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings["Issuer"],
                    ValidAudience = jwtSettings["Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
                    ClockSkew = TimeSpan.Zero
                };

                // SignalR Authentication
                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var accessToken = context.Request.Query["access_token"];
                        var path = context.HttpContext.Request.Path;
                        if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/notifications"))
                        {
                            context.Token = accessToken;
                        }
                        return Task.CompletedTask;
                    }
                };
            });

            services.AddScoped<IJwtTokenService, JwtTokenService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddHttpContextAccessor();

            return services;
        }

        private static IServiceCollection AddCaching(this IServiceCollection services, IConfiguration configuration)
        {
            var redisConnectionString = configuration.GetConnectionString("Redis") ?? "localhost:6379";

            services.AddSingleton<IConnectionMultiplexer>(sp =>
                ConnectionMultiplexer.Connect(redisConnectionString));

            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = redisConnectionString;
            });

            services.AddScoped<ICacheService, CacheService>();

            return services;
        }

        private static IServiceCollection AddFileStorage(this IServiceCollection services, IConfiguration configuration)
        {
            var storageConnectionString = configuration["AzureSettings:StorageConnectionString"] ?? "UseDevelopmentStorage=true";

            services.AddSingleton(x => new BlobServiceClient(storageConnectionString));
            services.AddScoped<IFileStorageService, FileStorageService>();

            return services;
        }

        private static IServiceCollection AddMessaging(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddMassTransit(x =>
            {
                x.AddConsumer<OrderPlacedEventConsumer>();
                x.AddConsumer<VendorApprovedEventConsumer>();

                x.UsingRabbitMq((context, cfg) =>
                {
                    cfg.Host(configuration["RabbitMQ:Host"] ?? "localhost", h =>
                    {
                        h.Username(configuration["RabbitMQ:Username"] ?? "guest");
                        h.Password(configuration["RabbitMQ:Password"] ?? "guest");
                    });

                    cfg.ConfigureEndpoints(context);
                });
            });

            return services;
        }

        private static IServiceCollection AddBackgroundJobs(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddHangfire(config => config
                .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UseSqlServerStorage(configuration.GetConnectionString("DefaultConnection")));

            services.AddHangfireServer();

            // Register Jobs
            services.AddScoped<GenerateDailyVendorReportJob>();
            services.AddScoped<SyncProductToElasticsearchJob>();
            services.AddScoped<CleanExpiredCartItemsJob>();
            services.AddScoped<SendLowStockAlertsJob>();

            return services;
        }

        private static IServiceCollection AddSearchService(this IServiceCollection services, IConfiguration configuration)
        {
            var elasticUri = configuration["Elasticsearch:Uri"] ?? "http://localhost:9200";
            var settings = new ElasticsearchClientSettings(new Uri(elasticUri))
                .DefaultIndex("markethub_products");

            var client = new ElasticsearchClient(settings);

            services.AddSingleton(client);
            services.AddScoped<ISearchService, SearchService>();

            return services;
        }

        private static IServiceCollection AddEmailService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IEmailService, EmailService>();
            return services;
        }

        private static IServiceCollection AddNotificationService(this IServiceCollection services)
        {
            services.AddScoped<INotificationService, NotificationService>();
            return services;
        }

        private static IServiceCollection AddPaymentService(this IServiceCollection services)
        {
            services.AddScoped<IPaymentService, PaymentService>();
            return services;
        }
    }
}
