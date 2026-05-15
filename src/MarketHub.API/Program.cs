using System.Threading.RateLimiting;
using Hangfire;
using Hangfire.SqlServer;
using Microsoft.AspNetCore.ResponseCompression;
using Serilog;
using MarketHub.API.Extensions;
using MarketHub.API.Filters;
using MarketHub.Infrastructure.Services;
using MarketHub.Application;
using MarketHub.Infrastructure;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

// 1. Serilog configuration
builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .Enrich.FromLogContext()
    .WriteTo.Console());

// 2. Add MediatR and Application/Infrastructure Layers
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// 3. Add API Versioning
builder.Services.AddApiVersioningConfig();

// 4. Add Swagger
builder.Services.AddSwaggerConfig();

// 5. Add Authentication & Authorization
builder.Services.AddJwtAuthentication(builder.Configuration);

// 6. Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("fixed", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.User.Identity?.IsAuthenticated == true 
                ? httpContext.User.Identity.Name! 
                : httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = httpContext.User.Identity?.IsAuthenticated == true ? 1000 : 100,
                QueueLimit = 0,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// 7. CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowConfiguredOrigins", policy =>
    {
        var origins = builder.Configuration.GetSection("CorsOrigins").Get<string[]>() ?? new[] { "http://localhost:3000" };
        policy.WithOrigins(origins)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials(); // needed for SignalR and cookies
    });
});

// 8. SignalR
builder.Services.AddSignalR();

// 9. Hangfire
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=MarketHubDb;Trusted_Connection=True;";
builder.Services.AddHangfire(configuration => configuration
    .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
    .UseSimpleAssemblyNameTypeSerializer()
    .UseRecommendedSerializerSettings()
    .UseSqlServerStorage(connectionString, new SqlServerStorageOptions
    {
        CommandBatchMaxTimeout = TimeSpan.FromMinutes(5),
        SlidingInvisibilityTimeout = TimeSpan.FromMinutes(5),
        QueuePollInterval = TimeSpan.Zero,
        UseRecommendedIsolationLevel = true,
        DisableGlobalLocks = true
    }));
builder.Services.AddHangfireServer();

// 10. Health Checks
builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString, name: "SQL Server")
    .AddRedis(builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379", name: "Redis")
    .AddElasticsearch(builder.Configuration.GetConnectionString("ElasticSearch") ?? "http://localhost:9200", name: "Elasticsearch");

// 11. Caching & Idempotency Filter
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis") ?? "localhost:6379";
});
builder.Services.AddScoped<IdempotencyFilter>();
builder.Services.AddScoped<ApiKeyAuthFilter>();

// 12. Response Compression
builder.Services.AddResponseCompression(options =>
{
    options.Providers.Add<GzipCompressionProvider>();
    options.Providers.Add<BrotliCompressionProvider>();
    options.EnableForHttps = true;
});

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseResponseCompression();

app.UseMarketHubMiddleware();

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUIConfig();
}

app.UseHttpsRedirection();

app.UseCors("AllowConfiguredOrigins");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers().RequireRateLimiting("fixed");

app.MapHub<NotificationHub>("/hubs/notifications");

app.UseHangfireDashboard("/hangfire", new DashboardOptions
{
    // In production, configure an authorization filter to enforce RequireSuperAdmin or RequireAdmin
});

// Health check endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = _ => false // Only check if the API is responsive
});

app.Run();

public partial class Program { }
