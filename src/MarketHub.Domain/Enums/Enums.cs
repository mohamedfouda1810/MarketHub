namespace MarketHub.Domain.Enums;

public enum Role
{
    SuperAdmin,
    Admin,
    Vendor,
    Customer
}

public enum VendorStatus
{
    Pending,
    Active,
    Suspended,
    Rejected
}

public enum ProductStatus
{
    Draft,
    Active,
    OutOfStock,
    Archived
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Cancelled,
    Refunded
}

public enum PaymentMethod
{
    CreditCard,
    PayPal,
    Wallet,
    CashOnDelivery
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}

public enum ReviewStatus
{
    Pending,
    Approved,
    Rejected
}

public enum CouponType
{
    Percentage,
    FixedAmount,
    FreeShipping
}

public enum NotificationType
{
    Order,
    Payment,
    Review,
    System,
    Promotion
}

public enum WithdrawalStatus
{
    Pending,
    Approved,
    Rejected,
    Paid
}
