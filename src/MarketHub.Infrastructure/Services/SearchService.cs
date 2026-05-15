using Elastic.Clients.Elasticsearch;
using MarketHub.Domain.Entities;
using MarketHub.Application.Common.Interfaces;

namespace MarketHub.Infrastructure.Services
{
    public class SearchService : ISearchService
    {
        private readonly ElasticsearchClient _client;

        public SearchService(ElasticsearchClient client)
        {
            _client = client;
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string searchTerm)
        {
            var response = await _client.SearchAsync<Product>(s => s
                .Query(q => q
                    .MultiMatch(m => m
                        .Fields(new[] { "name", "description" })
                        .Query(searchTerm)
                    )
                )
            );

            return response.Documents;
        }

        public async Task IndexProductAsync(ProductSearchDocument doc)
        {
            await _client.IndexAsync(doc);
        }

        public async Task DeleteProductAsync(Guid productId)
        {
            await _client.DeleteAsync<ProductSearchDocument>(productId);
        }
    }
}
