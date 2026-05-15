using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using MarketHub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Testcontainers.MsSql;
using Testcontainers.Redis;
using Respawn;
using MarketHub.API;

namespace MarketHub.Integration.Tests;

public class IntegrationTestBase : IAsyncLifetime
{
    private readonly MsSqlContainer _msSqlContainer = new MsSqlBuilder().Build();
    private readonly RedisContainer _redisContainer = new RedisBuilder().Build();
    
    protected HttpClient HttpClient { get; private set; } = null!;
    protected IServiceProvider ServiceProvider { get; private set; } = null!;
    private WebApplicationFactory<Program> _factory = null!;
    private Respawner _respawner = null!;

    public async Task InitializeAsync()
    {
        await _msSqlContainer.StartAsync();
        await _redisContainer.StartAsync();

        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.ConfigureServices(services =>
            {
                // Remove existing DB context
                var descriptor = services.SingleOrDefault(d => d.ServiceType == typeof(DbContextOptions<AppDbContext>));
                if (descriptor != null) services.Remove(descriptor);

                // Add Test DB
                services.AddDbContext<AppDbContext>(options =>
                    options.UseSqlServer(_msSqlContainer.GetConnectionString()));

                // Add Test Redis (assuming there's a way to configure it, usually via StackExchange.Redis)
                // services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(_redisContainer.GetConnectionString()));
            });
        });

        HttpClient = _factory.CreateClient();
        ServiceProvider = _factory.Services;

        _respawner = await Respawner.CreateAsync(_msSqlContainer.GetConnectionString(), new RespawnerOptions
        {
            TablesToIgnore = new Respawn.Graph.Table[] { "__EFMigrationsHistory" }
        });
    }

    public async Task ResetDatabaseAsync()
    {
        await _respawner.ResetAsync(_msSqlContainer.GetConnectionString());
    }

    public async Task DisposeAsync()
    {
        await _msSqlContainer.DisposeAsync();
        await _redisContainer.DisposeAsync();
        _factory.Dispose();
    }
}
