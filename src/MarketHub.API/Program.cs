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

// 5. Removed duplicate Auth registration as it is handled in Infrastructure

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

    options.AddPolicy("auth", httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: partition => new FixedWindowRateLimiterOptions
            {
                AutoReplenishment = true,
                PermitLimit = 5,
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

// 9. Hangfire - Already registered in Infrastructure
// builder.Services.AddHangfire(...) is handled in builder.Services.AddInfrastructure(builder.Configuration);

// 10. Health Checks
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
Log.Information("Connection String found: {HasConnectionString}", !string.IsNullOrEmpty(connectionString));

builder.Services.AddHealthChecks()
    .AddSqlServer(connectionString ?? "Server=(localdb)\\mssqllocaldb;Database=MarketHubDb;Trusted_Connection=True;", name: "SQL Server")
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

// Seed Database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        await MarketHub.Infrastructure.Persistence.DbInitializer.SeedDataAsync(services);
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding the database.");
    }
}

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
    Authorization = new[] { new HangfireAuthorizationFilter() }
});

// Health check endpoints
app.MapHealthChecks("/health");
app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = _ => false // Only check if the API is responsive
});

app.Run();

public partial class Program { }
