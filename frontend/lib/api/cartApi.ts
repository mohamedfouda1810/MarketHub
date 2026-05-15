import { api } from './baseApi';
import { ApiResponse } from '../types/api';
import toast from 'react-hot-toast';

export interface CartItemDto {
  id: string;
  productId: string;
  variantId?: string;
  productName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartDto {
  id: string;
  items: CartItemDto[];
  subtotal: number;
  itemCount: number;
}

export interface CartSummaryDto {
  itemCount: number;
  subtotal: number;
}

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<CartDto>, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    getCartSummary: builder.query<ApiResponse<CartSummaryDto>, void>({
      query: () => '/cart/summary',
      providesTags: ['Cart'],
    }),
    addItem: builder.mutation<ApiResponse<void>, { productId: string; variantId?: string; quantity: number; product?: any }>({
      query: (data) => ({ url: '/cart/items', method: 'POST', body: { productId: data.productId, variantId: data.variantId, quantity: data.quantity } }),
      async onQueryStarted({ productId, variantId, quantity, product }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            if (draft.data?.items) {
              const existingItem = draft.data.items.find((i) => i.productId === productId && i.variantId === variantId);
              if (existingItem) {
                existingItem.quantity += quantity;
                existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
              } else if (product) {
                draft.data.items.push({ 
                  id: 'temp-' + Date.now(), 
                  productId, 
                  variantId, 
                  quantity, 
                  unitPrice: product.price, 
                  productName: product.name,
                  imageUrl: product.images?.[0] || '',
                  totalPrice: product.price * quantity
                });
              }
              draft.data.itemCount = draft.data.items.reduce((acc, i) => acc + i.quantity, 0);
              draft.data.subtotal = draft.data.items.reduce((acc, i) => acc + i.totalPrice, 0);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          toast.error("Failed to add item to cart. Please try again.");
        }
      },
      invalidatesTags: ['Cart'],
    }),
    updateItem: builder.mutation<ApiResponse<void>, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `/cart/items/${id}`, method: 'PUT', body: { cartItemId: id, quantity } }),
      async onQueryStarted({ id, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const item = draft.data?.items?.find((i) => i.id === id);
            if (item) {
              item.quantity = quantity;
              item.totalPrice = item.quantity * item.unitPrice;
              draft.data.itemCount = draft.data.items.reduce((acc, i) => acc + i.quantity, 0);
              draft.data.subtotal = draft.data.items.reduce((acc, i) => acc + i.totalPrice, 0);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          toast.error("Failed to update cart. Please try again.");
        }
      },
      invalidatesTags: ['Cart'],
    }),
    removeItem: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/cart/items/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            if (draft.data?.items) {
               draft.data.items = draft.data.items.filter((i) => i.id !== id);
               draft.data.itemCount = draft.data.items.reduce((acc, i) => acc + i.quantity, 0);
               draft.data.subtotal = draft.data.items.reduce((acc, i) => acc + i.totalPrice, 0);
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          toast.error("Failed to remove item. Please try again.");
        }
      },
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<ApiResponse<void>, void>({
      query: () => ({ url: '/cart', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useGetCartSummaryQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} = cartApi;
