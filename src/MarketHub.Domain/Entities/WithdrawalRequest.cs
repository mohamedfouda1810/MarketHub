using MarketHub.Domain.Common;
using MarketHub.Domain.Enums;

namespace MarketHub.Domain.Entities;

/// <summary>
/// Represents a request by a vendor to withdraw funds from their balance.
/// </summary>
public class WithdrawalRequest : BaseEntity
{
    public Guid VendorId { get; private set; }
    public decimal Amount { get; private set; }
    public WithdrawalStatus Status { get; private set; }
    
    // Store as JSON or string, keeping it simple as per instructions.
    public string BankDetails { get; private set; }
    
    public DateTime RequestedAt { get; private set; }
    public DateTime? ProcessedAt { get; private set; }
    public string? AdminNote { get; private set; }

    private WithdrawalRequest() { } // For EF Core

    public WithdrawalRequest(Guid vendorId, decimal amount, string bankDetails)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be greater than zero.", nameof(amount));

        VendorId = vendorId;
        Amount = amount;
        BankDetails = bankDetails;
        Status = WithdrawalStatus.Pending;
        RequestedAt = DateTime.UtcNow;
    }

    public void Approve(string? adminNote = null)
    {
        Status = WithdrawalStatus.Approved;
        AdminNote = adminNote;
        UpdateTimestamp();
    }

    public void Reject(string adminNote)
    {
        Status = WithdrawalStatus.Rejected;
        AdminNote = adminNote;
        ProcessedAt = DateTime.UtcNow;
        UpdateTimestamp();
    }

    public void MarkAsPaid(string? adminNote = null)
    {
        if (Status != WithdrawalStatus.Approved)
        {
            throw new InvalidOperationException("Only approved requests can be marked as paid.");
        }
        
        Status = WithdrawalStatus.Paid;
        AdminNote = adminNote;
        ProcessedAt = DateTime.UtcNow;
        UpdateTimestamp();
    }
}
