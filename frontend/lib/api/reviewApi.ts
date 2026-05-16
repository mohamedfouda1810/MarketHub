import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export interface ReviewDto {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  createdAt: string;
  vendorReply?: string;
}

export interface RatingSummaryDto {
  average: number;
  count: number;
  distribution: number[];
}

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<ApiResponse<PaginatedData<ReviewDto>>, { productId: string; params?: any }>({
      query: ({ productId, params }) => ({ url: `/reviews/product/${productId}`, params }),
      providesTags: ['Review'],
    }),
    getRatingSummary: builder.query<ApiResponse<RatingSummaryDto>, string>({
      query: (productId) => `/reviews/product/${productId}/summary`,
      providesTags: ['Review'],
    }),
    createReview: builder.mutation<ApiResponse<string>, any>({
      query: (data) => ({ url: '/reviews', method: 'POST', body: data }),
      invalidatesTags: ['Review'],
    }),
    updateReview: builder.mutation<ApiResponse<void>, { id: string; data: any }>({
      query: ({ id, data }) => ({ url: `/reviews/${id}`, method: 'PUT', body: { ...data, reviewId: id } }),
      invalidatesTags: (result, error, arg) => ['Review', { type: 'Review', id: arg.id }],
    }),
    deleteReview: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review'],
    }),
    vendorReply: builder.mutation<ApiResponse<void>, { id: string; reply: string }>({
      query: ({ id, reply }) => ({ url: `/reviews/${id}/vendor-reply`, method: 'POST', body: { reviewId: id, reply } }),
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
