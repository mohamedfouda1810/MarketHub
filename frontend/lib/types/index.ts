export type Role = 'SuperAdmin' | 'Admin' | 'Vendor' | 'Customer';

export interface User {
  id: string;
  email: string;
  role: Role;
  vendorId?: string;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  vendorId: string;
  parentCategoryId?: string;
  subCategories?: StoreCategory[];
}

export interface Vendor {
  id: string;
  storeName: string;
  storeSlug: string;
  storeEmail: string;
  description?: string;
  logoUrl?: string;
  bannerUrl?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  categories?: StoreCategory[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>; // e.g. { Color: 'Red', Size: 'M' }
  priceAdjustment: number;
  stockQuantity: number;
}

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  price: number;
  stockQuantity: number;
  description?: string;
  vendorName: string;
}

export interface Product {
  id: string;
  vendorId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  images: string[];
  status: 'Draft' | 'Active' | 'Archived';
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  vendor?: Vendor;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  productName: string;
  imageUrl: string;
  vendorId: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  vendorId: string;
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  createdAt: string;
  items: OrderItem[];
}