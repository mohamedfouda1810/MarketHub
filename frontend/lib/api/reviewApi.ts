import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<ApiResponse<PaginatedData<any>>, { productId: string; params?: any }>({
      query: ({ productId, params }) => ({ url: `/reviews/product/${productId}`, params }),
      providesTags: ['Review'],
    }),
    getRatingSummary: builder.query<ApiResponse<any>, string>({
      query: (productId) => `/reviews/product/${productId}/summary`,
      providesTags: ['Review'],
    }),
    createReview: builder.mutation<ApiResponse<{ id: string }>, any>({
      query: (data) => ({ url: '/reviews', method: 'POST', body: data }),
      invalidatesTags: ['Review'],
    }),
    updateReview: builder.mutation<ApiResponse<{}>, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/reviews/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, arg) => ['Review', { type: 'Review', id: arg.id }],
    }),
    deleteReview: builder.mutation<ApiResponse<{}>, string>({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
    vendorReply: builder.mutation<ApiResponse<{}>, { id: string; reply: string }>({
      query: ({ id, reply }) => ({ url: `/reviews/${id}/vendor-reply`, method: 'POST', body: { reply } }),
      invalidatesTags: (result, error, arg) => ['Review', { type: 'Review', id: arg.id }],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetRatingSummaryQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useVendorReplyMutation,
} = reviewApi;
