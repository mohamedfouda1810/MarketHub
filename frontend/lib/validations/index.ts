import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phoneNumber: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const vendorRegisterSchema = registerSchema.and(
  z.object({
    storeName: z.string().min(3, 'Store name must be at least 3 characters').max(100),
    storeDescription: z.string().min(20, 'Store description must be at least 20 characters'),
    storeEmail: z.string().email('Invalid store email').optional().or(z.literal('')),
  })
);

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stockQuantity: z.coerce.number().int().nonnegative('Stock cannot be negative'),
  storeCategoryId: z.string().uuid('Category is required'),
});

export const addressSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phoneNumber: z.string().min(1, 'Phone number is required').regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  addressLine1: z.string().min(1, 'Address Line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  body: z.string().min(20, 'Review body must be at least 20 characters').max(2000),
});

export const checkoutSchema = z.object({
  addressId: z.string().uuid().optional(),
  useNewAddress: z.boolean().default(false),
  newAddress: addressSchema.optional(),
  paymentMethod: z.string().min(1, 'Payment method is required'),
}).refine(data => data.useNewAddress || data.addressId, {
  message: 'Please select or enter a shipping address',
  path: ['addressId']
});
