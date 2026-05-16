using Microsoft.EntityFrameworkCore;
using MarketHub.Domain.Entities;
using MarketHub.Domain.Interfaces;

namespace MarketHub.Infrastructure.Persistence.Repositories
{
    public class StoreCategoryRepository : GenericRepository<StoreCategory>, IStoreCategoryRepository
    {
        public StoreCategoryRepository(AppDbContext context) : base(context) { }

        public async Task<StoreCategory?> GetBySlugAsync(string slug, CancellationToken cancellationToken = default)
        {
            return await _dbSet.FirstOrDefaultAsync(c => c.Slug == slug, cancellationToken);
        }
    }
}
