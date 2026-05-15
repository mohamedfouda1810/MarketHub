using Bogus;

namespace MarketHub.Domain.Tests;

public abstract class BaseTest
{
    protected BaseTest()
    {
        // Fixed seed for reproducibility
        Randomizer.Seed = new Random(1234);
    }
}
