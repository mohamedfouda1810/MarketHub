using System.Net.Http.Headers;
using System.Text.Json;
using MarketHub.Application.Features.Auth;

namespace MarketHub.Integration.Tests;

public abstract class AuthenticatedTestBase : IntegrationTestBase
{
    protected async Task AuthenticateAsync(string email, string password)
    {
        // This is a simplified example. In a real test, you'd call your login endpoint
        // or use a mock JWT generator to bypass the login logic for speed.
        
        // Example:
        // var response = await HttpClient.PostAsJsonAsync("/api/v1/auth/login", new { Email = email, Password = password });
        // var content = await response.Content.ReadAsStringAsync();
        // var token = JsonDocument.Parse(content).RootElement.GetProperty("accessToken").GetString();
        
        var token = "MOCK_TOKEN"; // You should implement real token generation or mock it
        HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
    }
}
