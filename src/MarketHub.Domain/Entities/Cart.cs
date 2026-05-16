using MarketHub.Domain.Common;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a customer's shopping cart.
/// </summary>
public class Cart : BaseEntity
{
    public Guid CustomerId { get; private set; }

    private readonly List<CartItem> _items = new();
    public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly();

    private Cart() { } // For EF Core

    public Cart(Guid customerId)
    {
        CustomerId = customerId;
    }

    /// <summary>
    /// Adds an item to the cart or updates the quantity if it already exists.
    /// </summary>
    public void AddItem(Product product, ProductVariant? variant, int quantity)
    {
        if (quantity <= 0) throw new ArgumentException("Quantity must be greater than zero.", nameof(quantity));

        var existingItem = _items.SingleOrDefault(i => i.ProductId == product.Id && i.VariantId == variant?.Id);

        if (existingItem != null)
        {
            // Stock checking should ideally be a domain service or handled here if all data is loaded
            existingItem.UpdateQuantity(existingItem.Quantity + quantity);
        }
        else
        {
            var unitPrice = variant?.Price ?? product.Price;
            var item = new CartItem(Id, product.Id, variant?.Id, quantity, unitPrice);
            _items.Add(item);
        }

        UpdateTimestamp();
    }

    /// <summary>
    /// Removes an item from the cart.
    /// </summary>
    public void RemoveItem(Guid cartItemId)
    {
        var item = _items.SingleOrDefault(i => i.Id == cartItemId);
        if (item != null)
        {
            _items.Remove(item);
            UpdateTimestamp();
        }
    }

    /// <summary>
    /// Updates the quantity of a specific item in the cart.
    /// </summary>
    public void UpdateQuantity(Guid cartItemId, int quantity)
    {
        var item = _items.SingleOrDefault(i => i.Id == cartItemId);
        if (item == null) throw new InvalidOperationException("Cart item not found.");
        
        item.UpdateQuantity(quantity);
        UpdateTimestamp();
    }

    /// <summary>
    /// Clears all items from the cart.
    /// </summary>
    public void Clear()
    {
        _items.Clear();
        UpdateTimestamp();
    }
}
