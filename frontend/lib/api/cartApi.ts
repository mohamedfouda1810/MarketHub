import { api } from './baseApi';
import { ApiResponse } from '../types/api';
import toast from 'react-hot-toast';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<ApiResponse<any>, void>({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    getCartSummary: builder.query<ApiResponse<{ itemCount: number; subtotal: number }>, void>({
      query: () => '/cart/summary',
      providesTags: ['Cart'],
    }),
    addItem: builder.mutation<ApiResponse<{}>, { productId: string; variantId?: string; quantity: number; product?: any }>({
      query: (data) => ({ url: '/cart/items', method: 'POST', body: { productId: data.productId, variantId: data.variantId, quantity: data.quantity } }),
      async onQueryStarted({ productId, variantId, quantity, product }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            // Optimistically update the cart
            const existingItem = draft.data?.items?.find((i: any) => i.productId === productId && i.variantId === variantId);
            if (existingItem) {
              existingItem.quantity += quantity;
            } else if (product) {
              // Add a mock item
              draft.data?.items?.push({ id: 'temp-' + Date.now(), productId, variantId, quantity, unitPrice: product.price, product });
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
    updateItem: builder.mutation<ApiResponse<{}>, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({ url: `/cart/items/${id}`, method: 'PUT', body: { quantity } }),
      async onQueryStarted({ id, quantity }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            const item = draft.data?.items?.find((i: any) => i.id === id);
            if (item) item.quantity = quantity;
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          toast.error("Failed to update cart. Please try again.");
        }
      },
      invalidatesTags: ['Cart'], // Invalidate to ensure consistency
    }),
    removeItem: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/cart/items/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData('getCart', undefined, (draft) => {
            if (draft.data?.items) {
               draft.data.items = draft.data.items.filter((i: any) => i.id !== id);
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
    clearCart: builder.mutation<ApiResponse<{}>, void>({
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
