namespace MarketHub.Shared;

/// <summary>
/// Represents a paginated list of items.
/// </summary>
public class PagedList<T>
{
    public List<T> Items { get; }
    public int TotalCount { get; }
    public int PageNumber { get; }
    public int CurrentPage => PageNumber; // Alias for API controllers
    public int PageSize { get; }

    public int TotalPages => PageSize > 0 ? (int)Math.Ceiling(TotalCount / (double)PageSize) : 0;
    public bool HasNextPage => PageNumber < TotalPages;
    public bool HasPreviousPage => PageNumber > 1;

    public PagedList()
    {
        Items = new List<T>();
    }

    public PagedList(List<T> items, int totalCount, int pageNumber, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        PageNumber = pageNumber;
        PageSize = pageSize;
    }
}
