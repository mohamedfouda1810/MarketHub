import { api } from './baseApi';
import { ApiResponse, PaginatedData } from '../types/api';

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<ApiResponse<PaginatedData<any>>, any>({
      query: (params) => ({ url: '/vendors', params }),
      providesTags: ['Vendor'],
    }),
    getStoreBySlug: builder.query<ApiResponse<any>, string>({
      query: (slug) => `/vendors/${slug}`,
      providesTags: (result, error, id) => [{ type: 'Vendor', id }],
    }),
    getStoreCategories: builder.query<ApiResponse<any[]>, string>({
      query: (slug) => `/vendors/${slug}/categories`,
    }),
    getStoreProducts: builder.query<ApiResponse<PaginatedData<any>>, { slug: string; params?: any }>({
      query: ({ slug, params }) => ({ url: `/vendors/${slug}/products`, params }),
    }),
    getStoreDashboard: builder.query<ApiResponse<any>, void>({
      query: () => '/vendors/me/dashboard',
      providesTags: ['Vendor'],
    }),
    getStoreEarnings: builder.query<ApiResponse<any>, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/vendors/me/earnings', params }),
    }),
    updateVendorProfile: builder.mutation<ApiResponse<{}>, FormData>({
      query: (data) => ({ url: '/vendors/me/profile', method: 'PUT', body: data }),
      invalidatesTags: ['Vendor'],
    }),
    requestWithdrawal: builder.mutation<ApiResponse<{}>, any>({
      query: (data) => ({ url: '/vendors/me/withdrawal', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useGetStoresQuery,
  useGetStoreBySlugQuery,
  useGetStoreCategoriesQuery,
  useGetStoreProductsQuery,
  useGetStoreDashboardQuery,
  useGetStoreEarningsQuery,
  useUpdateVendorProfileMutation,
  useRequestWithdrawalMutation,
} = vendorApi;
